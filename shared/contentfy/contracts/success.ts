/**
 * ContentFy Success Engine — contracts for transformation metrics.
 * Rule-based only. No generative AI / embeddings / LLM.
 * Additive layer over Learn (read-only consumption).
 */

/** Configurable pillar weights — must sum conceptually to 1.0 (normalized at runtime). */
export interface SuccessPillarWeights {
  knowledge: number;
  application: number;
  consistency: number;
  result: number;
}

/** Targets used to normalize raw counts into 0–100 pillar scores. */
export interface SuccessNormalizationTargets {
  /** Modules / lesson completions for knowledge */
  modulesCompleted: number;
  /** Application tasks (exercises, checklists, practices) */
  applicationTasks: number;
  /** Active days window for consistency */
  activeDays: number;
  /** Streak days target */
  streakDays: number;
  /** Goals completed for result */
  goalsCompleted: number;
  /** Competencies acquired for result */
  competenciesAcquired: number;
}

export interface SuccessScoreConfig {
  weights: SuccessPillarWeights;
  targets: SuccessNormalizationTargets;
  gradeThresholds: {
    master: number;
    rise: number;
    grow: number;
  };
  habitMilestones: number[];
  consistencyBands: {
    excellent: number;
    good: number;
    declining: number;
  };
}

export type SuccessGrade = "seed" | "grow" | "rise" | "master";

export type ConsistencyBand = "excellent" | "good" | "fair" | "declining";

export interface SuccessPillarScores {
  knowledge: number;
  application: number;
  consistency: number;
  result: number;
}

export interface SuccessScoreSnapshot {
  score: number;
  grade: SuccessGrade;
  pillars: SuccessPillarScores;
  weightsUsed: SuccessPillarWeights;
  label: string;
}

export interface SuccessRawSignals {
  userId: number;
  modulesCompleted: number;
  modulesTotal: number;
  applicationTasks: number;
  activeDays: number;
  streakDays: number;
  goalsCompleted: number;
  goalsTotal: number;
  competenciesAcquired: number;
  competenciesInProgress: number;
  competenciesStagnant: number;
  avgProgress: number;
  weeklyDeltaPercent: number;
  ownedProductSlugs: string[];
  activeGoalId?: string | null;
  activeGoalName?: string | null;
  activeGoalProgress?: number;
  nextStepTitle?: string | null;
  nextStepHref?: string | null;
  nextStepReason?: string | null;
  /** ISO month → relative activity 0–100 */
  monthlyEvolution: Array<{ month: string; value: number; label: string }>;
  /** Recent timeline events */
  timeline: SuccessTimelineEvent[];
}

export interface SuccessTimelineEvent {
  id: string;
  at: string;
  kind: "score" | "habit" | "goal" | "competency" | "lesson" | "insight";
  title: string;
  subtitle?: string;
}

export interface HabitMilestone {
  days: number;
  name: string;
  reached: boolean;
  progress: number; // 0–100 toward this milestone
}

export interface HabitSnapshot {
  currentStreakDays: number;
  milestones: HabitMilestone[];
  label: string;
}

export interface ConsistencySnapshot {
  band: ConsistencyBand;
  score: number;
  frequency: number;
  regularity: number;
  trend: "up" | "flat" | "down";
  label: string;
}

export interface GoalProgressSnapshot {
  goalId: string;
  goalName: string;
  progress: number;
  competencyIds: string[];
  courseSlugs: string[];
  achievementIds: string[];
  nextStep: string | null;
  nextStepHref?: string | null;
}

export interface SuccessInsight {
  id: string;
  kind: "weekly_evolution" | "goal_progress" | "competencies_left" | "stagnant" | "habit" | "morning_hint";
  title: string;
  body: string;
  metric?: number;
  unit?: string;
}

export interface SuccessRecommendation {
  id: string;
  title: string;
  reason: string;
  href?: string;
  productSlug?: string;
  score: number;
}

export interface EvolutionPoint {
  key: string;
  label: string;
  value: number;
}

export interface SuccessDashboardPayload {
  score: SuccessScoreSnapshot;
  habits: HabitSnapshot;
  consistency: ConsistencySnapshot;
  goals: GoalProgressSnapshot[];
  evolution: EvolutionPoint[];
  monthlyEvolution: EvolutionPoint[];
  weeklyProgress: EvolutionPoint[];
  timeline: SuccessTimelineEvent[];
  insights: SuccessInsight[];
  recommendations: SuccessRecommendation[];
  nextAction: SuccessRecommendation | null;
  stagnantCompetencies: Array<{ id: string; name: string; progress: number }>;
  relatedProducts: Array<{ slug: string; name: string; href: string; reason: string }>;
  generatedAt: string;
  cacheHit: boolean;
}

export interface SuccessAdminAnalytics {
  averageScore: number;
  averageEvolution: number;
  habitReachRate: number;
  abandonmentRate: number;
  byCourse: Array<{ slug: string; avgProgress: number; learners: number }>;
  byCategory: Array<{ category: string; avgScore: number; learners: number }>;
  sampleSize: number;
  note: string;
}

export interface SuccessCreatorAnalytics {
  learnerCount: number;
  averageEvolution: number;
  competenciesDeveloped: number;
  abandonmentPoints: Array<{ slug: string; dropOffPercent: number }>;
  topGoals: Array<{ goalId: string; goalName: string; seekers: number }>;
  transformationRate: number;
  note: string;
}

/** Default Enterprise config — override via SUCCESS_SCORE_CONFIG_JSON or engine ctor. */
export const DEFAULT_SUCCESS_SCORE_CONFIG: SuccessScoreConfig = {
  weights: {
    knowledge: 0.3,
    application: 0.25,
    consistency: 0.25,
    result: 0.2,
  },
  targets: {
    modulesCompleted: 20,
    applicationTasks: 12,
    activeDays: 20,
    streakDays: 30,
    goalsCompleted: 2,
    competenciesAcquired: 6,
  },
  gradeThresholds: {
    master: 85,
    rise: 65,
    grow: 40,
  },
  habitMilestones: [7, 21, 30, 60, 90],
  consistencyBands: {
    excellent: 80,
    good: 60,
    declining: 35,
  },
};

export function normalizeWeights(
  weights: SuccessPillarWeights
): SuccessPillarWeights {
  const sum =
    weights.knowledge +
    weights.application +
    weights.consistency +
    weights.result;
  if (sum <= 0) return { ...DEFAULT_SUCCESS_SCORE_CONFIG.weights };
  return {
    knowledge: weights.knowledge / sum,
    application: weights.application / sum,
    consistency: weights.consistency / sum,
    result: weights.result / sum,
  };
}

export function gradeFromScore(
  score: number,
  thresholds: SuccessScoreConfig["gradeThresholds"] = DEFAULT_SUCCESS_SCORE_CONFIG.gradeThresholds
): SuccessGrade {
  if (score >= thresholds.master) return "master";
  if (score >= thresholds.rise) return "rise";
  if (score >= thresholds.grow) return "grow";
  return "seed";
}

export function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}
