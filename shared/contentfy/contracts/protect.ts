/**
 * ContentFy Protect — guarantee & refund contracts
 * Public language: ContentFy Protect · Garantia de 30 dias · Compra protegida pela ContentFy
 */

export const PROTECT_DEFAULT_DAYS = 30;

export const PROTECT_BRAND = {
  name: "ContentFy Protect",
  guaranteeLabel: "Garantia de 30 dias",
  purchaseProtected: "Compra protegida pela ContentFy",
  paymentCopy:
    "Pagamento processado com segurança pela infraestrutura integrada da ContentFy.",
  microcopy:
    "Você poderá solicitar o reembolso dentro do prazo informado, conforme a Política de Garantia ContentFy.",
} as const;

export type RefundRequestStatus =
  | "requested"
  | "under_review"
  | "approved"
  | "rejected"
  | "processing"
  | "refunded"
  | "failed"
  | "cancelled";

export const ACTIVE_REFUND_STATUSES: RefundRequestStatus[] = [
  "requested",
  "under_review",
  "approved",
  "processing",
];

export type RefundReasonCode =
  | "content_mismatch"
  | "access_issue"
  | "accidental_purchase"
  | "not_needed"
  | "other";

export const REFUND_REASON_LABELS: Record<RefundReasonCode, string> = {
  content_mismatch: "Conteúdo diferente do esperado",
  access_issue: "Dificuldade técnica de acesso",
  accidental_purchase: "Compra realizada por engano",
  not_needed: "Produto não atendeu à necessidade",
  other: "Outro",
};

export type RefundEligibilityReasonCode =
  | "ELIGIBLE"
  | "ORDER_NOT_COMPLETED"
  | "ALREADY_REFUNDED"
  | "ACTIVE_REQUEST_EXISTS"
  | "PRODUCT_NOT_ELIGIBLE"
  | "GUARANTEE_EXPIRED"
  | "INVALID_PURCHASE";

export interface RefundEligibilityInput {
  orderStatus: string;
  purchasedAt: Date | string;
  /** Product guarantee window; falls back to 30 when null/undefined */
  guaranteeDays?: number | null;
  /** false when product opts out of Protect */
  productEligible?: boolean;
  hasActiveRequest: boolean;
  alreadyRefunded?: boolean;
  now?: Date;
}

export interface RefundEligibilityResult {
  eligible: boolean;
  deadline: string | null;
  remainingDays: number;
  reasonCode: RefundEligibilityReasonCode;
  humanMessage: string;
  guaranteeDays: number;
}

export interface GuaranteePolicy {
  days: number;
  label: string;
  description: string;
  brandName: string;
  paymentCopy: string;
  microcopy: string;
}

/** @deprecated Prefer RefundRequestStatus — kept for scaffold compatibility */
export type GuaranteeStatus =
  | "eligible"
  | "requested"
  | "under_review"
  | "approved"
  | "refunded"
  | "denied"
  | "expired";

export interface GuaranteeRequest {
  orderId: string;
  userId: number;
  reason: string;
}

export interface GuaranteeRecord {
  id: string;
  orderId: string;
  userId: number;
  status: GuaranteeStatus;
  requestedAt: string;
  resolvedAt?: string;
  reason: string;
}

function startOfUtcDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function addUtcDays(d: Date, days: number): Date {
  const next = new Date(d.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

/**
 * Pure eligibility rule for ContentFy Protect.
 * Inclusive of the last calendar day of the guarantee window.
 */
export function getRefundEligibility(
  input: RefundEligibilityInput
): RefundEligibilityResult {
  const guaranteeDays =
    input.guaranteeDays == null || Number.isNaN(Number(input.guaranteeDays))
      ? PROTECT_DEFAULT_DAYS
      : Math.max(0, Math.floor(Number(input.guaranteeDays)));

  const purchasedAt = new Date(input.purchasedAt);
  if (Number.isNaN(purchasedAt.getTime())) {
    return {
      eligible: false,
      deadline: null,
      remainingDays: 0,
      reasonCode: "INVALID_PURCHASE",
      humanMessage: "Não foi possível validar a data desta compra.",
      guaranteeDays,
    };
  }

  const purchaseDay = startOfUtcDay(purchasedAt);
  const deadlineDate = addUtcDays(purchaseDay, guaranteeDays);
  const deadline = deadlineDate.toISOString();
  const now = input.now ?? new Date();
  const today = startOfUtcDay(now);
  const remainingMs = deadlineDate.getTime() - today.getTime();
  const remainingDays = Math.max(0, Math.ceil(remainingMs / 86_400_000));

  if (input.alreadyRefunded || input.orderStatus === "refunded") {
    return {
      eligible: false,
      deadline,
      remainingDays: 0,
      reasonCode: "ALREADY_REFUNDED",
      humanMessage: "Este pedido já foi reembolsado.",
      guaranteeDays,
    };
  }

  if (input.orderStatus !== "completed") {
    return {
      eligible: false,
      deadline,
      remainingDays: 0,
      reasonCode: "ORDER_NOT_COMPLETED",
      humanMessage:
        "A garantia ContentFy Protect vale apenas para compras confirmadas.",
      guaranteeDays,
    };
  }

  if (input.productEligible === false || guaranteeDays <= 0) {
    return {
      eligible: false,
      deadline,
      remainingDays: 0,
      reasonCode: "PRODUCT_NOT_ELIGIBLE",
      humanMessage: "Este produto não participa do ContentFy Protect.",
      guaranteeDays,
    };
  }

  if (input.hasActiveRequest) {
    return {
      eligible: false,
      deadline,
      remainingDays,
      reasonCode: "ACTIVE_REQUEST_EXISTS",
      humanMessage:
        "Já existe uma solicitação de reembolso em andamento para este pedido.",
      guaranteeDays,
    };
  }

  if (today.getTime() > deadlineDate.getTime()) {
    return {
      eligible: false,
      deadline,
      remainingDays: 0,
      reasonCode: "GUARANTEE_EXPIRED",
      humanMessage: `O prazo de ${guaranteeDays} dias do ContentFy Protect encerrou em ${deadlineDate.toLocaleDateString("pt-BR", { timeZone: "UTC" })}.`,
      guaranteeDays,
    };
  }

  return {
    eligible: true,
    deadline,
    remainingDays,
    reasonCode: "ELIGIBLE",
    humanMessage:
      remainingDays === 0
        ? "Último dia da garantia ContentFy Protect. Você ainda pode solicitar o reembolso hoje."
        : `Você tem ${remainingDays} dia${remainingDays === 1 ? "" : "s"} restantes de garantia ContentFy Protect.`,
    guaranteeDays,
  };
}

export const REFUND_STATUS_TRANSITIONS: Record<
  RefundRequestStatus,
  RefundRequestStatus[]
> = {
  requested: ["under_review", "cancelled"],
  under_review: ["approved", "rejected"],
  approved: ["processing"],
  rejected: [],
  processing: ["refunded", "failed"],
  refunded: [],
  failed: ["processing"],
  cancelled: [],
};

export function canTransitionRefundStatus(
  from: RefundRequestStatus,
  to: RefundRequestStatus
): boolean {
  return REFUND_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}
