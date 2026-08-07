import type {
  AchievementViewItem,
  CompetencyViewItem,
  ContinueLearningView,
  ExperienceHomePayload,
  ExperienceOnboardingInput,
  ExperienceOnboardingState,
  ProtectionSummaryItem,
  SuccessSnapshotView,
} from "@shared/contentfy";
import { competencyEngine, learnEngine } from "../learn";
import { successEngine, buildSuccessContext } from "../success";
import { discoveryEngine } from "../discovery";
import { getRefundEligibility } from "@shared/contentfy";
import * as db from "../../db";
import * as learnStore from "../../learn-store";
import { buildContinueLearningSnapshots } from "../../discovery-store";
import * as discoveryStore from "../../discovery-store";
import {
  experienceCacheGet,
  experienceCacheSet,
  invalidateExperienceForUser,
} from "./cache";
import { studentContextBuilder } from "./student-context-builder";
import { nextBestActionEngine } from "./next-best-action-engine";
import { greetingContextService } from "./greeting-context-service";
import { journeySummaryService } from "./journey-summary-service";
import { experienceFallbackService } from "./experience-fallback-service";
import { experienceAnalytics } from "./analytics";
import { resolveInactiveReturnDays } from "./config";
import { buildAchievementsPayload } from "./achievements-page";
import { notificationCenter } from "../notifications";
import * as experienceStore from "../../experience-store";

function logEngineError(engine: string, error: unknown) {
  const msg = error instanceof Error ? error.message : String(error);
  console.error(`[ContentFy Experience] ${engine} unavailable:`, msg);
}

async function settled<T>(
  label: string,
  fn: () => Promise<T>
): Promise<{ ok: true; value: T } | { ok: false; error: string }> {
  try {
    return { ok: true, value: await fn() };
  } catch (error) {
    logEngineError(label, error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "unavailable",
    };
  }
}

function mapContinueLearning(
  snaps: Awaited<ReturnType<typeof buildContinueLearningSnapshots>>
): ContinueLearningView[] {
  return snaps
    .map((snap) => {
      const progressPercent = Math.min(
        100,
        Math.round(
          (snap.completedLessons / Math.max(snap.totalLessons, 1)) * 100
        )
      );
      const lastAt = snap.lastWatchedAt
        ? new Date(snap.lastWatchedAt)
        : null;
      const daysAgo = lastAt
        ? Math.floor((Date.now() - lastAt.getTime()) / 86_400_000)
        : null;
      return {
        productSlug: snap.productSlug,
        productName: snap.productName,
        productId: snap.productId,
        lastLessonTitle: snap.lastLessonTitle,
        lastModuleTitle: snap.lastModuleTitle,
        progressPercent,
        remainingLabel:
          snap.totalLessons > snap.completedLessons
            ? `${snap.totalLessons - snap.completedLessons} aulas restantes`
            : "Concluído",
        href: `/my-account/course/${snap.productId}`,
        coverImage: snap.coverImage,
        lastActivityLabel:
          daysAgo == null
            ? undefined
            : daysAgo === 0
              ? "Hoje"
              : daysAgo === 1
                ? "Ontem"
                : `Há ${daysAgo} dias`,
      } satisfies ContinueLearningView;
    })
    .filter((c) => c.progressPercent < 100 || c.lastLessonTitle);
}

function mapCompetencies(
  list: Array<{
    competencyId: string;
    name: string;
    category: string;
    progress: number;
    status: "acquired" | "in_progress" | "missing";
  }>,
  stagnantIds: Set<string>
): {
  acquired: CompetencyViewItem[];
  inProgress: CompetencyViewItem[];
  stagnant: CompetencyViewItem[];
} {
  const acquired: CompetencyViewItem[] = [];
  const inProgress: CompetencyViewItem[] = [];
  const stagnant: CompetencyViewItem[] = [];
  for (const c of list) {
    const item: CompetencyViewItem = {
      id: c.competencyId,
      name: c.name,
      category: c.category,
      progress: c.progress,
      status: stagnantIds.has(c.competencyId) ? "stagnant" : c.status,
    };
    if (item.status === "acquired") acquired.push(item);
    else if (item.status === "stagnant") stagnant.push(item);
    else if (item.status === "in_progress") inProgress.push(item);
  }
  return { acquired, inProgress, stagnant };
}

export class ExperienceOrchestrator {
  async buildHome(userId: number, name: string | null): Promise<ExperienceHomePayload> {
    const cacheKey = `experience:home:${userId}`;
    const cached = experienceCacheGet<ExperienceHomePayload>(cacheKey);
    if (cached) {
      experienceAnalytics.track(userId, "experience.home_viewed", {
        cacheHit: true,
      });
      return { ...cached, cacheHit: true };
    }

    const [
      learnResult,
      successResult,
      discoveryResult,
      protectResult,
      notifyResult,
    ] = await Promise.all([
      settled("learn", async () => {
        const [owned, progressSnaps, activeGoalId, allProducts] =
          await Promise.all([
            db.getUserProducts(userId),
            buildContinueLearningSnapshots(userId),
            learnStore.getActiveGoalId(userId),
            db.getAllProducts(),
          ]);

        const productNames: Record<string, string> = {};
        for (const p of allProducts) productNames[p.slug] = p.name;

        const ownedProductSlugs: string[] = [];
        for (const row of owned || []) {
          const slug = row.product?.slug;
          if (slug) {
            ownedProductSlugs.push(slug);
            if (row.product?.name) productNames[slug] = row.product.name;
          }
        }

        const progressBySlug: Record<string, number> = {};
        let completedLessonCount = 0;
        let totalLessonTouches = 0;
        let coursesCompleted = 0;

        for (const snap of progressSnaps) {
          const pct = Math.min(
            100,
            Math.round(
              (snap.completedLessons / Math.max(snap.totalLessons, 1)) * 100
            )
          );
          progressBySlug[snap.productSlug] = pct;
          completedLessonCount += snap.completedLessons;
          totalLessonTouches += snap.totalLessons;
          if (pct >= 100) coursesCompleted += 1;
          if (!ownedProductSlugs.includes(snap.productSlug)) {
            ownedProductSlugs.push(snap.productSlug);
          }
          productNames[snap.productSlug] = snap.productName;
        }

        // Soft ownership credit only for Learn signals — Experience UI uses LMS snaps.
        for (const slug of ownedProductSlugs) {
          if (progressBySlug[slug] == null) progressBySlug[slug] = 20;
        }

        const last = progressSnaps[0];
        const signals = {
          userId,
          ownedProductSlugs,
          completedLessonCount,
          totalLessonTouches,
          coursesCompleted,
          streakDays: 0,
          progressBySlug,
          lastLesson: last
            ? {
                productId: last.productId,
                productSlug: last.productSlug,
                productName: last.productName,
                lessonTitle: last.lastLessonTitle,
                moduleTitle: last.lastModuleTitle,
                href: `/my-account/course/${last.productId}`,
              }
            : undefined,
          activeGoalId,
          purchasedAtLeastOnce: ownedProductSlugs.length > 0,
        };

        const dashboard = learnEngine.buildDashboard({ signals, productNames });
        const competencies = competencyEngine.evaluate(signals);
        const stagnant = learnEngine.stagnantCompetencies(signals);
        const stagnantIds = new Set(stagnant.map((s) => s.competencyId));
        const mapped = mapCompetencies(competencies, stagnantIds);
        const continueLearning = mapContinueLearning(progressSnaps);

        const realProgresses = progressSnaps.map((s) =>
          Math.min(
            100,
            Math.round(
              (s.completedLessons / Math.max(s.totalLessons, 1)) * 100
            )
          )
        );
        const averageProgress =
          realProgresses.length > 0
            ? Math.round(
                realProgresses.reduce((a, b) => a + b, 0) / realProgresses.length
              )
            : null;

        // LMS lastWatchedAt is a fallback only — activity store preferred later.
        let lmsInactiveDays: number | null = null;
        if (last?.lastWatchedAt) {
          lmsInactiveDays = Math.floor(
            (Date.now() - new Date(last.lastWatchedAt).getTime()) / 86_400_000
          );
        }

        return {
          continueLearning,
          activeGoalId: dashboard.activeGoal?.goalId ?? null,
          activeGoalName: dashboard.activeGoal?.name ?? null,
          activeGoalProgress: dashboard.activeGoal?.progress ?? null,
          acquired: mapped.acquired,
          inProgress: mapped.inProgress,
          stagnant: mapped.stagnant,
          achievements: dashboard.achievements.map(
            (a): AchievementViewItem => ({
              id: a.id,
              name: a.name,
              description: a.description,
              tier: a.tier,
              unlocked: a.unlocked,
            })
          ),
          ownedProductSlugs,
          averageProgress,
          coursesCompleted,
          lmsInactiveDays,
          relatedCourses: dashboard.relatedCourses,
        };
      }),
      settled("success", async () => {
        const ctx = await buildSuccessContext(userId);
        const dash = successEngine.buildDashboard(ctx);
        return {
          score: dash.score.score,
          consistencyBand: dash.consistency.band,
          habitStreakDays: dash.habits.currentStreakDays,
          snapshot: {
            score: dash.score.score,
            label: dash.score.label,
            knowledge: dash.score.pillars.knowledge,
            application: dash.score.pillars.application,
            consistency: dash.score.pillars.consistency,
            result: dash.score.pillars.result,
            weeklyTrend:
              dash.consistency.trend === "up"
                ? ("up" as const)
                : dash.consistency.trend === "down"
                  ? ("down" as const)
                  : ("flat" as const),
            explanation:
              "Score composto por conhecimento, aplicação, constância e resultado — sem fórmulas internas.",
          } satisfies SuccessSnapshotView,
          recommendations: dash.recommendations.slice(0, 6).map((r) => ({
            id: r.id,
            title: r.title,
            reason: r.reason,
            href: r.href,
            productSlug: r.productSlug,
          })),
        };
      }),
      settled("discovery", async () => {
        const products = (await db.getAllProducts())
          .filter((p) => p.isActive)
          .map((p) => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            type: p.type,
            description: p.description,
            coverImage: p.coverImage,
            thumbnailImage: p.thumbnailImage,
            price: p.price,
            categoryName: p.category?.name ?? null,
            isActive: p.isActive,
            createdAt: p.createdAt,
          }));
        const [favorites, views, searches, owned, progress, dbMeta, trending] =
          await Promise.all([
            discoveryStore.listFavoriteSlugs(userId),
            discoveryStore.getRecentViewSlugs(userId),
            discoveryStore.getRecentSearchQueries(userId),
            db.getUserProducts(userId),
            buildContinueLearningSnapshots(userId),
            discoveryStore.listDiscoveryDbMeta(),
            discoveryStore.buildTrendingSignals(),
          ]);
        const { getSeedMetaBySlug } = await import(
          "../discovery/seed-metadata"
        );
        const preferences = Array.from(
          new Set(
            [...views, ...favorites]
              .map((slug) => getSeedMetaBySlug(slug)?.category)
              .filter((c): c is string => Boolean(c))
          )
        );
        const home = discoveryEngine.buildHome({
          products,
          dbMeta,
          progress,
          trendingSignals: trending,
          favoriteSlugs: favorites,
          profile: {
            userId,
            preferences,
            goals: [],
            completedProductIds: [],
            ownedProductIds: (owned || [])
              .map((o) => o.userProduct?.productId ?? o.product?.id)
              .filter((id): id is number => typeof id === "number"),
            favoriteSlugs: favorites,
            recentViewSlugs: views,
            recentSearchQueries: searches,
            signals: [],
          },
        });
        const recommendedRail = home.rails.find((r) => r.id === "recommended");
        const trendingRail = home.rails.find((r) => r.id === "trending");
        const cards = [
          ...(recommendedRail?.items || []),
          ...(trendingRail?.items || []),
        ].slice(0, 6);
        return {
          recommendations: cards.map((c) => ({
            id: `disc:${c.slug}`,
            title: c.name,
            reason: c.reason || "Selecionado para você",
            href: c.href || `/produto/${c.slug}`,
            productSlug: c.slug,
          })),
        };
      }),
      settled("protect", async () => {
        const orders = await db.getUserOrders(userId);
        const items: ProtectionSummaryItem[] = [];
        for (const order of orders.slice(0, 8)) {
          const product = await db.getProductById(order.productId);
          if (!product || product.guaranteeDays <= 0) continue;
          const active = await db.getActiveRefundRequestForOrder(order.id);
          const eligibility = getRefundEligibility({
            orderStatus: order.status,
            purchasedAt: order.createdAt,
            guaranteeDays: product.guaranteeDays,
            productEligible: true,
            hasActiveRequest: Boolean(active),
            alreadyRefunded: order.status === "refunded",
          });
          // Keep Home discreet: only active protection window or open request.
          if (!eligibility.eligible && !active) continue;
          items.push({
            orderId: order.id,
            productName: product.name,
            status: active?.status || "protected",
            remainingDays: eligibility.eligible
              ? eligibility.remainingDays
              : null,
            href: `/my-account/purchases/${order.id}/protection`,
          });
        }
        return { items };
      }),
      settled("notifications", async () => {
        return notificationCenter.list(userId).slice(0, 5).map((n) => ({
          id: n.id,
          title: n.title,
          body: n.body,
          createdAt: n.createdAt,
          read: n.read,
        }));
      }),
    ]);

    const learn = learnResult.ok
      ? { ok: true as const, ...learnResult.value }
      : { ok: false as const };

    const success = successResult.ok
      ? {
          ok: true as const,
          score: successResult.value.score,
          consistencyBand: successResult.value.consistencyBand,
          habitStreakDays: successResult.value.habitStreakDays,
          recommendations: successResult.value.recommendations,
          snapshot: successResult.value.snapshot,
        }
      : { ok: false as const };

    const discovery = discoveryResult.ok
      ? {
          ok: true as const,
          recommendations: discoveryResult.value.recommendations,
        }
      : { ok: false as const };

    const protect = protectResult.ok
      ? { ok: true as const, items: protectResult.value.items }
      : { ok: false as const };

    const [onboarding, activity, dismissedIds] = await Promise.all([
      experienceStore.getOnboarding(userId),
      experienceStore.getActivitySummary(userId),
      experienceStore.listDismissedRecommendationIds(userId),
    ]);
    const dismissedSet = new Set(dismissedIds);

    const inactiveDays =
      activity.inactiveDays != null
        ? activity.inactiveDays
        : learn.ok
          ? learn.lmsInactiveDays
          : null;
    const hasPriorActivity =
      activity.hasPriorActivity ||
      (learn.ok && (learn.lmsInactiveDays != null || learn.coursesCompleted > 0));

    // Soft-record area open (non-blocking); also establishes activity source.
    void experienceStore.recordActivityEvent({
      userId,
      eventType: "area_opened",
    });

    const ctx = studentContextBuilder.build({
      userId,
      name,
      inactiveReturnDays: resolveInactiveReturnDays(),
      learn: learn.ok
        ? {
            ok: true,
            continueLearning: learn.continueLearning,
            activeGoalId: learn.activeGoalId,
            activeGoalName: learn.activeGoalName,
            activeGoalProgress: learn.activeGoalProgress,
            acquired: learn.acquired,
            inProgress: learn.inProgress,
            stagnant: learn.stagnant,
            achievements: learn.achievements,
            ownedProductSlugs: learn.ownedProductSlugs,
            averageProgress: learn.averageProgress,
            coursesCompleted: learn.coursesCompleted,
            inactiveDays,
            hasPriorActivity,
          }
        : {
            ok: false,
            continueLearning: [],
            activeGoalId: null,
            activeGoalName: null,
            activeGoalProgress: null,
            acquired: [],
            inProgress: [],
            stagnant: [],
            achievements: [],
            ownedProductSlugs: [],
            averageProgress: null,
            coursesCompleted: 0,
            inactiveDays: null,
            hasPriorActivity: false,
          },
      success: success.ok
        ? {
            ok: true,
            score: success.score,
            consistencyBand: success.consistencyBand,
            habitStreakDays: success.habitStreakDays,
            recommendations: success.recommendations,
          }
        : undefined,
      discovery: discovery.ok
        ? { ok: true, recommendations: discovery.recommendations }
        : undefined,
      protect: protect.ok ? { ok: true, items: protect.items } : undefined,
      notifications: notifyResult.ok ? notifyResult.value : [],
      onboarding,
    });

    const greeting = greetingContextService.build(ctx);
    const journeySummary = journeySummaryService.build(ctx);
    const nextBestAction = nextBestActionEngine.decide(ctx);
    ctx.nextSteps = nextBestAction ? [nextBestAction] : [];

    const fallbackMode =
      !learn.ok ||
      ctx.studentState === "partial_data" ||
      ctx.studentState === "service_degraded";

    const onboardingNeeded =
      !onboarding?.completed &&
      (ctx.studentState === "new_user" ||
        ctx.studentState === "no_products" ||
        !ctx.activeGoalId);

    const patch = experienceFallbackService.emptyHomePatch(ctx.studentState);

    const payload: ExperienceHomePayload = {
      greeting,
      primaryGoal: {
        id: ctx.activeGoalId,
        name: ctx.activeGoalName,
        progress: ctx.activeGoalProgress,
      },
      journeySummary,
      continueLearning: ctx.productInProgress
        ? learn.ok
          ? learn.continueLearning
          : [ctx.productInProgress]
        : learn.ok
          ? learn.continueLearning
          : [],
      nextBestAction,
      successSnapshot: success.ok ? success.snapshot : null,
      competencies: {
        acquired: ctx.competenciesAcquired,
        inProgress: ctx.competenciesInProgress,
        stagnant: ctx.competenciesStagnant,
      },
      achievements: ctx.achievementsUnlocked,
      recommendations: (() => {
        const base =
          patch.recommendations && ctx.recommendations.length === 0
            ? patch.recommendations
            : ctx.recommendations;
        return base.filter((r) => !dismissedSet.has(r.id));
      })(),
      protectionSummary: ctx.protectedPurchases,
      notifications: ctx.notifications,
      studentState: ctx.studentState,
      fallbackMode,
      onboardingNeeded:
        patch.onboardingNeeded != null
          ? patch.onboardingNeeded
          : onboardingNeeded,
      cacheHit: false,
      generatedAt: new Date().toISOString(),
    };

    experienceCacheSet(cacheKey, payload, 30_000);
    experienceAnalytics.track(userId, "experience.home_viewed", {
      state: payload.studentState,
      fallbackMode,
    });
    return payload;
  }

  async buildContext(userId: number, name: string | null) {
    const home = await this.buildHome(userId, name);
    const owned = await db.getUserProducts(userId).catch(() => []);
    const ownedProductSlugs = (owned || [])
      .map((o) => o.product?.slug)
      .filter((s): s is string => Boolean(s));
    return studentContextBuilder.build({
      userId,
      name,
      learn: {
        ok: true,
        continueLearning: home.continueLearning,
        activeGoalId: home.primaryGoal.id,
        activeGoalName: home.primaryGoal.name,
        activeGoalProgress: home.primaryGoal.progress,
        acquired: home.competencies.acquired,
        inProgress: home.competencies.inProgress,
        stagnant: home.competencies.stagnant,
        achievements: home.achievements.map((a) => ({
          ...a,
          unlocked: true,
        })),
        ownedProductSlugs,
        averageProgress: home.journeySummary.evolutionPercent,
        coursesCompleted: home.studentState === "course_completed" ? 1 : 0,
      },
      success: home.successSnapshot
        ? {
            ok: true,
            score: home.successSnapshot.score,
            consistencyBand: null,
            habitStreakDays: null,
            recommendations: home.recommendations,
          }
        : {
            ok: false,
            score: null,
            consistencyBand: null,
            habitStreakDays: null,
            recommendations: [],
          },
      discovery: {
        ok: true,
        recommendations: home.recommendations,
      },
      protect: {
        ok: true,
        items: home.protectionSummary,
      },
      notifications: home.notifications,
      onboarding: await experienceStore.getOnboarding(userId),
    });
  }

  nextBestAction(userId: number, name: string | null) {
    return this.buildHome(userId, name).then((h) => h.nextBestAction);
  }

  journeySummary(userId: number, name: string | null) {
    return this.buildHome(userId, name).then((h) => h.journeySummary);
  }

  async saveOnboarding(
    userId: number,
    input: ExperienceOnboardingInput
  ): Promise<ExperienceOnboardingState> {
    const state = await experienceStore.saveOnboarding(userId, input);
    if (input.primaryGoalId) {
      void learnStore.setActiveGoalId(userId, input.primaryGoalId).catch(() => {
        /* learn goal sync best-effort */
      });
      void experienceStore.recordActivityEvent({
        userId,
        eventType: "goal_updated",
        meta: { goalId: input.primaryGoalId },
      });
    }
    invalidateExperienceForUser(userId);
    await experienceAnalytics.trackAsync(
      userId,
      "experience.onboarding_completed",
      {
        primaryGoalId: input.primaryGoalId ?? null,
        weeklyHours: input.weeklyHours ?? null,
        persisted: state.persisted,
      }
    );
    return state;
  }

  async getOnboarding(userId: number): Promise<ExperienceOnboardingState> {
    const state = await experienceStore.getOnboarding(userId);
    return (
      state || {
        completed: false,
        primaryGoalId: null,
        improveFirst: null,
        weeklyHours: null,
        preferences: null,
        completedAt: null,
        updatedAt: null,
        persisted: "memory",
      }
    );
  }

  async dismissRecommendation(userId: number, recommendationId: string) {
    await experienceStore.dismissRecommendation(userId, recommendationId);
    return { ok: true as const };
  }

  markActionSeen(userId: number, actionKind: string) {
    experienceAnalytics.track(userId, "experience.next_action_clicked", {
      kind: actionKind,
      phase: "seen",
    });
    return { ok: true as const };
  }

  async achievements(userId: number) {
    try {
      const ctx = await buildSuccessContext(userId);
      return buildAchievementsPayload(ctx.achievements, {
        trustUnlockTimestamps: false,
      });
    } catch (error) {
      logEngineError("achievements", error);
      return buildAchievementsPayload([], { trustUnlockTimestamps: false });
    }
  }
}

export const experienceOrchestrator = new ExperienceOrchestrator();
