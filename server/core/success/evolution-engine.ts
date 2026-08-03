import type {
  EvolutionPoint,
  SuccessRawSignals,
} from "@shared/contentfy";

/** Visual evolution series — monthly / weekly points from signals. */
export class EvolutionEngine {
  monthly(signals: SuccessRawSignals): EvolutionPoint[] {
    if (signals.monthlyEvolution.length) {
      return signals.monthlyEvolution.map((m) => ({
        key: m.month,
        label: m.label,
        value: m.value,
      }));
    }
    // Deterministic fallback from avg progress — not fake history
    const base = Math.max(8, Math.round(signals.avgProgress * 0.4));
    return [
      { key: "m1", label: "Início", value: Math.min(100, base) },
      {
        key: "m2",
        label: "Recente",
        value: Math.min(100, Math.round(signals.avgProgress * 0.7)),
      },
      {
        key: "m3",
        label: "Atual",
        value: Math.min(100, Math.round(signals.avgProgress)),
      },
    ];
  }

  weekly(signals: SuccessRawSignals): EvolutionPoint[] {
    const current = Math.min(100, Math.round(signals.avgProgress));
    const prev = Math.max(
      0,
      current - Math.round(signals.weeklyDeltaPercent)
    );
    return [
      { key: "w-prev", label: "Semana anterior", value: prev },
      { key: "w-now", label: "Esta semana", value: current },
    ];
  }

  series(signals: SuccessRawSignals): EvolutionPoint[] {
    return this.monthly(signals);
  }
}

export const evolutionEngine = new EvolutionEngine();
