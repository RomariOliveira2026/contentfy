import { describe, expect, it } from "vitest";
import { MemoryRateLimitProvider } from "./memory-provider";

describe("MemoryRateLimitProvider", () => {
  it("allows up to limit then blocks", async () => {
    const provider = new MemoryRateLimitProvider();
    expect(provider.durable).toBe(false);

    const a = await provider.hit("u:1", 2, 60_000);
    const b = await provider.hit("u:1", 2, 60_000);
    const c = await provider.hit("u:1", 2, 60_000);

    expect(a.allowed).toBe(true);
    expect(b.allowed).toBe(true);
    expect(c.allowed).toBe(false);
    expect(c.retryAfterMs).toBeGreaterThan(0);
  });
});
