/** ContentFy Insight — proprietary analytics (independent of GA4). */

export type InsightAudience = "student" | "creator" | "admin";

export type InsightMetricKey =
  | "conversion"
  | "engagement"
  | "retention"
  | "completion"
  | "revenue"
  | "ltv";

export interface InsightMetric {
  key: InsightMetricKey;
  label: string;
  value: number;
  unit?: "count" | "percent" | "currency" | "days";
  delta?: number;
}

export interface InsightDashboard {
  audience: InsightAudience;
  generatedAt: string;
  metrics: InsightMetric[];
}
