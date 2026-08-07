import type {
  AchievementViewItem,
  CompetencyViewItem,
  ContinueLearningView,
  ExperienceOnboardingState,
  ProtectionSummaryItem,
  StudentContext,
} from "@shared/contentfy";
import { deriveStudentState } from "./next-best-action-engine";
import { experienceFeedService } from "./experience-feed-service";

export interface StudentContextBuilderInput {
  userId: number;
  name: string | null;
  learn?: {
    ok: boolean;
    continueLearning: ContinueLearningView[];
    activeGoalId: string | null;
    activeGoalName: string | null;
    activeGoalProgress: number | null;
    acquired: CompetencyViewItem[];
    inProgress: CompetencyViewItem[];
    stagnant: CompetencyViewItem[];
    achievements: AchievementViewItem[];
    ownedProductSlugs: string[];
    averageProgress: number | null;
    coursesCompleted: number;
    inactiveDays?: number | null;
    hasPriorActivity?: boolean;
  };
  inactiveReturnDays?: number;
  success?: {
    ok: boolean;
    score: number | null;
    consistencyBand: string | null;
    habitStreakDays: number | null;
    recommendations: Array<{
      id?: string;
      title: string;
      reason: string;
      href?: string;
      productSlug?: string;
    }>;
  };
  discovery?: {
    ok: boolean;
    recommendations: Array<{
      id?: string;
      title: string;
      reason: string;
      href?: string;
      productSlug?: string;
    }>;
  };
  protect?: {
    ok: boolean;
    items: ProtectionSummaryItem[];
  };
  notifications?: StudentContext["notifications"];
  onboarding?: ExperienceOnboardingState | null;
}

function firstName(name: string | null): string | null {
  if (!name?.trim()) return null;
  return name.trim().split(/\s+/)[0] || null;
}

export class StudentContextBuilder {
  build(input: StudentContextBuilderInput): StudentContext {
    const learn = input.learn;
    const success = input.success;
    const discovery = input.discovery;
    const protect = input.protect;

    const ownedSlugs = learn?.ownedProductSlugs || [];
    const continueLearning = learn?.continueLearning || [];
    const productInProgress = continueLearning[0] || null;
    const hasProgress = continueLearning.some((c) => c.progressPercent > 0);

    const recs = experienceFeedService.fromDiscovery([
      ...(success?.recommendations || []),
      ...(discovery?.recommendations || []),
    ]);

    const statusOf = (
      block: { ok: boolean } | undefined
    ): "ok" | "unavailable" => {
      // Undefined = not consulted in this build; do not treat as failure.
      if (block == null) return "ok";
      return block.ok ? "ok" : "unavailable";
    };

    const engines = {
      learn: statusOf(learn),
      success: statusOf(success),
      discovery: statusOf(discovery),
      protect: statusOf(protect),
      lms: statusOf(learn),
    };

    const consulted = [learn, success, discovery, protect].filter(
      (b) => b != null
    );
    const failedConsulted = consulted.filter((b) => !b!.ok).length;
    const enginesDegraded =
      consulted.length > 0 && failedConsulted >= Math.min(3, consulted.length) && failedConsulted >= 3;
    const partialData = failedConsulted > 0 && failedConsulted < 3;

    const studentState = deriveStudentState({
      ownedProductCount: ownedSlugs.length,
      hasProgress,
      coursesCompleted: learn?.coursesCompleted || 0,
      activeGoalProgress: learn?.activeGoalProgress ?? null,
      inactiveDays: learn?.inactiveDays ?? null,
      hasPriorActivity: Boolean(learn?.hasPriorActivity),
      productInProgress: Boolean(
        productInProgress && productInProgress.progressPercent < 100
      ),
      enginesDegraded,
      learnUnavailable: learn != null && !learn.ok,
      partialData,
      inactiveReturnDays: input.inactiveReturnDays,
    });

    return {
      userId: input.userId,
      name: input.name,
      firstName: firstName(input.name),
      ownedProductCount: ownedSlugs.length,
      ownedProductSlugs: ownedSlugs,
      productInProgress,
      lastLessonTitle: productInProgress?.lastLessonTitle || null,
      averageProgress: learn?.averageProgress ?? null,
      activeGoalId: learn?.activeGoalId ?? null,
      activeGoalName: learn?.activeGoalName ?? null,
      activeGoalProgress: learn?.activeGoalProgress ?? null,
      competenciesAcquired: learn?.acquired || [],
      competenciesInProgress: learn?.inProgress || [],
      competenciesStagnant: learn?.stagnant || [],
      successScore: success?.score ?? null,
      consistencyBand: success?.consistencyBand ?? null,
      habitStreakDays: success?.habitStreakDays ?? null,
      achievementsUnlocked: (learn?.achievements || []).filter((a) => a.unlocked),
      recommendations: recs,
      nextSteps: [],
      protectedPurchases: protect?.items || [],
      notifications: input.notifications || [],
      studentState,
      engines,
      generatedAt: new Date().toISOString(),
    };
  }
}

export const studentContextBuilder = new StudentContextBuilder();
