/**
 * @deprecated Prefer server/experience-store.ts (DB-backed).
 * Kept as a thin sync facade for unit tests that don't hit DB.
 * Memory is NOT a production source of truth.
 */

import type {
  ExperienceOnboardingInput,
  ExperienceOnboardingState,
} from "@shared/contentfy";
import { isDevMemoryFallbackAllowed } from "./config";

const onboarding = new Map<number, ExperienceOnboardingState>();
const dismissed = new Map<number, Set<string>>();

function assertDevOnly() {
  if (!isDevMemoryFallbackAllowed()) {
    console.warn(
      "[ContentFy Experience] onboarding-store memory called outside development — ignore as source of truth."
    );
  }
}

export const experienceOnboardingStore = {
  get(userId: number): ExperienceOnboardingState | null {
    assertDevOnly();
    return onboarding.get(userId) || null;
  },

  save(
    userId: number,
    input: ExperienceOnboardingInput
  ): ExperienceOnboardingState {
    assertDevOnly();
    const now = new Date().toISOString();
    const prev = onboarding.get(userId);
    const state: ExperienceOnboardingState = {
      completed: true,
      primaryGoalId: input.primaryGoalId ?? null,
      improveFirst: input.improveFirst ?? null,
      weeklyHours: input.weeklyHours ?? null,
      preferences: input.preferences
        ? (input.preferences as ExperienceOnboardingState["preferences"])
        : null,
      completedAt: prev?.completedAt || now,
      updatedAt: now,
      persisted: "memory",
    };
    onboarding.set(userId, state);
    return state;
  },

  dismissRecommendation(userId: number, recommendationId: string) {
    assertDevOnly();
    const set = dismissed.get(userId) || new Set<string>();
    set.add(recommendationId);
    dismissed.set(userId, set);
  },

  isDismissed(userId: number, recommendationId: string) {
    return dismissed.get(userId)?.has(recommendationId) ?? false;
  },
};
