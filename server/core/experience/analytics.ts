import type { ExperienceAnalyticsEvent } from "@shared/contentfy";
import * as experienceStore from "../../experience-store";

/**
 * Experience telemetry — persists via experience-store (DB) with memory fallback in non-production.
 */
export const experienceAnalytics = {
  track(
    userId: number,
    event: ExperienceAnalyticsEvent,
    meta?: Record<string, unknown>
  ) {
    void experienceStore.trackTelemetry(userId, event, meta);
  },

  async trackAsync(
    userId: number,
    event: ExperienceAnalyticsEvent,
    meta?: Record<string, unknown>
  ) {
    return experienceStore.trackTelemetry(userId, event, meta);
  },

  recent(userId?: number, limit = 50) {
    if (userId == null) return Promise.resolve([]);
    return experienceStore.recentTelemetry(userId, limit);
  },
};
