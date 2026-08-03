import { MemoryRateLimitProvider } from "./memory-provider";
import { RedisRateLimitProvider } from "./redis-provider.stub";
import type { RateLimitProvider } from "./types";

export type { RateLimitProvider, RateLimitResult } from "./types";
export { MemoryRateLimitProvider } from "./memory-provider";

let singleton: RateLimitProvider | null = null;

/**
 * Resolve rate-limit provider.
 * - memory: default / development (not durable)
 * - redis: requires REDIS_URL + real implementation (throws until wired)
 */
export function getRateLimitProvider(): RateLimitProvider {
  if (singleton) return singleton;

  const mode = (process.env.RATE_LIMIT_PROVIDER || "memory").toLowerCase();
  if (mode === "redis") {
    const url = process.env.REDIS_URL || "";
    singleton = new RedisRateLimitProvider(url);
  } else {
    if (process.env.NODE_ENV === "production" && process.env.VERCEL) {
      console.warn(
        "[ContentFy Protect] RATE_LIMIT_PROVIDER=memory em ambiente multi-instância — não é durável. Configure Redis para produção."
      );
    }
    singleton = new MemoryRateLimitProvider();
  }
  return singleton;
}

export async function assertRateLimitOrThrow(
  key: string,
  limit: number,
  windowMs: number,
  message: string
) {
  const provider = getRateLimitProvider();
  const result = await provider.hit(key, limit, windowMs);
  if (!result.allowed) {
    const err = new Error(message) as Error & { code: string; retryAfterMs?: number };
    err.code = "RATE_LIMITED";
    err.retryAfterMs = result.retryAfterMs;
    throw err;
  }
  return result;
}
