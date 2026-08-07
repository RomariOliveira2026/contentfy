import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import {
  contentFyOrchestrator,
  eventRegistry,
} from "../core/orchestrator";
import type { OrchestratorEventName } from "@shared/contentfy";

const eventNameSchema = z.enum([
  "PRODUCT_PURCHASED",
  "COURSE_STARTED",
  "COURSE_COMPLETED",
  "LESSON_COMPLETED",
  "PRODUCT_REFUNDED",
  "REFUND_APPROVED",
  "DISCOVERY_CLICKED",
  "GOAL_UPDATED",
  "ACHIEVEMENT_UNLOCKED",
  "PRODUCT_FAVORITED",
  "RECOMMENDATION_CLICKED",
  "CREATOR_PRODUCT_CREATED",
  "PRODUCT_PUBLISHED",
  "CATEGORY_GROWING",
  "PRODUCT_TRENDING",
  "SUCCESS_SCORE_CHANGED",
]);

export const orchestratorRouter = router({
  dashboard: adminProcedure.query(() => contentFyOrchestrator.dashboard()),

  registry: adminProcedure.query(() => eventRegistry.list()),

  emit: adminProcedure
    .input(
      z.object({
        name: eventNameSchema,
        payload: z
          .object({
            userId: z.number().int().positive().optional(),
            productId: z.number().int().positive().optional(),
            productSlug: z.string().max(255).optional(),
            lessonId: z.number().int().positive().optional(),
            orderId: z.number().int().positive().optional(),
            goalId: z.string().max(64).optional(),
            category: z.string().max(128).optional(),
            meta: z
              .record(
                z.string().max(64),
                z.union([z.string().max(120), z.number(), z.boolean(), z.null()])
              )
              .optional(),
          })
          .optional(),
        sync: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await contentFyOrchestrator.emit({
        name: input.name as OrchestratorEventName,
        payload: input.payload || {},
        source: "admin",
        sync: input.sync ?? true,
      });
      return {
        eventId: result.event.id,
        runs: result.runs.map((r) => ({
          id: r.id,
          workflowId: r.workflowId,
          status: r.status,
          totalLatencyMs: r.totalLatencyMs,
          steps: r.steps.length,
        })),
      };
    }),

  drain: adminProcedure.mutation(async () => {
    await contentFyOrchestrator.drain(50);
    return contentFyOrchestrator.dashboard();
  }),
});
