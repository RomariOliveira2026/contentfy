/**
 * ContentFy Discovery persistence.
 * Uses DB tables when migration 0012 is applied; otherwise memory fallback (dev).
 * Never pretends memory is durable in production logs.
 */

import { and, desc, eq, gte, sql } from "drizzle-orm";
import type { DiscoveryProductMeta } from "@shared/contentfy";
import { getDb } from "./db";
import {
  discoveryEvents,
  discoverySearchStats,
  productDiscoveryMeta,
  productDiscoveryRelationships,
  productReviews,
  orders,
  userFavorites,
  products,
  courses,
  courseModules,
  courseLessons,
  lessonProgress,
} from "../drizzle/schema";
import type { LessonProgressSnapshot } from "./core/discovery/continue-learning-engine";
import type { TrendingSignals } from "./core/discovery/trending-engine";
import { discoveryCacheInvalidate } from "./core/discovery/cache";

const memoryFavorites = new Map<number, Set<string>>();
const memoryEvents: Array<{
  userId?: number | null;
  eventType: string;
  productSlug?: string;
  category?: string;
  query?: string;
  dwellMs?: number;
  at: number;
}> = [];

let warnedMemory = false;
function warnMemoryOnce() {
  if (warnedMemory) return;
  warnedMemory = true;
  console.warn(
    "[ContentFy Discovery] Persistência em memória ativa (migration 0012 ausente ou DB indisponível). Não é durável."
  );
}

function parseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

export async function listDiscoveryDbMeta(): Promise<DiscoveryProductMeta[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const rows = await db.select().from(productDiscoveryMeta);
    return rows.map((r) => ({
      slug: r.slug,
      productId: r.productId,
      tags: parseJsonArray(r.tagsJson),
      category: r.category || "Geral",
      subcategory: r.subcategory || undefined,
      level: r.level || undefined,
      duration: r.durationLabel || undefined,
      type: "ebook",
      author: r.author || undefined,
      collections: parseJsonArray(r.collectionsJson),
      keywords: parseJsonArray(r.keywordsJson),
      objectives: parseJsonArray(r.objectivesJson),
      audience: parseJsonArray(r.audienceJson),
      skills: parseJsonArray(r.skillsJson),
      isFeatured: r.isFeatured,
      isLaunch: r.isLaunch,
      isBeginnerFriendly: r.isBeginnerFriendly,
    }));
  } catch {
    return [];
  }
}

export async function listDiscoveryDbRelationships() {
  try {
    const db = await getDb();
    if (!db) return [];
    return await db.select().from(productDiscoveryRelationships);
  } catch {
    return [];
  }
}

export async function listFavoriteSlugs(userId: number): Promise<string[]> {
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    const rows = await db
      .select({ slug: userFavorites.productSlug })
      .from(userFavorites)
      .where(eq(userFavorites.userId, userId))
      .orderBy(desc(userFavorites.createdAt));
    return rows.map((r) => r.slug);
  } catch {
    warnMemoryOnce();
    return Array.from(memoryFavorites.get(userId) || []);
  }
}

export async function addFavorite(
  userId: number,
  productSlug: string,
  productId?: number | null
) {
  discoveryCacheInvalidate(`discovery:home:${userId}`);
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    await db
      .insert(userFavorites)
      .values({ userId, productSlug, productId: productId ?? null })
      .onDuplicateKeyUpdate({ set: { productId: productId ?? null } });
    return { ok: true as const, persisted: "db" as const };
  } catch {
    warnMemoryOnce();
    const set = memoryFavorites.get(userId) || new Set();
    set.add(productSlug);
    memoryFavorites.set(userId, set);
    return { ok: true as const, persisted: "memory" as const };
  }
}

export async function removeFavorite(userId: number, productSlug: string) {
  discoveryCacheInvalidate(`discovery:home:${userId}`);
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    await db
      .delete(userFavorites)
      .where(
        and(
          eq(userFavorites.userId, userId),
          eq(userFavorites.productSlug, productSlug)
        )
      );
    return { ok: true as const, persisted: "db" as const };
  } catch {
    warnMemoryOnce();
    memoryFavorites.get(userId)?.delete(productSlug);
    return { ok: true as const, persisted: "memory" as const };
  }
}

export async function trackDiscoveryEvent(input: {
  userId?: number | null;
  sessionId?: string;
  eventType: string;
  productId?: number | null;
  productSlug?: string;
  category?: string;
  query?: string;
  dwellMs?: number;
}) {
  if (input.userId) {
    discoveryCacheInvalidate(`discovery:home:${input.userId}`);
  }
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    await db.insert(discoveryEvents).values({
      userId: input.userId ?? null,
      sessionId: input.sessionId,
      eventType: input.eventType,
      productId: input.productId ?? null,
      productSlug: input.productSlug,
      category: input.category,
      query: input.query,
      dwellMs: input.dwellMs,
    });

    if (input.eventType === "search" && input.query?.trim()) {
      const q = input.query.trim().toLowerCase().slice(0, 255);
      await db
        .insert(discoverySearchStats)
        .values({ queryNormalized: q, hitCount: 1 })
        .onDuplicateKeyUpdate({
          set: {
            hitCount: sql`${discoverySearchStats.hitCount} + 1`,
            lastSearchedAt: sql`CURRENT_TIMESTAMP`,
          },
        });
    }
    return { ok: true as const, persisted: "db" as const };
  } catch {
    warnMemoryOnce();
    memoryEvents.push({
      userId: input.userId,
      eventType: input.eventType,
      productSlug: input.productSlug,
      category: input.category,
      query: input.query,
      dwellMs: input.dwellMs,
      at: Date.now(),
    });
    if (memoryEvents.length > 5000) memoryEvents.splice(0, 1000);
    return { ok: true as const, persisted: "memory" as const };
  }
}

export async function getRecentViewSlugs(
  userId: number,
  limit = 20
): Promise<string[]> {
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    const rows = await db
      .select({ slug: discoveryEvents.productSlug })
      .from(discoveryEvents)
      .where(
        and(
          eq(discoveryEvents.userId, userId),
          eq(discoveryEvents.eventType, "view")
        )
      )
      .orderBy(desc(discoveryEvents.createdAt))
      .limit(limit * 3);
    const out: string[] = [];
    const seen = new Set<string>();
    for (const r of rows) {
      if (!r.slug || seen.has(r.slug)) continue;
      seen.add(r.slug);
      out.push(r.slug);
      if (out.length >= limit) break;
    }
    return out;
  } catch {
    const rows = memoryEvents
      .filter((e) => e.userId === userId && e.eventType === "view" && e.productSlug)
      .sort((a, b) => b.at - a.at);
    const out: string[] = [];
    const seen = new Set<string>();
    for (const r of rows) {
      if (!r.productSlug || seen.has(r.productSlug)) continue;
      seen.add(r.productSlug);
      out.push(r.productSlug);
      if (out.length >= limit) break;
    }
    return out;
  }
}

export async function getRecentSearchQueries(
  userId: number,
  limit = 10
): Promise<string[]> {
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    const rows = await db
      .select({ query: discoveryEvents.query })
      .from(discoveryEvents)
      .where(
        and(
          eq(discoveryEvents.userId, userId),
          eq(discoveryEvents.eventType, "search")
        )
      )
      .orderBy(desc(discoveryEvents.createdAt))
      .limit(limit * 2);
    const out: string[] = [];
    const seen = new Set<string>();
    for (const r of rows) {
      if (!r.query || seen.has(r.query)) continue;
      seen.add(r.query);
      out.push(r.query);
      if (out.length >= limit) break;
    }
    return out;
  } catch {
    return [];
  }
}

export async function buildTrendingSignals(): Promise<TrendingSignals[]> {
  const bySlug = new Map<
    string,
    {
      views: number;
      purchases: number;
      favorites: number;
      ratings: number;
      recent: number;
      older: number;
    }
  >();

  const ensure = (slug: string) => {
    if (!bySlug.has(slug)) {
      bySlug.set(slug, {
        views: 0,
        purchases: 0,
        favorites: 0,
        ratings: 0,
        recent: 0,
        older: 0,
      });
    }
    return bySlug.get(slug)!;
  };

  try {
    const db = await getDb();
    if (!db) throw new Error("no db");

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const events = await db
      .select({
        slug: discoveryEvents.productSlug,
        type: discoveryEvents.eventType,
        createdAt: discoveryEvents.createdAt,
      })
      .from(discoveryEvents)
      .where(gte(discoveryEvents.createdAt, thirtyDaysAgo))
      .limit(5000);

    for (const e of events) {
      if (!e.slug) continue;
      const row = ensure(e.slug);
      if (e.type === "view" || e.type === "click") row.views += 1;
      if (e.type === "favorite" || e.type === "wishlist") row.favorites += 1;
      const t = e.createdAt ? new Date(e.createdAt).getTime() : 0;
      if (t >= sevenDaysAgo.getTime()) row.recent += 1;
      else row.older += 1;
    }

    const favCounts = await db
      .select({
        slug: userFavorites.productSlug,
        c: sql<number>`count(*)`,
      })
      .from(userFavorites)
      .groupBy(userFavorites.productSlug);
    for (const f of favCounts) {
      ensure(f.slug).favorites += Number(f.c) || 0;
    }

    const purchaseRows = await db
      .select({
        slug: products.slug,
        c: sql<number>`count(*)`,
      })
      .from(orders)
      .innerJoin(products, eq(orders.productId, products.id))
      .where(eq(orders.status, "completed"))
      .groupBy(products.slug);
    for (const p of purchaseRows) {
      ensure(p.slug).purchases += Number(p.c) || 0;
    }

    const ratingRows = await db
      .select({
        slug: products.slug,
        c: sql<number>`count(*)`,
        avg: sql<number>`avg(${productReviews.rating})`,
      })
      .from(productReviews)
      .innerJoin(products, eq(productReviews.productId, products.id))
      .where(eq(productReviews.isApproved, true))
      .groupBy(products.slug);
    for (const r of ratingRows) {
      const avg = Number(r.avg) || 0;
      ensure(r.slug).ratings += (Number(r.c) || 0) * (avg / 5);
    }
  } catch {
    for (const e of memoryEvents) {
      if (!e.productSlug) continue;
      const row = ensure(e.productSlug);
      if (e.eventType === "view" || e.eventType === "click") row.views += 1;
      if (e.eventType === "favorite") row.favorites += 1;
      if (Date.now() - e.at < 7 * 24 * 60 * 60 * 1000) row.recent += 1;
      else row.older += 1;
    }
  }

  return Array.from(bySlug.entries()).map(([slug, v]) => ({
    slug,
    views: v.views,
    purchases: v.purchases,
    favorites: v.favorites,
    ratings: v.ratings,
    recentGrowth: v.older > 0 ? v.recent / v.older : v.recent > 0 ? 1 : 0,
  }));
}

export async function buildContinueLearningSnapshots(
  userId: number
): Promise<LessonProgressSnapshot[]> {
  try {
    const db = await getDb();
    if (!db) return [];

    // Progress by product via course → modules → lessons
    const rows = await db
      .select({
        productId: products.id,
        productSlug: products.slug,
        productName: products.name,
        coverImage: products.coverImage,
        lessonId: courseLessons.id,
        lessonTitle: courseLessons.title,
        moduleTitle: courseModules.title,
        isCompleted: lessonProgress.isCompleted,
        lastWatchedAt: lessonProgress.lastWatchedAt,
      })
      .from(lessonProgress)
      .innerJoin(courseLessons, eq(lessonProgress.lessonId, courseLessons.id))
      .innerJoin(courseModules, eq(courseLessons.moduleId, courseModules.id))
      .innerJoin(courses, eq(courseModules.courseId, courses.id))
      .innerJoin(products, eq(courses.productId, products.id))
      .where(eq(lessonProgress.userId, userId))
      .orderBy(desc(lessonProgress.lastWatchedAt));

    const byProduct = new Map<
      number,
      LessonProgressSnapshot & { _last?: number }
    >();

    for (const r of rows) {
      let snap = byProduct.get(r.productId);
      if (!snap) {
        snap = {
          productId: r.productId,
          productSlug: r.productSlug,
          productName: r.productName,
          coverImage: r.coverImage,
          lastLessonTitle: r.lessonTitle,
          lastModuleTitle: r.moduleTitle,
          completedLessons: 0,
          totalLessons: 0,
          lastWatchedAt: r.lastWatchedAt,
          _last: r.lastWatchedAt ? new Date(r.lastWatchedAt).getTime() : 0,
        };
        byProduct.set(r.productId, snap);
      }
      snap.totalLessons += 1;
      if (r.isCompleted) snap.completedLessons += 1;
      const t = r.lastWatchedAt ? new Date(r.lastWatchedAt).getTime() : 0;
      if (t >= (snap._last || 0)) {
        snap._last = t;
        snap.lastLessonTitle = r.lessonTitle;
        snap.lastModuleTitle = r.moduleTitle;
        snap.lastWatchedAt = r.lastWatchedAt;
      }
    }

    // Enrich total lessons from course structure for products with progress
    for (const snap of Array.from(byProduct.values())) {
      const totals = await db
        .select({ c: sql<number>`count(*)` })
        .from(courseLessons)
        .innerJoin(courseModules, eq(courseLessons.moduleId, courseModules.id))
        .innerJoin(courses, eq(courseModules.courseId, courses.id))
        .where(eq(courses.productId, snap.productId));
      const total = Number(totals[0]?.c) || snap.totalLessons;
      snap.totalLessons = total;
    }

    return Array.from(byProduct.values()).map(({ _last: _, ...rest }) => rest);
  } catch (error) {
    console.error("[Discovery] continue learning snapshot failed:", error);
    return [];
  }
}

export async function getAdminDiscoveryInsights() {
  const empty = {
    mostViewed: [] as Array<{ slug: string; count: number }>,
    mostSold: [] as Array<{ slug: string; count: number }>,
    mostFavorited: [] as Array<{ slug: string; count: number }>,
    mostSearched: [] as Array<{ query: string; count: number }>,
    persistence: "unknown" as "db" | "memory" | "unknown",
  };

  try {
    const db = await getDb();
    if (!db) {
      warnMemoryOnce();
      const views = new Map<string, number>();
      for (const e of memoryEvents) {
        if ((e.eventType === "view" || e.eventType === "click") && e.productSlug) {
          views.set(e.productSlug, (views.get(e.productSlug) || 0) + 1);
        }
      }
      return {
        ...empty,
        mostViewed: Array.from(views.entries())
          .map(([slug, count]) => ({ slug, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 20),
        persistence: "memory" as const,
      };
    }

    const viewed = await db
      .select({
        slug: discoveryEvents.productSlug,
        count: sql<number>`count(*)`,
      })
      .from(discoveryEvents)
      .where(eq(discoveryEvents.eventType, "view"))
      .groupBy(discoveryEvents.productSlug)
      .orderBy(desc(sql`count(*)`))
      .limit(20);

    const sold = await db
      .select({
        slug: products.slug,
        count: sql<number>`count(*)`,
      })
      .from(orders)
      .innerJoin(products, eq(orders.productId, products.id))
      .where(eq(orders.status, "completed"))
      .groupBy(products.slug)
      .orderBy(desc(sql`count(*)`))
      .limit(20);

    const favorited = await db
      .select({
        slug: userFavorites.productSlug,
        count: sql<number>`count(*)`,
      })
      .from(userFavorites)
      .groupBy(userFavorites.productSlug)
      .orderBy(desc(sql`count(*)`))
      .limit(20);

    const searched = await db
      .select({
        query: discoverySearchStats.queryNormalized,
        count: discoverySearchStats.hitCount,
      })
      .from(discoverySearchStats)
      .orderBy(desc(discoverySearchStats.hitCount))
      .limit(20);

    return {
      mostViewed: viewed
        .filter((v) => v.slug)
        .map((v) => ({ slug: v.slug!, count: Number(v.count) || 0 })),
      mostSold: sold.map((v) => ({ slug: v.slug, count: Number(v.count) || 0 })),
      mostFavorited: favorited.map((v) => ({
        slug: v.slug,
        count: Number(v.count) || 0,
      })),
      mostSearched: searched.map((v) => ({
        query: v.query,
        count: Number(v.count) || 0,
      })),
      persistence: "db" as const,
    };
  } catch {
    warnMemoryOnce();
    return { ...empty, persistence: "memory" as const };
  }
}
