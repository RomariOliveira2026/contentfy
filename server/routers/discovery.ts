import { z } from "zod";
import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "../_core/trpc";
import { discoveryEngine } from "../core/discovery";
import type { DiscoveryProfile } from "@shared/contentfy";
import * as db from "../db";
import * as discoveryStore from "../discovery-store";
import { RelationshipEngine } from "../core/discovery/relationship-engine";
import { listDiscoveryDbRelationships } from "../discovery-store";

async function loadCatalogProducts() {
  const rows = await db.getAllProducts();
  return rows
    .filter((p) => p.isActive)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      type: p.type,
      description: p.description,
      coverImage: p.coverImage,
      thumbnailImage: p.thumbnailImage,
      price: p.price,
      categoryName: p.category?.name ?? null,
      isActive: p.isActive,
      createdAt: p.createdAt,
    }));
}

async function buildProfile(
  userId: number | null | undefined
): Promise<DiscoveryProfile | null> {
  if (!userId) return null;
  const [favorites, views, searches, owned] = await Promise.all([
    discoveryStore.listFavoriteSlugs(userId),
    discoveryStore.getRecentViewSlugs(userId),
    discoveryStore.getRecentSearchQueries(userId),
    db.getUserProducts(userId),
  ]);

  const { getSeedMetaBySlug } = await import("../core/discovery/seed-metadata");
  const preferences = Array.from(
    new Set(
      [...views, ...favorites]
        .map((slug) => getSeedMetaBySlug(slug)?.category)
        .filter((c): c is string => Boolean(c))
    )
  );

  return {
    userId,
    preferences,
    goals: [],
    completedProductIds: [],
    ownedProductIds: (owned || [])
      .map((o) => o.userProduct?.productId ?? o.product?.id)
      .filter((id): id is number => typeof id === "number"),
    favoriteSlugs: favorites,
    recentViewSlugs: views,
    recentSearchQueries: searches,
    signals: [],
  };
}

export const discoveryRouter = router({
  home: publicProcedure.query(async ({ ctx }) => {
    const products = await loadCatalogProducts();
    const [dbMeta, trendingSignals, profile, progress, favorites] =
      await Promise.all([
        discoveryStore.listDiscoveryDbMeta(),
        discoveryStore.buildTrendingSignals(),
        buildProfile(ctx.user?.id),
        ctx.user?.id
          ? discoveryStore.buildContinueLearningSnapshots(ctx.user.id)
          : Promise.resolve([]),
        ctx.user?.id
          ? discoveryStore.listFavoriteSlugs(ctx.user.id)
          : Promise.resolve([]),
      ]);

    // Merge DB relationships into engine instance for this request
    const relRows = await listDiscoveryDbRelationships();
    if (relRows.length) {
      const eng = new RelationshipEngine(
        relRows.map((r) => ({
          fromSlug: r.fromSlug,
          toSlug: r.toSlug,
          type: r.relationType,
          weight: r.weight,
          label: r.label || undefined,
        }))
      );
      void eng;
    }

    return discoveryEngine.buildHome({
      products,
      dbMeta,
      profile,
      progress,
      trendingSignals,
      favoriteSlugs: favorites,
    });
  }),

  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1).max(200),
        limit: z.number().int().min(1).max(50).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const products = await loadCatalogProducts();
      const dbMeta = await discoveryStore.listDiscoveryDbMeta();
      if (ctx.user?.id) {
        await discoveryStore.trackDiscoveryEvent({
          userId: ctx.user.id,
          eventType: "search",
          query: input.query,
        });
      } else {
        await discoveryStore.trackDiscoveryEvent({
          eventType: "search",
          query: input.query,
        });
      }
      return discoveryEngine.search(
        input.query,
        { products, dbMeta },
        input.limit ?? 24
      );
    }),

  related: publicProcedure
    .input(z.object({ slug: z.string().min(1).max(255) }))
    .query(async ({ input }) => {
      const products = await loadCatalogProducts();
      const dbMeta = await discoveryStore.listDiscoveryDbMeta();
      return discoveryEngine.related(input.slug, { products, dbMeta });
    }),

  track: publicProcedure
    .input(
      z.object({
        eventType: z.enum([
          "view",
          "click",
          "dwell",
          "search",
          "favorite",
          "wishlist",
        ]),
        productSlug: z.string().max(255).optional(),
        productId: z.number().int().optional(),
        category: z.string().max(255).optional(),
        query: z.string().max(512).optional(),
        dwellMs: z.number().int().min(0).max(3_600_000).optional(),
        sessionId: z.string().max(64).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return discoveryStore.trackDiscoveryEvent({
        userId: ctx.user?.id ?? null,
        sessionId: input.sessionId,
        eventType: input.eventType,
        productSlug: input.productSlug,
        productId: input.productId,
        category: input.category,
        query: input.query,
        dwellMs: input.dwellMs,
      });
    }),

  myList: protectedProcedure.query(async ({ ctx }) => {
    const slugs = await discoveryStore.listFavoriteSlugs(ctx.user.id);
    const products = await loadCatalogProducts();
    const dbMeta = await discoveryStore.listDiscoveryDbMeta();
    const home = discoveryEngine.buildHome({
      products,
      dbMeta,
      favoriteSlugs: slugs,
      profile: await buildProfile(ctx.user.id),
    });
    const items =
      home.rails.find((r) => r.id === "favorites")?.items ||
      slugs
        .map((slug) => home.rails.flatMap((r) => r.items).find((i) => i.slug === slug))
        .filter(Boolean);
    return { slugs, items };
  }),

  addFavorite: protectedProcedure
    .input(
      z.object({
        productSlug: z.string().min(1).max(255),
        productId: z.number().int().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await discoveryStore.addFavorite(
        ctx.user.id,
        input.productSlug,
        input.productId
      );
      await discoveryStore.trackDiscoveryEvent({
        userId: ctx.user.id,
        eventType: "favorite",
        productSlug: input.productSlug,
        productId: input.productId,
      });
      return result;
    }),

  removeFavorite: protectedProcedure
    .input(z.object({ productSlug: z.string().min(1).max(255) }))
    .mutation(async ({ ctx, input }) => {
      return discoveryStore.removeFavorite(ctx.user.id, input.productSlug);
    }),

  isFavorite: protectedProcedure
    .input(z.object({ productSlug: z.string().min(1).max(255) }))
    .query(async ({ ctx, input }) => {
      const slugs = await discoveryStore.listFavoriteSlugs(ctx.user.id);
      return { favorite: slugs.includes(input.productSlug) };
    }),

  continueLearning: protectedProcedure.query(async ({ ctx }) => {
    const progress = await discoveryStore.buildContinueLearningSnapshots(
      ctx.user.id
    );
    return discoveryEngine.buildHome({
      products: await loadCatalogProducts(),
      progress,
      profile: await buildProfile(ctx.user.id),
    }).continueLearning;
  }),

  adminInsights: adminProcedure.query(async () => {
    return discoveryStore.getAdminDiscoveryInsights();
  }),
});
