/**
 * ContentFy Learn persistence — active goal preference.
 * Additive tables (0013). Memory fallback when migration absent.
 */

import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { learnUserGoals } from "../drizzle/schema";
import { learnCacheInvalidate } from "./core/learn/cache";

const memoryGoals = new Map<number, string>();
let warned = false;

function warnOnce() {
  if (warned) return;
  warned = true;
  console.warn(
    "[ContentFy Learn] Preferência de objetivo em memória (migration 0013 ausente). Não é durável."
  );
}

export async function getActiveGoalId(
  userId: number
): Promise<string | null> {
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    const rows = await db
      .select()
      .from(learnUserGoals)
      .where(eq(learnUserGoals.userId, userId))
      .limit(1);
    return rows[0]?.goalId ?? null;
  } catch {
    warnOnce();
    return memoryGoals.get(userId) ?? null;
  }
}

export async function setActiveGoalId(
  userId: number,
  goalId: string
): Promise<{ ok: true; persisted: "db" | "memory" }> {
  learnCacheInvalidate(`learn:dashboard:${userId}`);
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    await db
      .insert(learnUserGoals)
      .values({ userId, goalId })
      .onDuplicateKeyUpdate({ set: { goalId } });
    return { ok: true, persisted: "db" };
  } catch {
    warnOnce();
    memoryGoals.set(userId, goalId);
    return { ok: true, persisted: "memory" };
  }
}
