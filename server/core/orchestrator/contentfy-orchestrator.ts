import type {
  OrchestratorDashboardSnapshot,
  OrchestratorEventName,
  OrchestratorEventPayload,
  OrchestratorMotor,
} from "@shared/contentfy";
import { eventBus } from "./event-bus";
import { eventRegistry } from "./event-registry";
import { ActionPipeline } from "./action-pipeline";
import { createDefaultHandlers } from "./handlers";
import { WorkflowEngine } from "./workflow-engine";
import { ReactionEngine } from "./reaction-engine";
import { RuleDispatcher } from "./rule-dispatcher";
import { observabilityStore } from "./observability";
import { resolveOrchestratorRules } from "./config";

/**
 * ContentFy Orchestrator — central nervous system.
 * Coordinates engines via events; does not execute motor business rules.
 */
export class ContentFyOrchestrator {
  private pipeline = new ActionPipeline(createDefaultHandlers());
  private workflows = new WorkflowEngine(this.pipeline);
  private reactions = new ReactionEngine();
  private dispatcher = new RuleDispatcher(
    this.workflows,
    this.reactions,
    this.pipeline
  );
  private draining = false;

  /**
   * Publish an event. Dispatch is async by default (non-blocking).
   */
  emit(input: {
    name: OrchestratorEventName;
    payload?: OrchestratorEventPayload;
    source?: OrchestratorMotor | "edge" | "admin" | "system";
    priority?: number;
    correlationId?: string;
    /** Force sync processing (tests / critical admin) */
    sync?: boolean;
  }) {
    if (!eventRegistry.has(input.name)) {
      throw new Error(`Unknown orchestrator event: ${input.name}`);
    }
    const envelope = eventBus.create({
      name: input.name,
      payload: input.payload || {},
      source: input.source,
      priority: input.priority,
      correlationId: input.correlationId,
    });

    const rules = resolveOrchestratorRules();
    if (input.sync || !rules.asyncDispatch) {
      return this.processOne(envelope).then((runs) => ({
        event: envelope,
        runs,
      }));
    }

    eventBus.enqueue(envelope);
    queueMicrotask(() => {
      void this.drain();
    });
    return Promise.resolve({ event: envelope, runs: [] });
  }

  private async processOne(envelope: ReturnType<typeof eventBus.create>) {
    await eventBus.notify(envelope);
    const runs = await this.dispatcher.dispatch(envelope);
    observabilityStore.record(runs);
    return runs;
  }

  async drain(max = 20) {
    if (this.draining) return;
    this.draining = true;
    try {
      const batch = eventBus.dequeue(max);
      // Process by priority already sorted; isolate failures
      await Promise.allSettled(batch.map((evt) => this.processOne(evt)));
      if (eventBus.depth() > 0) {
        queueMicrotask(() => {
          void this.drain();
        });
      }
    } finally {
      this.draining = false;
    }
  }

  dashboard(): OrchestratorDashboardSnapshot {
    const rules = resolveOrchestratorRules();
    return {
      queueDepth: eventBus.depth(),
      processedTotal: observabilityStore.processedTotal,
      failedTotal: observabilityStore.failedTotal,
      retryTotal: observabilityStore.retryTotal,
      avgLatencyMs: observabilityStore.avgLatencyMs(),
      recentEvents: eventBus.recentEvents(40),
      recentRuns: observabilityStore.recent(40),
      registry: eventRegistry.list(),
      workflows: rules.workflows.map((w) => ({
        id: w.id,
        event: w.event,
        enabled: w.enabled,
        steps: w.steps.length,
      })),
      reactions: rules.reactions.map((r) => ({
        id: r.id,
        onEvent: r.onEvent,
        enabled: r.enabled,
      })),
      generatedAt: new Date().toISOString(),
    };
  }

  /** Test helpers */
  __resetForTests() {
    eventBus.clear();
    observabilityStore.clear();
  }

  get pipelineForTests() {
    return this.pipeline;
  }
}

export const contentFyOrchestrator = new ContentFyOrchestrator();

/** Fire-and-forget emit from edge routers — never throws to callers. */
export function emitOrchestratorEvent(
  name: OrchestratorEventName,
  payload: OrchestratorEventPayload = {},
  source: OrchestratorMotor | "edge" | "admin" | "system" = "edge"
) {
  try {
    void contentFyOrchestrator.emit({ name, payload, source });
  } catch (error) {
    console.error(
      "[ContentFy Orchestrator] emit failed:",
      error instanceof Error ? error.message : error
    );
  }
}
