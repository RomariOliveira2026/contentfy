import { router, adminProcedure } from "../_core/trpc";
import * as db from "../db";

export const usersRouter = router({
  /** Admin-only customer list. */
  list: adminProcedure.query(async () => {
    return await db.getAllUsers();
  }),
});
