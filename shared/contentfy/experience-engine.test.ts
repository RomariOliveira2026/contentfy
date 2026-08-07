import { describe, expect, it } from "vitest";
import {
  DEFAULT_NBA_PRIORITIES,
  type StudentContext,
  type ContinueLearningView,
} from "@shared/contentfy";
import {
  deriveStudentState,
  nextBestActionEngine,
} from "../../server/core/experience/next-best-action-engine";
import { experienceFallbackService } from "../../server/core/experience/experience-fallback-service";
import { studentContextBuilder } from "../../server/core/experience/student-context-builder";
import { resolveNbaPriorities } from "../../server/core/experience/config";

function baseCtx(partial: Partial<StudentContext> = {}): StudentContext {
  return {
    userId: 1,
    name: "Romário Silva",
    firstName: "Romário",
    ownedProductCount: 0,
    ownedProductSlugs: [],
    productInProgress: null,
    lastLessonTitle: null,
    averageProgress: null,
    activeGoalId: null,
    activeGoalName: null,
    activeGoalProgress: null,
    competenciesAcquired: [],
    competenciesInProgress: [],
    competenciesStagnant: [],
    successScore: null,
    consistencyBand: null,
    habitStreakDays: null,
    achievementsUnlocked: [],
    recommendations: [],
    nextSteps: [],
    protectedPurchases: [],
    notifications: [],
    studentState: "new_user",
    engines: {
      learn: "ok",
      success: "ok",
      discovery: "ok",
      protect: "ok",
      lms: "ok",
    },
    generatedAt: new Date().toISOString(),
    ...partial,
  };
}

const continueItem: ContinueLearningView = {
  productSlug: "manual-do-representante-comercial",
  productName: "Manual do Representante",
  progressPercent: 42,
  href: "/my-account/course/1",
  lastLessonTitle: "Follow-up",
  lastModuleTitle: "Módulo 2",
};

describe("Experience student states", () => {
  const journey = {
    hasPriorActivity: true,
    productInProgress: true,
  };

  it("new / no products", () => {
    expect(
      deriveStudentState({
        ownedProductCount: 0,
        hasProgress: false,
        coursesCompleted: 0,
        activeGoalProgress: null,
        inactiveDays: null,
        hasPriorActivity: false,
        productInProgress: false,
        enginesDegraded: false,
        partialData: false,
      })
    ).toBe("no_products");
  });

  it("purchased without progress", () => {
    expect(
      deriveStudentState({
        ownedProductCount: 2,
        hasProgress: false,
        coursesCompleted: 0,
        activeGoalProgress: null,
        inactiveDays: null,
        hasPriorActivity: false,
        productInProgress: false,
        enginesDegraded: false,
        partialData: false,
      })
    ).toBe("purchased_no_progress");
  });

  it("active learning", () => {
    expect(
      deriveStudentState({
        ownedProductCount: 1,
        hasProgress: true,
        coursesCompleted: 0,
        activeGoalProgress: 40,
        inactiveDays: 1,
        ...journey,
        enginesDegraded: false,
        partialData: false,
      })
    ).toBe("active_learning");
  });

  it("inactive return", () => {
    expect(
      deriveStudentState({
        ownedProductCount: 1,
        hasProgress: true,
        coursesCompleted: 0,
        activeGoalProgress: 40,
        inactiveDays: 10,
        ...journey,
        enginesDegraded: false,
        partialData: false,
      })
    ).toBe("inactive_return");
  });

  it("course completed", () => {
    expect(
      deriveStudentState({
        ownedProductCount: 1,
        hasProgress: false,
        coursesCompleted: 1,
        activeGoalProgress: null,
        inactiveDays: null,
        hasPriorActivity: true,
        productInProgress: false,
        enginesDegraded: false,
        partialData: false,
      })
    ).toBe("course_completed");
  });

  it("goal near completion", () => {
    expect(
      deriveStudentState({
        ownedProductCount: 1,
        hasProgress: true,
        coursesCompleted: 0,
        activeGoalProgress: 75,
        inactiveDays: 0,
        ...journey,
        enginesDegraded: false,
        partialData: false,
      })
    ).toBe("goal_near_completion");
  });

  it("service degraded when many engines fail", () => {
    expect(
      deriveStudentState({
        ownedProductCount: 1,
        hasProgress: true,
        coursesCompleted: 0,
        activeGoalProgress: null,
        inactiveDays: null,
        ...journey,
        enginesDegraded: true,
        partialData: false,
      })
    ).toBe("service_degraded");
  });
});

describe("NextBestActionEngine", () => {
  it("prefers continue lesson when product in progress", () => {
    const action = nextBestActionEngine.decide(
      baseCtx({
        studentState: "active_learning",
        ownedProductCount: 1,
        ownedProductSlugs: [continueItem.productSlug],
        productInProgress: continueItem,
      })
    );
    expect(action?.kind).toBe("continue_lesson");
    expect(action?.title).toContain("Follow-up");
  });

  it("starts first product when purchased without progress", () => {
    const action = nextBestActionEngine.decide(
      baseCtx({
        studentState: "purchased_no_progress",
        ownedProductCount: 1,
        ownedProductSlugs: ["manual-do-representante-comercial"],
      })
    );
    expect(action?.kind).toBe("start_first_product");
  });

  it("suggests explore for no products", () => {
    const action = nextBestActionEngine.decide(
      baseCtx({ studentState: "no_products" })
    );
    expect(
      action?.kind === "explore_catalog" || action?.kind === "complete_onboarding"
    ).toBe(true);
  });

  it("respects priority config", () => {
    const p = resolveNbaPriorities();
    expect(p.continue_lesson).toBe(DEFAULT_NBA_PRIORITIES.continue_lesson);
    expect(p.continue_lesson).toBeLessThan(p.explore_catalog);
  });
});

describe("Experience fallbacks", () => {
  it("greeting does not claim evolution without data", () => {
    const g = experienceFallbackService.greetingForState(
      "purchased_no_progress",
      "Romário",
      9
    );
    expect(g.salutation).toContain("Romário");
    expect(g.headline.toLowerCase()).not.toContain("avançou");
  });

  it("editorial recommendations are real links", () => {
    const recs = experienceFallbackService.editorialRecommendations();
    expect(recs[0]?.href).toBe("/explorar");
  });

  it("journey fallback asks for goal when missing", () => {
    const summary = experienceFallbackService.journeySummary(
      baseCtx({ ownedProductCount: 1 })
    );
    expect(summary.message.toLowerCase()).toContain("objetivo");
  });
});

describe("StudentContextBuilder resilience", () => {
  it("tolerates discovery/success absence without collapsing the journey", () => {
    const ctx = studentContextBuilder.build({
      userId: 7,
      name: "Ana",
      learn: {
        ok: true,
        continueLearning: [continueItem],
        activeGoalId: "sell-more",
        activeGoalName: "Vender mais",
        activeGoalProgress: 40,
        acquired: [],
        inProgress: [],
        stagnant: [],
        achievements: [],
        ownedProductSlugs: [continueItem.productSlug],
        averageProgress: 40,
        coursesCompleted: 0,
        inactiveDays: 0,
      },
      success: {
        ok: false,
        score: null,
        consistencyBand: null,
        habitStreakDays: null,
        recommendations: [],
      },
      discovery: { ok: false, recommendations: [] },
      protect: { ok: true, items: [] },
    });
    expect(ctx.productInProgress?.productSlug).toBe(continueItem.productSlug);
    expect(ctx.firstName).toBe("Ana");
    expect(ctx.studentState).toBe("active_learning");
    expect(ctx.engines.success).toBe("unavailable");
    expect(ctx.engines.discovery).toBe("unavailable");
  });

  it("keeps journey state when only Discovery fails", () => {
    const ctx = studentContextBuilder.build({
      userId: 8,
      name: null,
      learn: {
        ok: true,
        continueLearning: [],
        activeGoalId: null,
        activeGoalName: null,
        activeGoalProgress: null,
        acquired: [],
        inProgress: [],
        stagnant: [],
        achievements: [],
        ownedProductSlugs: ["x"],
        averageProgress: null,
        coursesCompleted: 0,
      },
      discovery: { ok: false, recommendations: [] },
    });
    expect(ctx.engines.discovery).toBe("unavailable");
    expect(ctx.studentState).toBe("purchased_no_progress");
  });

  it("marks partial_data when Learn is unavailable", () => {
    const ctx = studentContextBuilder.build({
      userId: 9,
      name: null,
      learn: {
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
      },
    });
    expect(ctx.studentState).toBe("partial_data");
  });
});
