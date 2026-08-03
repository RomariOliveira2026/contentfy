import type { RateLimitProvider, RateLimitResult } from "./types";

/** Dev/single-instance only — NOT durable across restarts or replicas. */
export class MemoryRateLimitProvider implements RateLimitProvider {
  readonly name = "memory";
  readonly durable = false;
  private hits = new Map<string, number[]>();

  async hit(
    key: string,
    limit: number,
    windowMs: number
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const stamps = (this.hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (stamps.length >= limit) {
      const oldest = stamps[0] ?? now;
      this.hits.set(key, stamps);
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: Math.max(0, windowMs - (now - oldest)),
      };
    }
    stamps.push(now);
    this.hits.set(key, stamps);
    return { allowed: true, remaining: Math.max(0, limit - stamps.length) };
  }
}
