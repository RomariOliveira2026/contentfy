import { z } from "zod";
import { CONTENTFY_IDENTITY } from "@shared/contentfy";
import { publicProcedure, router } from "../_core/trpc";
import {
  CONTENTFY_CORE_STATUS,
  guaranteeEngine,
  paymentEngine,
  successScoreEngine,
} from "../core";

/**
 * ContentFy OS meta-router — read-only capabilities & policies.
 * Does not alter checkout, auth, LMS, or existing domain routers.
 */
export const contentfyRouter = router({
  identity: publicProcedure.query(() => CONTENTFY_IDENTITY),

  capabilities: publicProcedure.query(() => ({
    identity: CONTENTFY_IDENTITY,
    domains: CONTENTFY_CORE_STATUS,
    paymentDisplayName: paymentEngine.getDisplayName(),
    guarantee: guaranteeEngine.getPolicy(),
  })),

  guaranteePolicy: publicProcedure.query(() => guaranteeEngine.getPolicy()),

  previewSuccessScore: publicProcedure
    .input(
      z.object({
        videoProgress: z.number().min(0).max(1).default(0),
        activitiesCompleted: z.number().min(0).default(0),
        quizzesPassed: z.number().min(0).default(0),
        applicationTasks: z.number().min(0).default(0),
        consistencyDays: z.number().min(0).default(0),
        completionRate: z.number().min(0).max(1).default(0),
      })
    )
    .query(({ input }) => successScoreEngine.compute(input)),
});
