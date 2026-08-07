import type { ActionHandler } from "./action-pipeline";
import type { OrchestratorActionKind } from "@shared/contentfy";

/**
 * Coordination handlers only — invalidate caches / log.
 * Motors never call each other; orchestrator calls these adapters.
 */
export function createDefaultHandlers(): Map<OrchestratorActionKind, ActionHandler> {
  const map = new Map<OrchestratorActionKind, ActionHandler>();

  map.set("noop", async () => undefined);

  map.set("log_metric", async ({ event, step }) => {
    // Observability breadcrumb without sensitive payload dump
    if (process.env.NODE_ENV !== "production") {
      console.info(
        `[ContentFy Orchestrator] ${event.name} → ${step.kind} (${step.motor})`
      );
    }
  });

  map.set("experience_invalidate", async ({ event }) => {
    const userId = event.payload.userId;
    if (!userId) return;
    const { invalidateExperienceForUser } = await import("../experience/cache");
    invalidateExperienceForUser(userId);
  });

  map.set("learn_invalidate", async ({ event }) => {
    const userId = event.payload.userId;
    const { learnCacheInvalidate } = await import("../learn/cache");
    if (userId) learnCacheInvalidate(`learn:dashboard:${userId}`);
    else learnCacheInvalidate();
  });

  map.set("success_invalidate", async ({ event }) => {
    const userId = event.payload.userId;
    const { successCacheInvalidate } = await import("../success/cache");
    if (userId) successCacheInvalidate(`success:dashboard:${userId}`);
    else successCacheInvalidate();
  });

  map.set("intelligence_invalidate", async () => {
    const { intelligenceCacheInvalidate } = await import("../intelligence/cache");
    intelligenceCacheInvalidate();
  });

  map.set("discovery_invalidate", async () => {
    const { discoveryCacheInvalidate } = await import("../discovery/cache");
    discoveryCacheInvalidate();
  });

  return map;
}
