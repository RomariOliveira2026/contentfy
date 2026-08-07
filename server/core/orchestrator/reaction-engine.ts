import type {
  OrchestratorEventEnvelope,
  OrchestratorReactionRule,
  OrchestratorActionStep,
} from "@shared/contentfy";
import { resolveOrchestratorRules } from "./config";

function readField(
  event: OrchestratorEventEnvelope,
  field: string
): number | null {
  if (field.startsWith("meta.")) {
    const key = field.slice(5);
    const v = event.payload.meta?.[key];
    return typeof v === "number" ? v : null;
  }
  const direct = (event.payload as Record<string, unknown>)[field];
  return typeof direct === "number" ? direct : null;
}

function match(
  rule: OrchestratorReactionRule,
  event: OrchestratorEventEnvelope
): boolean {
  if (!rule.enabled || rule.onEvent !== event.name) return false;
  const actual = readField(event, rule.when.field);
  if (actual == null) return false;
  const { op, value } = rule.when;
  switch (op) {
    case "gte":
      return actual >= value;
    case "lte":
      return actual <= value;
    case "gt":
      return actual > value;
    case "lt":
      return actual < value;
    case "eq":
      return actual === value;
    default:
      return false;
  }
}

/**
 * Configurable SE/ENTÃO reactions — coordination only, no motor business logic.
 */
export class ReactionEngine {
  matching(event: OrchestratorEventEnvelope): OrchestratorReactionRule[] {
    const rules = resolveOrchestratorRules();
    return rules.reactions
      .filter((r) => match(r, event))
      .sort((a, b) => a.priority - b.priority);
  }

  stepsFor(event: OrchestratorEventEnvelope): OrchestratorActionStep[] {
    return this.matching(event).flatMap((r) =>
      r.then.map((s) => ({
        ...s,
        id: `${r.id}:${s.id}`,
      }))
    );
  }
}

export const reactionEngine = new ReactionEngine();
