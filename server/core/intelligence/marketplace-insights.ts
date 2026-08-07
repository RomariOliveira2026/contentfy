import type {
  CategoryIntelligenceRow,
  CreatorIntelligenceRow,
  IntelligenceScoreConfig,
  ProductIntelligenceRow,
} from "@shared/contentfy";
import {
  computeCategoryScore,
  computeCreatorScore,
} from "./score-math";
import { pctDelta } from "./config";
import { conversionEngine } from "./conversion-engine";

export class MarketplaceInsights {
  topProducts(rows: ProductIntelligenceRow[], limit = 10) {
    return [...rows]
      .sort(
        (a, b) =>
          b.productScore.score - a.productScore.score || b.sales - a.sales
      )
      .slice(0, limit);
  }

  byLifecycle(rows: ProductIntelligenceRow[]) {
    return {
      emerging: rows.filter((r) => r.lifecycle === "emerging"),
      stable: rows.filter((r) => r.lifecycle === "stable"),
      declining: rows.filter((r) => r.lifecycle === "declining"),
    };
  }

  highRefund(rows: ProductIntelligenceRow[], threshold: number, limit = 10) {
    return [...rows]
      .filter((r) => r.refundRate >= threshold && r.sales > 0)
      .sort((a, b) => b.refundRate - a.refundRate)
      .slice(0, limit);
  }

  creators(
    rows: ProductIntelligenceRow[],
    config: IntelligenceScoreConfig
  ): CreatorIntelligenceRow[] {
    const map = new Map<string, ProductIntelligenceRow[]>();
    for (const r of rows) {
      const key = (r.author || "").trim() || "__unassigned__";
      const list = map.get(key) || [];
      list.push(r);
      map.set(key, list);
    }
    const maxSales = Math.max(1, ...rows.map((r) => r.sales));
    const out: CreatorIntelligenceRow[] = [];
    for (const [key, list] of Array.from(map.entries())) {
      const views = list.reduce(
        (s: number, r: ProductIntelligenceRow) => s + r.views,
        0
      );
      const sales = list.reduce(
        (s: number, r: ProductIntelligenceRow) => s + r.sales,
        0
      );
      const revenueCents = list.reduce(
        (s: number, r: ProductIntelligenceRow) => s + r.revenueCents,
        0
      );
      const refunds = list.reduce(
        (s: number, r: ProductIntelligenceRow) => s + r.refunds,
        0
      );
      const completionRate =
        list.length > 0
          ? Math.round(
              list.reduce(
                (s: number, r: ProductIntelligenceRow) => s + r.completionRate,
                0
              ) / list.length
            )
          : 0;
      const retentionProxy =
        list.length > 0
          ? Math.round(
              list.reduce(
                (s: number, r: ProductIntelligenceRow) => s + r.retentionProxy,
                0
              ) / list.length
            )
          : 0;
      const refundRate =
        sales > 0 ? Math.round((refunds / sales) * 1000) / 10 : 0;
      const conversionRate = conversionEngine.rate(views, sales);
      const satisfactionProxy = Math.max(0, 100 - refundRate * 4);
      out.push({
        authorKey: key,
        authorLabel: key === "__unassigned__" ? "Sem autor (meta)" : key,
        productCount: list.length,
        views,
        sales,
        conversionRate,
        completionRate,
        retentionProxy,
        refundRate,
        revenueCents,
        creatorScore: computeCreatorScore(
          {
            conversionRate,
            retentionProxy,
            satisfactionProxy,
            sales,
            maxSales,
          },
          config
        ),
      });
    }
    return out.sort(
      (a, b) => b.creatorScore.score - a.creatorScore.score || b.sales - a.sales
    );
  }

  categories(
    rows: ProductIntelligenceRow[],
    config: IntelligenceScoreConfig
  ): CategoryIntelligenceRow[] {
    const map = new Map<string, ProductIntelligenceRow[]>();
    for (const r of rows) {
      const key = r.category || "Sem categoria";
      const list = map.get(key) || [];
      list.push(r);
      map.set(key, list);
    }
    const maxSales = Math.max(1, ...rows.map((r) => r.sales));
    const maxEng = Math.max(
      1,
      ...rows.map((r) => r.views + r.favorites)
    );
    const out: CategoryIntelligenceRow[] = [];
    for (const [category, list] of Array.from(map.entries())) {
      const views = list.reduce(
        (s: number, r: ProductIntelligenceRow) => s + r.views,
        0
      );
      const sales = list.reduce(
        (s: number, r: ProductIntelligenceRow) => s + r.sales,
        0
      );
      const favorites = list.reduce(
        (s: number, r: ProductIntelligenceRow) => s + r.favorites,
        0
      );
      const recentSales = list.reduce(
        (s: number, r: ProductIntelligenceRow) => s + r.recentSales,
        0
      );
      const priorSales = list.reduce(
        (s: number, r: ProductIntelligenceRow) => s + r.priorSales,
        0
      );
      const salesDeltaPercent = pctDelta(recentSales, priorSales);
      let trend: CategoryIntelligenceRow["trend"] = "unknown";
      if (salesDeltaPercent != null) {
        if (salesDeltaPercent >= config.thresholds.categoryHeatGrowthPercent) {
          trend = "heating";
        } else if (
          salesDeltaPercent <= config.thresholds.categoryCoolDropPercent
        ) {
          trend = "cooling";
        } else {
          trend = "stable";
        }
      }
      out.push({
        category,
        productCount: list.length,
        views,
        sales,
        favorites,
        salesDeltaPercent,
        trend,
        categoryScore: computeCategoryScore(
          {
            growthDelta: salesDeltaPercent,
            sales,
            maxSales,
            engagement: views + favorites,
            maxEngagement: maxEng,
          },
          config
        ),
      });
    }
    return out.sort(
      (a, b) =>
        b.categoryScore.score - a.categoryScore.score || b.sales - a.sales
    );
  }
}

export const marketplaceInsights = new MarketplaceInsights();
