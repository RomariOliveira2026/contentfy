import {
  DEFAULT_INTELLIGENCE_SCORE_CONFIG,
  type IntelligenceScoreConfig,
} from "@shared/contentfy";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === "object" && !Array.isArray(v);
}

function deepMergeConfig(
  base: IntelligenceScoreConfig,
  patch: Partial<IntelligenceScoreConfig>
): IntelligenceScoreConfig {
  const out: IntelligenceScoreConfig = {
    weights: { ...base.weights },
    thresholds: { ...base.thresholds },
    windows: { ...base.windows },
  };

  if (patch.windows) out.windows = { ...out.windows, ...patch.windows };
  if (patch.thresholds) {
    out.thresholds = { ...out.thresholds, ...patch.thresholds };
  }
  if (patch.weights) {
    out.weights = {
      product: { ...out.weights.product, ...(patch.weights.product || {}) },
      creator: { ...out.weights.creator, ...(patch.weights.creator || {}) },
      category: { ...out.weights.category, ...(patch.weights.category || {}) },
      engagement: {
        ...out.weights.engagement,
        ...(patch.weights.engagement || {}),
      },
      trust: { ...out.weights.trust, ...(patch.weights.trust || {}) },
      growth: { ...out.weights.growth, ...(patch.weights.growth || {}) },
      momentum: { ...out.weights.momentum, ...(patch.weights.momentum || {}) },
    };
  }
  void isPlainObject;
  return out;
}

export function resolveIntelligenceConfig(
  override?: Partial<IntelligenceScoreConfig>
): IntelligenceScoreConfig {
  let fromEnv: Partial<IntelligenceScoreConfig> = {};
  const raw = process.env.INTELLIGENCE_SCORE_CONFIG_JSON;
  if (raw) {
    try {
      fromEnv = JSON.parse(raw) as Partial<IntelligenceScoreConfig>;
    } catch {
      console.warn(
        "[ContentFy Intelligence] INTELLIGENCE_SCORE_CONFIG_JSON inválido — defaults."
      );
    }
  }
  return deepMergeConfig(
    deepMergeConfig(DEFAULT_INTELLIGENCE_SCORE_CONFIG, fromEnv),
    override || {}
  );
}

export function clamp01to100(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function pctDelta(recent: number, prior: number): number | null {
  if (prior <= 0 && recent <= 0) return null;
  if (prior <= 0) return recent > 0 ? 100 : null;
  return Math.round(((recent - prior) / prior) * 100);
}

export function normalizeAgainst(value: number, target: number): number {
  if (target <= 0) return 0;
  return clamp01to100((value / target) * 100);
}

export function weightedScore(
  components: Record<string, number>,
  weights: Record<string, number>
): { score: number; components: Record<string, number> } {
  let sumW = 0;
  let acc = 0;
  const out: Record<string, number> = {};
  for (const [k, w] of Object.entries(weights)) {
    const v = components[k] ?? 0;
    out[k] = clamp01to100(v);
    sumW += w;
    acc += out[k] * w;
  }
  const score = sumW > 0 ? clamp01to100(acc / sumW) : 0;
  return { score, components: out };
}

export function scoreLabel(score: number): string {
  if (score >= 80) return "Excelente";
  if (score >= 60) return "Forte";
  if (score >= 40) return "Em evolução";
  if (score >= 20) return "Inicial";
  return "Baixo sinal";
}
