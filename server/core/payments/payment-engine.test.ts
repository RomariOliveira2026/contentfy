import { describe, expect, it } from "vitest";
import { PaymentEngine } from "./payment-engine";

describe("ContentFy Pay", () => {
  it("exposes ContentFy payment label while using Stripe provider", () => {
    const engine = new PaymentEngine();
    expect(engine.getDisplayName()).toBe("Pagamento ContentFy");
    expect(engine.getActiveProvider().id).toBe("stripe");
  });
});
