import { describe, expect, it } from "vitest";
import {
  computeTrendingScore,
  scoreDiscoverySearch,
} from "@shared/contentfy";
import { recommendationService } from "../../server/core/discovery/recommendation-service";
import { relationshipEngine } from "../../server/core/discovery/relationship-engine";
import { categoryEngine } from "../../server/core/discovery/category-engine";
import { trendingEngine } from "../../server/core/discovery/trending-engine";
import { continueLearningEngine } from "../../server/core/discovery/continue-learning-engine";
import { listSeedMeta } from "../../server/core/discovery/seed-metadata";
import { walkRelationshipChain } from "../../server/core/discovery/seed-relationships";
import { DiscoveryEngine } from "../../server/core/discovery/discovery-engine";

describe("Discovery search scoring", () => {
  it("ranks title matches above tags", () => {
    const titleHit = scoreDiscoverySearch("desacelere", {
      name: "Desacelere",
      tags: ["bem-estar"],
    });
    const tagHit = scoreDiscoverySearch("desacelere", {
      name: "Outro livro",
      tags: ["desacelere"],
    });
    expect(titleHit.score).toBeGreaterThan(tagHit.score);
    expect(titleHit.matchedOn).toContain("title");
  });

  it("matches author category keywords objectives", () => {
    const r = scoreDiscoverySearch("romário vendas", {
      name: "Manual",
      author: "Romário Oliveira",
      category: "Negócios",
      keywords: ["vendas"],
      objectives: ["Vender com método"],
    });
    expect(r.score).toBeGreaterThan(0);
    expect(r.matchedOn.length).toBeGreaterThan(0);
  });
});

describe("Trending algorithm", () => {
  it("weights purchases higher than views", () => {
    const viewsOnly = computeTrendingScore({
      views: 10,
      purchases: 0,
      favorites: 0,
      ratings: 0,
      recentGrowth: 0,
    });
    const purchase = computeTrendingScore({
      views: 0,
      purchases: 2,
      favorites: 0,
      ratings: 0,
      recentGrowth: 0,
    });
    expect(purchase).toBeGreaterThan(viewsOnly);
  });

  it("falls back to editorial when scores are zero", () => {
    const ranked = trendingEngine.withEditorialFallback(
      [],
      ["desacelere", "manual-do-representante-comercial"],
      2
    );
    expect(ranked.map((r) => r.slug)).toEqual([
      "desacelere",
      "manual-do-representante-comercial",
    ]);
  });
});

describe("Relationship graph", () => {
  it("walks representante trail", () => {
    const chain = walkRelationshipChain(
      "manual-do-representante-comercial",
      6
    );
    expect(chain[0]).toBe("manual-do-representante-comercial");
    expect(chain).toContain("rep4crm");
  });

  it("scores graph proximity", () => {
    const score = relationshipEngine.scoreByGraph("rep4crm", [
      "manual-do-representante-comercial",
    ]);
    expect(score).toBeGreaterThan(0);
  });
});

describe("Category + recommendation engines", () => {
  it("finds personal_dev collection", () => {
    const items = categoryEngine.railItems(listSeedMeta(), "personal_dev", 5);
    expect(items.some((i) => i.slug === "desacelere")).toBe(true);
  });

  it("recommends from behavior anchors", () => {
    const result = recommendationService.recommend(
      {
        userId: 1,
        preferences: ["Negócios"],
        goals: ["vendas"],
        completedProductIds: [],
        ownedProductIds: [],
        favoriteSlugs: ["manual-do-representante-comercial"],
        recentViewSlugs: ["manual-do-representante-comercial"],
        recentSearchQueries: ["crm"],
        signals: [],
      },
      listSeedMeta()
    );
    expect(result.productSlugs.length).toBeGreaterThan(0);
    expect(["behavior", "goals", "related", "fallback"]).toContain(
      result.strategy
    );
  });
});

describe("Continue learning", () => {
  it("sorts incomplete progress and hides completed", () => {
    const items = continueLearningEngine.build([
      {
        productId: 1,
        productSlug: "curso-a",
        productName: "Curso A",
        completedLessons: 2,
        totalLessons: 10,
        lastWatchedAt: new Date("2026-01-02"),
        lastLessonTitle: "Aula 2",
      },
      {
        productId: 2,
        productSlug: "curso-b",
        productName: "Curso B",
        completedLessons: 5,
        totalLessons: 5,
        lastWatchedAt: new Date("2026-01-03"),
      },
    ]);
    expect(items).toHaveLength(1);
    expect(items[0].productSlug).toBe("curso-a");
    expect(items[0].progressPercent).toBe(20);
  });
});

describe("DiscoveryEngine home", () => {
  it("builds rails with cache flag false first time", () => {
    const engine = new DiscoveryEngine();
    const home = engine.buildHome({
      products: [
        {
          id: 1,
          slug: "desacelere",
          name: "Desacelere",
          type: "ebook",
          price: 9900,
          isActive: true,
        },
      ],
      profile: {
        userId: 99,
        preferences: [],
        goals: [],
        completedProductIds: [],
        ownedProductIds: [],
        favoriteSlugs: [],
        recentViewSlugs: [],
        recentSearchQueries: [],
        signals: [],
      },
    });
    expect(home.rails.length).toBeGreaterThan(0);
    expect(home.cacheHit).toBe(false);
    expect(home.personalized).toBe(true);
  });
});
