import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, adminProcedure } from "../_core/trpc";
import { canAccessOwnedResource } from "../_core/authz";
import * as db from "../db";
import { z } from "zod";

export const ordersRouter = router({
  /** Admin-only — never expose all orders to regular users. */
  list: adminProcedure.query(async () => {
    return await db.getAllOrders();
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const order = await db.getOrderById(input.id);
      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Pedido não encontrado" });
      }
      if (
        !canAccessOwnedResource({
          actorUserId: ctx.user.id,
          actorRole: ctx.user.role,
          ownerUserId: order.userId,
        })
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Você não tem permissão para acessar este pedido",
        });
      }
      return order;
    }),
});
