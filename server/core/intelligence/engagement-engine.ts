import type { ProductIntelligenceRow } from "@shared/contentfy";

export class EngagementEngine {
  topEngaged(rows: ProductIntelligenceRow[], limit = 10) {
    return [...rows]
      .sort(
        (a, b) =>
          b.engagementScore.score - a.engagementScore.score ||
          b.favorites - a.favorites
      )
      .slice(0, limit);
  }
}

export const engagementEngine = new EngagementEngine();
