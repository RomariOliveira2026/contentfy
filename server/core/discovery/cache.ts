/**
 * Lightweight TTL cache for Discovery rails.
 * Process-local — fine for single instance / Vercel warm lambdas.
 * Does not pretend to be a distributed cache.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export function discoveryCacheGet<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value as T;
}

export function discoveryCacheSet<T>(
  key: string,
  value: T,
  ttlMs = 60_000
): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function discoveryCacheInvalidate(prefix?: string): void {
  if (!prefix) {
    store.clear();
    return;
  }
  for (const key of Array.from(store.keys())) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}
