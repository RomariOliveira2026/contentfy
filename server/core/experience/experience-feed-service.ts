/**
 * Experience feed — thin adapter over Discovery recommendations.
 * Does not reimplement ranking.
 */

import type { RecommendationViewItem } from "@shared/contentfy";
import { experienceFallbackService } from "./experience-fallback-service";

export class ExperienceFeedService {
  fromDiscovery(
    items: Array<{
      id?: string;
      title: string;
      reason: string;
      href?: string;
      productSlug?: string;
      score?: number;
    }>
  ): RecommendationViewItem[] {
    if (!items.length) return experienceFallbackService.editorialRecommendations();
    return items.slice(0, 6).map((r, i) => ({
      id: r.id || `rec:${r.productSlug || i}`,
      title: r.title,
      reason: r.reason,
      href: r.href,
      productSlug: r.productSlug,
    }));
  }
}

export const experienceFeedService = new ExperienceFeedService();
