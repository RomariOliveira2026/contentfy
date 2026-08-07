import type {
  OrchestratorActionKind,
  OrchestratorActionStep,
  OrchestratorEventEnvelope,
  OrchestratorStepLog,
  OrchestratorStepStatus,
} from "@shared/contentfy";
import { resolveOrchestratorRules } from "./config";

export type ActionHandler = (ctx: {
  event: OrchestratorEventEnvelope;
  step: OrchestratorActionStep;
}) => Promise<void> | void;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`timeout ${ms}ms`)), ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

/**
 * Executes coordination actions (cache invalidation / metrics).
 * Never embeds motor business rules.
 */
export class ActionPipeline {
  constructor(private handlers: Map<OrchestratorActionKind, ActionHandler>) {}

  register(kind: OrchestratorActionKind, handler: ActionHandler) {
    this.handlers.set(kind, handler);
  }

  async runStep(
    event: OrchestratorEventEnvelope,
    step: OrchestratorActionStep
  ): Promise<OrchestratorStepLog> {
    const rules = resolveOrchestratorRules();
    const timeoutMs = step.timeoutMs ?? rules.defaultTimeoutMs;
    const maxAttempts = (step.retry ?? rules.defaultRetry) + 1;
    const startedAt = new Date().toISOString();
    const t0 = Date.now();
    let attempts = 0;
    let lastError: string | undefined;
    let status: OrchestratorStepStatus = "pending";

    const handler = this.handlers.get(step.kind);
    if (!handler) {
      return {
        stepId: step.id,
        kind: step.kind,
        motor: step.motor,
        phase: step.phase,
        status: "skipped",
        attempts: 0,
        latencyMs: 0,
        error: `handler missing: ${step.kind}`,
        startedAt,
        finishedAt: new Date().toISOString(),
      };
    }

    while (attempts < maxAttempts) {
      attempts += 1;
      status = "running";
      try {
        await withTimeout(
          Promise.resolve(handler({ event, step })),
          timeoutMs
        );
        status = "success";
        lastError = undefined;
        break;
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
        status = lastError.includes("timeout") ? "timeout" : "failed";
      }
    }

    return {
      stepId: step.id,
      kind: step.kind,
      motor: step.motor,
      phase: step.phase,
      status,
      attempts,
      latencyMs: Date.now() - t0,
      error: lastError,
      startedAt,
      finishedAt: new Date().toISOString(),
    };
  }

  async runSequence(
    event: OrchestratorEventEnvelope,
    steps: OrchestratorActionStep[]
  ): Promise<OrchestratorStepLog[]> {
    const ordered = [...steps].sort(
      (a, b) => (a.priority ?? 100) - (b.priority ?? 100)
    );
    const phaseOrder = ["before", "main", "after", "onSuccess", "onFailure", "fallback"] as const;
    const logs: OrchestratorStepLog[] = [];

    const byPhase = (phase: (typeof phaseOrder)[number]) =>
      ordered.filter((s) => s.phase === phase);

    // before + main in parallel groups per phase (motors isolated)
    for (const phase of ["before", "main"] as const) {
      const batch = byPhase(phase);
      if (!batch.length) continue;
      const settled = await Promise.all(
        batch.map((step) => this.runStep(event, step))
      );
      logs.push(...settled);
    }

    const mainFailed = logs.some(
      (l) =>
        l.phase === "main" &&
        (l.status === "failed" || l.status === "timeout")
    );
    const mainOk = logs.some((l) => l.phase === "main" && l.status === "success") ||
      !byPhase("main").length;

    // after always
    for (const step of byPhase("after")) {
      logs.push(await this.runStep(event, step));
    }

    if (mainOk && !mainFailed) {
      for (const step of byPhase("onSuccess")) {
        logs.push(await this.runStep(event, step));
      }
    }

    if (mainFailed) {
      for (const step of byPhase("onFailure")) {
        logs.push(await this.runStep(event, step));
      }
      for (const step of byPhase("fallback")) {
        const log = await this.runStep(event, step);
        logs.push({ ...log, status: log.status === "success" ? "fallback" : log.status });
      }
    }

    return logs;
  }
}
