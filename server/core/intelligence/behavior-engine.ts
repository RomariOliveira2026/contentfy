import type {
  IntelligenceScoreConfig,
  ProductIntelligenceRow,
  IntelligenceRawProductSignal,
} from "@shared/contentfy";
import { computeProductScores } from "./score-math";

export class BehaviorEngine {
  toProductRows(
    signals: IntelligenceRawProductSignal[],
    config: IntelligenceScoreConfig
  ): ProductIntelligenceRow[] {
    return signals.map((s) => {
      const scores = computeProductScores(s, signals, config);
      const refundRate =
        s.sales > 0 ? Math.round((s.refunds / s.sales) * 1000) / 10 : 0;
      return {
        productId: s.productId,
        slug: s.slug,
        name: s.name,
        category: s.category,
        author: s.author,
        views: s.views,
        sales: s.sales,
        favorites: s.favorites,
        refunds: s.refunds,
        refundRate,
        completionRate: s.completionRate,
        abandonmentRate: s.abandonmentRate,
        retentionProxy: s.retentionProxy,
        avgProgress: s.avgProgress,
        revenueCents: s.revenueCents,
        recentSales: s.recentSales,
        priorSales: s.priorSales,
        salesDeltaPercent: scores.salesDeltaPercent,
        recentViews: s.recentViews,
        priorViews: s.priorViews,
        viewsDeltaPercent: scores.viewsDeltaPercent,
        productScore: scores.productScore,
        engagementScore: scores.engagementScore,
        trustScore: scores.trustScore,
        growthScore: scores.growthScore,
        momentumScore: scores.momentumScore,
        lifecycle: scores.lifecycle,
      };
    });
  }
}

export const behaviorEngine = new BehaviorEngine();
