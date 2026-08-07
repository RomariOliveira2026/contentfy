import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  learnEngine,
  skillGraph,
  competencyEngine,
  goalEngine,
  LEARN_GOALS,
} from "../core/learn";
import type { LearnLearnerSignals } from "@shared/contentfy";
import * as db from "../db";
import * as learnStore from "../learn-store";
import { buildContinueLearningSnapshots } from "../discovery-store";

async function buildSignals(userId: number): Promise<{
  signals: LearnLearnerSignals;
  productNames: Record<string, string>;
}> {
  const [owned, progressSnaps, activeGoalId, allProducts] = await Promise.all([
    db.getUserProducts(userId),
    buildContinueLearningSnapshots(userId),
    learnStore.getActiveGoalId(userId),
    db.getAllProducts(),
  ]);

  const productNames: Record<string, string> = {};
  for (const p of allProducts) {
    productNames[p.slug] = p.name;
  }

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

  // Soft progress for owned non-course products only when no LMS progress exists.
  // Ebooks/apps: engagement credit from ownership, never fake 100% completion.
  for (const slug of ownedProductSlugs) {
    if (progressBySlug[slug] == null) {
      progressBySlug[slug] = 20;
    }
  }

  const last = progressSnaps[0];
  const signals: LearnLearnerSignals = {
    userId,
    ownedProductSlugs,
    completedLessonCount,
    totalLessonTouches,
    coursesCompleted,
    streakDays: 0, // Real streak requires daily event log — wire when Learn events table expands
    progressBySlug,
    lastLesson: last
      ? {
          productId: last.productId,
          productSlug: last.productSlug,
          productName: last.productName,
          lessonTitle: last.lastLessonTitle,
          moduleTitle: last.lastModuleTitle,
          href: last.productId
            ? `/my-account/course/${last.productId}`
            : `/produto/${last.productSlug}`,
        }
      : undefined,
    activeGoalId,
    purchasedAtLeastOnce: ownedProductSlugs.length > 0,
  };

  return { signals, productNames };
}

export const learnRouter = router({
  home: protectedProcedure.query(async ({ ctx }) => {
    const { signals, productNames } = await buildSignals(ctx.user.id);
    return learnEngine.buildDashboard({ signals, productNames });
  }),

  dashboard: protectedProcedure.query(async ({ ctx }) => {
    const { signals, productNames } = await buildSignals(ctx.user.id);
    return learnEngine.buildDashboard({ signals, productNames });
  }),

  goals: protectedProcedure.query(async ({ ctx }) => {
    const { signals } = await buildSignals(ctx.user.id);
    const competencies = competencyEngine.evaluate(signals);
    return goalEngine.evaluate(competencies, signals);
  }),

  catalogGoals: protectedProcedure.query(async () => LEARN_GOALS),

  setActiveGoal: protectedProcedure
    .input(z.object({ goalId: z.string().min(1).max(64) }))
    .mutation(async ({ ctx, input }) => {
      const exists = LEARN_GOALS.some((g) => g.id === input.goalId);
      if (!exists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Objetivo inválido",
        });
      }
      const result = await learnStore.setActiveGoalId(ctx.user.id, input.goalId);
      const { invalidateExperienceForUser } = await import(
        "../core/experience/cache"
      );
      const experienceStore = await import("../experience-store");
      invalidateExperienceForUser(ctx.user.id);
      void experienceStore.recordActivityEvent({
        userId: ctx.user.id,
        eventType: "goal_updated",
        meta: { goalId: input.goalId },
      });
      const { emitOrchestratorEvent } = await import("../core/orchestrator");
      emitOrchestratorEvent(
        "GOAL_UPDATED",
        { userId: ctx.user.id, goalId: input.goalId },
        "learn"
      );
      return result;
    }),

  competencies: protectedProcedure.query(async ({ ctx }) => {
    const { signals } = await buildSignals(ctx.user.id);
    const all = competencyEngine.evaluate(signals);
    return {
      all,
      acquired: all.filter((c) => c.status === "acquired"),
      inProgress: all.filter((c) => c.status === "in_progress"),
      missing: all.filter((c) => c.status === "missing"),
      stagnant: competencyEngine.stagnant(all, signals),
    };
  }),

  journey: protectedProcedure.query(async ({ ctx }) => {
    const { signals, productNames } = await buildSignals(ctx.user.id);
    return learnEngine.buildDashboard({ signals, productNames }).journey;
  }),

  timeline: protectedProcedure.query(async ({ ctx }) => {
    const { signals, productNames } = await buildSignals(ctx.user.id);
    return learnEngine.buildDashboard({ signals, productNames }).timeline;
  }),

  achievements: protectedProcedure.query(async ({ ctx }) => {
    const { signals, productNames } = await buildSignals(ctx.user.id);
    return learnEngine.buildDashboard({ signals, productNames }).achievements;
  }),

  nextStep: protectedProcedure.query(async ({ ctx }) => {
    const { signals, productNames } = await buildSignals(ctx.user.id);
    return learnEngine.buildDashboard({ signals, productNames }).nextStep;
  }),

  skillGraph: protectedProcedure.query(async ({ ctx }) => {
    const { signals } = await buildSignals(ctx.user.id);
    const competencies = competencyEngine.evaluate(signals);
    const goals = goalEngine.evaluate(competencies, signals);
    return skillGraph.build({ signals, competencies, goals });
  }),

  successIndex: protectedProcedure.query(async ({ ctx }) => {
    const { signals, productNames } = await buildSignals(ctx.user.id);
    return learnEngine.buildDashboard({ signals, productNames }).successIndex;
  }),
});
