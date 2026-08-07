import type {
  IntelligenceInsight,
  ProductIntelligenceRow,
} from "@shared/contentfy";
import { recommendationAnalytics } from "./recommendation-analytics";

/**
 * Automatic insights from real aggregates only — never invent metrics.
 */
export function buildInsights(
  rows: ProductIntelligenceRow[]
): IntelligenceInsight[] {
  const insights: IntelligenceInsight[] = [];

  for (const p of rows) {
    if (p.salesDeltaPercent != null && p.salesDeltaPercent !== 0 && p.priorSales > 0) {
      const dir = p.salesDeltaPercent > 0 ? "aumento" : "queda";
      insights.push({
        id: `ret:${p.slug}`,
        kind: "retention_change",
        title:
          p.salesDeltaPercent > 0
            ? "Demanda em alta"
            : "Demanda em ajuste",
        body: `“${p.name}” teve ${dir} de ${Math.abs(p.salesDeltaPercent)}% nas vendas vs janela anterior.`,
        entityType: "product",
        entityId: p.slug,
        evidence: {
          salesDeltaPercent: p.salesDeltaPercent,
          recentSales: p.recentSales,
          priorSales: p.priorSales,
        },
      });
    }

    if (p.abandonmentRate >= 40 && p.sales > 0) {
      insights.push({
        id: `abd:${p.slug}`,
        kind: "abandonment_hotspot",
        title: "Ponto de atenção no progresso",
        body: `“${p.name}” concentra abandono estimado de ${p.abandonmentRate}% (progresso médio ${p.avgProgress}%).`,
        entityType: "product",
        entityId: p.slug,
        evidence: {
          abandonmentRate: p.abandonmentRate,
          avgProgress: p.avgProgress,
        },
      });
    }
  }

  insights.push(...recommendationAnalytics.categoryCompanions(rows));

  // Honest limitation: weekday / night study patterns require event timestamps density —
  // only emit when we have enough view volume as proxy note is NOT invented clock data.
  // Skip study_time_pattern / conversion_weekday until we have hour-of-day aggregates.

  return insights.slice(0, 30);
}

export function buildCreatorSuggestions(
  rows: ProductIntelligenceRow[]
): IntelligenceInsight[] {
  const suggestions: IntelligenceInsight[] = [];
  for (const p of rows) {
    if (p.views >= 10 && p.sales === 0) {
      suggestions.push({
        id: `sug:conv:${p.slug}`,
        kind: "generic_metric",
        title: "Oportunidade de conversão",
        body: `“${p.name}” tem ${p.views} visualizações e ainda sem vendas registradas neste recorte.`,
        entityType: "product",
        entityId: p.slug,
        evidence: { views: p.views, sales: p.sales },
      });
    }
    if (p.refundRate >= 8 && p.sales > 0) {
      suggestions.push({
        id: `sug:trust:${p.slug}`,
        kind: "generic_metric",
        title: "Revisar expectativa do produto",
        body: `Taxa de reembolso de ${p.refundRate}% em “${p.name}” — revise descrição e onboarding.`,
        entityType: "product",
        entityId: p.slug,
        evidence: { refundRate: p.refundRate, sales: p.sales },
      });
    }
    if (p.abandonmentRate >= 50 && p.sales > 0) {
      suggestions.push({
        id: `sug:retain:${p.slug}`,
        kind: "abandonment_hotspot",
        title: "Reforçar início da jornada",
        body: `Abandono estimado de ${p.abandonmentRate}% em “${p.name}” — priorize as primeiras aulas.`,
        entityType: "product",
        entityId: p.slug,
        evidence: { abandonmentRate: p.abandonmentRate },
      });
    }
  }
  return suggestions.slice(0, 12);
}
