import express from "express";
import Stripe from "stripe";
import * as db from "../db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

/**
 * Webhook do Stripe para processar eventos de pagamento
 * Rota: POST /api/stripe/webhook
 */
export function setupStripeWebhook(app: express.Application) {
  // IMPORTANTE: Deve vir ANTES do express.json()
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"];

      if (!sig) {
        console.error("[Stripe Webhook] Missing signature");
        return res.status(400).send("Missing signature");
      }

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET!
        );
      } catch (err: any) {
        console.error("[Stripe Webhook] Signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Detectar eventos de teste
      if (event.id.startsWith("evt_test_")) {
        console.log("[Stripe Webhook] Test event detected, returning verification response");
        return res.status(200).json({
          success: true,
          message: "Webhook test event received",
          eventId: event.id,
          eventType: event.type
        });
      }

      console.log("[Stripe Webhook] Event received:", event.type);

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            await handleCheckoutCompleted(session);
            break;
          }

          case "payment_intent.succeeded": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log("[Stripe Webhook] Payment succeeded:", paymentIntent.id);
            break;
          }

          case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log("[Stripe Webhook] Payment failed:", paymentIntent.id);
            
            // Marcar pedido como falho se tiver metadata
            if (paymentIntent.metadata?.orderId) {
              await db.updateOrderStatus(
                Number(paymentIntent.metadata.orderId),
                "failed"
              );
            }
            break;
          }

          case "customer.subscription.created": {
            const subscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionCreated(subscription);
            break;
          }

          case "customer.subscription.updated": {
            const subscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionUpdated(subscription);
            break;
          }

          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionDeleted(subscription);
            break;
          }

          case "invoice.payment_succeeded": {
            const invoice = event.data.object as Stripe.Invoice;
            await handleInvoicePaymentSucceeded(invoice);
            break;
          }

          case "invoice.payment_failed": {
            const invoice = event.data.object as Stripe.Invoice;
            console.log("[Stripe Webhook] Invoice payment failed:", invoice.id);
            // TODO: Notificar usuário sobre falha no pagamento
            break;
          }

          default:
            console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }

        res.status(200).json({
          success: true,
          message: "Webhook event processed successfully",
          eventId: event.id,
          eventType: event.type
        });
      } catch (error) {
        console.error("[Stripe Webhook] Error processing event:", error);
        res.status(500).send("Webhook handler failed");
      }
    }
  );
}

/**
 * Processar checkout completado
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("[Stripe Webhook] Processing checkout.session.completed:", session.id);

  const orderId = session.metadata?.orderId;
  const userId = session.metadata?.userId;
  const productId = session.metadata?.productId;

  if (!orderId || !userId || !productId) {
    console.error("[Stripe Webhook] Missing metadata in session:", session.id);
    return;
  }

  try {
    // Atualizar status do pedido
    await db.updateOrderStatus(Number(orderId), "completed");

    // Conceder acesso ao produto
    await db.grantProductAccess({
      userId: Number(userId),
      productId: Number(productId),
      orderId: Number(orderId),
      accessGrantedAt: new Date(),
      accessExpiresAt: null, // Acesso vitalício por padrão
      isActive: true,
    });

    // Incrementar uso do cupom se houver
    const order = await db.getOrderById(Number(orderId));
    if (order?.couponId) {
      await db.incrementCouponUsage(order.couponId);
    }

    try {
      const { invalidateExperienceForUser } = await import(
        "../core/experience/cache"
      );
      invalidateExperienceForUser(Number(userId));
      const { emitOrchestratorEvent } = await import("../core/orchestrator");
      emitOrchestratorEvent(
        "PRODUCT_PURCHASED",
        {
          userId: Number(userId),
          productId: Number(productId),
          orderId: Number(orderId),
        },
        "commerce"
      );
    } catch {
      /* Experience / orchestrator optional */
    }

    console.log("[Stripe Webhook] Access granted successfully:", {
      orderId,
      userId,
      productId,
    });
  } catch (error) {
    console.error("[Stripe Webhook] Error granting access:", error);
    throw error;
  }
}

/**
 * Processar criação de assinatura
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log("[Stripe Webhook] Processing subscription.created:", subscription.id);

  const userId = subscription.metadata?.userId;
  const planId = subscription.metadata?.planId;
  const affiliateId = subscription.metadata?.affiliateId;

  if (!userId || !planId) {
    console.error("[Stripe Webhook] Missing metadata in subscription:", subscription.id);
    return;
  }

  try {
    // Criar registro de assinatura no banco
    await db.createUserSubscription({
      userId: Number(userId),
      planId: Number(planId),
      status: subscription.status as any,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      currentPeriodStart: (subscription as any).current_period_start ? new Date((subscription as any).current_period_start * 1000) : null,
      currentPeriodEnd: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000) : null,
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end || false,
      canceledAt: (subscription as any).canceled_at ? new Date((subscription as any).canceled_at * 1000) : null,
    });

    console.log("[Stripe Webhook] Subscription created successfully:", {
      userId,
      planId,
      subscriptionId: subscription.id,
    });

    // Se houver afiliado, criar registro de comissão recorrente
    if (affiliateId) {
      const plan = await db.getSubscriptionPlanById(Number(planId));
      if (plan) {
        const affiliate = await db.getAffiliateById(Number(affiliateId));
        if (affiliate) {
          const commissionAmount = Math.round((plan.price * affiliate.commissionRate) / 100);
          
          // Criar registro de comissão recorrente
          // TODO: Criar tabela affiliate_recurring_commissions
          console.log("[Stripe Webhook] Recurring commission setup:", {
            affiliateId,
            subscriptionId: subscription.id,
            commissionAmount,
            commissionRate: affiliate.commissionRate,
          });
        }
      }
    }
  } catch (error) {
    console.error("[Stripe Webhook] Error creating subscription:", error);
    throw error;
  }
}

/**
 * Processar atualização de assinatura
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("[Stripe Webhook] Processing subscription.updated:", subscription.id);

  try {
    const existingSubscription = await db.getUserSubscriptionByStripeId(subscription.id);
    
    if (!existingSubscription) {
      console.warn("[Stripe Webhook] Subscription not found in database:", subscription.id);
      return;
    }

    // Atualizar registro de assinatura
    await db.updateUserSubscription(existingSubscription.id, {
      status: subscription.status as any,
      currentPeriodStart: (subscription as any).current_period_start ? new Date((subscription as any).current_period_start * 1000) : null,
      currentPeriodEnd: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000) : null,
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end || false,
      canceledAt: (subscription as any).canceled_at ? new Date((subscription as any).canceled_at * 1000) : null,
    });

    console.log("[Stripe Webhook] Subscription updated successfully:", subscription.id);
  } catch (error) {
    console.error("[Stripe Webhook] Error updating subscription:", error);
    throw error;
  }
}

/**
 * Processar cancelamento de assinatura
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("[Stripe Webhook] Processing subscription.deleted:", subscription.id);

  try {
    const existingSubscription = await db.getUserSubscriptionByStripeId(subscription.id);
    
    if (!existingSubscription) {
      console.warn("[Stripe Webhook] Subscription not found in database:", subscription.id);
      return;
    }

    // Atualizar status para cancelado
    await db.updateUserSubscription(existingSubscription.id, {
      status: "canceled",
      canceledAt: new Date(),
    });

    console.log("[Stripe Webhook] Subscription cancelled successfully:", subscription.id);
  } catch (error) {
    console.error("[Stripe Webhook] Error cancelling subscription:", error);
    throw error;
  }
}

/**
 * Processar pagamento de invoice (renovação de assinatura)
 * Aqui é onde creditamos comissões recorrentes aos afiliados
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log("[Stripe Webhook] Processing invoice.payment_succeeded:", invoice.id);

  // Apenas processar invoices de assinatura
  const subscriptionId = (invoice as any).subscription;
  if (!subscriptionId) {
    console.log("[Stripe Webhook] Invoice is not for subscription, skipping");
    return;
  }

  try {
    // Buscar assinatura no Stripe para pegar metadata
    const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
    const affiliateId = subscription.metadata?.affiliateId;

    if (!affiliateId) {
      console.log("[Stripe Webhook] No affiliate associated with subscription");
      return;
    }

    const userId = subscription.metadata?.userId;
    const planId = subscription.metadata?.planId;

    if (!userId || !planId) {
      console.error("[Stripe Webhook] Missing metadata in subscription:", subscription.id);
      return;
    }

    // Buscar plano e afiliado
    const plan = await db.getSubscriptionPlanById(Number(planId));
    const affiliate = await db.getAffiliateById(Number(affiliateId));

    if (!plan || !affiliate) {
      console.error("[Stripe Webhook] Plan or affiliate not found");
      return;
    }

    // Calcular comissão
    const commissionAmount = Math.round((plan.price * affiliate.commissionRate) / 100);

    // Criar registro de comissão recorrente
    // TODO: Usar tabela affiliate_recurring_commissions quando criada
    // Por enquanto, vamos apenas logar
    console.log("[Stripe Webhook] Recurring commission earned:", {
      affiliateId,
      invoiceId: invoice.id,
      subscriptionId: subscription.id,
      amount: plan.price,
      commissionAmount,
      commissionRate: affiliate.commissionRate,
    });

    // Atualizar ganhos do afiliado
    await db.updateProduct(Number(affiliateId), {
      totalEarnings: affiliate.totalEarnings + commissionAmount,
      pendingEarnings: affiliate.pendingEarnings + commissionAmount,
    } as any);

    console.log("[Stripe Webhook] Affiliate earnings updated:", {
      affiliateId,
      newTotalEarnings: affiliate.totalEarnings + commissionAmount,
    });
  } catch (error) {
    console.error("[Stripe Webhook] Error processing invoice payment:", error);
    throw error;
  }
}
