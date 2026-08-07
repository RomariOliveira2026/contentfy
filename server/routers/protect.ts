import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  canTransitionRefundStatus,
  getRefundEligibility,
  PROTECT_BRAND,
  REFUND_REASON_LABELS,
  type RefundRequestStatus,
} from "@shared/contentfy";
import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "../_core/trpc";
import * as db from "../db";
import {
  assertStripeSecretForProtect,
  guaranteeEngine,
  processStripeRefund,
} from "../core/protect";
import { notificationCenter } from "../core/notifications";
import { assertRateLimitOrThrow } from "../core/rate-limit";
import { canAccessOwnedResource } from "../_core/authz";

const refundReasonSchema = z.enum([
  "content_mismatch",
  "access_issue",
  "accidental_purchase",
  "not_needed",
  "other",
]);

const statusSchema = z.enum([
  "requested",
  "under_review",
  "approved",
  "rejected",
  "processing",
  "refunded",
  "failed",
  "cancelled",
]);

function emitRefundEvent(
  userId: number,
  kind: string,
  title: string,
  body: string
) {
  notificationCenter.enqueue({
    userId,
    kind: "guarantee",
    title,
    body,
    channels: ["in_app"],
    metadata: { event: kind },
  });
}

async function audit(input: {
  refundRequestId?: number | null;
  orderId?: number | null;
  actorUserId?: number | null;
  eventType: string;
  fromStatus?: string | null;
  toStatus?: string | null;
  message?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await db.insertRefundAuditEvent({
      refundRequestId: input.refundRequestId ?? null,
      orderId: input.orderId ?? null,
      actorUserId: input.actorUserId ?? null,
      eventType: input.eventType,
      fromStatus: input.fromStatus ?? null,
      toStatus: input.toStatus ?? null,
      message: input.message ?? null,
      metadataJson: input.metadata
        ? JSON.stringify(sanitizeAuditMetadata(input.metadata))
        : null,
    });
  } catch (error) {
    console.error(
      "[ContentFy Protect] audit insert failed:",
      error instanceof Error ? error.message : error
    );
  }
}

function sanitizeAuditMetadata(meta: Record<string, unknown>) {
  const blocked = /secret|token|password|authorization|api[_-]?key|sk_live|sk_test/i;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(meta)) {
    if (blocked.test(k)) continue;
    if (typeof v === "string" && blocked.test(v)) continue;
    out[k] = v;
  }
  return out;
}

async function buildOrderProtectionContext(
  orderId: number,
  userId: number,
  isAdmin: boolean
) {
  const order = await db.getOrderById(orderId);
  if (!order) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Pedido não encontrado" });
  }
  if (
    !canAccessOwnedResource({
      actorUserId: userId,
      actorRole: isAdmin ? "admin" : "user",
      ownerUserId: order.userId,
    })
  ) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Você não tem permissão para acessar este pedido",
    });
  }

  const product = await db.getProductById(order.productId);
  if (!product) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Produto não encontrado" });
  }

  const requests = await db.getRefundRequestsByOrderId(orderId);
  const active = await db.getActiveRefundRequestForOrder(orderId);
  const access = await db.getUserProductByOrder(orderId);

  const eligibility = getRefundEligibility({
    orderStatus: order.status,
    purchasedAt: order.createdAt,
    guaranteeDays: product.guaranteeDays,
    productEligible: product.guaranteeDays > 0,
    hasActiveRequest: Boolean(active),
    alreadyRefunded: order.status === "refunded",
  });

  return {
    order,
    product,
    requests,
    activeRequest: active,
    access,
    eligibility,
    policy: guaranteeEngine.getPolicy(eligibility.guaranteeDays),
    brand: PROTECT_BRAND,
    reasonLabels: REFUND_REASON_LABELS,
  };
}

export const protectRouter = router({
  policy: publicProcedure.query(() => guaranteeEngine.getPolicy()),

  brand: publicProcedure.query(() => PROTECT_BRAND),

  getOrderProtection: protectedProcedure
    .input(z.object({ orderId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const context = await buildOrderProtectionContext(
        input.orderId,
        ctx.user.id,
        ctx.user.role === "admin"
      );
      const activeId = context.activeRequest?.id;
      const auditTrail = activeId
        ? await db.listRefundAuditEvents(activeId)
        : [];
      return { ...context, auditTrail };
    }),

  myPurchases: protectedProcedure.query(async ({ ctx }) => {
    const orders = await db.getUserOrders(ctx.user.id);
    return Promise.all(
      orders.map(async (order) => {
        const product = await db.getProductById(order.productId);
        const active = await db.getActiveRefundRequestForOrder(order.id);
        const eligibility = getRefundEligibility({
          orderStatus: order.status,
          purchasedAt: order.createdAt,
          guaranteeDays: product?.guaranteeDays ?? 30,
          productEligible: Boolean(product && product.guaranteeDays > 0),
          hasActiveRequest: Boolean(active),
          alreadyRefunded: order.status === "refunded",
        });
        return {
          order,
          product: product
            ? {
                id: product.id,
                name: product.name,
                slug: product.slug,
                guaranteeDays: product.guaranteeDays,
              }
            : null,
          eligibility,
          activeRequest: active,
        };
      })
    );
  }),

  createRequest: protectedProcedure
    .input(
      z.object({
        orderId: z.number().int().positive(),
        reason: refundReasonSchema,
        details: z.string().max(2000).optional(),
        acknowledge: z.literal(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await assertRateLimitOrThrow(
          `protect:create:${ctx.user.id}`,
          5,
          60 * 60 * 1000,
          "Muitas solicitações. Aguarde um pouco e tente novamente."
        );
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Muitas solicitações. Aguarde um pouco e tente novamente.",
        });
      }

      const ctxData = await buildOrderProtectionContext(
        input.orderId,
        ctx.user.id,
        false
      );

      if (!ctxData.eligibility.eligible) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: ctxData.eligibility.humanMessage,
        });
      }

      const existing = await db.getActiveRefundRequestForOrder(input.orderId);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Já existe uma solicitação ativa para este pedido.",
        });
      }

      const id = await db.createRefundRequest({
        orderId: ctxData.order.id,
        userId: ctx.user.id,
        productId: ctxData.product.id,
        reason: input.reason,
        details: input.details?.trim() || null,
        status: "requested",
        refundAmount: ctxData.order.amount,
        accessRevocationStatus: "not_applicable",
        reconciliationNeeded: false,
      });

      await audit({
        refundRequestId: id,
        orderId: ctxData.order.id,
        actorUserId: ctx.user.id,
        eventType: "refund.requested",
        fromStatus: null,
        toStatus: "requested",
        message: "Solicitação criada pelo aluno",
        metadata: { reason: input.reason },
      });

      emitRefundEvent(
        ctx.user.id,
        "refund.requested",
        "Solicitação recebida",
        `Sua solicitação de reembolso #${id} foi registrada no ContentFy Protect.`
      );

      return {
        request: await db.getRefundRequestById(id),
        eligibility: ctxData.eligibility,
      };
    }),

  cancelRequest: protectedProcedure
    .input(z.object({ requestId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const request = await db.getRefundRequestById(input.requestId);
      if (!request || request.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Solicitação não encontrada",
        });
      }
      if (!canTransitionRefundStatus(request.status, "cancelled")) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Esta solicitação não pode ser cancelada neste status.",
        });
      }
      const updated = await db.updateRefundRequest(request.id, {
        status: "cancelled",
      });
      await audit({
        refundRequestId: request.id,
        orderId: request.orderId,
        actorUserId: ctx.user.id,
        eventType: "refund.cancelled",
        fromStatus: request.status,
        toStatus: "cancelled",
        message: "Cancelada pelo aluno",
      });
      return updated;
    }),

  adminList: adminProcedure
    .input(
      z
        .object({
          status: statusSchema.optional(),
          productId: z.number().int().positive().optional(),
          userId: z.number().int().positive().optional(),
          from: z.string().datetime().optional(),
          to: z.string().datetime().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      return db.listRefundRequests({
        status: input?.status,
        productId: input?.productId,
        userId: input?.userId,
        from: input?.from ? new Date(input.from) : undefined,
        to: input?.to ? new Date(input.to) : undefined,
      });
    }),

  adminGet: adminProcedure
    .input(z.object({ requestId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const request = await db.getRefundRequestById(input.requestId);
      if (!request) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Solicitação não encontrada",
        });
      }
      const context = await buildOrderProtectionContext(
        request.orderId,
        request.userId,
        true
      );
      const auditTrail = await db.listRefundAuditEvents(request.id);
      return { request, ...context, auditTrail };
    }),

  adminTransition: adminProcedure
    .input(
      z.object({
        requestId: z.number().int().positive(),
        status: statusSchema,
        adminNotes: z.string().max(4000).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const request = await db.getRefundRequestById(input.requestId);
      if (!request) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Solicitação não encontrada",
        });
      }

      if (
        !canTransitionRefundStatus(
          request.status,
          input.status as RefundRequestStatus
        )
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Transição inválida: ${request.status} → ${input.status}`,
        });
      }

      // refunded only via adminProcessRefund (Stripe + revoke)
      if (input.status === "refunded" || input.status === "processing") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            input.status === "refunded"
              ? "Use a ação “Processar reembolso” para concluir o estorno com segurança."
              : "O status processing é definido automaticamente ao processar o reembolso.",
        });
      }

      const updated = await db.updateRefundRequest(request.id, {
        status: input.status,
        adminNotes: input.adminNotes ?? request.adminNotes,
        reviewedAt: new Date(),
        reviewedBy: ctx.user.id,
      });

      await audit({
        refundRequestId: request.id,
        orderId: request.orderId,
        actorUserId: ctx.user.id,
        eventType: `refund.${input.status}`,
        fromStatus: request.status,
        toStatus: input.status,
        message: "Transição administrativa",
      });

      const eventMap: Partial<Record<RefundRequestStatus, string>> = {
        under_review: "refund.under_review",
        approved: "refund.approved",
        rejected: "refund.rejected",
        failed: "refund.failed",
      };
      const event = eventMap[input.status as RefundRequestStatus];
      if (event) {
        emitRefundEvent(
          request.userId,
          event,
          "Atualização ContentFy Protect",
          `Sua solicitação #${request.id} agora está: ${input.status}.`
        );
      }

      return updated;
    }),

  adminAddNotes: adminProcedure
    .input(
      z.object({
        requestId: z.number().int().positive(),
        adminNotes: z.string().min(1).max(4000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const request = await db.getRefundRequestById(input.requestId);
      if (!request) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Solicitação não encontrada",
        });
      }
      const updated = await db.updateRefundRequest(request.id, {
        adminNotes: input.adminNotes,
        reviewedBy: ctx.user.id,
        reviewedAt: new Date(),
      });
      await audit({
        refundRequestId: request.id,
        orderId: request.orderId,
        actorUserId: ctx.user.id,
        eventType: "refund.notes_updated",
        message: "Observação administrativa atualizada",
      });
      return updated;
    }),

  /**
   * Explicit admin action — Stripe refund once (idempotent).
   * Homologation: requires sk_test_ unless CONTENTFY_PROTECT_HOMOLOGATION=false and NODE_ENV=production.
   */
  adminProcessRefund: adminProcedure
    .input(
      z.object({
        requestId: z.number().int().positive(),
        confirm: z.literal(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const request = await db.getRefundRequestById(input.requestId);
      if (!request) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Solicitação não encontrada",
        });
      }

      if (request.status === "refunded" && request.providerRefundId) {
        await audit({
          refundRequestId: request.id,
          orderId: request.orderId,
          actorUserId: ctx.user.id,
          eventType: "refund.process_idempotent_hit",
          message: "Processamento ignorado — já reembolsado",
          metadata: { providerRefundId: request.providerRefundId },
        });
        return { alreadyProcessed: true, request };
      }

      if (
        request.status !== "approved" &&
        request.status !== "processing" &&
        request.status !== "failed"
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Aprove a solicitação antes de processar o reembolso.",
        });
      }

      if (
        request.status === "approved" &&
        !canTransitionRefundStatus("approved", "processing")
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Transição inválida para processing",
        });
      }
      if (
        request.status === "failed" &&
        !canTransitionRefundStatus("failed", "processing")
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Nova tentativa inválida a partir de failed",
        });
      }

      const order = await db.getOrderById(request.orderId);
      if (!order?.stripePaymentIntentId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Pedido sem PaymentIntent Stripe para reembolso.",
        });
      }

      if (order.status === "refunded") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Pedido já está marcado como reembolsado.",
        });
      }

      const keyCheck = assertStripeSecretForProtect();
      if (!keyCheck.ok) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: keyCheck.errorMessage,
        });
      }

      const amount = request.refundAmount ?? order.amount;
      const idempotencyKey =
        request.idempotencyKey ||
        `cf_protect_refund_${request.id}_${request.orderId}`;

      const fromStatus = request.status;
      await db.updateRefundRequest(request.id, {
        status: "processing",
        idempotencyKey,
        reviewedBy: ctx.user.id,
        reviewedAt: new Date(),
        accessRevocationStatus: "pending",
      });

      await audit({
        refundRequestId: request.id,
        orderId: request.orderId,
        actorUserId: ctx.user.id,
        eventType: "refund.processing",
        fromStatus,
        toStatus: "processing",
        message: "Tentativa de processamento Stripe iniciada",
        metadata: {
          amountCents: amount,
          paymentIntentId: order.stripePaymentIntentId,
          idempotencyKey,
        },
      });

      emitRefundEvent(
        request.userId,
        "refund.processing",
        "Reembolso em processamento",
        `Estamos processando o reembolso da solicitação #${request.id}.`
      );

      const result = await processStripeRefund({
        paymentIntentId: order.stripePaymentIntentId,
        amountCents: amount,
        maxAmountCents: order.amount,
        idempotencyKey,
      });

      if (!result.ok) {
        const failed = await db.updateRefundRequest(request.id, {
          status: "failed",
          adminNotes:
            `${request.adminNotes ?? ""}\n[Stripe] ${result.errorMessage}`.trim(),
          accessRevocationStatus: "not_applicable",
        });
        await audit({
          refundRequestId: request.id,
          orderId: request.orderId,
          actorUserId: ctx.user.id,
          eventType: "refund.failed",
          fromStatus: "processing",
          toStatus: "failed",
          message: result.errorMessage || "Falha no provedor",
        });
        emitRefundEvent(
          request.userId,
          "refund.failed",
          "Falha no reembolso",
          `Houve uma falha ao processar o reembolso #${request.id}. Nossa equipe irá analisar.`
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.errorMessage || "Falha ao processar reembolso",
          cause: failed,
        });
      }

      const finalize = await db.finalizeRefundAndRevokeAccess({
        orderId: order.id,
        requestId: request.id,
        providerRefundId: result.providerRefundId!,
        refundAmount: amount,
        reviewedBy: ctx.user.id,
      });

      await audit({
        refundRequestId: request.id,
        orderId: request.orderId,
        actorUserId: ctx.user.id,
        eventType: "refund.completed",
        fromStatus: "processing",
        toStatus: "refunded",
        message: "Reembolso confirmado no Stripe",
        metadata: {
          providerRefundId: result.providerRefundId,
          amountRefunded: result.amountRefunded,
          currency: result.currency,
          accessRevocationStatus: finalize.accessRevocationStatus,
          reconciliationNeeded: finalize.reconciliationNeeded,
        },
      });

      try {
        const { invalidateExperienceForUser } = await import(
          "../core/experience/cache"
        );
        invalidateExperienceForUser(request.userId);
        const { emitOrchestratorEvent } = await import("../core/orchestrator");
        emitOrchestratorEvent(
          "PRODUCT_REFUNDED",
          {
            userId: request.userId,
            orderId: request.orderId,
          },
          "protect"
        );
      } catch {
        /* Experience / orchestrator optional */
      }

      if (finalize.accessRevocationStatus === "revoked") {
        await audit({
          refundRequestId: request.id,
          orderId: request.orderId,
          actorUserId: ctx.user.id,
          eventType: "access.revoked",
          message: "Acesso ao produto desativado (histórico preservado)",
        });
      } else {
        await audit({
          refundRequestId: request.id,
          orderId: request.orderId,
          actorUserId: ctx.user.id,
          eventType: "access.revoke_failed",
          message:
            "Refund Stripe OK, mas revogação falhou — reconciliação necessária",
        });
      }

      emitRefundEvent(
        request.userId,
        "refund.completed",
        "Reembolso concluído",
        `O reembolso da solicitação #${request.id} foi concluído. O acesso ao produto foi encerrado.`
      );

      console.info(
        `[ContentFy Protect] Refund completed request=${request.id} stripe=${result.providerRefundId} by admin=${ctx.user.id} revoke=${finalize.accessRevocationStatus}`
      );

      const completed = await db.getRefundRequestById(request.id);
      return {
        alreadyProcessed: false,
        request: completed,
        providerRefundId: result.providerRefundId,
        accessRevocationStatus: finalize.accessRevocationStatus,
        reconciliationNeeded: finalize.reconciliationNeeded,
      };
    }),

  /** Admin repair when Stripe refunded but access revoke failed. */
  adminRepairAccessRevocation: adminProcedure
    .input(z.object({ requestId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const request = await db.getRefundRequestById(input.requestId);
      if (!request || request.status !== "refunded") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Só é possível reparar revogação em solicitações refunded.",
        });
      }
      await db.revokeProductAccessByOrder(request.orderId);
      const updated = await db.updateRefundRequest(request.id, {
        accessRevocationStatus: "revoked",
        reconciliationNeeded: false,
        reviewedBy: ctx.user.id,
        reviewedAt: new Date(),
      });
      await audit({
        refundRequestId: request.id,
        orderId: request.orderId,
        actorUserId: ctx.user.id,
        eventType: "access.revoked_repair",
        message: "Revogação reparada administrativamente",
      });
      return updated;
    }),
});

export type ProtectRouter = typeof protectRouter;
