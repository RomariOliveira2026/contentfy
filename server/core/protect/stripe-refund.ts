import Stripe from "stripe";

export interface ProcessStripeRefundInput {
  paymentIntentId: string;
  amountCents: number;
  /** Must match order amount ceiling */
  maxAmountCents: number;
  /** Stable key — prevents duplicate Stripe refunds */
  idempotencyKey: string;
  reason?: "requested_by_customer" | "duplicate" | "fraudulent";
  /** When true (default in homologation), only sk_test_ keys are accepted */
  requireTestKey?: boolean;
}

export interface ProcessStripeRefundResult {
  ok: boolean;
  providerRefundId?: string;
  status?: string;
  errorMessage?: string;
  currency?: string;
  amountRefunded?: number;
}

export function assertStripeSecretForProtect(options?: {
  requireTestKey?: boolean;
}): { ok: true; secret: string } | { ok: false; errorMessage: string } {
  const secret = process.env.STRIPE_SECRET_KEY || "";
  if (!secret) {
    return { ok: false, errorMessage: "STRIPE_SECRET_KEY não configurada" };
  }

  const requireTest =
    options?.requireTestKey ??
    (process.env.CONTENTFY_PROTECT_REQUIRE_TEST_KEY === "true" ||
      process.env.CONTENTFY_PROTECT_HOMOLOGATION === "true" ||
      process.env.NODE_ENV !== "production");

  if (requireTest && !secret.startsWith("sk_test_")) {
    return {
      ok: false,
      errorMessage:
        "Homologação ContentFy Protect exige STRIPE_SECRET_KEY de teste (sk_test_). Processamento com chave live bloqueado.",
    };
  }

  if (!requireTest && secret.startsWith("sk_live_")) {
    // Live allowed only when explicitly not in homologation — still log
    console.warn(
      "[ContentFy Protect] Processando reembolso com chave live. Confirme que isto é intencional."
    );
  }

  return { ok: true, secret };
}

/**
 * ContentFy Pay → Stripe refund adapter.
 * Admin-only orchestration; never call from student request path.
 */
export async function processStripeRefund(
  input: ProcessStripeRefundInput
): Promise<ProcessStripeRefundResult> {
  const keyCheck = assertStripeSecretForProtect({
    requireTestKey: input.requireTestKey,
  });
  if (!keyCheck.ok) {
    return { ok: false, errorMessage: keyCheck.errorMessage };
  }

  if (!input.paymentIntentId?.startsWith("pi_")) {
    return {
      ok: false,
      errorMessage: "PaymentIntent inválido para reembolso",
    };
  }

  if (
    !Number.isFinite(input.amountCents) ||
    input.amountCents <= 0 ||
    input.amountCents > input.maxAmountCents
  ) {
    return {
      ok: false,
      errorMessage: "Valor de reembolso inválido ou acima do valor pago",
    };
  }

  const stripe = new Stripe(keyCheck.secret, {
    apiVersion: "2025-10-29.clover",
  });

  try {
    const pi = await stripe.paymentIntents.retrieve(input.paymentIntentId, {
      expand: ["latest_charge"],
    });

    if (pi.status !== "succeeded") {
      return {
        ok: false,
        errorMessage: `PaymentIntent não elegível (status=${pi.status})`,
      };
    }

    const paid = pi.amount_received || pi.amount || 0;
    if (input.amountCents > paid || input.amountCents > input.maxAmountCents) {
      return {
        ok: false,
        errorMessage: "Reembolso acima do valor pago bloqueado",
      };
    }

    // Prevent second full refund when Charge already refunded (amount on Charge, not PI)
    const latestCharge = pi.latest_charge;
    const charge =
      typeof latestCharge === "object" && latestCharge !== null
        ? latestCharge
        : null;
    const alreadyRefunded =
      charge && "amount_refunded" in charge
        ? Number(charge.amount_refunded ?? 0)
        : 0;
    if (alreadyRefunded + input.amountCents > paid) {
      return {
        ok: false,
        errorMessage:
          "PaymentIntent já possui reembolso que impediria um novo estorno total/parcial seguro",
      };
    }

    const refund = await stripe.refunds.create(
      {
        payment_intent: input.paymentIntentId,
        amount: input.amountCents,
        reason: input.reason ?? "requested_by_customer",
        metadata: {
          source: "contentfy_protect",
          idempotencyKey: input.idempotencyKey,
        },
      },
      { idempotencyKey: input.idempotencyKey }
    );

    return {
      ok: true,
      providerRefundId: refund.id,
      status: refund.status ?? "succeeded",
      currency: refund.currency,
      amountRefunded: refund.amount,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Falha ao processar reembolso";
    // Never log secret keys
    console.error("[ContentFy Protect] Stripe refund failed:", message);
    return { ok: false, errorMessage: message };
  }
}
