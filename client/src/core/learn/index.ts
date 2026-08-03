/**
 * Client Learn core — thin re-exports for experience layer.
 * Business logic lives in shared contracts + server engines.
 */

export type {
  LearnDashboardPayload,
  LearnerCompetencyState,
  LearnerGoalState,
  LearnerAchievement,
  SuccessIndexBreakdown,
  NextStepRecommendation,
  JourneySnapshot,
} from "@shared/contentfy";

export {
  computeSuccessIndex,
  levelFromProgress,
  competencyStatusFromProgress,
} from "@shared/contentfy";
