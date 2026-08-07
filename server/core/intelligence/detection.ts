import type {
  IntelligenceAlert,
  IntelligenceScoreConfig,
  ProductIntelligenceRow,
  CategoryIntelligenceRow,
} from "@shared/contentfy";

export function detectAlerts(
  products: ProductIntelligenceRow[],
  categories: CategoryIntelligenceRow[],
  config: IntelligenceScoreConfig
): IntelligenceAlert[] {
  const alerts: IntelligenceAlert[] = [];
  const t = config.thresholds;

  for (const p of products) {
    if (
      p.salesDeltaPercent != null &&
      p.salesDeltaPercent <= -t.salesDropPercent &&
      p.priorSales > 0
    ) {
      alerts.push({
        id: `sales_drop:${p.slug}`,
        kind: "sales_drop",
        severity: p.salesDeltaPercent <= -40 ? "critical" : "watch",
        title: "Queda de vendas",
        body: `“${p.name}” caiu ${Math.abs(p.salesDeltaPercent)}% nas vendas vs janela anterior.`,
        entityType: "product",
        entityId: p.slug,
        metric: p.salesDeltaPercent,
        unit: "%",
      });
    }

    if (
      p.viewsDeltaPercent != null &&
      p.retentionProxy > 0 &&
      p.salesDeltaPercent != null &&
      p.salesDeltaPercent <= -t.retentionDropPercent &&
      p.priorSales > 0
    ) {
      // retention proxy via sales+progress decline when recent progress weak
      if (p.retentionProxy < 40) {
        alerts.push({
          id: `retention_drop:${p.slug}`,
          kind: "retention_drop",
          severity: "watch",
          title: "Retenção sob pressão",
          body: `“${p.name}” apresenta retenção proxy de ${p.retentionProxy}% com demanda em queda.`,
          entityType: "product",
          entityId: p.slug,
          metric: p.retentionProxy,
          unit: "%",
        });
      }
    }

    if (p.abandonmentRate >= t.highAbandonmentPercent && p.sales > 0) {
      alerts.push({
        id: `abandon:${p.slug}`,
        kind: "high_abandonment",
        severity: p.abandonmentRate >= 60 ? "critical" : "watch",
        title: "Alto abandono",
        body: `“${p.name}” tem abandono estimado de ${p.abandonmentRate}%.`,
        entityType: "product",
        entityId: p.slug,
        metric: p.abandonmentRate,
        unit: "%",
      });
    }

    if (p.refundRate >= t.highRefundPercent && p.sales > 0) {
      alerts.push({
        id: `refund:${p.slug}`,
        kind: "high_refund",
        severity: p.refundRate >= 15 ? "critical" : "watch",
        title: "Alta de reembolso",
        body: `“${p.name}” registra ${p.refundRate}% de reembolsos sobre vendas.`,
        entityType: "product",
        entityId: p.slug,
        metric: p.refundRate,
        unit: "%",
      });
    }

    if (
      p.salesDeltaPercent != null &&
      p.salesDeltaPercent >= t.emergingGrowthPercent &&
      p.recentSales > 0
    ) {
      alerts.push({
        id: `growth:${p.slug}`,
        kind: "accelerated_growth",
        severity: "info",
        title: "Crescimento acelerado",
        body: `“${p.name}” cresceu ${p.salesDeltaPercent}% em vendas na janela recente.`,
        entityType: "product",
        entityId: p.slug,
        metric: p.salesDeltaPercent,
        unit: "%",
      });
    }

    if (
      p.recentViews >= t.viralViewsMin &&
      p.recentSales >= t.viralSalesMin
    ) {
      alerts.push({
        id: `viral:${p.slug}`,
        kind: "viral_product",
        severity: "info",
        title: "Produto com tração viral",
        body: `“${p.name}” somou ${p.recentViews} views e ${p.recentSales} vendas na janela recente.`,
        entityType: "product",
        entityId: p.slug,
        metric: p.recentViews,
        unit: "views",
      });
    }
  }

  for (const c of categories) {
    if (c.trend === "heating" && c.salesDeltaPercent != null) {
      alerts.push({
        id: `cat_heat:${c.category}`,
        kind: "category_heating",
        severity: "info",
        title: "Categoria aquecendo",
        body: `“${c.category}” acelerou ${c.salesDeltaPercent}% em vendas.`,
        entityType: "category",
        entityId: c.category,
        metric: c.salesDeltaPercent,
        unit: "%",
      });
    }
    if (c.trend === "cooling" && c.salesDeltaPercent != null) {
      alerts.push({
        id: `cat_cool:${c.category}`,
        kind: "category_cooling",
        severity: "watch",
        title: "Categoria esfriando",
        body: `“${c.category}” recuou ${Math.abs(c.salesDeltaPercent)}% em vendas.`,
        entityType: "category",
        entityId: c.category,
        metric: c.salesDeltaPercent,
        unit: "%",
      });
    }
  }

  return alerts.slice(0, 40);
}
