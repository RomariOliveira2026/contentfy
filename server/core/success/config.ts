/**
 * Resolve Success Score config — env override, never silent hardcode in engines.
 * Set SUCCESS_SCORE_CONFIG_JSON to a partial/full SuccessScoreConfig JSON.
 */

import {
  DEFAULT_SUCCESS_SCORE_CONFIG,
  type SuccessScoreConfig,
} from "@shared/contentfy";

function deepMergeConfig(
  base: SuccessScoreConfig,
  patch: Partial<SuccessScoreConfig>
): SuccessScoreConfig {
  return {
    weights: { ...base.weights, ...patch.weights },
    targets: { ...base.targets, ...patch.targets },
    gradeThresholds: { ...base.gradeThresholds, ...patch.gradeThresholds },
    habitMilestones: patch.habitMilestones ?? base.habitMilestones,
    consistencyBands: {
      ...base.consistencyBands,
      ...patch.consistencyBands,
    },
  };
}

export function resolveSuccessScoreConfig(
  override?: Partial<SuccessScoreConfig>
): SuccessScoreConfig {
  let fromEnv: Partial<SuccessScoreConfig> = {};
  const raw = process.env.SUCCESS_SCORE_CONFIG_JSON;
  if (raw) {
    try {
      fromEnv = JSON.parse(raw) as Partial<SuccessScoreConfig>;
    } catch {
      console.warn(
        "[ContentFy Success] SUCCESS_SCORE_CONFIG_JSON inválido — usando defaults."
      );
    }
  }
  return deepMergeConfig(
    deepMergeConfig(DEFAULT_SUCCESS_SCORE_CONFIG, fromEnv),
    override || {}
  );
}

export { DEFAULT_SUCCESS_SCORE_CONFIG };
