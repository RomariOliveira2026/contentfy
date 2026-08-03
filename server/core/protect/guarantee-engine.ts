import {
  PROTECT_BRAND,
  PROTECT_DEFAULT_DAYS,
  type GuaranteePolicy,
  type GuaranteeRecord,
  type GuaranteeRequest,
  type GuaranteeStatus,
} from "@shared/contentfy";

/**
 * ContentFy Protect — policy helpers.
 * Persistence lives in DB (refund_requests); this engine exposes brand policy.
 */
export class GuaranteeEngine {
  getPolicy(days: number = PROTECT_DEFAULT_DAYS): GuaranteePolicy {
    return {
      days,
      label: days === 30 ? PROTECT_BRAND.guaranteeLabel : `Garantia de ${days} dias`,
      description: `Você tem ${days} dias para solicitar reembolso pelo ${PROTECT_BRAND.name}.`,
      brandName: PROTECT_BRAND.name,
      paymentCopy: PROTECT_BRAND.paymentCopy,
      microcopy: PROTECT_BRAND.microcopy,
    };
  }

  /** @deprecated in-memory scaffold — use protect router + DB */
  createRequest(input: GuaranteeRequest): GuaranteeRecord {
    return {
      id: `cf_g_${Date.now()}`,
      orderId: input.orderId,
      userId: input.userId,
      status: "requested",
      requestedAt: new Date().toISOString(),
      reason: input.reason,
    };
  }

  /** @deprecated */
  transition(record: GuaranteeRecord, status: GuaranteeStatus): GuaranteeRecord {
    return {
      ...record,
      status,
      resolvedAt:
        status === "approved" ||
        status === "refunded" ||
        status === "denied" ||
        status === "expired"
          ? new Date().toISOString()
          : record.resolvedAt,
    };
  }
}

export const guaranteeEngine = new GuaranteeEngine();
