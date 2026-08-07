import type { ProductIntelligenceRow } from "@shared/contentfy";

export class RetentionEngine {
  topRetained(rows: ProductIntelligenceRow[], limit = 10) {
    return [...rows]
      .filter((r) => r.sales > 0 || r.avgProgress > 0)
      .sort((a, b) => b.retentionProxy - a.retentionProxy)
      .slice(0, limit);
  }

  highAbandonment(
    rows: ProductIntelligenceRow[],
    threshold: number,
    limit = 10
  ) {
    return [...rows]
      .filter((r) => r.abandonmentRate >= threshold && (r.sales > 0 || r.views > 0))
      .sort((a, b) => b.abandonmentRate - a.abandonmentRate)
      .slice(0, limit);
  }
}

export const retentionEngine = new RetentionEngine();
