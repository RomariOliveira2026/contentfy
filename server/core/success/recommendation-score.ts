import type {
  SuccessRecommendation,
  SuccessRawSignals,
  SuccessScoreSnapshot,
} from "@shared/contentfy";
import { LEARN_PRODUCT_LINKS } from "../learn/catalog";

/**
 * Recommendation scoring — rules only.
 * Higher score = higher chance of success lift.
 */
export class RecommendationScore {
  rank(input: {
    signals: SuccessRawSignals;
    score: SuccessScoreSnapshot;
    productNames?: Record<string, string>;
    stagnantIds: string[];
  }): SuccessRecommendation[] {
    const owned = new Set(input.signals.ownedProductSlugs);
    const recs: SuccessRecommendation[] = [];

    if (input.signals.nextStepTitle) {
      recs.push({
        id: "next-action",
        title: input.signals.nextStepTitle,
        reason: input.signals.nextStepReason || "Próximo passo da jornada Learn",
        href: input.signals.nextStepHref || undefined,
        score: 100,
      });
    }

    for (const link of LEARN_PRODUCT_LINKS) {
      if (owned.has(link.productSlug)) continue;
      let score = 40;
      if (input.signals.activeGoalId && link.goalIds?.includes(input.signals.activeGoalId)) {
        score += 35;
      }
      const overlapsStagnant = link.competencyIds.some((id) =>
        input.stagnantIds.includes(id)
      );
      if (overlapsStagnant) score += 25;
      if (input.score.pillars.knowledge < 50) score += 10;

      recs.push({
        id: `product:${link.productSlug}`,
        title: input.productNames?.[link.productSlug] || link.productSlug,
        reason: overlapsStagnant
          ? "Acelera competências estagnadas"
          : "Alinhado ao seu objetivo de evolução",
        href: `/produto/${link.productSlug}`,
        productSlug: link.productSlug,
        score,
      });
    }

    return recs.sort((a, b) => b.score - a.score).slice(0, 8);
  }
}

export const recommendationScore = new RecommendationScore();
