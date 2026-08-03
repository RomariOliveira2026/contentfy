/** ContentFy Pay — gateway abstraction (Stripe remains the active provider). */

export type PaymentMethod = "card" | "pix" | "subscription" | "wallet";

export type PaymentProviderId = "stripe" | "contentfy_gateway";

export interface PaymentIntentRequest {
  orderId: string;
  amountCents: number;
  currency: string;
  method: PaymentMethod;
  customerId?: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResult {
  provider: PaymentProviderId;
  /** User-facing label — always ContentFy Pay */
  displayName: string;
  clientSecret?: string;
  checkoutUrl?: string;
  status: "pending" | "requires_action" | "succeeded" | "failed";
}

export interface RefundRequest {
  paymentId: string;
  amountCents?: number;
  reason?: string;
}

export interface RefundResult {
  refundId: string;
  status: "pending" | "succeeded" | "failed";
}

export interface SplitRule {
  recipientId: string;
  percentageBps: number;
}

export interface PaymentProvider {
  readonly id: PaymentProviderId;
  createIntent(req: PaymentIntentRequest): Promise<PaymentIntentResult>;
  refund(req: RefundRequest): Promise<RefundResult>;
}
