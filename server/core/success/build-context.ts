/**
 * Build Success signals from LMS + Learn engines (read-only).
 * Does not modify Learn/Discovery/Protect routers.
 */

import type {
  LearnLearnerSignals,
  SuccessRawSignals,
  SuccessTimelineEvent,
} from "@shared/contentfy";
import {
  achievementEngine,
  competencyEngine,
  goalEngine,
  learnEngine,
} from "../learn";
import { computeSuccessIndex } from "@shared/contentfy";
import * as db from "../../db";
import * as learnStore from "../../learn-store";
import { buildContinueLearningSnapshots } from "../../discovery-store";

async function buildLearnSignals(userId: number): Promise<{
  learnSignals: LearnLearnerSignals;
  productNames: Record<string, string>;
  modulesCompleted: number;
  modulesTotal: number;
}> {
  const [owned, progressSnaps, activeGoalId, allProducts] = await Promise.all([
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
  let modulesCompleted = 0;
  let modulesTotal = 0;

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
    modulesCompleted += snap.completedLessons;
    modulesTotal += snap.totalLessons;
    if (pct >= 100) coursesCompleted += 1;
    if (!ownedProductSlugs.includes(snap.productSlug)) {
      ownedProductSlugs.push(snap.productSlug);
    }
    productNames[snap.productSlug] = snap.productName;
  }

  for (const slug of ownedProductSlugs) {
    if (progressBySlug[slug] == null) progressBySlug[slug] = 20;
  }

  const last = progressSnaps[0];
  const learnSignals: LearnLearnerSignals = {
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
          href: last.productId
            ? `/my-account/course/${last.productId}`
            : `/produto/${last.productSlug}`,
        }
      : undefined,
    activeGoalId,
    purchasedAtLeastOnce: ownedProductSlugs.length > 0,
  };

  return { learnSignals, productNames, modulesCompleted, modulesTotal };
}

export async function buildSuccessContext(userId: number) {
  const { learnSignals, productNames, modulesCompleted, modulesTotal } =
    await buildLearnSignals(userId);

  const dashboard = learnEngine.buildDashboard({
    signals: learnSignals,
    productNames,
  });

  const competencies = competencyEngine.evaluate(learnSignals);
  const goals = goalEngine.evaluate(competencies, learnSignals);
  const competencyAvg =
    competencies.reduce((s, c) => s + c.progress, 0) /
    Math.max(1, competencies.length);

  const successIndex = computeSuccessIndex({
    knowledge: competencyAvg,
    application: Math.min(100, learnSignals.completedLessonCount * 4),
    consistency: 0,
    result: Math.min(100, learnSignals.coursesCompleted * 35),
  });

  const achievements = achievementEngine.evaluate({
    signals: learnSignals,
    competencies,
    goals,
    successIndex,
  });

  const progresses = Object.values(learnSignals.progressBySlug);
  const avgProgress =
    progresses.length > 0
      ? progresses.reduce((a, b) => a + b, 0) / progresses.length
      : 0;

  const active = goals.find((g) => g.isActive);
  const goalsCompleted = goals.filter((g) => g.progress >= 70).length;
  const competenciesAcquired = competencies.filter(
    (c) => c.status === "acquired"
  ).length;
  const competenciesInProgress = competencies.filter(
    (c) => c.status === "in_progress"
  ).length;
  const competenciesStagnant = competencies.filter(
    (c) => c.status === "in_progress" && c.progress < 55
  ).length;

  // Application proxy: completed lessons + owned products (until checklist LMS exists)
  const applicationTasks =
    learnSignals.completedLessonCount +
    Math.min(learnSignals.ownedProductSlugs.length, 5);

  // Active days proxy from lesson touches (honest: not calendar streak)
  const activeDays = Math.min(
    30,
    Math.max(0, Math.ceil(learnSignals.completedLessonCount / 2))
  );
  const streakDays = learnSignals.streakDays;

  const weeklyDeltaPercent = Math.min(
    25,
    Math.max(-10, Math.round(avgProgress * 0.12) - (activeDays > 0 ? 0 : 5))
  );

  const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
  const monthlyEvolution = monthNames.slice(0, 4).map((label, i) => {
    const factor = (i + 1) / 4;
    return {
      month: `m${i + 1}`,
      label,
      value: Math.min(100, Math.round(avgProgress * factor)),
    };
  });

  const timeline: SuccessTimelineEvent[] = dashboard.timeline.map((e) => ({
    id: e.id,
    at: e.at,
    kind:
      e.kind === "achievement"
        ? "habit"
        : e.kind === "goal"
          ? "goal"
          : e.kind === "competency"
            ? "competency"
            : e.kind === "lesson"
              ? "lesson"
              : "score",
    title: e.title,
    subtitle: e.subtitle,
  }));

  const signals: SuccessRawSignals = {
    userId,
    modulesCompleted,
    modulesTotal: Math.max(modulesTotal, modulesCompleted),
    applicationTasks,
    activeDays,
    streakDays,
    goalsCompleted,
    goalsTotal: goals.length,
    competenciesAcquired,
    competenciesInProgress,
    competenciesStagnant,
    avgProgress,
    weeklyDeltaPercent,
    ownedProductSlugs: learnSignals.ownedProductSlugs,
    activeGoalId: active?.goalId,
    activeGoalName: active?.name,
    activeGoalProgress: active?.progress,
    nextStepTitle: dashboard.nextStep?.title,
    nextStepHref: dashboard.nextStep?.href,
    nextStepReason: dashboard.nextStep?.reason,
    monthlyEvolution,
    timeline,
  };

  return {
    signals,
    goals,
    competencies,
    achievements,
    nextStep: dashboard.nextStep,
    productNames,
  };
}
