import { router, protectedProcedure } from "../_core/trpc";
import * as db from "../db";
import { z } from "zod";

export const ordersRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await db.getAllOrders();
  }),
  
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await db.getOrderById(input.id);
    }),
});
