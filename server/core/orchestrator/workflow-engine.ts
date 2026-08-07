import type {
  OrchestratorEventEnvelope,
  OrchestratorWorkflowDefinition,
  OrchestratorWorkflowRunLog,
  OrchestratorMotor,
} from "@shared/contentfy";
import { resolveOrchestratorRules } from "./config";
import { ActionPipeline } from "./action-pipeline";

let runSeq = 0;

export class WorkflowEngine {
  constructor(private pipeline: ActionPipeline) {}

  workflowsFor(eventName: OrchestratorEventEnvelope["name"]): OrchestratorWorkflowDefinition[] {
    const rules = resolveOrchestratorRules();
    return rules.workflows
      .filter((w) => w.enabled && w.event === eventName)
      .sort((a, b) => a.priority - b.priority);
  }

  async run(
    event: OrchestratorEventEnvelope,
    workflow: OrchestratorWorkflowDefinition
  ): Promise<OrchestratorWorkflowRunLog> {
    runSeq += 1;
    const startedAt = new Date().toISOString();
    const t0 = Date.now();
    const steps = await this.pipeline.runSequence(event, workflow.steps);
    const failed = steps.filter(
      (s) => s.status === "failed" || s.status === "timeout"
    ).length;
    const success = steps.filter((s) => s.status === "success" || s.status === "fallback").length;
    const status =
      failed === 0 ? "success" : success > 0 ? "partial" : "failed";
    const motors = Array.from(
      new Set(steps.map((s) => s.motor))
    ) as OrchestratorMotor[];

    return {
      id: `run_${Date.now().toString(36)}_${runSeq}`,
      workflowId: workflow.id,
      eventId: event.id,
      eventName: event.name,
      status,
      steps,
      motors,
      startedAt,
      finishedAt: new Date().toISOString(),
      totalLatencyMs: Date.now() - t0,
    };
  }
}
