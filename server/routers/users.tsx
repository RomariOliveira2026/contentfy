import { router, protectedProcedure } from "../_core/trpc";
import * as db from "../db";

export const usersRouter = router({
  list: protectedProcedure.query(async () => {
    return await db.getAllUsers();
  }),
});
