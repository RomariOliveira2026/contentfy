import type { InsightAudience, InsightDashboard } from "@shared/contentfy";

/** ContentFy Insight — proprietary analytics engine (no GA4 dependency). */
export class InsightEngine {
  emptyDashboard(audience: InsightAudience): InsightDashboard {
    return {
      audience,
      generatedAt: new Date().toISOString(),
      metrics: [
        { key: "conversion", label: "Conversão", value: 0, unit: "percent" },
        { key: "engagement", label: "Engajamento", value: 0, unit: "percent" },
        { key: "retention", label: "Retenção", value: 0, unit: "percent" },
        { key: "completion", label: "Conclusão", value: 0, unit: "percent" },
        { key: "revenue", label: "Receita", value: 0, unit: "currency" },
        { key: "ltv", label: "Lifetime Value", value: 0, unit: "currency" },
      ],
    };
  }
}

export const insightEngine = new InsightEngine();
