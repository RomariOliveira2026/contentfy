import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { experienceOrchestrator } from "../core/experience";
import { experienceAnalytics } from "../core/experience/analytics";
import { LEARN_GOALS } from "../core/learn";
import * as experienceStore from "../experience-store";

export const experienceRouter = router({
  home: protectedProcedure.query(async ({ ctx }) => {
    return experienceOrchestrator.buildHome(
      ctx.user.id,
      ctx.user.name ?? null
    );
  }),

  context: protectedProcedure.query(async ({ ctx }) => {
    return experienceOrchestrator.buildContext(
      ctx.user.id,
      ctx.user.name ?? null
    );
  }),

  nextBestAction: protectedProcedure.query(async ({ ctx }) => {
    return experienceOrchestrator.nextBestAction(
      ctx.user.id,
      ctx.user.name ?? null
    );
  }),

  journeySummary: protectedProcedure.query(async ({ ctx }) => {
    return experienceOrchestrator.journeySummary(
      ctx.user.id,
      ctx.user.name ?? null
    );
  }),

  achievements: protectedProcedure.query(async ({ ctx }) => {
    const payload = await experienceOrchestrator.achievements(ctx.user.id);
    experienceAnalytics.track(ctx.user.id, "experience.achievement_viewed", {
      unlocked: payload.unlocked.length,
    });
    return payload;
  }),

  activitySummary: protectedProcedure.query(async ({ ctx }) => {
    return experienceStore.getActivitySummary(ctx.user.id);
  }),

  onboarding: protectedProcedure.query(async ({ ctx }) => {
    const state = await experienceOrchestrator.getOnboarding(ctx.user.id);
    return {
      state,
      goals: LEARN_GOALS.map((g) => ({
        id: g.id,
        name: g.name,
        description: g.description,
      })),
      persistence: state.persisted,
      note:
        state.persisted === "db"
          ? "Preferências persistidas no banco (migration 0014)."
          : "Fallback em memória (somente desenvolvimento / migration ausente). Não é fonte de verdade em produção.",
    };
  }),

  saveOnboarding: protectedProcedure
    .input(
      z.object({
        primaryGoalId: z.string().min(1).max(64).optional(),
        improveFirst: z.string().min(1).max(200).optional(),
        weeklyHours: z.number().min(0.5).max(40).optional(),
        preferences: z
          .record(
            z.string().max(64),
            z.union([z.string().max(200), z.number(), z.boolean(), z.null()])
          )
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return experienceOrchestrator.saveOnboarding(ctx.user.id, input);
    }),

  dismissRecommendation: protectedProcedure
    .input(z.object({ recommendationId: z.string().min(1).max(128) }))
    .mutation(async ({ ctx, input }) => {
      return experienceOrchestrator.dismissRecommendation(
        ctx.user.id,
        input.recommendationId
      );
    }),

  markActionSeen: protectedProcedure
    .input(z.object({ actionKind: z.string().min(1).max(64) }))
    .mutation(async ({ ctx, input }) => {
      return experienceOrchestrator.markActionSeen(
        ctx.user.id,
        input.actionKind
      );
    }),

  track: protectedProcedure
    .input(
      z.object({
        event: z.enum([
          "experience.home_viewed",
          "experience.next_action_clicked",
          "experience.goal_selected",
          "experience.recommendation_clicked",
          "experience.section_viewed",
          "experience.onboarding_completed",
          "experience.continue_learning_clicked",
          "experience.achievement_viewed",
        ]),
        meta: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await experienceAnalytics.trackAsync(
        ctx.user.id,
        input.event,
        input.meta
      );
      if (input.event === "experience.recommendation_clicked") {
        const slug =
          typeof input.meta?.productSlug === "string"
            ? input.meta.productSlug
            : null;
        void experienceStore.recordActivityEvent({
          userId: ctx.user.id,
          eventType: "recommendation_clicked",
          productSlug: slug,
        });
        const { emitOrchestratorEvent } = await import("../core/orchestrator");
        emitOrchestratorEvent(
          "RECOMMENDATION_CLICKED",
          { userId: ctx.user.id, productSlug: slug },
          "experience"
        );
      }
      return { ok: true as const };
    }),
});
