import { describe, expect, it, beforeEach } from "vitest";
import {
  contentFyOrchestrator,
  eventBus,
  eventRegistry,
  resolveOrchestratorRules,
  ActionPipeline,
} from "../../server/core/orchestrator";
import type { OrchestratorActionStep } from "@shared/contentfy";

describe("Orchestrator registry", () => {
  it("lists known events with consumers", () => {
    const list = eventRegistry.list();
    expect(list.length).toBeGreaterThanOrEqual(10);
    expect(eventRegistry.has("LESSON_COMPLETED")).toBe(true);
    const def = eventRegistry.get("PRODUCT_PURCHASED");
    expect(def?.consumers).toContain("experience");
  });
});

describe("Orchestrator rules config", () => {
  it("loads default workflows and reactions", () => {
    const rules = resolveOrchestratorRules();
    expect(rules.workflows.length).toBeGreaterThan(0);
    expect(rules.reactions.length).toBeGreaterThan(0);
    expect(rules.defaultTimeoutMs).toBeGreaterThan(0);
  });
});

describe("ContentFyOrchestrator", () => {
  beforeEach(() => {
    contentFyOrchestrator.__resetForTests();
  });

  it("processes a simple sync event workflow", async () => {
    const result = await contentFyOrchestrator.emit({
      name: "LESSON_COMPLETED",
      payload: { userId: 42, lessonId: 7 },
      source: "edge",
      sync: true,
    });
    expect(result.event.name).toBe("LESSON_COMPLETED");
    expect(result.runs.length).toBeGreaterThan(0);
    expect(result.runs.some((r) => r.workflowId === "wf_lesson_completed")).toBe(
      true
    );
    const dash = contentFyOrchestrator.dashboard();
    expect(dash.processedTotal).toBeGreaterThan(0);
    expect(dash.recentEvents[0]?.name).toBe("LESSON_COMPLETED");
  });

  it("runs multiple workflows independently for COURSE_COMPLETED", async () => {
    const result = await contentFyOrchestrator.emit({
      name: "COURSE_COMPLETED",
      payload: { userId: 1, productSlug: "demo" },
      sync: true,
    });
    expect(result.runs.length).toBeGreaterThanOrEqual(1);
    const motors = new Set(result.runs.flatMap((r) => r.motors));
    expect(motors.has("experience") || motors.has("success")).toBe(true);
  });

  it("respects priority ordering in the async queue", async () => {
    await contentFyOrchestrator.emit({
      name: "DISCOVERY_CLICKED",
      payload: { productSlug: "a" },
      source: "discovery",
    });
    await contentFyOrchestrator.emit({
      name: "PRODUCT_PURCHASED",
      payload: { userId: 1, orderId: 9 },
      source: "commerce",
    });
    // Lower priority number first
    const first = eventBus.dequeue(1)[0];
    expect(first?.name).toBe("PRODUCT_PURCHASED");
  });

  it("reaction fires when condition matches", async () => {
    const result = await contentFyOrchestrator.emit({
      name: "SUCCESS_SCORE_CHANGED",
      payload: { userId: 3, meta: { retentionDelta: 15 } },
      sync: true,
    });
    expect(result.runs.some((r) => r.workflowId === "reactions")).toBe(true);
  });

  it("reaction skips when condition fails", async () => {
    const result = await contentFyOrchestrator.emit({
      name: "SUCCESS_SCORE_CHANGED",
      payload: { userId: 3, meta: { retentionDelta: 1 } },
      sync: true,
    });
    expect(result.runs.some((r) => r.workflowId === "reactions")).toBe(false);
  });

  it("partial failure does not cancel sibling steps", async () => {
    const pipeline = new ActionPipeline(new Map());
    pipeline.register("log_metric", async () => undefined);
    pipeline.register("noop", async () => undefined);
    pipeline.register("experience_invalidate", async () => {
      throw new Error("boom");
    });
    pipeline.register("learn_invalidate", async () => undefined);

    const steps: OrchestratorActionStep[] = [
      {
        id: "a",
        kind: "experience_invalidate",
        motor: "experience",
        phase: "main",
        retry: 0,
        timeoutMs: 500,
      },
      {
        id: "b",
        kind: "learn_invalidate",
        motor: "learn",
        phase: "main",
        retry: 0,
        timeoutMs: 500,
      },
      {
        id: "f",
        kind: "log_metric",
        motor: "orchestrator",
        phase: "fallback",
      },
    ];

    const logs = await pipeline.runSequence(
      {
        id: "e1",
        name: "LESSON_COMPLETED",
        payload: { userId: 1 },
        source: "edge",
        priority: 10,
        createdAt: new Date().toISOString(),
      },
      steps
    );
    expect(logs.find((l) => l.stepId === "a")?.status).toBe("failed");
    expect(logs.find((l) => l.stepId === "b")?.status).toBe("success");
    expect(logs.find((l) => l.stepId === "f")?.status).toBe("fallback");
  });

  it("retries then times out", async () => {
    const pipeline = new ActionPipeline(new Map());
    let calls = 0;
    pipeline.register("noop", async () => {
      calls += 1;
      await new Promise((r) => setTimeout(r, 80));
    });
    const log = await pipeline.runStep(
      {
        id: "e2",
        name: "GOAL_UPDATED",
        payload: {},
        source: "system",
        priority: 1,
        createdAt: new Date().toISOString(),
      },
      {
        id: "slow",
        kind: "noop",
        motor: "orchestrator",
        phase: "main",
        timeoutMs: 20,
        retry: 1,
      }
    );
    expect(log.status).toBe("timeout");
    expect(calls).toBe(2);
    expect(log.attempts).toBe(2);
  });

  it("records observability logs", async () => {
    await contentFyOrchestrator.emit({
      name: "PRODUCT_FAVORITED",
      payload: { userId: 1, productSlug: "x" },
      sync: true,
    });
    const dash = contentFyOrchestrator.dashboard();
    expect(dash.recentRuns.length).toBeGreaterThan(0);
    expect(dash.avgLatencyMs).toBeGreaterThanOrEqual(0);
    expect(dash.registry.length).toBeGreaterThan(0);
  });

  it("handles burst of events with acceptable latency", async () => {
    const t0 = Date.now();
    const jobs = Array.from({ length: 20 }, (_, i) =>
      contentFyOrchestrator.emit({
        name: "DISCOVERY_CLICKED",
        payload: { productSlug: `p-${i}` },
        sync: true,
      })
    );
    await Promise.all(jobs);
    expect(Date.now() - t0).toBeLessThan(5_000);
  });
});
