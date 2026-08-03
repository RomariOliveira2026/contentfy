import type { DiscoveryProfile, DiscoveryResult } from "@shared/contentfy";

/** ContentFy Discovery — beyond category browsing. */
export class DiscoveryEngine {
  recommend(profile: DiscoveryProfile): DiscoveryResult {
    if (profile.completedProductIds.length > 0) {
      return {
        productIds: [],
        strategy: "related",
        reason: "Related products seam ready — ranking not wired.",
      };
    }
    if (profile.goals.length > 0) {
      return {
        productIds: [],
        strategy: "goals",
        reason: "Goal-based discovery seam ready.",
      };
    }
    return {
      productIds: [],
      strategy: "fallback",
      reason: "Fallback catalog discovery.",
    };
  }
}

export const discoveryEngine = new DiscoveryEngine();
