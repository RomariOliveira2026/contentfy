import type {
  OrchestratorEventEnvelope,
  OrchestratorWorkflowRunLog,
} from "@shared/contentfy";
import { WorkflowEngine } from "./workflow-engine";
import { ReactionEngine } from "./reaction-engine";
import { ActionPipeline } from "./action-pipeline";

export class RuleDispatcher {
  constructor(
    private workflows: WorkflowEngine,
    private reactions: ReactionEngine,
    private pipeline: ActionPipeline
  ) {}

  async dispatch(
    event: OrchestratorEventEnvelope
  ): Promise<OrchestratorWorkflowRunLog[]> {
    const runs: OrchestratorWorkflowRunLog[] = [];
    const defs = this.workflows.workflowsFor(event.name);

    // Workflows run independently — failure in one does not cancel others
    const settled = await Promise.allSettled(
      defs.map((wf) => this.workflows.run(event, wf))
    );
    for (const r of settled) {
      if (r.status === "fulfilled") runs.push(r.value);
    }

    // Reactions as an ad-hoc workflow
    const reactionSteps = this.reactions.stepsFor(event);
    if (reactionSteps.length) {
      const startedAt = new Date().toISOString();
      const t0 = Date.now();
      const steps = await this.pipeline.runSequence(event, reactionSteps);
      const failed = steps.some(
        (s) => s.status === "failed" || s.status === "timeout"
      );
      const ok = steps.some((s) => s.status === "success");
      runs.push({
        id: `run_rx_${event.id}`,
        workflowId: "reactions",
        eventId: event.id,
        eventName: event.name,
        status: failed ? (ok ? "partial" : "failed") : "success",
        steps,
        motors: Array.from(new Set(steps.map((s) => s.motor))),
        startedAt,
        finishedAt: new Date().toISOString(),
        totalLatencyMs: Date.now() - t0,
      });
    }

    return runs;
  }
}
