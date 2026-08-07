import type {
  IntelligenceInsight,
  ProductIntelligenceRow,
} from "@shared/contentfy";

/**
 * Recommendation analytics — co-purchase style insights from sales overlap proxies.
 * Without order-line basket table, we surface category companions honestly.
 */
export class RecommendationAnalytics {
  categoryCompanions(
    rows: ProductIntelligenceRow[],
    limit = 6
  ): IntelligenceInsight[] {
    const byCat = new Map<string, ProductIntelligenceRow[]>();
    for (const r of rows) {
      if (!r.category || r.sales < 1) continue;
      const list = byCat.get(r.category) || [];
      list.push(r);
      byCat.set(r.category, list);
    }
    const insights: IntelligenceInsight[] = [];
    for (const [category, list] of Array.from(byCat.entries())) {
      if (list.length < 2) continue;
      const sorted = [...list].sort((a, b) => b.sales - a.sales);
      const a = sorted[0];
      const b = sorted[1];
      insights.push({
        id: `co:${a.slug}:${b.slug}`,
        kind: "co_purchase",
        title: "Produtos da mesma categoria com demanda conjunta",
        body: `“${a.name}” e “${b.name}” lideram vendas em ${category} (${a.sales} e ${b.sales} pedidos).`,
        entityType: "category",
        entityId: category,
        evidence: {
          category,
          productA: a.slug,
          productB: b.slug,
          salesA: a.sales,
          salesB: b.sales,
        },
      });
      if (insights.length >= limit) break;
    }
    return insights;
  }
}

export const recommendationAnalytics = new RecommendationAnalytics();
