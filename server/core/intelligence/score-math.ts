import type {
  IntelligenceRawProductSignal,
  IntelligenceScoreConfig,
  IntelligenceScoreBreakdown,
} from "@shared/contentfy";
import {
  normalizeAgainst,
  pctDelta,
  scoreLabel,
  weightedScore,
} from "./config";

function maxOf(rows: IntelligenceRawProductSignal[], key: keyof IntelligenceRawProductSignal): number {
  let m = 1;
  for (const r of rows) {
    const v = Number(r[key]);
    if (Number.isFinite(v) && v > m) m = v;
  }
  return m;
}

export function computeProductScores(
  signal: IntelligenceRawProductSignal,
  peers: IntelligenceRawProductSignal[],
  config: IntelligenceScoreConfig
): {
  productScore: IntelligenceScoreBreakdown;
  engagementScore: IntelligenceScoreBreakdown;
  trustScore: IntelligenceScoreBreakdown;
  growthScore: IntelligenceScoreBreakdown;
  momentumScore: IntelligenceScoreBreakdown;
  salesDeltaPercent: number | null;
  viewsDeltaPercent: number | null;
  lifecycle: "emerging" | "stable" | "declining" | "unknown";
} {
  const maxViews = maxOf(peers, "views");
  const maxSales = maxOf(peers, "sales");
  const maxFav = maxOf(peers, "favorites");

  const salesDeltaPercent = pctDelta(signal.recentSales, signal.priorSales);
  const viewsDeltaPercent = pctDelta(signal.recentViews, signal.priorViews);

  const product = weightedScore(
    {
      views: normalizeAgainst(signal.views, maxViews),
      sales: normalizeAgainst(signal.sales, maxSales),
      favorites: normalizeAgainst(signal.favorites, maxFav),
      completion: signal.completionRate,
      retention: signal.retentionProxy,
      refundPenalty: 100 - Math.min(100, signal.refunds > 0
        ? (signal.refunds / Math.max(signal.sales, 1)) * 100 * 2
        : 0),
      abandonmentPenalty: 100 - signal.abandonmentRate,
    },
    config.weights.product
  );

  const engagement = weightedScore(
    {
      sessionsProxy: normalizeAgainst(signal.views, maxViews),
      favorites: normalizeAgainst(signal.favorites, maxFav),
      progress: signal.avgProgress,
    },
    config.weights.engagement
  );

  const refundRate =
    signal.sales > 0 ? (signal.refunds / signal.sales) * 100 : 0;
  const trust = weightedScore(
    {
      completion: signal.completionRate,
      lowRefund: clampRefund(refundRate),
      retention: signal.retentionProxy,
    },
    config.weights.trust
  );

  const growth = weightedScore(
    {
      salesDelta: deltaToScore(salesDeltaPercent),
      viewsDelta: deltaToScore(viewsDeltaPercent),
    },
    config.weights.growth
  );

  const momentum = weightedScore(
    {
      recentSales: normalizeAgainst(signal.recentSales, Math.max(1, maxOf(peers, "recentSales"))),
      recentViews: normalizeAgainst(signal.recentViews, Math.max(1, maxOf(peers, "recentViews"))),
      acceleration: deltaToScore(
        salesDeltaPercent != null && viewsDeltaPercent != null
          ? (salesDeltaPercent + viewsDeltaPercent) / 2
          : salesDeltaPercent ?? viewsDeltaPercent
      ),
    },
    config.weights.momentum
  );

  let lifecycle: "emerging" | "stable" | "declining" | "unknown" = "unknown";
  if (salesDeltaPercent != null) {
    if (salesDeltaPercent >= config.thresholds.emergingGrowthPercent) {
      lifecycle = "emerging";
    } else if (salesDeltaPercent <= config.thresholds.decliningGrowthPercent) {
      lifecycle = "declining";
    } else {
      lifecycle = "stable";
    }
  }

  return {
    productScore: {
      score: product.score,
      label: scoreLabel(product.score),
      components: product.components,
    },
    engagementScore: {
      score: engagement.score,
      label: scoreLabel(engagement.score),
      components: engagement.components,
    },
    trustScore: {
      score: trust.score,
      label: scoreLabel(trust.score),
      components: trust.components,
    },
    growthScore: {
      score: growth.score,
      label: scoreLabel(growth.score),
      components: growth.components,
    },
    momentumScore: {
      score: momentum.score,
      label: scoreLabel(momentum.score),
      components: momentum.components,
    },
    salesDeltaPercent,
    viewsDeltaPercent,
    lifecycle,
  };
}

function clampRefund(refundRatePercent: number): number {
  return Math.max(0, Math.min(100, 100 - refundRatePercent * 4));
}

function deltaToScore(delta: number | null): number {
  if (delta == null) return 50;
  // Map -100..+100 → 0..100 centered at 50
  return Math.max(0, Math.min(100, Math.round(50 + delta / 2)));
}

export function computeCreatorScore(
  input: {
    conversionRate: number;
    retentionProxy: number;
    /** Inverse of refund rate as satisfaction proxy */
    satisfactionProxy: number;
    sales: number;
    maxSales: number;
  },
  config: IntelligenceScoreConfig
): IntelligenceScoreBreakdown {
  const w = weightedScore(
    {
      conversion: input.conversionRate,
      retention: input.retentionProxy,
      satisfaction: input.satisfactionProxy,
      volume: normalizeAgainst(input.sales, Math.max(1, input.maxSales)),
    },
    config.weights.creator
  );
  return {
    score: w.score,
    label: scoreLabel(w.score),
    components: w.components,
  };
}

export function computeCategoryScore(
  input: {
    growthDelta: number | null;
    sales: number;
    maxSales: number;
    engagement: number;
    maxEngagement: number;
  },
  config: IntelligenceScoreConfig
): IntelligenceScoreBreakdown {
  const w = weightedScore(
    {
      growth: deltaToScore(input.growthDelta),
      sales: normalizeAgainst(input.sales, Math.max(1, input.maxSales)),
      engagement: normalizeAgainst(
        input.engagement,
        Math.max(1, input.maxEngagement)
      ),
    },
    config.weights.category
  );
  return {
    score: w.score,
    label: scoreLabel(w.score),
    components: w.components,
  };
}
