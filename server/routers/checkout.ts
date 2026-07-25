import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import * as db from "../db";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

/**
 * Checkout Router - Sistema de pagamentos com Stripe
 */
export const checkoutRouter = router({
  createCheckout: publicProcedure
  .input(
    z.object({
      name: z.string(),
      price: z.number(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    // Keep URLs aligned with the running app origin (ContentFy on :3001),
    // not the OAuth portal (:3010).
    const origin = (ctx.req.headers.origin as string) || "http://localhost:3001";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: input.name,
            },
            unit_amount: input.price,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/checkout/success`,
      cancel_url: `${origin}/products`,
    });

    return { url: session.url };
  }),
  // Aplicar cupom no checkout
  applyCoupon: publicProcedure
    .input(z.object({
      couponCode: z.string(),
      productId: z.number(),
      originalPrice: z.number(),
    }))
    .mutation(async ({ input }) => {
      const coupon = await db.getCouponByCode(input.couponCode);
      
      if (!coupon) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cupom não encontrado",
        });
      }

      if (!coupon.isActive) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Este cupom não está ativo",
        });
      }

      // Verificar validade
      const now = new Date();
      if (coupon.validFrom && new Date(coupon.validFrom) > now) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Este cupom ainda não é válido",
        });
      }

      if (coupon.validUntil && new Date(coupon.validUntil) < now) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Este cupom expirou",
        });
      }

      // Verificar limite de uso
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Este cupom atingiu o limite de uso",
        });
      }

      // TODO: Adicionar campo productId ao schema de cupons se necessário
      // Para agora, cupons são válidos para todos os produtos

      // Calcular desconto
      let discountAmount = 0;
      if (coupon.discountType === "percentage") {
        discountAmount = Math.round((input.originalPrice * coupon.discountValue) / 100);
      } else {
        discountAmount = coupon.discountValue;
      }

      const finalPrice = Math.max(0, input.originalPrice - discountAmount);

      return {
        valid: true,
        couponId: coupon.id,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        originalPrice: input.originalPrice,
        discountAmount,
        finalPrice,
        message: "Cupom aplicado com sucesso!",
      };
    }),

  // Calcular parcelamento
  calculateInstallments: publicProcedure
    .input(z.object({
      amount: z.number(),
      maxInstallments: z.number().default(12),
    }))
    .query(({ input }) => {
      const installments = [];
      const minInstallmentAmount = 500; // R$ 5,00 mínimo por parcela

      for (let i = 1; i <= input.maxInstallments; i++) {
        const installmentAmount = Math.round(input.amount / i);
        
        if (installmentAmount < minInstallmentAmount) {
          break;
        }

        installments.push({
          number: i,
          amount: installmentAmount,
          total: input.amount,
          label: `${i}x de R$ ${(installmentAmount / 100).toFixed(2)} sem juros`,
        });
      }

      // Recomendar parcela com valor entre R$ 20 e R$ 50
      const recommendedInstallment = installments.find(
        (inst) => inst.amount >= 2000 && inst.amount <= 5000
      )?.number || 1;

      return {
        installments,
        recommendedInstallment,
      };
    }),

  // Verificar acesso do usuário ao produto
  checkUserAccess: protectedProcedure
    .input(z.object({
      productId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const userProducts = await db.getUserProducts(ctx.user.id);
      const access = userProducts.find(up => up.userProduct.productId === input.productId);
      
      if (!access) {
        return {
          hasAccess: false,
          purchaseDate: null,
          orderId: null,
        };
      }

      return {
        hasAccess: true,
        purchaseDate: access.userProduct.accessGrantedAt,
        orderId: access.userProduct.orderId,
        message: "Você já possui este produto!",
      };
    }),

  // Criar sessão de checkout
  createSession: protectedProcedure
    .input(z.object({
      productId: z.number(),
      couponCode: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Buscar produto
      const product = await db.getProductById(input.productId);
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Produto não encontrado",
        });
      }

      if (!product.isActive) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Este produto não está disponível para venda",
        });
      }

      // Verificar se usuário já tem acesso
      const hasAccess = await db.hasProductAccess(ctx.user.id, input.productId);
      if (hasAccess) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Você já possui acesso a este produto",
        });
      }

      let finalAmount = product.price;
      let discountAmount = 0;
      let couponId: number | undefined;

      // Aplicar cupom se fornecido
      if (input.couponCode) {
        const coupon = await db.getCouponByCode(input.couponCode);
        
        if (!coupon) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Cupom inválido",
          });
        }

        // Verificar validade do cupom
        const now = new Date();
        if (coupon.validFrom && new Date(coupon.validFrom) > now) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Este cupom ainda não está válido",
          });
        }

        if (coupon.validUntil && new Date(coupon.validUntil) < now) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Este cupom expirou",
          });
        }

        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Este cupom atingiu o limite de usos",
          });
        }

        // Calcular desconto
        if (coupon.discountType === "percentage") {
          discountAmount = Math.floor((finalAmount * coupon.discountValue) / 100);
        } else {
          discountAmount = coupon.discountValue;
        }

        finalAmount = Math.max(50, finalAmount - discountAmount); // Mínimo $0.50
        couponId = coupon.id;
      }

      // Criar pedido pendente
      const orderId = await db.createOrder({
        userId: ctx.user.id,
        productId: input.productId,
        status: "pending",
        amount: finalAmount,
        couponId,
        discountAmount,
      });

      // Criar ou obter Stripe Customer
      let stripeCustomerId = ctx.user.stripeCustomerId;
      
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: ctx.user.email || undefined,
          name: ctx.user.name || undefined,
          metadata: {
            userId: ctx.user.id.toString(),
          },
        });
        stripeCustomerId = customer.id;
        if (stripeCustomerId) {
          await db.updateUserStripeCustomerId(ctx.user.id, stripeCustomerId);
        }
      }

      // Criar sessão de checkout do Stripe
      // PIX e Boleto só disponíveis em modo "payment" (não em subscription)
      const isRecurring = product.isRecurring;
      const paymentMethods = isRecurring
        ? ["card"]
        : ["card", "pix", "boleto"];

      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        mode: isRecurring ? "subscription" : "payment",
        payment_method_types: paymentMethods as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
        payment_method_options: !isRecurring ? {
          boleto: {
            expires_after_days: 3, // Boleto vence em 3 dias
          },
        } : undefined,
        line_items: [
          {
            price_data: {
              currency: "brl",
              product_data: {
                name: product.name,
                description: product.description || undefined,
                images: product.coverImage ? [product.coverImage] : undefined,
              },
              unit_amount: finalAmount,
              ...(product.isRecurring && product.recurringInterval ? {
                recurring: {
                  interval: product.recurringInterval,
                },
              } : {}),
            },
            quantity: 1,
          },
        ],
        allow_promotion_codes: true,
        success_url: `${ctx.req.headers.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${ctx.req.headers.origin}/checkout/cancel`,
        metadata: {
          orderId: orderId.toString(),
          userId: ctx.user.id.toString(),
          productId: input.productId.toString(),
        },
        client_reference_id: ctx.user.id.toString(),
      });

      // Atualizar pedido com session ID
      await db.updateOrder(orderId, {
        stripeCheckoutSessionId: session.id,
      });

      return {
        sessionId: session.id,
        checkoutUrl: session.url,
      };
    }),

  // Verificar cupom
  validateCoupon: publicProcedure
    .input(z.object({
      code: z.string(),
      productId: z.number(),
    }))
    .query(async ({ input }) => {
      const coupon = await db.getCouponByCode(input.code);
      
      if (!coupon) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cupom inválido",
        });
      }

      // Verificar validade
      const now = new Date();
      if (coupon.validFrom && new Date(coupon.validFrom) > now) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Este cupom ainda não está válido",
        });
      }

      if (coupon.validUntil && new Date(coupon.validUntil) < now) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Este cupom expirou",
        });
      }

      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Este cupom atingiu o limite de usos",
        });
      }

      // Buscar produto para calcular desconto
      const product = await db.getProductById(input.productId);
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Produto não encontrado",
        });
      }

      let discountAmount = 0;
      if (coupon.discountType === "percentage") {
        discountAmount = Math.floor((product.price * coupon.discountValue) / 100);
      } else {
        discountAmount = coupon.discountValue;
      }

      const finalPrice = Math.max(50, product.price - discountAmount);

      return {
        valid: true,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        originalPrice: product.price,
        finalPrice,
      };
    }),

  // Criar sessão de assinatura (para planos Freemium/Premium)
  createSubscriptionSession: protectedProcedure
    .input(z.object({
      planSlug: z.string(), // 'librofy-premium-mensal' ou 'librofy-premium-anual'
      affiliateCode: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Buscar plano
      const plans = await db.getAllSubscriptionPlans();
      const plan = plans.find(p => p.slug === input.planSlug);
      
      if (!plan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Plano não encontrado",
        });
      }

      if (!plan.isActive) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Este plano não está disponível",
        });
      }

      // Plano gratuito não precisa de checkout
      if (plan.price === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Plano gratuito não requer pagamento",
        });
      }

      if (!plan.stripePriceId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Plano não configurado no Stripe",
        });
      }

      // Verificar se usuário já tem assinatura ativa
      const existingSubscription = await db.getUserActiveSubscription(ctx.user.id);
      if (existingSubscription) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Você já possui uma assinatura ativa",
        });
      }

      // Criar ou obter Stripe Customer
      let stripeCustomerId = ctx.user.stripeCustomerId;
      
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: ctx.user.email || undefined,
          name: ctx.user.name || undefined,
          metadata: {
            userId: ctx.user.id.toString(),
          },
        });
        stripeCustomerId = customer.id;
        if (stripeCustomerId) {
          await db.updateUserStripeCustomerId(ctx.user.id, stripeCustomerId);
        }
      }

      // Preparar metadata com código de afiliado se fornecido
      const metadata: Record<string, string> = {
        userId: ctx.user.id.toString(),
        planId: plan.id.toString(),
        planSlug: plan.slug,
      };

      if (input.affiliateCode) {
        // Buscar afiliado pelo código
        const affiliate = await db.getAffiliateByCode(input.affiliateCode);
        if (affiliate && affiliate.status === 'approved') {
          metadata.affiliateId = affiliate.id.toString();
          metadata.affiliateCode = input.affiliateCode;
        }
      }

      // Criar sessão de checkout do Stripe para assinatura
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: plan.stripePriceId, // Usar Price ID fixo do Stripe
            quantity: 1,
          },
        ],
        allow_promotion_codes: true,
        success_url: `${ctx.req.headers.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${ctx.req.headers.origin}/products`,
        metadata,
        client_reference_id: ctx.user.id.toString(),
        subscription_data: {
          metadata,
        },
      });

      return {
        sessionId: session.id,
        checkoutUrl: session.url,
      };
    }),

  // Listar pedidos do usuário
  myOrders: protectedProcedure.query(async ({ ctx }) => {
    return await db.getUserOrders(ctx.user.id);
  }),

  // Obter detalhes de um pedido
  getOrder: protectedProcedure
    .input(z.object({
      orderId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const order = await db.getOrderById(input.orderId);
      
      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pedido não encontrado",
        });
      }

      // Verificar se o pedido pertence ao usuário
      if (order.userId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Você não tem permissão para acessar este pedido",
        });
      }

      return order;
    }),

  // Criar sessão do Stripe Customer Portal
  createCustomerPortalSession: protectedProcedure
    .mutation(async ({ ctx }) => {
      // Verificar se usuário tem Stripe Customer ID
      if (!ctx.user.stripeCustomerId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Você não possui uma assinatura ativa",
        });
      }

      try {
        // Criar sessão do Customer Portal
        const session = await stripe.billingPortal.sessions.create({
          customer: ctx.user.stripeCustomerId,
          return_url: `${ctx.req.headers.origin}/dashboard`,
        });

        return {
          url: session.url,
        };
      } catch (error: any) {
        console.error("[Customer Portal] Error creating session:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao criar sessão do portal de gerenciamento",
        });
      }
    }),
});
