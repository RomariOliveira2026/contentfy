import {
  adminProcedure,
  protectedProcedure,
  router,
} from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { intelligenceEngine } from "../core/intelligence";

/**
 * ContentFy Intelligence — admin sees all; creator sees scoped/proxy;
 * students must not access.
 */
export const intelligenceRouter = router({
  adminDashboard: adminProcedure.query(async () => {
    return intelligenceEngine.buildAdminDashboard();
  }),

  creatorDashboard: protectedProcedure.query(async ({ ctx }) => {
    // Block pure student surface: require admin or creator-area convention.
    // Until role=creator exists, allow authenticated users into creator area
    // (same as success.creatorAnalytics) but never expose admin aggregates here.
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return intelligenceEngine.buildCreatorDashboard({
      userName: ctx.user.name ?? null,
    });
  }),

  /** Lightweight health for admin widgets */
  marketplaceHealth: adminProcedure.query(async () => {
    const dash = await intelligenceEngine.buildAdminDashboard();
    return dash.health;
  }),
});
