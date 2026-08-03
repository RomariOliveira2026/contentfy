import type {
  ConsistencyBand,
  ConsistencySnapshot,
  SuccessRawSignals,
  SuccessScoreConfig,
} from "@shared/contentfy";
import { clampScore } from "@shared/contentfy";
import { resolveSuccessScoreConfig } from "./config";

export class ConsistencyEngine {
  constructor(private config: SuccessScoreConfig = resolveSuccessScoreConfig()) {}

  evaluate(signals: SuccessRawSignals): ConsistencySnapshot {
    const t = this.config.targets;
    const frequency = clampScore(
      (signals.activeDays / Math.max(1, t.activeDays)) * 100
    );
    const regularity = clampScore(
      (signals.streakDays / Math.max(1, t.streakDays)) * 100
    );
    const score = clampScore(frequency * 0.6 + regularity * 0.4);

    let trend: ConsistencySnapshot["trend"] = "flat";
    if (signals.weeklyDeltaPercent > 3) trend = "up";
    else if (signals.weeklyDeltaPercent < -3) trend = "down";

    const bands = this.config.consistencyBands;
    let band: ConsistencyBand = "fair";
    if (score >= bands.excellent) band = "excellent";
    else if (score >= bands.good) band = "good";
    else if (score < bands.declining) band = "declining";

    // Trend override for declining label
    if (trend === "down" && band !== "excellent") {
      band = "declining";
    }

    return {
      band,
      score,
      frequency,
      regularity,
      trend,
      label: bandLabel(band),
    };
  }
}

function bandLabel(band: ConsistencyBand): string {
  switch (band) {
    case "excellent":
      return "Excelente";
    case "good":
      return "Boa";
    case "declining":
      return "Em queda";
    default:
      return "Regular";
  }
}

export const consistencyEngine = new ConsistencyEngine();
