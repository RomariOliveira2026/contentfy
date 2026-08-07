import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { productsRouter } from "./routers/products";
import { checkoutRouter } from "./routers/checkout";
import { membersRouter } from "./routers/members";
import { affiliatesRouter } from "./routers/affiliates";
import { certificatesRouter } from "./routers/certificates";
import { ordersRouter } from "./routers/orders";
import { usersRouter } from "./routers/users";
import { creatorRouter } from "./routers/creator";
import { contentfyRouter } from "./routers/contentfy";
import { protectRouter } from "./routers/protect";
import { discoveryRouter } from "./routers/discovery";
import { learnRouter } from "./routers/learn";
import { successRouter } from "./routers/success";
import { experienceRouter } from "./routers/experience";
import { intelligenceRouter } from "./routers/intelligence";
import { orchestratorRouter } from "./routers/orchestrator";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Contentfy Platform Routers
  products: productsRouter,
  checkout: checkoutRouter,
  members: membersRouter,
  affiliates: affiliatesRouter,
  certificates: certificatesRouter,
  orders: ordersRouter,
  users: usersRouter,
  creator: creatorRouter,

  // ContentFy OS — Evolution X (additive meta layer)
  contentfy: contentfyRouter,
  protect: protectRouter,
  discovery: discoveryRouter,
  learn: learnRouter,
  success: successRouter,
  experience: experienceRouter,
  intelligence: intelligenceRouter,
  orchestrator: orchestratorRouter,
});

export type AppRouter = typeof appRouter;
