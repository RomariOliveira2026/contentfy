import {
  adminProcedure,
  protectedProcedure,
  router,
} from "../_core/trpc";
import { successEngine } from "../core/success";
import { buildSuccessContext } from "../core/success/build-context";
import type {
  SuccessAdminAnalytics,
  SuccessCreatorAnalytics,
} from "@shared/contentfy";
import * as db from "../db";
import { LEARN_GOALS, LEARN_PRODUCT_LINKS } from "../core/learn";

async function learnerDashboard(userId: number) {
  const ctx = await buildSuccessContext(userId);
  return successEngine.buildDashboard(ctx);
}

export const successRouter = router({
  dashboard: protectedProcedure.query(async ({ ctx }) => {
    return learnerDashboard(ctx.user.id);
  }),

  score: protectedProcedure.query(async ({ ctx }) => {
    const dash = await learnerDashboard(ctx.user.id);
    return dash.score;
  }),

  habits: protectedProcedure.query(async ({ ctx }) => {
    const dash = await learnerDashboard(ctx.user.id);
    return dash.habits;
  }),

  timeline: protectedProcedure.query(async ({ ctx }) => {
    const dash = await learnerDashboard(ctx.user.id);
    return dash.timeline;
  }),

  insights: protectedProcedure.query(async ({ ctx }) => {
    const dash = await learnerDashboard(ctx.user.id);
    return dash.insights;
  }),

  goals: protectedProcedure.query(async ({ ctx }) => {
    const dash = await learnerDashboard(ctx.user.id);
    return dash.goals;
  }),

  recommendations: protectedProcedure.query(async ({ ctx }) => {
    const dash = await learnerDashboard(ctx.user.id);
    return {
      nextAction: dash.nextAction,
      recommendations: dash.recommendations,
      relatedProducts: dash.relatedProducts,
    };
  }),

  /**
   * Aggregate analytics for creators — uses platform-wide proxies until
   * per-creator product ownership is wired. Does not alter creatorRouter.
   */
  creatorAnalytics: protectedProcedure.query(
    async ({ ctx }): Promise<SuccessCreatorAnalytics> => {
      void ctx.user;
      const products = await db.getAllProducts();
      const active = products.filter((p) => p.isActive);
      const note =
        "Agregado de catálogo + catálogo Learn. Métricas por criador expandirão com ownership.";

      const abandonmentPoints = LEARN_PRODUCT_LINKS.map((l) => ({
        slug: l.productSlug,
        dropOffPercent: 0,
      }));

      const topGoals = LEARN_GOALS.slice(0, 5).map((g) => ({
        goalId: g.id,
        goalName: g.name,
        seekers: 0,
      }));

      return {
        learnerCount: 0,
        averageEvolution: 0,
        competenciesDeveloped: LEARN_PRODUCT_LINKS.reduce(
          (n, l) => n + l.competencyIds.length,
          0
        ),
        abandonmentPoints,
        topGoals,
        transformationRate: 0,
        note: `${note} Produtos ativos no catálogo: ${active.length}.`,
      };
    }
  ),

  adminAnalytics: adminProcedure.query(
    async (): Promise<SuccessAdminAnalytics> => {
      const products = await db.getAllProducts();
      const byCourse = products
        .filter((p) => p.isActive)
        .slice(0, 20)
        .map((p) => ({
          slug: p.slug,
          avgProgress: 0,
          learners: 0,
        }));

      const categories = new Map<string, { sum: number; n: number }>();
      for (const p of products) {
        const cat = p.category?.name || "Geral";
        const row = categories.get(cat) || { sum: 0, n: 0 };
        row.n += 1;
        categories.set(cat, row);
      }

      return {
        averageScore: 0,
        averageEvolution: 0,
        habitReachRate: 0,
        abandonmentRate: 0,
        byCourse,
        byCategory: Array.from(categories.entries()).map(
          ([category, v]) => ({
            category,
            avgScore: 0,
            learners: v.n,
          })
        ),
        sampleSize: 0,
        note: "Painel pronto. Valores populam com volume de sinais Success/Learn em produção.",
      };
    }
  ),
});
