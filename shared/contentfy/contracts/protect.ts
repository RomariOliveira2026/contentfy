/** ContentFy Protect — proprietary guarantee architecture. */

export type GuaranteeStatus =
  | "eligible"
  | "requested"
  | "under_review"
  | "approved"
  | "refunded"
  | "denied"
  | "expired";

export interface GuaranteePolicy {
  days: number;
  label: string;
  description: string;
}

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
