/**
 * ContentFy rate-limit provider contract.
 *
 * Production: implement RedisRateLimitProvider (or similar durable store).
 * Development: MemoryRateLimitProvider (process-local, not shared across instances).
 *
 * Env:
 * - RATE_LIMIT_PROVIDER=memory|redis (default: memory)
 * - REDIS_URL=... (required when provider=redis)
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs?: number;
}

export interface RateLimitProvider {
  readonly name: string;
  /** Durable when true — safe for multi-instance production */
  readonly durable: boolean;
  hit(key: string, limit: number, windowMs: number): Promise<RateLimitResult>;
}
