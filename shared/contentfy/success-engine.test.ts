import { describe, expect, it } from "vitest";
import {
  DEFAULT_SUCCESS_SCORE_CONFIG,
  normalizeWeights,
  gradeFromScore,
  type SuccessRawSignals,
} from "@shared/contentfy";
import {
  ScoreEngine,
  HabitEngine,
  ConsistencyEngine,
  EvolutionEngine,
  RecommendationScore,
  SuccessEngine,
} from "../../server/core/success";

function raw(partial: Partial<SuccessRawSignals> = {}): SuccessRawSignals {
  return {
    userId: 1,
    modulesCompleted: 8,
    modulesTotal: 20,
    applicationTasks: 6,
    activeDays: 10,
    streakDays: 7,
    goalsCompleted: 1,
    goalsTotal: 10,
    competenciesAcquired: 3,
    competenciesInProgress: 2,
    competenciesStagnant: 1,
    avgProgress: 45,
    weeklyDeltaPercent: 8,
    ownedProductSlugs: ["manual-do-representante-comercial"],
    activeGoalId: "sell-more",
    activeGoalName: "Vender mais",
    activeGoalProgress: 40,
    nextStepTitle: "Continuar aula",
    nextStepHref: "/my-account/course/1",
    nextStepReason: "Constância",
    monthlyEvolution: [
      { month: "m1", label: "Jan", value: 20 },
      { month: "m2", label: "Fev", value: 40 },
      { month: "m3", label: "Mar", value: 55 },
      { month: "m4", label: "Abr", value: 70 },
    ],
    timeline: [],
    ...partial,
  };
}

describe("Success config", () => {
  it("normalizes weights", () => {
    const w = normalizeWeights({
      knowledge: 3,
      application: 2,
      consistency: 2,
      result: 3,
    });
    const sum =
      w.knowledge + w.application + w.consistency + w.result;
    expect(sum).toBeCloseTo(1, 5);
  });

  it("has default habit milestones", () => {
    expect(DEFAULT_SUCCESS_SCORE_CONFIG.habitMilestones).toEqual([
      7, 21, 30, 60, 90,
    ]);
  });
});

describe("ScoreEngine", () => {
  it("computes pillars and overall with configurable weights", () => {
    const engine = new ScoreEngine();
    const snap = engine.compute(raw());
    expect(snap.score).toBeGreaterThan(0);
    expect(snap.pillars.knowledge).toBeGreaterThan(0);
    expect(snap.grade).toBe(gradeFromScore(snap.score));
  });

  it("accepts weight overrides", () => {
    const a = new ScoreEngine({
      ...DEFAULT_SUCCESS_SCORE_CONFIG,
      weights: {
        knowledge: 1,
        application: 0,
        consistency: 0,
        result: 0,
      },
    }).compute(raw());
    const b = new ScoreEngine({
      ...DEFAULT_SUCCESS_SCORE_CONFIG,
      weights: {
        knowledge: 0,
        application: 0,
        consistency: 0,
        result: 1,
      },
    }).compute(raw());
    expect(a.score).not.toBe(b.score);
  });
});

describe("Habit + Consistency + Evolution", () => {
  it("marks 7-day habit reached", () => {
    const habits = new HabitEngine().evaluate(7);
    expect(habits.milestones.find((m) => m.days === 7)?.reached).toBe(true);
    expect(habits.milestones.find((m) => m.days === 21)?.reached).toBe(false);
  });

  it("bands consistency", () => {
    const c = new ConsistencyEngine().evaluate(raw({ activeDays: 20, streakDays: 30 }));
    expect(["excellent", "good", "fair", "declining"]).toContain(c.band);
  });

  it("builds monthly evolution series", () => {
    const series = new EvolutionEngine().monthly(raw());
    expect(series.length).toBe(4);
    expect(series[3].value).toBeGreaterThanOrEqual(series[0].value);
  });
});

describe("RecommendationScore + SuccessEngine", () => {
  it("ranks next action first when present", () => {
    const score = new ScoreEngine().compute(raw());
    const recs = new RecommendationScore().rank({
      signals: raw(),
      score,
      stagnantIds: ["crm"],
    });
    expect(recs[0]?.id).toBe("next-action");
  });

  it("builds dashboard payload", () => {
    const dash = new SuccessEngine().buildDashboard({
      signals: raw(),
      goals: [
        {
          goalId: "sell-more",
          name: "Vender mais",
          description: "",
          progress: 40,
          isActive: true,
          competencyIds: ["crm"],
          missingCompetencyIds: ["crm"],
        },
      ],
      competencies: [
        {
          competencyId: "crm",
          name: "CRM",
          category: "Vendas",
          level: "developing",
          progress: 40,
          status: "in_progress",
          sourceProductSlugs: ["manual-do-representante-comercial"],
        },
      ],
      achievements: [],
      nextStep: {
        kind: "lesson",
        title: "Continuar",
        reason: "Constância",
        href: "/my-account/course/1",
      },
      productNames: {
        "manual-do-representante-comercial": "Manual",
        desacelere: "Desacelere",
      },
    });
    expect(dash.score.score).toBeGreaterThan(0);
    expect(dash.insights.length).toBeGreaterThan(0);
    expect(dash.monthlyEvolution.length).toBeGreaterThan(0);
    expect(dash.cacheHit).toBe(false);
  });
});
