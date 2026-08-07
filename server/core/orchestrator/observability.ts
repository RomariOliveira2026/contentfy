import type { OrchestratorWorkflowRunLog } from "@shared/contentfy";

/** In-memory observability ring buffer — no secrets. */
class ObservabilityStore {
  private runs: OrchestratorWorkflowRunLog[] = [];
  private max = 200;
  processedTotal = 0;
  failedTotal = 0;
  retryTotal = 0;
  latencySum = 0;

  record(runs: OrchestratorWorkflowRunLog[]) {
    for (const run of runs) {
      this.processedTotal += 1;
      this.latencySum += run.totalLatencyMs;
      if (run.status === "failed") this.failedTotal += 1;
      for (const step of run.steps) {
        if (step.attempts > 1) this.retryTotal += step.attempts - 1;
      }
      this.runs.push(run);
    }
    if (this.runs.length > this.max) {
      this.runs.splice(0, this.runs.length - this.max);
    }
  }

  recent(limit = 40) {
    return this.runs.slice(-limit).reverse();
  }

  avgLatencyMs() {
    if (this.processedTotal === 0) return 0;
    return Math.round(this.latencySum / this.processedTotal);
  }

  clear() {
    this.runs = [];
    this.processedTotal = 0;
    this.failedTotal = 0;
    this.retryTotal = 0;
    this.latencySum = 0;
  }
}

export const observabilityStore = new ObservabilityStore();
