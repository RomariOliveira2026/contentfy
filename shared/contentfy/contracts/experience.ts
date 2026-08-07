/**
 * ContentFy Experience Layer — orchestration contracts.
 * Consumes Learn / Success / Discovery / Protect / LMS.
 * No generative AI. No duplicated scoring/recommendation logic.
 */

export type ExperienceStudentState =
  | "new_user"
  | "purchased_no_progress"
  | "active_learning"
  | "inactive_return"
  | "goal_near_completion"
  | "course_completed"
  | "no_products"
  | "partial_data"
  | "service_degraded";

export type NextBestActionKind =
  | "continue_lesson"
  | "start_first_product"
  | "resume_journey"
  | "review_stagnant_competency"
  | "choose_goal"
  | "related_product"
  | "view_achievement"
  | "onboarding"
  | "explore_catalog"
  | "support"
  | "complete_onboarding";

export interface NextBestAction {
  kind: NextBestActionKind;
  title: string;
  reason: string;
  href?: string;
  ctaLabel: string;
  priority: number;
  meta?: Record<string, string | number | boolean | null>;
}

export interface ExperienceGreeting {
  salutation: string;
  headline: string;
  support?: string;
  tone: "welcome" | "continue" | "return" | "celebrate" | "guide";
}

export interface JourneySummaryView {
  primaryGoalName: string | null;
  evolutionPercent: number | null;
  productInProgress: string | null;
  lastLessonTitle: string | null;
  message: string;
}

export interface ContinueLearningView {
  productSlug: string;
  productName: string;
  productId?: number;
  lastLessonTitle?: string;
  lastModuleTitle?: string;
  progressPercent: number;
  remainingLabel?: string;
  href: string;
  coverImage?: string | null;
  lastActivityLabel?: string;
}

export interface SuccessSnapshotView {
  score: number;
  label: string;
  knowledge: number;
  application: number;
  consistency: number;
  result: number;
  weeklyTrend: "up" | "flat" | "down";
  explanation: string;
}

export interface CompetencyViewItem {
  id: string;
  name: string;
  category: string;
  progress: number;
  status: "acquired" | "in_progress" | "missing" | "stagnant";
}

export interface AchievementViewItem {
  id: string;
  name: string;
  description: string;
  tier: string;
  unlocked: boolean;
}

export interface RecommendationViewItem {
  id: string;
  title: string;
  reason: string;
  href?: string;
  productSlug?: string;
}

export interface ProtectionSummaryItem {
  orderId: number;
  productName: string;
  status: string;
  remainingDays: number | null;
  href: string;
}

export interface ExperienceNotificationItem {
  id: string;
  title: string;
  body?: string;
  createdAt: string;
  read: boolean;
}

export interface StudentContext {
  userId: number;
  name: string | null;
  firstName: string | null;
  ownedProductCount: number;
  ownedProductSlugs: string[];
  productInProgress: ContinueLearningView | null;
  lastLessonTitle: string | null;
  averageProgress: number | null;
  activeGoalId: string | null;
  activeGoalName: string | null;
  activeGoalProgress: number | null;
  competenciesAcquired: CompetencyViewItem[];
  competenciesInProgress: CompetencyViewItem[];
  competenciesStagnant: CompetencyViewItem[];
  successScore: number | null;
  consistencyBand: string | null;
  habitStreakDays: number | null;
  achievementsUnlocked: AchievementViewItem[];
  recommendations: RecommendationViewItem[];
  nextSteps: NextBestAction[];
  protectedPurchases: ProtectionSummaryItem[];
  notifications: ExperienceNotificationItem[];
  studentState: ExperienceStudentState;
  engines: {
    learn: "ok" | "degraded" | "unavailable";
    success: "ok" | "degraded" | "unavailable";
    discovery: "ok" | "degraded" | "unavailable";
    protect: "ok" | "degraded" | "unavailable";
    lms: "ok" | "degraded" | "unavailable";
  };
  generatedAt: string;
}

export interface ExperienceHomePayload {
  greeting: ExperienceGreeting;
  primaryGoal: {
    id: string | null;
    name: string | null;
    progress: number | null;
  };
  journeySummary: JourneySummaryView;
  continueLearning: ContinueLearningView[];
  nextBestAction: NextBestAction | null;
  successSnapshot: SuccessSnapshotView | null;
  competencies: {
    acquired: CompetencyViewItem[];
    inProgress: CompetencyViewItem[];
    stagnant: CompetencyViewItem[];
  };
  achievements: AchievementViewItem[];
  recommendations: RecommendationViewItem[];
  protectionSummary: ProtectionSummaryItem[];
  notifications: ExperienceNotificationItem[];
  studentState: ExperienceStudentState;
  fallbackMode: boolean;
  onboardingNeeded: boolean;
  cacheHit: boolean;
  generatedAt: string;
}

export interface ExperienceOnboardingInput {
  primaryGoalId?: string;
  improveFirst?: string;
  weeklyHours?: number;
  preferences?: Record<string, string | number | boolean | null>;
}

export interface ExperienceOnboardingState {
  completed: boolean;
  primaryGoalId: string | null;
  improveFirst: string | null;
  weeklyHours: number | null;
  preferences: Record<string, string | number | boolean | null> | null;
  completedAt: string | null;
  updatedAt: string | null;
  /** Production must be db; memory only when migration absent / local fallback. */
  persisted: "db" | "memory";
}

export type ExperienceActivityEventType =
  | "login"
  | "area_opened"
  | "lesson_started"
  | "lesson_completed"
  | "product_returned"
  | "exercise_completed"
  | "goal_updated"
  | "recommendation_clicked";

export interface ExperienceActivitySummary {
  lastActiveDay: string | null;
  lastActiveAt: string | null;
  recentActiveDays: number;
  streakDays: number;
  inactiveDays: number | null;
  hasPriorActivity: boolean;
  isReturning: boolean;
}

/** Default inactivity threshold for inactive_return (days). Override via EXPERIENCE_INACTIVE_RETURN_DAYS. */
export const DEFAULT_INACTIVE_RETURN_DAYS = 7;

/** Configurable NBA priorities (lower number = higher priority). */
export interface NextBestActionPriorityConfig {
  continue_lesson: number;
  resume_journey: number;
  review_stagnant_competency: number;
  choose_goal: number;
  start_first_product: number;
  complete_onboarding: number;
  related_product: number;
  view_achievement: number;
  explore_catalog: number;
  support: number;
  onboarding: number;
}

export const DEFAULT_NBA_PRIORITIES: NextBestActionPriorityConfig = {
  continue_lesson: 10,
  resume_journey: 20,
  review_stagnant_competency: 30,
  choose_goal: 40,
  start_first_product: 50,
  complete_onboarding: 55,
  related_product: 60,
  view_achievement: 70,
  explore_catalog: 80,
  support: 90,
  onboarding: 100,
};

export type ExperienceAnalyticsEvent =
  | "experience.home_viewed"
  | "experience.next_action_clicked"
  | "experience.goal_selected"
  | "experience.recommendation_clicked"
  | "experience.section_viewed"
  | "experience.onboarding_completed"
  | "experience.continue_learning_clicked"
  | "experience.achievement_viewed";

export interface ExperienceAchievementPageItem {
  id: string;
  name: string;
  description: string;
  tier: string;
  unlocked: boolean;
  /** Only set when a real unlock timestamp exists; never invent. */
  unlockedAt: string | null;
  origin: string;
  progressToUnlock: number | null;
}

export interface ExperienceAchievementsPayload {
  unlocked: ExperienceAchievementPageItem[];
  locked: ExperienceAchievementPageItem[];
  nextTarget: ExperienceAchievementPageItem | null;
  emptyInvite: string | null;
  generatedAt: string;
}
