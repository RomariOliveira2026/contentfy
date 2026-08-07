/**
 * ContentFy Experience persistence (XIII.1).
 * DB is source of truth when migration 0014 is applied.
 * Memory fallback ONLY outside production (clearly logged once).
 */

import { and, desc, eq, gte, sql } from "drizzle-orm";
import type {
  ExperienceActivityEventType,
  ExperienceActivitySummary,
  ExperienceAnalyticsEvent,
  ExperienceOnboardingInput,
  ExperienceOnboardingState,
} from "@shared/contentfy";
import { getDb } from "./db";
import {
  experienceActivityDaily,
  experienceActivityEvents,
  experienceDismissedRecommendations,
  experienceOnboarding,
  experienceTelemetryEvents,
} from "../drizzle/schema";
import { isDevMemoryFallbackAllowed } from "./core/experience/config";
import {
  dayKey,
  daysBetween,
  sanitizeExperienceMeta,
} from "./core/experience/sanitize";
import { experienceCacheInvalidate } from "./core/experience/cache";

const memoryOnboarding = new Map<number, ExperienceOnboardingState>();
const memoryDismissed = new Map<number, Set<string>>();
const memoryActivityDays = new Map<number, Map<string, number>>();
const memoryActivityLast = new Map<
  number,
  { at: string; type: ExperienceActivityEventType }
>();
const memoryTelemetry: Array<{
  userId: number;
  event: ExperienceAnalyticsEvent;
  meta?: Record<string, unknown>;
  at: string;
}> = [];

let warnedMemory = false;

function warnMemory(reason: string) {
  if (warnedMemory) return;
  warnedMemory = true;
  const env = process.env.NODE_ENV || "development";
  console.warn(
    `[ContentFy Experience] Fallback em memória (${env}): ${reason}. Migration 0014 necessária para persistência. Não usar como fonte de verdade em produção.`
  );
}

function allowMemory(): boolean {
  if (!isDevMemoryFallbackAllowed()) return false;
  return true;
}

function toState(
  row: {
    primaryGoalId: string | null;
    improveFirst: string | null;
    weeklyHours: string | null;
    preferencesJson: string | null;
    completedAt: Date | null;
    updatedAt: Date;
  },
  persisted: "db" | "memory"
): ExperienceOnboardingState {
  let preferences: ExperienceOnboardingState["preferences"] = null;
  if (row.preferencesJson) {
    try {
      preferences = JSON.parse(row.preferencesJson) as NonNullable<
        ExperienceOnboardingState["preferences"]
      >;
    } catch {
      preferences = null;
    }
  }
  const weekly =
    row.weeklyHours != null && row.weeklyHours !== ""
      ? Number(row.weeklyHours)
      : null;
  return {
    completed: Boolean(row.completedAt),
    primaryGoalId: row.primaryGoalId,
    improveFirst: row.improveFirst,
    weeklyHours: Number.isFinite(weekly as number) ? weekly : null,
    preferences,
    completedAt: row.completedAt ? row.completedAt.toISOString() : null,
    updatedAt: row.updatedAt.toISOString(),
    persisted,
  };
}

export async function getOnboarding(
  userId: number
): Promise<ExperienceOnboardingState | null> {
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    const rows = await db
      .select()
      .from(experienceOnboarding)
      .where(eq(experienceOnboarding.userId, userId))
      .limit(1);
    if (!rows[0]) return null;
    return toState(rows[0], "db");
  } catch {
    if (!allowMemory()) {
      console.error(
        "[ContentFy Experience] Onboarding DB indisponível em produção — retornando null."
      );
      return null;
    }
    warnMemory("onboarding get");
    return memoryOnboarding.get(userId) ?? null;
  }
}

export async function saveOnboarding(
  userId: number,
  input: ExperienceOnboardingInput
): Promise<ExperienceOnboardingState> {
  experienceCacheInvalidate(`experience:home:${userId}`);
  const prefs = input.preferences
    ? sanitizeExperienceMeta(input.preferences)
    : null;
  const now = new Date();
  const improveFirst = input.improveFirst?.trim().slice(0, 200) || null;
  const primaryGoalId = input.primaryGoalId?.slice(0, 64) || null;
  const weeklyHours =
    input.weeklyHours != null
      ? Math.min(40, Math.max(0.5, Number(input.weeklyHours)))
      : null;

  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    const existing = await db
      .select()
      .from(experienceOnboarding)
      .where(eq(experienceOnboarding.userId, userId))
      .limit(1);

    const completedAt = existing[0]?.completedAt ?? now;
    const values = {
      userId,
      primaryGoalId,
      improveFirst,
      weeklyHours: weeklyHours != null ? String(weeklyHours) : null,
      preferencesJson: prefs ? JSON.stringify(prefs) : null,
      completedAt,
      updatedAt: now,
    };

    if (existing[0]) {
      await db
        .update(experienceOnboarding)
        .set({
          primaryGoalId: values.primaryGoalId,
          improveFirst: values.improveFirst,
          weeklyHours: values.weeklyHours,
          preferencesJson: values.preferencesJson,
          completedAt: values.completedAt,
          updatedAt: now,
        })
        .where(eq(experienceOnboarding.userId, userId));
    } else {
      await db.insert(experienceOnboarding).values(values);
    }

    return {
      completed: true,
      primaryGoalId,
      improveFirst,
      weeklyHours,
      preferences: prefs,
      completedAt: completedAt.toISOString(),
      updatedAt: now.toISOString(),
      persisted: "db",
    };
  } catch {
    if (!allowMemory()) {
      throw new Error("Experience onboarding persistence unavailable");
    }
    warnMemory("onboarding save");
    const state: ExperienceOnboardingState = {
      completed: true,
      primaryGoalId,
      improveFirst,
      weeklyHours,
      preferences: prefs,
      completedAt:
        memoryOnboarding.get(userId)?.completedAt || now.toISOString(),
      updatedAt: now.toISOString(),
      persisted: "memory",
    };
    memoryOnboarding.set(userId, state);
    return state;
  }
}

export async function dismissRecommendation(
  userId: number,
  recommendationId: string
): Promise<void> {
  const id = recommendationId.slice(0, 128);
  experienceCacheInvalidate(`experience:home:${userId}`);
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    await db
      .insert(experienceDismissedRecommendations)
      .values({ userId, recommendationId: id })
      .onDuplicateKeyUpdate({ set: { recommendationId: id } });
  } catch {
    if (!allowMemory()) return;
    warnMemory("dismiss");
    const set = memoryDismissed.get(userId) || new Set<string>();
    set.add(id);
    memoryDismissed.set(userId, set);
  }
}

export async function isRecommendationDismissed(
  userId: number,
  recommendationId: string
): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    const rows = await db
      .select()
      .from(experienceDismissedRecommendations)
      .where(
        and(
          eq(experienceDismissedRecommendations.userId, userId),
          eq(
            experienceDismissedRecommendations.recommendationId,
            recommendationId
          )
        )
      )
      .limit(1);
    return rows.length > 0;
  } catch {
    if (!allowMemory()) return false;
    return memoryDismissed.get(userId)?.has(recommendationId) ?? false;
  }
}

export async function listDismissedRecommendationIds(
  userId: number
): Promise<string[]> {
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    const rows = await db
      .select({
        id: experienceDismissedRecommendations.recommendationId,
      })
      .from(experienceDismissedRecommendations)
      .where(eq(experienceDismissedRecommendations.userId, userId));
    return rows.map((r: { id: string }) => r.id);
  } catch {
    if (!allowMemory()) return [];
    return Array.from(memoryDismissed.get(userId) || []);
  }
}

export async function recordActivityEvent(input: {
  userId: number;
  eventType: ExperienceActivityEventType;
  productId?: number | null;
  productSlug?: string | null;
  lessonId?: number | null;
  meta?: Record<string, unknown>;
}): Promise<{ persisted: "db" | "memory" }> {
  const meta = sanitizeExperienceMeta(input.meta);
  const day = dayKey();
  const now = new Date();

  // Invalidate experience after meaningful learning activity
  if (
    input.eventType === "lesson_completed" ||
    input.eventType === "goal_updated" ||
    input.eventType === "lesson_started"
  ) {
    experienceCacheInvalidate(`experience:home:${input.userId}`);
  }

  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    await db.insert(experienceActivityEvents).values({
      userId: input.userId,
      eventType: input.eventType,
      productId: input.productId ?? null,
      productSlug: input.productSlug?.slice(0, 255) ?? null,
      lessonId: input.lessonId ?? null,
      metaJson: Object.keys(meta).length ? JSON.stringify(meta) : null,
      createdAt: now,
    });

    const existing = await db
      .select()
      .from(experienceActivityDaily)
      .where(
        and(
          eq(experienceActivityDaily.userId, input.userId),
          eq(experienceActivityDaily.day, day)
        )
      )
      .limit(1);

    if (existing[0]) {
      await db
        .update(experienceActivityDaily)
        .set({
          eventCount: existing[0].eventCount + 1,
          lastEventType: input.eventType,
          updatedAt: now,
        })
        .where(eq(experienceActivityDaily.id, existing[0].id));
    } else {
      await db.insert(experienceActivityDaily).values({
        userId: input.userId,
        day,
        eventCount: 1,
        lastEventType: input.eventType,
        createdAt: now,
        updatedAt: now,
      });
    }
    return { persisted: "db" };
  } catch {
    if (!allowMemory()) {
      console.error(
        "[ContentFy Experience] activity persist failed (production)"
      );
      return { persisted: "memory" };
    }
    warnMemory("activity");
    const days = memoryActivityDays.get(input.userId) || new Map();
    days.set(day, (days.get(day) || 0) + 1);
    memoryActivityDays.set(input.userId, days);
    memoryActivityLast.set(input.userId, {
      at: now.toISOString(),
      type: input.eventType,
    });
    return { persisted: "memory" };
  }
}

export async function getActivitySummary(
  userId: number,
  opts?: { recentWindowDays?: number; now?: Date }
): Promise<ExperienceActivitySummary> {
  const now = opts?.now || new Date();
  const today = dayKey(now);
  const window = opts?.recentWindowDays ?? 30;
  const windowStart = new Date(now.getTime() - window * 86_400_000);
  const windowStartKey = dayKey(windowStart);

  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    const days = await db
      .select()
      .from(experienceActivityDaily)
      .where(
        and(
          eq(experienceActivityDaily.userId, userId),
          gte(experienceActivityDaily.day, windowStartKey)
        )
      )
      .orderBy(desc(experienceActivityDaily.day));

    const last = await db
      .select()
      .from(experienceActivityEvents)
      .where(eq(experienceActivityEvents.userId, userId))
      .orderBy(desc(experienceActivityEvents.createdAt))
      .limit(1);

    return buildSummaryFromDays(
      days.map((d: { day: string }) => d.day),
      last[0]?.createdAt?.toISOString() ?? null,
      today
    );
  } catch {
    if (!allowMemory()) {
      return emptySummary();
    }
    const map = memoryActivityDays.get(userId);
    const days = map
      ? Array.from(map.keys()).filter((d) => d >= windowStartKey).sort().reverse()
      : [];
    const lastAt = memoryActivityLast.get(userId)?.at ?? null;
    return buildSummaryFromDays(days, lastAt, today);
  }
}

function emptySummary(): ExperienceActivitySummary {
  return {
    lastActiveDay: null,
    lastActiveAt: null,
    recentActiveDays: 0,
    streakDays: 0,
    inactiveDays: null,
    hasPriorActivity: false,
    isReturning: false,
  };
}

/** Pure helper — exported for tests. */
export function buildSummaryFromDays(
  activeDaysDesc: string[],
  lastActiveAt: string | null,
  today: string
): ExperienceActivitySummary {
  const unique = Array.from(new Set(activeDaysDesc)).sort().reverse();
  if (!unique.length) return emptySummary();

  const lastActiveDay = unique[0];
  const inactiveDays = daysBetween(lastActiveDay, today);
  let streak = 0;
  let cursor = today;
  // Streak counts consecutive days ending today or yesterday
  const set = new Set(unique);
  if (!set.has(today)) {
    const yesterday = dayKey(new Date(Date.parse(`${today}T00:00:00.000Z`) - 86_400_000));
    if (set.has(yesterday)) cursor = yesterday;
    else {
      return {
        lastActiveDay,
        lastActiveAt,
        recentActiveDays: unique.length,
        streakDays: 0,
        inactiveDays,
        hasPriorActivity: true,
        isReturning: inactiveDays >= 1,
      };
    }
  }
  while (set.has(cursor)) {
    streak += 1;
    cursor = dayKey(new Date(Date.parse(`${cursor}T00:00:00.000Z`) - 86_400_000));
  }

  return {
    lastActiveDay,
    lastActiveAt,
    recentActiveDays: unique.length,
    streakDays: streak,
    inactiveDays,
    hasPriorActivity: true,
    isReturning: inactiveDays >= 1,
  };
}

export async function trackTelemetry(
  userId: number,
  event: ExperienceAnalyticsEvent,
  meta?: Record<string, unknown>
): Promise<{ persisted: "db" | "memory" }> {
  const clean = sanitizeExperienceMeta(meta);
  const at = new Date();
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    await db.insert(experienceTelemetryEvents).values({
      userId,
      eventName: event.slice(0, 64),
      metaJson: Object.keys(clean).length ? JSON.stringify(clean) : null,
      createdAt: at,
    });
    return { persisted: "db" };
  } catch {
    if (!allowMemory()) {
      console.error("[ContentFy Experience] telemetry persist failed");
      return { persisted: "memory" };
    }
    warnMemory("telemetry");
    memoryTelemetry.push({
      userId,
      event,
      meta: clean,
      at: at.toISOString(),
    });
    if (memoryTelemetry.length > 500) memoryTelemetry.splice(0, 100);
    return { persisted: "memory" };
  }
}

export async function recentTelemetry(userId: number, limit = 50) {
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    return db
      .select()
      .from(experienceTelemetryEvents)
      .where(eq(experienceTelemetryEvents.userId, userId))
      .orderBy(desc(experienceTelemetryEvents.createdAt))
      .limit(limit);
  } catch {
    return memoryTelemetry
      .filter((e) => e.userId === userId)
      .slice(-limit)
      .reverse();
  }
}

/** Test helper — clear memory stores. */
export function __resetExperienceMemoryForTests() {
  memoryOnboarding.clear();
  memoryDismissed.clear();
  memoryActivityDays.clear();
  memoryActivityLast.clear();
  memoryTelemetry.length = 0;
  warnedMemory = false;
}

// silence unused sql import if drizzle needs it later
void sql;
