import { learnCacheInvalidate } from "../learn/cache";
import { successCacheInvalidate } from "../success/cache";

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export function experienceCacheGet<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value as T;
}

export function experienceCacheSet<T>(
  key: string,
  value: T,
  ttlMs = 30_000
): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function experienceCacheInvalidate(prefix?: string): void {
  if (!prefix) {
    store.clear();
    return;
  }
  for (const key of Array.from(store.keys())) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}

/** Invalidate Experience + Learn/Success caches after critical learner actions. */
export function invalidateExperienceForUser(userId: number): void {
  experienceCacheInvalidate(`experience:home:${userId}`);
  learnCacheInvalidate(`learn:dashboard:${userId}`);
  successCacheInvalidate(`success:dashboard:${userId}`);
}
