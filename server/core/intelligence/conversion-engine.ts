import type { ProductIntelligenceRow } from "@shared/contentfy";

/** Conversion & funnel proxies from aggregated views → sales. */
export class ConversionEngine {
  rate(views: number, sales: number): number {
    if (views <= 0) return 0;
    return Math.round((sales / views) * 1000) / 10;
  }

  topByConversion(rows: ProductIntelligenceRow[], limit = 10) {
    return [...rows]
      .filter((r) => r.views >= 5)
      .map((r) => ({
        ...r,
        conversionRate: this.rate(r.views, r.sales),
      }))
      .sort((a, b) => b.conversionRate - a.conversionRate)
      .slice(0, limit);
  }
}

export const conversionEngine = new ConversionEngine();
