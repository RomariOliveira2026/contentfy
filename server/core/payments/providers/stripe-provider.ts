import { CONTENTFY_IDENTITY } from "@shared/contentfy";
import type {
  PaymentIntentRequest,
  PaymentIntentResult,
  PaymentProvider,
  RefundRequest,
  RefundResult,
} from "@shared/contentfy";

/**
 * Stripe adapter for ContentFy Pay.
 * Does NOT replace checkout.ts / stripe-webhook.ts — those remain the live path.
 * This provider is the abstraction seam for future gateway evolution.
 */
export class StripePaymentProvider implements PaymentProvider {
  readonly id = "stripe" as const;

  async createIntent(_req: PaymentIntentRequest): Promise<PaymentIntentResult> {
    return {
      provider: "stripe",
      displayName: CONTENTFY_IDENTITY.paymentLabel,
      status: "pending",
    };
  }

  async refund(_req: RefundRequest): Promise<RefundResult> {
    return {
      refundId: `cf_refund_pending_${Date.now()}`,
      status: "pending",
    };
  }
}
