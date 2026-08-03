import type {
  DiscoveryCardModel,
  DiscoveryHomePayload,
  DiscoveryProductMeta,
  DiscoveryProfile,
  DiscoveryRailId,
  DiscoveryResult,
  DiscoverySearchResult,
} from "@shared/contentfy";
import {
  DISCOVERY_RAIL_DEFS as RAIL_DEFS,
  scoreDiscoverySearch,
} from "@shared/contentfy";
import { discoveryCacheGet, discoveryCacheSet } from "./cache";
import { categoryEngine } from "./category-engine";
import {
  continueLearningEngine,
  type LessonProgressSnapshot,
} from "./continue-learning-engine";
import {
  mergeCatalogMeta,
  recommendationService,
  toCardModel,
  type CatalogProduct,
} from "./recommendation-service";
import { relationshipEngine } from "./relationship-engine";
import { listSeedMeta } from "./seed-metadata";
import { trendingEngine, type TrendingSignals } from "./trending-engine";

export interface DiscoveryEngineInput {
  products: CatalogProduct[];
  dbMeta?: DiscoveryProductMeta[];
  profile?: DiscoveryProfile | null;
  progress?: LessonProgressSnapshot[];
  trendingSignals?: TrendingSignals[];
  favoriteSlugs?: string[];
}

function cardsForSlugs(
  slugs: string[],
  meta: DiscoveryProductMeta[],
  products: CatalogProduct[],
  reason?: string
): DiscoveryCardModel[] {
  const productBySlug = new Map(products.map((p) => [p.slug, p]));
  const metaBySlug = new Map(meta.map((m) => [m.slug, m]));
  const out: DiscoveryCardModel[] = [];
  for (const slug of slugs) {
    const m = metaBySlug.get(slug);
    if (!m) continue;
    out.push(
      toCardModel(m, productBySlug.get(slug), reason ? { reason } : undefined)
    );
  }
  return out;
}

function uniqueSlugs(lists: string[][], limit: number): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const list of lists) {
    for (const slug of list) {
      if (seen.has(slug)) continue;
      seen.add(slug);
      out.push(slug);
      if (out.length >= limit) return out;
    }
  }
  return out;
}

/** ContentFy Discovery — proprietary rule/behavior/relationship engine. */
export class DiscoveryEngine {
  buildCatalog(input: DiscoveryEngineInput): DiscoveryProductMeta[] {
    return mergeCatalogMeta(
      input.products,
      listSeedMeta(),
      input.dbMeta || []
    );
  }

  recommend(profile: DiscoveryProfile): DiscoveryResult {
    // Backward-compatible seam used by registry demos — empty catalog fallback.
    const catalog = listSeedMeta();
    return recommendationService.recommend(profile, catalog);
  }

  search(
    query: string,
    input: DiscoveryEngineInput,
    limit = 24
  ): DiscoverySearchResult {
    const catalog = this.buildCatalog(input);
    const productBySlug = new Map(input.products.map((p) => [p.slug, p]));
    const hits = catalog
      .map((m) => {
        const product = productBySlug.get(m.slug);
        const { score, matchedOn } = scoreDiscoverySearch(query, {
          name: product?.name || m.slug,
          author: m.author,
          category: m.category,
          subcategory: m.subcategory,
          tags: m.tags,
          keywords: m.keywords,
          objectives: m.objectives,
        });
        return {
          slug: m.slug,
          name: product?.name || m.slug,
          score,
          matchedOn,
          href: `/produto/${m.slug}`,
          category: m.category,
          tags: m.tags,
          author: m.author,
        };
      })
      .filter((h) => h.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return { query, hits, total: hits.length };
  }

  related(slug: string, input: DiscoveryEngineInput, limit = 8): DiscoveryCardModel[] {
    const catalog = this.buildCatalog(input);
    const chain = relationshipEngine.chain(slug, limit + 1).slice(1);
    const related = relationshipEngine.relatedSlugs(slug, limit);
    const slugs = uniqueSlugs([chain, related], limit);
    return cardsForSlugs(slugs, catalog, input.products, "Relacionado");
  }

  buildHome(input: DiscoveryEngineInput): DiscoveryHomePayload {
    const userKey = input.profile?.userId ?? "anon";
    const cacheKey = `discovery:home:${userKey}`;
    const cached = discoveryCacheGet<DiscoveryHomePayload>(cacheKey);
    if (cached) return { ...cached, cacheHit: true };

    const catalog = this.buildCatalog(input);
    const productBySlug = new Map(input.products.map((p) => [p.slug, p]));
    const profile = input.profile;
    const personalized = Boolean(profile && profile.userId > 0);

    const exclude = new Set<string>();
    // Prefer not recommending already owned if we can map ids→slugs later
    if (profile) {
      for (const s of profile.favoriteSlugs) exclude.add(s);
    }

    const continueLearning = continueLearningEngine.build(
      input.progress || [],
      8
    );

    const recommended = profile
      ? recommendationService.recommend(profile, catalog)
      : {
          productSlugs: categoryEngine
            .railItems(catalog, "featured", 12)
            .map((m) => m.slug),
          strategy: "fallback" as const,
          reason: "Visitante — destaque editorial.",
          productIds: [],
        };

    const trendingRaw = trendingEngine.rank(input.trendingSignals || [], 12);
    const editorial = catalog
      .filter((m) => m.isFeatured || m.isLaunch)
      .map((m) => m.slug);
    const trending = trendingEngine.withEditorialFallback(
      trendingRaw,
      editorial,
      12
    );

    const favoriteSlugs = input.favoriteSlugs || profile?.favoriteSlugs || [];

    const railBuilders: Array<{
      id: DiscoveryRailId;
      title: string;
      subtitle?: string;
      slugs: string[];
    }> = [];

    for (const def of RAIL_DEFS) {
      let slugs: string[] = [];
      switch (def.id) {
        case "continue_learning":
          // Rendered separately as ContinueLearning items
          continue;
        case "recommended":
          slugs = recommended.productSlugs;
          break;
        case "favorites":
          slugs = favoriteSlugs;
          break;
        case "bestsellers":
        case "trending":
          slugs = trending.map((t) => t.slug);
          break;
        default:
          slugs = categoryEngine
            .railItems(catalog, def.id, 12)
            .map((m) => m.slug);
          break;
      }
      // Only keep slugs that exist in catalog (or product list)
      slugs = slugs.filter(
        (s) => catalog.some((m) => m.slug === s) || productBySlug.has(s)
      );
      if (!slugs.length) continue;
      railBuilders.push({
        id: def.id,
        title: def.title,
        subtitle: def.subtitle,
        slugs,
      });
    }

    const heroMeta =
      catalog.find((m) => m.isLaunch && m.isFeatured) ||
      catalog.find((m) => m.isFeatured) ||
      catalog[0] ||
      null;

    const hero = heroMeta
      ? toCardModel(heroMeta, productBySlug.get(heroMeta.slug))
      : null;

    const payload: DiscoveryHomePayload = {
      hero,
      rails: railBuilders.map((r) => ({
        id: r.id,
        title: r.title,
        subtitle: r.subtitle,
        items: cardsForSlugs(r.slugs, catalog, input.products),
      })),
      continueLearning,
      personalized,
      generatedAt: new Date().toISOString(),
      cacheHit: false,
    };

    discoveryCacheSet(cacheKey, payload, personalized ? 30_000 : 90_000);
    return payload;
  }
}

export const discoveryEngine = new DiscoveryEngine();
