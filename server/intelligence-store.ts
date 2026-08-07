/**
 * Read-only aggregations for ContentFy Intelligence.
 * Does not mutate Discovery/Learn/Success/Protect/LMS engines.
 */

import { and, eq, gte, lt, sql } from "drizzle-orm";
import type { IntelligenceRawProductSignal } from "@shared/contentfy";
import { getDb } from "./db";
import {
  discoveryEvents,
  lessonProgress,
  orders,
  products,
  refundRequests,
  courseLessons,
  courseModules,
  courses,
} from "../drizzle/schema";
import * as db from "./db";
import * as discoveryStore from "./discovery-store";
import { resolveIntelligenceConfig } from "./core/intelligence/config";

export interface IntelligenceSnapshot {
  products: IntelligenceRawProductSignal[];
  persistence: "db" | "memory" | "partial";
  windowRecentDays: number;
  windowPriorDays: number;
  generatedAt: string;
}

function dayAgo(days: number): Date {
  return new Date(Date.now() - days * 86_400_000);
}

export async function buildIntelligenceSnapshot(): Promise<IntelligenceSnapshot> {
  const config = resolveIntelligenceConfig();
  const recentDays = config.windows.recentDays;
  const priorDays = config.windows.priorDays;
  const recentStart = dayAgo(recentDays);
  const priorStart = dayAgo(recentDays + priorDays);
  const priorEnd = recentStart;

  try {
    const database = await getDb();
    if (!database) throw new Error("no db");

    const [allProducts, insights, meta] = await Promise.all([
      db.getAllProducts(),
      discoveryStore.getAdminDiscoveryInsights(),
      discoveryStore.listDiscoveryDbMeta(),
    ]);

    const viewMap = new Map(insights.mostViewed.map((v) => [v.slug, v.count]));
    const soldMap = new Map(insights.mostSold.map((v) => [v.slug, v.count]));
    const favMap = new Map(
      insights.mostFavorited.map((v) => [v.slug, v.count])
    );
    const metaBySlug = new Map(meta.map((m) => [m.slug, m]));

    const recentSalesRows = await database
      .select({
        productId: orders.productId,
        count: sql<number>`count(*)`,
        revenue: sql<number>`coalesce(sum(${orders.amount}), 0)`,
      })
      .from(orders)
      .where(
        and(eq(orders.status, "completed"), gte(orders.createdAt, recentStart))
      )
      .groupBy(orders.productId);

    const priorSalesRows = await database
      .select({
        productId: orders.productId,
        count: sql<number>`count(*)`,
      })
      .from(orders)
      .where(
        and(
          eq(orders.status, "completed"),
          gte(orders.createdAt, priorStart),
          lt(orders.createdAt, priorEnd)
        )
      )
      .groupBy(orders.productId);

    const allSalesRows = await database
      .select({
        productId: orders.productId,
        count: sql<number>`count(*)`,
        revenue: sql<number>`coalesce(sum(${orders.amount}), 0)`,
      })
      .from(orders)
      .where(eq(orders.status, "completed"))
      .groupBy(orders.productId);

    const recentViewsRows = await database
      .select({
        slug: discoveryEvents.productSlug,
        count: sql<number>`count(*)`,
      })
      .from(discoveryEvents)
      .where(
        and(
          eq(discoveryEvents.eventType, "view"),
          gte(discoveryEvents.createdAt, recentStart)
        )
      )
      .groupBy(discoveryEvents.productSlug);

    const priorViewsRows = await database
      .select({
        slug: discoveryEvents.productSlug,
        count: sql<number>`count(*)`,
      })
      .from(discoveryEvents)
      .where(
        and(
          eq(discoveryEvents.eventType, "view"),
          gte(discoveryEvents.createdAt, priorStart),
          lt(discoveryEvents.createdAt, priorEnd)
        )
      )
      .groupBy(discoveryEvents.productSlug);

    const refundRows = await database
      .select({
        productId: orders.productId,
        count: sql<number>`count(*)`,
      })
      .from(refundRequests)
      .innerJoin(orders, eq(refundRequests.orderId, orders.id))
      .where(
        sql`${refundRequests.status} in ('refunded','approved','processing')`
      )
      .groupBy(orders.productId);

    const progressRows = await database
      .select({
        productId: products.id,
        learners: sql<number>`count(distinct ${lessonProgress.userId})`,
        completed: sql<number>`sum(case when ${lessonProgress.isCompleted} then 1 else 0 end)`,
        touches: sql<number>`count(*)`,
      })
      .from(lessonProgress)
      .innerJoin(courseLessons, eq(lessonProgress.lessonId, courseLessons.id))
      .innerJoin(courseModules, eq(courseLessons.moduleId, courseModules.id))
      .innerJoin(courses, eq(courseModules.courseId, courses.id))
      .innerJoin(products, eq(courses.productId, products.id))
      .groupBy(products.id);

    const recentSalesMap = new Map(
      recentSalesRows.map((r) => [
        r.productId,
        { count: Number(r.count) || 0, revenue: Number(r.revenue) || 0 },
      ])
    );
    const priorSalesMap = new Map(
      priorSalesRows.map((r) => [r.productId, Number(r.count) || 0])
    );
    const allSalesMap = new Map(
      allSalesRows.map((r) => [
        r.productId,
        { count: Number(r.count) || 0, revenue: Number(r.revenue) || 0 },
      ])
    );
    const recentViewsMap = new Map(
      recentViewsRows
        .filter((r) => r.slug)
        .map((r) => [r.slug!, Number(r.count) || 0])
    );
    const priorViewsMap = new Map(
      priorViewsRows
        .filter((r) => r.slug)
        .map((r) => [r.slug!, Number(r.count) || 0])
    );
    const refundMap = new Map(
      refundRows.map((r) => [r.productId, Number(r.count) || 0])
    );
    const progressMap = new Map(
      progressRows.map((r) => [
        r.productId,
        {
          learners: Number(r.learners) || 0,
          completed: Number(r.completed) || 0,
          touches: Number(r.touches) || 0,
        },
      ])
    );

    const signals: IntelligenceRawProductSignal[] = allProducts
      .filter((p) => p.isActive)
      .map((p) => {
        const m = metaBySlug.get(p.slug);
        const sales = allSalesMap.get(p.id)?.count ?? soldMap.get(p.slug) ?? 0;
        const revenue =
          allSalesMap.get(p.id)?.revenue ??
          Math.round(Number(p.price || 0) * sales);
        const views = viewMap.get(p.slug) ?? 0;
        const favorites = favMap.get(p.slug) ?? 0;
        const refunds = refundMap.get(p.id) ?? 0;
        const prog = progressMap.get(p.id) || {
          learners: 0,
          completed: 0,
          touches: 0,
        };
        const avgProgress =
          prog.touches > 0
            ? Math.min(100, Math.round((prog.completed / prog.touches) * 100))
            : 0;
        const completionRate = avgProgress;
        const abandonmentRate = Math.max(0, 100 - avgProgress);
        const retentionProxy =
          prog.learners > 0
            ? Math.min(100, Math.round(avgProgress * 0.9 + 10))
            : 0;

        return {
          productId: p.id,
          slug: p.slug,
          name: p.name,
          category: m?.category || p.category?.name || null,
          author: m?.author || null,
          views,
          recentViews: recentViewsMap.get(p.slug) ?? 0,
          priorViews: priorViewsMap.get(p.slug) ?? 0,
          sales,
          recentSales: recentSalesMap.get(p.id)?.count ?? 0,
          priorSales: priorSalesMap.get(p.id) ?? 0,
          favorites,
          refunds,
          revenueCents: Math.round(Number(revenue) || 0),
          learners: prog.learners,
          avgProgress,
          completionRate,
          abandonmentRate,
          retentionProxy,
        };
      });

    return {
      products: signals,
      persistence: insights.persistence === "db" ? "db" : "partial",
      windowRecentDays: recentDays,
      windowPriorDays: priorDays,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(
      "[ContentFy Intelligence] snapshot failed:",
      error instanceof Error ? error.message : error
    );
    const allProducts = await db.getAllProducts().catch(() => []);
    return {
      products: (allProducts || [])
        .filter((p) => p.isActive)
        .map((p) => ({
          productId: p.id,
          slug: p.slug,
          name: p.name,
          category: p.category?.name || null,
          author: null,
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
        })),
      persistence: "memory",
      windowRecentDays: recentDays,
      windowPriorDays: priorDays,
      generatedAt: new Date().toISOString(),
    };
  }
}
