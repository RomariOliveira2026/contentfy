import { CONTENTFY_IDENTITY } from "@shared/contentfy";
import type {
  PaymentIntentRequest,
  PaymentIntentResult,
  PaymentProvider,
  PaymentProviderId,
  RefundRequest,
  RefundResult,
  SplitRule,
} from "@shared/contentfy";
import { StripePaymentProvider } from "./providers/stripe-provider";

/**
 * ContentFy Pay — Payment Engine
 * Active provider: Stripe (unchanged runtime).
 * Frontend must always show CONTENTFY_IDENTITY.paymentLabel.
 */
export class PaymentEngine {
  private providers = new Map<PaymentProviderId, PaymentProvider>();
  private active: PaymentProviderId = "stripe";

  constructor() {
    this.register(new StripePaymentProvider());
  }

  register(provider: PaymentProvider) {
    this.providers.set(provider.id, provider);
  }

  setActive(id: PaymentProviderId) {
    if (!this.providers.has(id)) {
      throw new Error(`Payment provider not registered: ${id}`);
    }
    this.active = id;
  }

  getActiveProvider(): PaymentProvider {
    const provider = this.providers.get(this.active);
    if (!provider) throw new Error("No active payment provider");
    return provider;
  }

  getDisplayName() {
    return CONTENTFY_IDENTITY.paymentLabel;
  }

  createIntent(req: PaymentIntentRequest): Promise<PaymentIntentResult> {
    return this.getActiveProvider().createIntent(req);
  }

  refund(req: RefundRequest): Promise<RefundResult> {
    return this.getActiveProvider().refund(req);
  }

  /** Split / wallet seams — planned, not wired to production yet. */
  planSplit(_rules: SplitRule[]) {
    return { status: "planned" as const, engine: "contentfy-pay-split" };
  }
}

export const paymentEngine = new PaymentEngine();
