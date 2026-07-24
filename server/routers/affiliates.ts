import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import * as db from "../db";

/**
 * Affiliates Router - Sistema de afiliados
 */
export const affiliatesRouter = router({
  // Cadastrar como afiliado
  register: protectedProcedure
    .input(z.object({
      paymentMethod: z.enum(["pix", "bank_transfer"]),
      paymentDetails: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verificar se já é afiliado
      const existingAffiliate = await db.getAffiliateByUserId(ctx.user.id);
      if (existingAffiliate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Você já está cadastrado como afiliado",
        });
      }

      // Criar afiliado
      const affiliate = await db.createAffiliate({
        userId: ctx.user.id,
        affiliateCode: `AFF${ctx.user.id}${Date.now().toString().slice(-6)}`,
        commissionRate: 20, // 20% de comissão padrão
        isActive: false, // Aguardando aprovação
      });

      return {
        success: true,
        affiliate,
        message: "Cadastro enviado! Aguarde aprovação do administrador.",
      };
    }),

  // Obter dados do afiliado atual
  getMyAffiliateData: protectedProcedure.query(async ({ ctx }) => {
    const affiliate = await db.getAffiliateByUserId(ctx.user.id);
    if (!affiliate) {
      return null;
    }

    return affiliate;
  }),

  // Gerar link de afiliado para um produto
  generateLink: protectedProcedure
    .input(z.object({
      productSlug: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const affiliate = await db.getAffiliateByUserId(ctx.user.id);
      if (!affiliate) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Você não é um afiliado cadastrado",
        });
      }

      if (!affiliate.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Seu cadastro de afiliado ainda não foi aprovado",
        });
      }

      // Gerar link
      const baseUrl = process.env.VITE_APP_URL || "http://localhost:3000";
      const affiliateLink = `${baseUrl}/products/${input.productSlug}?ref=${affiliate.affiliateCode}`;

      return {
        link: affiliateLink,
        code: affiliate.affiliateCode,
      };
    }),

  // Obter estatísticas do afiliado
  getMyStats: protectedProcedure.query(async ({ ctx }) => {
    const affiliate = await db.getAffiliateByUserId(ctx.user.id);
    if (!affiliate) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Você não é um afiliado cadastrado",
      });
    }

    // Buscar vendas do afiliado
    const sales = await db.getAffiliateSales(affiliate.id);

    // Calcular estatísticas
    const totalSales = sales.length;
    const totalEarnings = sales.reduce((sum, sale) => sum + sale.commissionAmount, 0);
    const pendingEarnings = sales
      .filter((s) => s.status === "pending")
      .reduce((sum, sale) => sum + sale.commissionAmount, 0);
    const paidEarnings = sales
      .filter((s) => s.status === "paid")
      .reduce((sum, sale) => sum + sale.commissionAmount, 0);

    return {
      totalSales,
      totalEarnings,
      pendingEarnings,
      paidEarnings,
      commissionRate: affiliate.commissionRate,
    };
  }),

  // Listar vendas do afiliado
  getMySales: protectedProcedure.query(async ({ ctx }) => {
    const affiliate = await db.getAffiliateByUserId(ctx.user.id);
    if (!affiliate) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Você não é um afiliado cadastrado",
      });
    }

    const sales = await db.getAffiliateSales(affiliate.id);
    return sales;
  }),

  // Solicitar saque
  requestWithdrawal: protectedProcedure
    .input(z.object({
      amount: z.number().positive(),
    }))
    .mutation(async ({ ctx, input }) => {
      const affiliate = await db.getAffiliateByUserId(ctx.user.id);
      if (!affiliate) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Você não é um afiliado cadastrado",
        });
      }

      // Verificar saldo disponível
      const sales = await db.getAffiliateSales(affiliate.id);
      const availableBalance = sales
        .filter((s) => s.status === "approved")
        .reduce((sum, sale) => sum + sale.commissionAmount, 0);

      if (input.amount > availableBalance) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Saldo insuficiente para saque",
        });
      }

      // TODO: Criar registro de solicitação de saque
      // Por enquanto, apenas retornar sucesso

      return {
        success: true,
        message: "Solicitação de saque enviada com sucesso!",
      };
    }),

  // Obter estatísticas de MRR (Monthly Recurring Revenue)
  getMRRStats: protectedProcedure.query(async ({ ctx }) => {
    const affiliate = await db.getAffiliateByUserId(ctx.user.id);
    if (!affiliate) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Você não é um afiliado cadastrado",
      });
    }

    // Buscar assinaturas ativas geradas pelo afiliado
    const activeSubscriptions = await db.getAffiliateActiveSubscriptions(affiliate.id);
    
    // Calcular MRR total
    const mrr = activeSubscriptions.reduce((sum: number, sub: any) => {
      // Converter anual para mensal se necessário
      const monthlyAmount = sub.recurringInterval === 'year' 
        ? sub.commissionAmount / 12 
        : sub.commissionAmount;
      return sum + monthlyAmount;
    }, 0);

    // Calcular ARR (Annual Recurring Revenue)
    const arr = mrr * 12;

    // Calcular taxa de conversão (se houver dados de cliques)
    const totalClicks = await db.getAffiliateTotalClicks(affiliate.id);
    const conversionRate = totalClicks > 0 
      ? (activeSubscriptions.length / totalClicks) * 100 
      : 0;

    return {
      mrr: Math.round(mrr),
      arr: Math.round(arr),
      activeSubscribers: activeSubscriptions.length,
      conversionRate: conversionRate.toFixed(2),
      nextPaymentDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
    };
  }),

  // Listar assinantes ativos gerados pelo afiliado
  getActiveSubscribers: protectedProcedure.query(async ({ ctx }) => {
    const affiliate = await db.getAffiliateByUserId(ctx.user.id);
    if (!affiliate) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Você não é um afiliado cadastrado",
      });
    }

    const subscribers = await db.getAffiliateActiveSubscriptions(affiliate.id);
    return subscribers;
  }),

  // Histórico mensal de MRR (últimos 6 meses)
  getMRRHistory: protectedProcedure.query(async ({ ctx }) => {
    const affiliate = await db.getAffiliateByUserId(ctx.user.id);
    if (!affiliate) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Você não é um afiliado cadastrado",
      });
    }

    const history = await db.getAffiliateMRRHistory(affiliate.id, 6);
    return history;
  }),

  // ADMIN: Listar todos os afiliados
  listAll: protectedProcedure.query(async ({ ctx }) => {
    // TODO: Adicionar verificação de role admin
    const affiliates = await db.getAllAffiliates();
    return affiliates;
  }),

  // ADMIN: Aprovar afiliado
  approve: protectedProcedure
    .input(z.object({
      affiliateId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Adicionar verificação de role admin
      await db.updateAffiliateStatus(input.affiliateId, true);

      return {
        success: true,
        message: "Afiliado aprovado com sucesso!",
      };
    }),

  // ADMIN: Rejeitar afiliado
  reject: protectedProcedure
    .input(z.object({
      affiliateId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Adicionar verificação de role admin
      await db.updateAffiliateStatus(input.affiliateId, false);

      return {
        success: true,
        message: "Afiliado rejeitado",
      };
    }),
});
