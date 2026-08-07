import { describe, expect, it } from "vitest";
import {
  DEFAULT_INTELLIGENCE_SCORE_CONFIG,
  type IntelligenceRawProductSignal,
} from "@shared/contentfy";
import {
  resolveIntelligenceConfig,
  pctDelta,
  weightedScore,
  clamp01to100,
} from "../../server/core/intelligence/config";
import { computeProductScores } from "../../server/core/intelligence/score-math";
import { behaviorEngine } from "../../server/core/intelligence/behavior-engine";
import { analyticsEngine } from "../../server/core/intelligence/analytics-engine";
import { detectAlerts } from "../../server/core/intelligence/detection";
import { buildInsights } from "../../server/core/intelligence/insights";
import { marketplaceInsights } from "../../server/core/intelligence/marketplace-insights";
import { conversionEngine } from "../../server/core/intelligence/conversion-engine";

function signal(
  partial: Partial<IntelligenceRawProductSignal> & {
    productId: number;
    slug: string;
  }
): IntelligenceRawProductSignal {
  return {
    name: partial.name || partial.slug,
    category: partial.category ?? "Negócios",
    author: partial.author ?? "Autor A",
    views: 0,
    recentViews: 0,
    priorViews: 0,
    sales: 0,
    recentSales: 0,
    priorSales: 0,
    favorites: 0,
    refunds: 0,
    revenueCents: 0,
    learners: 0,
    avgProgress: 0,
    completionRate: 0,
    abandonmentRate: 0,
    retentionProxy: 0,
    ...partial,
  };
}

describe("Intelligence config", () => {
  it("loads defaults without env", () => {
    const cfg = resolveIntelligenceConfig();
    expect(cfg.windows.recentDays).toBe(
      DEFAULT_INTELLIGENCE_SCORE_CONFIG.windows.recentDays
    );
    expect(cfg.thresholds.highAbandonmentPercent).toBe(40);
  });

  it("merges overrides", () => {
    const cfg = resolveIntelligenceConfig({
      thresholds: {
        ...DEFAULT_INTELLIGENCE_SCORE_CONFIG.thresholds,
        viralViewsMin: 99,
      },
    });
    expect(cfg.thresholds.viralViewsMin).toBe(99);
  });
});

describe("score math", () => {
  it("clamps and weights", () => {
    expect(clamp01to100(150)).toBe(100);
    expect(pctDelta(20, 10)).toBe(100);
    expect(pctDelta(5, 10)).toBe(-50);
    const w = weightedScore(
      { a: 100, b: 0 },
      { a: 0.5, b: 0.5 }
    );
    expect(w.score).toBe(50);
  });

  it("computes product scores from peers", () => {
    const peers = [
      signal({
        productId: 1,
        slug: "a",
        views: 100,
        sales: 10,
        favorites: 5,
        completionRate: 70,
        retentionProxy: 60,
        recentSales: 8,
        priorSales: 2,
        recentViews: 60,
        priorViews: 20,
      }),
      signal({
        productId: 2,
        slug: "b",
        views: 10,
        sales: 1,
        recentSales: 0,
        priorSales: 2,
      }),
    ];
    const scores = computeProductScores(peers[0], peers, resolveIntelligenceConfig());
    expect(scores.lifecycle).toBe("emerging");
    expect(scores.productScore.score).toBeGreaterThan(0);
    expect(scores.growthScore.score).toBeGreaterThan(50);
  });
});

describe("engines", () => {
  const cfg = resolveIntelligenceConfig();
  const peers = [
    signal({
      productId: 1,
      slug: "hot",
      name: "Hot",
      views: 200,
      sales: 20,
      favorites: 15,
      recentSales: 15,
      priorSales: 5,
      completionRate: 55,
      abandonmentRate: 45,
      retentionProxy: 50,
      refunds: 3,
      revenueCents: 200000,
      category: "Vendas",
    }),
    signal({
      productId: 2,
      slug: "cold",
      name: "Cold",
      views: 80,
      sales: 8,
      recentSales: 1,
      priorSales: 7,
      completionRate: 20,
      abandonmentRate: 80,
      retentionProxy: 25,
      refunds: 2,
      category: "Vendas",
    }),
  ];

  it("behavior maps rows", () => {
    const rows = behaviorEngine.toProductRows(peers, cfg);
    expect(rows).toHaveLength(2);
    expect(rows[0].productScore.score).toBeGreaterThanOrEqual(0);
  });

  it("analytics health", () => {
    const rows = behaviorEngine.toProductRows(peers, cfg);
    const health = analyticsEngine.marketplaceHealth(rows);
    expect(health.ordersCompleted).toBe(28);
    expect(health.revenueCents).toBe(200000);
    expect(health.conversionProxy).toBeGreaterThan(0);
  });

  it("conversion rate", () => {
    expect(conversionEngine.rate(100, 10)).toBe(10);
    expect(conversionEngine.rate(0, 5)).toBe(0);
  });

  it("marketplace creators and categories", () => {
    const rows = behaviorEngine.toProductRows(peers, cfg);
    const creators = marketplaceInsights.creators(rows, cfg);
    expect(creators[0].authorLabel).toBeTruthy();
    const cats = marketplaceInsights.categories(rows, cfg);
    expect(cats.some((c) => c.category === "Vendas")).toBe(true);
  });

  it("detects alerts without inventing", () => {
    const rows = behaviorEngine.toProductRows(peers, cfg);
    const cats = marketplaceInsights.categories(rows, cfg);
    const alerts = detectAlerts(rows, cats, cfg);
    expect(alerts.some((a) => a.kind === "high_abandonment")).toBe(true);
    expect(alerts.some((a) => a.kind === "sales_drop")).toBe(true);
    for (const a of alerts) {
      expect(a.body.length).toBeGreaterThan(10);
      expect(a.body.toLowerCase()).not.toContain("lorem");
    }
  });

  it("insights cite real evidence", () => {
    const rows = behaviorEngine.toProductRows(peers, cfg);
    const insights = buildInsights(rows);
    expect(insights.length).toBeGreaterThan(0);
    for (const i of insights) {
      expect(Object.keys(i.evidence).length).toBeGreaterThan(0);
    }
  });
});
