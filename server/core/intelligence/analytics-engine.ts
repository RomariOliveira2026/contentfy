import type {
  MarketplaceHealth,
  ProductIntelligenceRow,
} from "@shared/contentfy";

export class AnalyticsEngine {
  marketplaceHealth(rows: ProductIntelligenceRow[]): MarketplaceHealth {
    const revenueCents = rows.reduce((s, r) => s + r.revenueCents, 0);
    const ordersCompleted = rows.reduce((s, r) => s + r.sales, 0);
    const totalViews = rows.reduce((s, r) => s + r.views, 0);
    const totalFavorites = rows.reduce((s, r) => s + r.favorites, 0);
    const refunds = rows.reduce((s, r) => s + r.refunds, 0);
    const withLearners = rows.filter((r) => r.avgProgress > 0 || r.sales > 0);
    const conversionProxy =
      totalViews > 0
        ? Math.round((ordersCompleted / totalViews) * 1000) / 10
        : 0;
    const retentionProxy =
      withLearners.length > 0
        ? Math.round(
            withLearners.reduce((s, r) => s + r.retentionProxy, 0) /
              withLearners.length
          )
        : 0;
    const completionProxy =
      withLearners.length > 0
        ? Math.round(
            withLearners.reduce((s, r) => s + r.completionRate, 0) /
              withLearners.length
          )
        : 0;
    const refundRate =
      ordersCompleted > 0
        ? Math.round((refunds / ordersCompleted) * 1000) / 10
        : 0;

    return {
      revenueCents,
      ordersCompleted,
      conversionProxy,
      retentionProxy,
      completionProxy,
      refundRate,
      activeProducts: rows.length,
      totalViews,
      totalFavorites,
    };
  }
}

export const analyticsEngine = new AnalyticsEngine();
