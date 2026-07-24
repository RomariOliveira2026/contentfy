import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import * as db from "../db";

/**
 * Products Router - Gestão completa de produtos
 */
export const productsRouter = router({
  // Listar categorias (público)
  listCategories: publicProcedure.query(async () => {
    return await db.getAllProductCategories();
  }),

  // Listar todos os produtos (público)
  list: publicProcedure.query(async () => {
    return await db.getAllProducts();
  }),

  // Listar produtos por tipo (público)
  listByType: publicProcedure
    .input(z.object({
      type: z.enum(["ebook", "audiobook", "course", "app"]),
    }))
    .query(async ({ input }) => {
      return await db.getProductsByType(input.type);
    }),

  // Obter produto por ID (público)
  getById: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      const product = await db.getProductById(input.id);
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Produto não encontrado",
        });
      }
      return product;
    }),

  // Obter produto por slug (público)
  getBySlug: publicProcedure
    .input(z.object({
      slug: z.string(),
    }))
    .query(async ({ input }) => {
      const product = await db.getProductBySlug(input.slug);
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Produto não encontrado",
        });
      }
      return product;
    }),

  // Criar produto (apenas admin)
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional(),
      type: z.enum(["ebook", "audiobook", "course", "app"]),
      categoryId: z.number().optional(),
      price: z.number().min(0), // Preço em centavos
      isRecurring: z.boolean().default(false),
      recurringInterval: z.enum(["month", "year"]).optional(),
      allowInstallments: z.boolean().default(true),
      maxInstallments: z.number().min(1).max(12).default(12),
      coverImage: z.string().optional(),
      thumbnailImage: z.string().optional(),
      contentUrl: z.string().optional(), // URL do arquivo do produto (PDF, MP3, etc.)
      salesPageUrl: z.string().optional(),
      guaranteeDays: z.number().min(0).default(30),
      affiliateCommission: z.number().min(50).max(70).default(60),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verificar se é admin
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem criar produtos",
        });
      }

      // Verificar se slug já existe
      const existing = await db.getProductBySlug(input.slug);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Já existe um produto com este slug",
        });
      }

      await db.createProduct({
        ...input,
        isActive: true,
      });

      return { success: true };
    }),

  // Atualizar produto (apenas admin)
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).optional(),
      slug: z.string().min(1).optional(),
      description: z.string().optional(),
      type: z.enum(["ebook", "audiobook", "course", "app"]).optional(),
      categoryId: z.number().optional(),
      price: z.number().min(0).optional(),
      isRecurring: z.boolean().optional(),
      recurringInterval: z.enum(["month", "year"]).optional(),
      allowInstallments: z.boolean().optional(),
      maxInstallments: z.number().min(1).max(12).optional(),
      coverImage: z.string().optional(),
      thumbnailImage: z.string().optional(),
      contentUrl: z.string().optional(), // URL do arquivo do produto (PDF, MP3, etc.)
      salesPageUrl: z.string().optional(),
      guaranteeDays: z.number().min(0).optional(),
      affiliateCommission: z.number().min(50).max(70).optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verificar se é admin
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem atualizar produtos",
        });
      }

      const { id, ...data } = input;

      // Verificar se produto existe
      const product = await db.getProductById(id);
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Produto não encontrado",
        });
      }

      await db.updateProduct(id, data);

      return { success: true };
    }),

  // Duplicar produto (apenas admin)
  duplicate: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verificar se é admin
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem duplicar produtos",
        });
      }

      // Buscar produto original
      const originalProduct = await db.getProductById(input.id);
      if (!originalProduct) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Produto não encontrado",
        });
      }

      // Gerar novo slug único
      const timestamp = Date.now();
      const newSlug = `${originalProduct.slug}-copia-${timestamp}`;

      // Criar produto duplicado
      const duplicatedProduct = await db.createProduct({
        name: `${originalProduct.name} (Cópia)`,
        slug: newSlug,
        description: originalProduct.description,
        type: originalProduct.type,
        categoryId: originalProduct.categoryId,
        price: originalProduct.price,
        isRecurring: originalProduct.isRecurring,
        recurringInterval: originalProduct.recurringInterval,
        salesPageUrl: originalProduct.salesPageUrl,
        isActive: false, // Duplicado começa inativo
        guaranteeDays: originalProduct.guaranteeDays,
      });

      return duplicatedProduct;
    }),

  // Deletar produto (soft delete - apenas admin)
  delete: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verificar se é admin
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem deletar produtos",
        });
      }

      // Verificar se produto existe
      const product = await db.getProductById(input.id);
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Produto não encontrado",
        });
      }

      await db.deleteProduct(input.id);

      return { success: true };
    }),

  // Verificar se usuário tem acesso ao produto
  hasAccess: protectedProcedure
    .input(z.object({
      productId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const hasAccess = await db.hasProductAccess(ctx.user.id, input.productId);
      return { hasAccess };
    }),

  // Listar produtos do usuário (área de membros)
  myProducts: protectedProcedure.query(async ({ ctx }) => {
    return await db.getUserProducts(ctx.user.id);
  }),
});
