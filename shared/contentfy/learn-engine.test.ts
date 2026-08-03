import { describe, expect, it } from "vitest";
import {
  computeSuccessIndex,
  levelFromProgress,
  competencyStatusFromProgress,
} from "@shared/contentfy";
import {
  competencyEngine,
  goalEngine,
  journeyEngine,
  achievementEngine,
  skillGraph,
  learnEngine,
  LEARN_COMPETENCIES,
  LEARN_GOALS,
} from "../../server/core/learn";
import type { LearnLearnerSignals } from "@shared/contentfy";

function signals(
  partial: Partial<LearnLearnerSignals> = {}
): LearnLearnerSignals {
  return {
    userId: 1,
    ownedProductSlugs: ["manual-do-representante-comercial"],
    completedLessonCount: 3,
    totalLessonTouches: 10,
    coursesCompleted: 0,
    streakDays: 0,
    progressBySlug: { "manual-do-representante-comercial": 50 },
    purchasedAtLeastOnce: true,
    activeGoalId: "sell-more",
    ...partial,
  };
}

describe("Success Index", () => {
  it("weights four pillars into overall", () => {
    const r = computeSuccessIndex({
      knowledge: 80,
      application: 60,
      consistency: 40,
      result: 20,
    });
    expect(r.overall).toBeGreaterThan(0);
    expect(r.knowledge).toBe(80);
  });
});

describe("Competency levels", () => {
  it("maps progress thresholds", () => {
    expect(levelFromProgress(0)).toBe("none");
    expect(levelFromProgress(20)).toBe("emerging");
    expect(levelFromProgress(50)).toBe("developing");
    expect(levelFromProgress(75)).toBe("proficient");
    expect(competencyStatusFromProgress(75)).toBe("acquired");
  });
});

describe("Learn engines", () => {
  it("evaluates competencies from owned product progress", () => {
    const states = competencyEngine.evaluate(signals());
    const crm = states.find((c) => c.competencyId === "crm");
    expect(crm).toBeTruthy();
    expect(crm!.progress).toBeGreaterThan(0);
    expect(crm!.status).not.toBe("missing");
  });

  it("evaluates goals and marks active", () => {
    const comps = competencyEngine.evaluate(signals());
    const goals = goalEngine.evaluate(comps, signals());
    expect(goals.some((g) => g.goalId === "sell-more" && g.isActive)).toBe(
      true
    );
  });

  it("builds journey with next step", () => {
    const s = signals();
    const comps = competencyEngine.evaluate(s);
    const goals = goalEngine.evaluate(comps, s);
    const index = computeSuccessIndex({
      knowledge: 50,
      application: 40,
      consistency: 10,
      result: 10,
    });
    const achievements = achievementEngine.evaluate({
      signals: s,
      competencies: comps,
      goals,
      successIndex: index,
    });
    const journey = journeyEngine.build({
      goals,
      competencies: comps,
      achievements,
      signals: s,
      productNames: {
        "manual-do-representante-comercial": "Manual Representante 4.0",
      },
    });
    expect(journey.steps.length).toBeGreaterThan(0);
    expect(journey.goalId).toBe("sell-more");
  });

  it("builds skill graph edges", () => {
    const s = signals();
    const comps = competencyEngine.evaluate(s);
    const goals = goalEngine.evaluate(comps, s);
    const graph = skillGraph.build({ signals: s, competencies: comps, goals });
    expect(graph.edges.length).toBeGreaterThan(0);
    expect(graph.productSlugs).toContain(
      "manual-do-representante-comercial"
    );
  });

  it("builds dashboard payload", () => {
    const dash = learnEngine.buildDashboard({
      signals: signals({
        lastLesson: {
          productId: 1,
          productSlug: "manual-do-representante-comercial",
          productName: "Manual",
          lessonTitle: "CRM na prática",
          href: "/my-account/course/1",
        },
      }),
      productNames: {
        "manual-do-representante-comercial": "Manual Representante 4.0",
        desacelere: "Desacelere",
      },
    });
    expect(dash.personalized).toBe(true);
    expect(dash.successIndex.overall).toBeGreaterThanOrEqual(0);
    expect(dash.nextStep?.kind).toBe("lesson");
    expect(LEARN_COMPETENCIES.length).toBeGreaterThan(5);
    expect(LEARN_GOALS.length).toBe(10);
  });

  it("unlocks first_purchase achievement", () => {
    const s = signals();
    const comps = competencyEngine.evaluate(s);
    const goals = goalEngine.evaluate(comps, s);
    const achievements = achievementEngine.evaluate({
      signals: s,
      competencies: comps,
      goals,
      successIndex: computeSuccessIndex({
        knowledge: 10,
        application: 10,
        consistency: 0,
        result: 0,
      }),
    });
    expect(
      achievements.find((a) => a.id === "first_purchase")?.unlocked
    ).toBe(true);
  });
});
