import type {
  AdaptiveHint,
  LearnDashboardPayload,
  LearnLearnerSignals,
  LearnNode,
  LearnTimelineEvent,
  SuccessIndexBreakdown,
} from "@shared/contentfy";
import { computeSuccessIndex } from "@shared/contentfy";
import { achievementEngine } from "./achievement-engine";
import { learnCacheGet, learnCacheSet } from "./cache";
import { competencyEngine } from "./competency-engine";
import { goalEngine } from "./goal-engine";
import { journeyEngine } from "./journey-engine";
import { skillGraph } from "./skill-graph";
import { LEARN_GOALS, LEARN_PRODUCT_LINKS } from "./catalog";

function buildSuccessIndex(
  signals: LearnLearnerSignals,
  competencyAvg: number
): SuccessIndexBreakdown {
  const progresses = Object.values(signals.progressBySlug);
  const avgProgress =
    progresses.length > 0
      ? progresses.reduce((a, b) => a + b, 0) / progresses.length
      : 0;

  const knowledge = Math.max(competencyAvg, avgProgress);
  const application = Math.min(
    100,
    avgProgress * 0.6 + Math.min(signals.completedLessonCount * 4, 40)
  );
  const consistency = Math.min(
    100,
    signals.streakDays * 12 + Math.min(signals.totalLessonTouches * 2, 30)
  );
  const result = Math.min(
    100,
    signals.coursesCompleted * 35 +
      (competencyAvg >= 70 ? 25 : competencyAvg >= 40 ? 12 : 0)
  );

  return computeSuccessIndex({
    knowledge,
    application,
    consistency,
    result,
  });
}

function buildTimeline(input: {
  signals: LearnLearnerSignals;
  achievements: ReturnType<typeof achievementEngine.evaluate>;
  goals: ReturnType<typeof goalEngine.evaluate>;
}): LearnTimelineEvent[] {
  const events: LearnTimelineEvent[] = [];
  const now = Date.now();

  if (input.signals.purchasedAtLeastOnce) {
    events.push({
      id: "purchase",
      at: new Date(now - 86_400_000 * 14).toISOString(),
      kind: "purchase",
      title: "Ingresso na jornada",
      subtitle: "Acesso aos produtos ContentFy",
    });
  }

  if (input.signals.lastLesson) {
    events.push({
      id: "last-lesson",
      at: new Date().toISOString(),
      kind: "lesson",
      title: input.signals.lastLesson.lessonTitle || "Aula recente",
      subtitle: input.signals.lastLesson.productName,
    });
  }

  for (const a of input.achievements.filter((x) => x.unlocked).slice(-4)) {
    events.push({
      id: `ach-${a.id}`,
      at: a.unlockedAt || new Date().toISOString(),
      kind: "achievement",
      title: a.name,
      subtitle: a.description,
    });
  }

  const active = input.goals.find((g) => g.isActive);
  if (active) {
    events.push({
      id: `goal-${active.goalId}`,
      at: new Date().toISOString(),
      kind: "goal",
      title: `Objetivo: ${active.name}`,
      subtitle: `${active.progress}% de evolução`,
    });
  }

  return events.sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
  );
}

/** ContentFy Learn — central evolution engine over LMS (read-only progress). */
export class LearnEngine {
  buildTrail(root: LearnNode): LearnNode {
    return root;
  }

  recommendNext(
    hint: Omit<AdaptiveHint, "recommendedNext" | "reason">
  ): AdaptiveHint {
    return {
      ...hint,
      recommendedNext: [],
      reason:
        "Use learn.dashboard / learn.nextStep para recomendações baseadas em competências.",
    };
  }

  buildDashboard(input: {
    signals: LearnLearnerSignals;
    productNames?: Record<string, string>;
  }): LearnDashboardPayload {
    const cacheKey = `learn:dashboard:${input.signals.userId}:${input.signals.activeGoalId || "auto"}`;
    const cached = learnCacheGet<LearnDashboardPayload>(cacheKey);
    if (cached) return { ...cached, cacheHit: true };

    const competencies = competencyEngine.evaluate(input.signals);
    const goals = goalEngine.evaluate(competencies, input.signals);
    const competencyAvg =
      competencies.reduce((s, c) => s + c.progress, 0) /
      Math.max(1, competencies.length);
    const successIndex = buildSuccessIndex(input.signals, competencyAvg);
    const achievements = achievementEngine.evaluate({
      signals: input.signals,
      competencies,
      goals,
      successIndex,
    });
    const journey = journeyEngine.build({
      goals,
      competencies,
      achievements,
      signals: input.signals,
      productNames: input.productNames,
    });

    const acquired = competencies.filter((c) => c.status === "acquired");
    const inProgress = competencies.filter((c) => c.status === "in_progress");
    const missing = competencies.filter((c) => c.status === "missing");

    const activeGoal = goals.find((g) => g.isActive) || null;
    const relatedSlugs = activeGoal
      ? goalEngine.productsThatAccelerate(activeGoal.goalId)
      : LEARN_PRODUCT_LINKS.map((l) => l.productSlug);

    const relatedCourses = relatedSlugs.slice(0, 6).map((slug) => ({
      slug,
      name: input.productNames?.[slug] || slug,
      href: `/produto/${slug}`,
      reason: activeGoal
        ? `Alinhado ao objetivo ${activeGoal.name}`
        : "Catálogo Learn",
    }));

    const payload: LearnDashboardPayload = {
      activeGoal,
      goals,
      competencies: { acquired, inProgress, missing },
      journey,
      timeline: buildTimeline({
        signals: input.signals,
        achievements,
        goals,
      }),
      achievements,
      nextStep: journey.nextStep,
      successIndex,
      evolutionPercent: journey.evolutionPercent,
      relatedCourses,
      personalized: true,
      generatedAt: new Date().toISOString(),
      cacheHit: false,
    };

    // Side-effect free graph available via skillGraph endpoint
    void skillGraph.build({
      signals: input.signals,
      competencies,
      goals,
    });

    learnCacheSet(cacheKey, payload, 45_000);
    return payload;
  }

  stagnantCompetencies(signals: LearnLearnerSignals) {
    const states = competencyEngine.evaluate(signals);
    return competencyEngine.stagnant(states, signals);
  }

  listGoals() {
    return goalEngine.list();
  }

  listCompetencies() {
    return competencyEngine.list();
  }

  catalogGoals() {
    return LEARN_GOALS;
  }
}

export const learnEngine = new LearnEngine();
