import { CONTENTFY_IDENTITY } from "@shared/contentfy";
import type {
  GuaranteePolicy,
  GuaranteeRecord,
  GuaranteeRequest,
  GuaranteeStatus,
} from "@shared/contentfy";

/**
 * ContentFy Protect — proprietary guarantee engine (architecture).
 * Persistence / antifraud will plug in later without naming competitors.
 */
export class GuaranteeEngine {
  getPolicy(): GuaranteePolicy {
    return {
      days: CONTENTFY_IDENTITY.guaranteeDays,
      label: CONTENTFY_IDENTITY.guaranteeLabel,
      description: `Você tem ${CONTENTFY_IDENTITY.guaranteeDays} dias para solicitar reembolso pela Garantia ContentFy.`,
    };
  }

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
