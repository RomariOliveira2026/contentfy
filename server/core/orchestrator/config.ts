import {
  DEFAULT_ORCHESTRATOR_RULES,
  type OrchestratorRulesConfig,
  type OrchestratorWorkflowDefinition,
  type OrchestratorReactionRule,
} from "@shared/contentfy";

function mergeWorkflows(
  base: OrchestratorWorkflowDefinition[],
  patch?: OrchestratorWorkflowDefinition[]
): OrchestratorWorkflowDefinition[] {
  if (!patch?.length) return base.map((w) => ({ ...w, steps: [...w.steps] }));
  const byId = new Map(base.map((w) => [w.id, { ...w, steps: [...w.steps] }]));
  for (const w of patch) {
    byId.set(w.id, { ...w, steps: [...w.steps] });
  }
  return Array.from(byId.values());
}

function mergeReactions(
  base: OrchestratorReactionRule[],
  patch?: OrchestratorReactionRule[]
): OrchestratorReactionRule[] {
  if (!patch?.length) return base.map((r) => ({ ...r, then: [...r.then] }));
  const byId = new Map(base.map((r) => [r.id, { ...r, then: [...r.then] }]));
  for (const r of patch) {
    byId.set(r.id, { ...r, then: [...r.then] });
  }
  return Array.from(byId.values());
}

export function resolveOrchestratorRules(
  override?: Partial<OrchestratorRulesConfig>
): OrchestratorRulesConfig {
  let fromEnv: Partial<OrchestratorRulesConfig> = {};
  const raw = process.env.ORCHESTRATOR_RULES_JSON;
  if (raw) {
    try {
      fromEnv = JSON.parse(raw) as Partial<OrchestratorRulesConfig>;
    } catch {
      console.warn(
        "[ContentFy Orchestrator] ORCHESTRATOR_RULES_JSON inválido — defaults."
      );
    }
  }

  const merged: OrchestratorRulesConfig = {
    ...DEFAULT_ORCHESTRATOR_RULES,
    ...fromEnv,
    ...override,
    workflows: mergeWorkflows(
      override?.workflows || fromEnv.workflows || DEFAULT_ORCHESTRATOR_RULES.workflows,
      undefined
    ),
    reactions: mergeReactions(
      override?.reactions || fromEnv.reactions || DEFAULT_ORCHESTRATOR_RULES.reactions,
      undefined
    ),
    eventPriorityOverrides: {
      ...DEFAULT_ORCHESTRATOR_RULES.eventPriorityOverrides,
      ...fromEnv.eventPriorityOverrides,
      ...override?.eventPriorityOverrides,
    },
  };

  // If env provided full workflows/reactions arrays, prefer them entirely
  if (fromEnv.workflows?.length) merged.workflows = fromEnv.workflows;
  if (fromEnv.reactions?.length) merged.reactions = fromEnv.reactions;
  if (override?.workflows?.length) merged.workflows = override.workflows;
  if (override?.reactions?.length) merged.reactions = override.reactions;

  return merged;
}

export function sanitizeOrchestratorMeta(
  meta?: Record<string, unknown> | null
): Record<string, string | number | boolean | null> {
  if (!meta) return {};
  const blocked = /secret|token|password|authorization|api[_-]?key|cookie|session/i;
  const out: Record<string, string | number | boolean | null> = {};
  let n = 0;
  for (const [k, v] of Object.entries(meta)) {
    if (n >= 12) break;
    if (blocked.test(k)) continue;
    if (v == null) {
      out[k] = null;
      n += 1;
      continue;
    }
    if (typeof v === "boolean" || typeof v === "number") {
      out[k] = typeof v === "number" && !Number.isFinite(v) ? null : v;
      n += 1;
      continue;
    }
    if (typeof v === "string") {
      if (blocked.test(v)) continue;
      out[k] = v.slice(0, 120);
      n += 1;
    }
  }
  return out;
}
