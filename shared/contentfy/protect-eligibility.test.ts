import { describe, expect, it } from "vitest";
import {
  canTransitionRefundStatus,
  getRefundEligibility,
} from "./contracts/protect";

describe("getRefundEligibility", () => {
  const purchasedAt = "2026-07-01T12:00:00.000Z";

  it("allows purchase with less than 30 days", () => {
    const result = getRefundEligibility({
      orderStatus: "completed",
      purchasedAt,
      guaranteeDays: 30,
      productEligible: true,
      hasActiveRequest: false,
      now: new Date("2026-07-15T10:00:00.000Z"),
    });
    expect(result.eligible).toBe(true);
    expect(result.reasonCode).toBe("ELIGIBLE");
    expect(result.remainingDays).toBeGreaterThan(0);
  });

  it("allows purchase on the last guarantee day", () => {
    const result = getRefundEligibility({
      orderStatus: "completed",
      purchasedAt,
      guaranteeDays: 30,
      productEligible: true,
      hasActiveRequest: false,
      now: new Date("2026-07-31T23:00:00.000Z"),
    });
    expect(result.eligible).toBe(true);
    expect(result.remainingDays).toBe(0);
  });

  it("rejects purchase after the deadline", () => {
    const result = getRefundEligibility({
      orderStatus: "completed",
      purchasedAt,
      guaranteeDays: 30,
      productEligible: true,
      hasActiveRequest: false,
      now: new Date("2026-08-01T00:00:00.000Z"),
    });
    expect(result.eligible).toBe(false);
    expect(result.reasonCode).toBe("GUARANTEE_EXPIRED");
  });

  it("rejects unpaid / pending orders", () => {
    const result = getRefundEligibility({
      orderStatus: "pending",
      purchasedAt,
      guaranteeDays: 30,
      productEligible: true,
      hasActiveRequest: false,
      now: new Date("2026-07-05T00:00:00.000Z"),
    });
    expect(result.eligible).toBe(false);
    expect(result.reasonCode).toBe("ORDER_NOT_COMPLETED");
  });

  it("rejects already refunded orders", () => {
    const result = getRefundEligibility({
      orderStatus: "refunded",
      purchasedAt,
      guaranteeDays: 30,
      productEligible: true,
      hasActiveRequest: false,
      now: new Date("2026-07-05T00:00:00.000Z"),
    });
    expect(result.eligible).toBe(false);
    expect(result.reasonCode).toBe("ALREADY_REFUNDED");
  });

  it("rejects when an active request already exists", () => {
    const result = getRefundEligibility({
      orderStatus: "completed",
      purchasedAt,
      guaranteeDays: 30,
      productEligible: true,
      hasActiveRequest: true,
      now: new Date("2026-07-05T00:00:00.000Z"),
    });
    expect(result.eligible).toBe(false);
    expect(result.reasonCode).toBe("ACTIVE_REQUEST_EXISTS");
  });

  it("rejects ineligible products", () => {
    const result = getRefundEligibility({
      orderStatus: "completed",
      purchasedAt,
      guaranteeDays: 0,
      productEligible: false,
      hasActiveRequest: false,
      now: new Date("2026-07-05T00:00:00.000Z"),
    });
    expect(result.eligible).toBe(false);
    expect(result.reasonCode).toBe("PRODUCT_NOT_ELIGIBLE");
  });

  it("defaults guarantee days to 30 when missing", () => {
    const result = getRefundEligibility({
      orderStatus: "completed",
      purchasedAt,
      guaranteeDays: null,
      productEligible: true,
      hasActiveRequest: false,
      now: new Date("2026-07-05T00:00:00.000Z"),
    });
    expect(result.guaranteeDays).toBe(30);
    expect(result.eligible).toBe(true);
  });
});

describe("canTransitionRefundStatus", () => {
  it("allows valid transitions and blocks invalid ones", () => {
    expect(canTransitionRefundStatus("requested", "under_review")).toBe(true);
    expect(canTransitionRefundStatus("under_review", "approved")).toBe(true);
    expect(canTransitionRefundStatus("under_review", "rejected")).toBe(true);
    expect(canTransitionRefundStatus("approved", "processing")).toBe(true);
    expect(canTransitionRefundStatus("processing", "refunded")).toBe(true);
    expect(canTransitionRefundStatus("processing", "failed")).toBe(true);
    expect(canTransitionRefundStatus("failed", "processing")).toBe(true);
    expect(canTransitionRefundStatus("requested", "refunded")).toBe(false);
    expect(canTransitionRefundStatus("requested", "processing")).toBe(false);
    expect(canTransitionRefundStatus("rejected", "approved")).toBe(false);
    expect(canTransitionRefundStatus("refunded", "processing")).toBe(false);
  });
});
