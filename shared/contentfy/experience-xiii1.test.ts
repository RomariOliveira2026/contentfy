import { describe, expect, it, beforeEach } from "vitest";
import { DEFAULT_INACTIVE_RETURN_DAYS } from "@shared/contentfy";
import { deriveStudentState as deriveState } from "../../server/core/experience/next-best-action-engine";
import { resolveInactiveReturnDays } from "../../server/core/experience/config";
import { buildSummaryFromDays } from "../../server/experience-store";
import { buildAchievementsPayload } from "../../server/core/experience/achievements-page";
import {
  experienceCacheSet,
  experienceCacheGet,
  invalidateExperienceForUser,
} from "../../server/core/experience/cache";
import { experienceOnboardingStore } from "../../server/core/experience/onboarding-store";
import { sanitizeExperienceMeta } from "../../server/core/experience/sanitize";

describe("Experience XIII.1 activity summary", () => {
  it("computes inactivity and streak", () => {
    const today = "2026-08-03";
    const summary = buildSummaryFromDays(
      ["2026-08-03", "2026-08-02", "2026-07-20"],
      "2026-08-03T12:00:00.000Z",
      today
    );
    expect(summary.hasPriorActivity).toBe(true);
    expect(summary.inactiveDays).toBe(0);
    expect(summary.streakDays).toBeGreaterThanOrEqual(2);
    expect(summary.recentActiveDays).toBe(3);
  });

  it("marks return after gap", () => {
    const summary = buildSummaryFromDays(
      ["2026-07-20"],
      "2026-07-20T10:00:00.000Z",
      "2026-08-03"
    );
    expect(summary.inactiveDays).toBe(14);
    expect(summary.isReturning).toBe(true);
    expect(summary.streakDays).toBe(0);
  });
});

describe("inactive_return thresholds", () => {
  const base = {
    ownedProductCount: 1,
    hasProgress: true,
    coursesCompleted: 0,
    activeGoalProgress: 40 as number | null,
    hasPriorActivity: true,
    productInProgress: true,
    enginesDegraded: false,
    partialData: false,
  };

  it.each([
    [3, 3, "inactive_return"],
    [7, 7, "inactive_return"],
    [14, 14, "inactive_return"],
    [30, 30, "inactive_return"],
    [7, 6, "active_learning"],
  ] as const)(
    "threshold %i with %i inactive days → %s",
    (threshold, inactiveDays, expected) => {
      expect(
        deriveState({
          ...base,
          inactiveDays,
          inactiveReturnDays: threshold,
        })
      ).toBe(expected);
    }
  );

  it("never classifies new learner without prior activity as inactive", () => {
    expect(
      deriveState({
        ...base,
        hasPriorActivity: false,
        inactiveDays: 30,
        inactiveReturnDays: 7,
      })
    ).toBe("active_learning");
  });

  it("default threshold is 7", () => {
    expect(resolveInactiveReturnDays()).toBe(DEFAULT_INACTIVE_RETURN_DAYS);
  });
});

describe("onboarding memory facade (dev)", () => {
  beforeEach(() => {
    // fresh map via overwrite keys
  });

  it("saves and updates onboarding", () => {
    const a = experienceOnboardingStore.save(101, {
      primaryGoalId: "sell-more",
      improveFirst: "Follow-up",
      weeklyHours: 4,
    });
    expect(a.completed).toBe(true);
    expect(a.primaryGoalId).toBe("sell-more");
    expect(a.completedAt).toBeTruthy();
    expect(a.persisted).toBe("memory");

    const b = experienceOnboardingStore.save(101, {
      primaryGoalId: "sell-more",
      weeklyHours: 6,
    });
    expect(b.weeklyHours).toBe(6);
    expect(b.completedAt).toBe(a.completedAt);
  });

  it("returns null without onboarding", () => {
    expect(experienceOnboardingStore.get(999001)).toBeNull();
  });
});

describe("achievements page payload", () => {
  it("builds empty invite without inventing unlocks", () => {
    const payload = buildAchievementsPayload([]);
    expect(payload.unlocked).toHaveLength(0);
    expect(payload.emptyInvite).toBeTruthy();
    expect(payload.nextTarget).toBeTruthy();
  });

  it("lists unlocked without fabricated dates by default", () => {
    const payload = buildAchievementsPayload([
      {
        id: "first_lesson",
        name: "Primeira aula",
        description: "x",
        tier: "bronze",
        unlocked: true,
        unlockedAt: new Date().toISOString(),
      },
    ]);
    expect(payload.unlocked[0]?.unlocked).toBe(true);
    expect(payload.unlocked[0]?.unlockedAt).toBeNull();
    expect(payload.unlocked[0]?.origin).toBeTruthy();
  });
});

describe("cache invalidation", () => {
  it("clears experience home cache for user", () => {
    experienceCacheSet("experience:home:42", { ok: true }, 60_000);
    expect(experienceCacheGet("experience:home:42")).toEqual({ ok: true });
    invalidateExperienceForUser(42);
    expect(experienceCacheGet("experience:home:42")).toBeNull();
  });
});

describe("sanitize meta", () => {
  it("strips secrets and truncates", () => {
    const clean = sanitizeExperienceMeta({
      token: "abc",
      goalId: "sell-more",
      note: "x".repeat(500),
    });
    expect(clean.token).toBeUndefined();
    expect(clean.goalId).toBe("sell-more");
    expect(String(clean.note).length).toBeLessThanOrEqual(200);
  });
});

describe("states without products / course completed", () => {
  it("no products", () => {
    expect(
      deriveState({
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

  it("course completed", () => {
    expect(
      deriveState({
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
});
