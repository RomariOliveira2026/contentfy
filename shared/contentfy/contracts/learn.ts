/**
 * ContentFy Learn — student evolution contracts.
 * Rule-based intelligence only. No LLM, embeddings, or generative AI.
 * Additive over LMS — does not replace lesson progress writers.
 */

/** Legacy adaptive node types (Evolution X seam — preserved). */
export type LearnNodeType =
  | "trail"
  | "objective"
  | "mission"
  | "lesson"
  | "quiz"
  | "challenge"
  | "practice"
  | "certificate";

export interface LearnNode {
  id: string;
  type: LearnNodeType;
  title: string;
  children?: LearnNode[];
  productId?: number;
}

export interface AdaptiveHint {
  userId: number;
  nodeId: string;
  recommendedNext: string[];
  reason: string;
}

// ---------------------------------------------------------------------------
// Competencies / Goals / Journeys / Achievements
// ---------------------------------------------------------------------------

export type CompetencyLevel =
  | "none"
  | "emerging"
  | "developing"
  | "proficient"
  | "mastery";

export interface CompetencyDef {
  id: string;
  name: string;
  description: string;
  category: string;
  relatedCompetencyIds?: string[];
}

export interface GoalDef {
  id: string;
  name: string;
  description: string;
  /** Competency IDs that advance this goal */
  competencyIds: string[];
  iconKey?: string;
}

export interface ProductCompetencyLink {
  productSlug: string;
  competencyIds: string[];
  /** How strongly this product develops each competency (0–1), keyed by id */
  weights?: Record<string, number>;
  goalIds?: string[];
}

export interface LearnerCompetencyState {
  competencyId: string;
  name: string;
  category: string;
  level: CompetencyLevel;
  progress: number; // 0–100
  status: "acquired" | "in_progress" | "missing";
  sourceProductSlugs: string[];
}

export interface LearnerGoalState {
  goalId: string;
  name: string;
  description: string;
  progress: number; // 0–100
  isActive: boolean;
  competencyIds: string[];
  missingCompetencyIds: string[];
}

export interface JourneyStep {
  id: string;
  kind: "goal" | "competency" | "course" | "product" | "achievement" | "next";
  title: string;
  subtitle?: string;
  href?: string;
  status: "done" | "current" | "upcoming";
  progress?: number;
}

export interface JourneySnapshot {
  goalId: string | null;
  goalName: string | null;
  steps: JourneyStep[];
  evolutionPercent: number;
  nextStep: NextStepRecommendation | null;
}

export type AchievementId =
  | "first_purchase"
  | "first_lesson"
  | "lessons_10"
  | "course_completed"
  | "streak_7"
  | "goal_reached"
  | "specialist"
  | "top_performer"
  | "high_performance"
  | "habit_builder";

export interface AchievementDef {
  id: AchievementId;
  name: string;
  description: string;
  /** Elegant tier — not childish gamification */
  tier: "bronze" | "silver" | "gold" | "platinum";
}

export interface LearnerAchievement {
  id: AchievementId;
  name: string;
  description: string;
  tier: AchievementDef["tier"];
  unlocked: boolean;
  unlockedAt?: string;
}

export interface SkillGraphEdge {
  fromType: "product" | "competency" | "goal" | "learner";
  fromId: string;
  toType: "product" | "competency" | "goal" | "learner" | "related_product";
  toId: string;
  weight: number;
  relation: string;
}

export interface SkillGraphSnapshot {
  edges: SkillGraphEdge[];
  competencyIds: string[];
  goalIds: string[];
  productSlugs: string[];
}

/** Success Index — four pillars (rules only). Distinct from Success Score formula. */
export interface SuccessIndexBreakdown {
  knowledge: number; // 0–100
  application: number;
  consistency: number;
  result: number;
  overall: number;
}

export interface NextStepRecommendation {
  kind: "lesson" | "course" | "competency" | "goal" | "product";
  title: string;
  reason: string;
  href?: string;
  productSlug?: string;
  competencyId?: string;
  goalId?: string;
}

export interface LearnTimelineEvent {
  id: string;
  at: string;
  kind: "lesson" | "achievement" | "goal" | "competency" | "purchase";
  title: string;
  subtitle?: string;
}

export interface LearnDashboardPayload {
  activeGoal: LearnerGoalState | null;
  goals: LearnerGoalState[];
  competencies: {
    acquired: LearnerCompetencyState[];
    inProgress: LearnerCompetencyState[];
    missing: LearnerCompetencyState[];
  };
  journey: JourneySnapshot;
  timeline: LearnTimelineEvent[];
  achievements: LearnerAchievement[];
  nextStep: NextStepRecommendation | null;
  successIndex: SuccessIndexBreakdown;
  evolutionPercent: number;
  relatedCourses: Array<{
    slug: string;
    name: string;
    href: string;
    reason: string;
  }>;
  personalized: boolean;
  generatedAt: string;
  cacheHit: boolean;
}

export interface LearnLearnerSignals {
  userId: number;
  ownedProductSlugs: string[];
  completedLessonCount: number;
  totalLessonTouches: number;
  coursesCompleted: number;
  streakDays: number;
  /** productSlug → progress 0–100 */
  progressBySlug: Record<string, number>;
  /** Last lesson context for next-step */
  lastLesson?: {
    productId: number;
    productSlug: string;
    productName: string;
    lessonTitle?: string;
    moduleTitle?: string;
    href: string;
  };
  activeGoalId?: string | null;
  purchasedAtLeastOnce: boolean;
}

export const COMPETENCY_LEVEL_THRESHOLDS: Record<
  Exclude<CompetencyLevel, "none">,
  number
> = {
  emerging: 15,
  developing: 40,
  proficient: 70,
  mastery: 90,
};

export function levelFromProgress(progress: number): CompetencyLevel {
  if (progress >= COMPETENCY_LEVEL_THRESHOLDS.mastery) return "mastery";
  if (progress >= COMPETENCY_LEVEL_THRESHOLDS.proficient) return "proficient";
  if (progress >= COMPETENCY_LEVEL_THRESHOLDS.developing) return "developing";
  if (progress >= COMPETENCY_LEVEL_THRESHOLDS.emerging) return "emerging";
  return "none";
}

export function competencyStatusFromProgress(
  progress: number
): LearnerCompetencyState["status"] {
  if (progress >= COMPETENCY_LEVEL_THRESHOLDS.proficient) return "acquired";
  if (progress > 0) return "in_progress";
  return "missing";
}

/** Success Index pure formula — Knowledge / Application / Consistency / Result. */
export function computeSuccessIndex(input: {
  knowledge: number;
  application: number;
  consistency: number;
  result: number;
}): SuccessIndexBreakdown {
  const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
  const knowledge = clamp(input.knowledge);
  const application = clamp(input.application);
  const consistency = clamp(input.consistency);
  const result = clamp(input.result);
  const overall = clamp(
    knowledge * 0.3 + application * 0.25 + consistency * 0.25 + result * 0.2
  );
  return { knowledge, application, consistency, result, overall };
}
