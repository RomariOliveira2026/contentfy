import type { RateLimitProvider, RateLimitResult } from "./types";

/**
 * Stub — wire ioredis / @upstash/redis when REDIS_URL is available.
 * Do not pretend this persists without a real client.
 */
export class RedisRateLimitProvider implements RateLimitProvider {
  readonly name = "redis";
  readonly durable = true;

  constructor(private readonly redisUrl: string) {
    if (!redisUrl) {
      throw new Error("REDIS_URL required for RedisRateLimitProvider");
    }
  }

  async hit(
    _key: string,
    _limit: number,
    _windowMs: number
  ): Promise<RateLimitResult> {
    throw new Error(
      "RedisRateLimitProvider not implemented. Install a Redis client and complete server/core/rate-limit/redis-provider.stub.ts before enabling RATE_LIMIT_PROVIDER=redis."
    );
  }
}
