import { afterEach, describe, expect, it } from "vitest";
import { assertStripeSecretForProtect } from "./stripe-refund";

describe("assertStripeSecretForProtect", () => {
  const prev = { ...process.env };

  afterEach(() => {
    process.env = { ...prev };
  });

  it("blocks live keys when homologation requires test key", () => {
    process.env.STRIPE_SECRET_KEY = "sk_live_fake";
    process.env.CONTENTFY_PROTECT_HOMOLOGATION = "true";
    process.env.NODE_ENV = "production";
    const result = assertStripeSecretForProtect({ requireTestKey: true });
    expect(result.ok).toBe(false);
  });

  it("accepts sk_test keys in homologation", () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_fake";
    process.env.CONTENTFY_PROTECT_HOMOLOGATION = "true";
    const result = assertStripeSecretForProtect({ requireTestKey: true });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.secret.startsWith("sk_test_")).toBe(true);
  });

  it("fails when secret missing", () => {
    delete process.env.STRIPE_SECRET_KEY;
    const result = assertStripeSecretForProtect({ requireTestKey: true });
    expect(result.ok).toBe(false);
  });
});
