import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { creatorProcedure, router } from "../_core/trpc";
import * as db from "../db";

/**
 * Área do Criador — v1
 * Usa tabelas existentes. Acesso via creatorProcedure (hoje = admin).
 */
export const creatorRouter = router({
  dashboard: creatorProcedure.query(async () => {
    const products = await db.getAllProducts();
    const orders = await db.getAllOrders();
    const totalStudents = await db.countDistinctStudents();

    const published = products.filter((p) => p.isActive).length;
    const drafts = products.filter((p) => !p.isActive).length;
    const completedOrders = orders.filter((o) => o.status === "completed");
    const grossRevenue = completedOrders.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0
    );

    const recentSales = completedOrders.slice(0, 8).map((o) => ({
      id: o.id,
      amount: o.totalAmount,
      status: o.status,
      createdAt: o.createdAt,
      customerName: o.user?.name ?? null,
      customerEmail: o.user?.email ?? null,
    }));

    return {
      totalProducts: products.length,
      publishedProducts: published,
      draftProducts: drafts,
      totalStudents,
      grossRevenue,
      recentSales,
      meta: {
        studentsSource: "user_products",
        revenueSource: "orders.status=completed",
        note: "Sem ownership por criador no schema — métricas globais da plataforma.",
      },
    };
  }),

  listProducts: creatorProcedure.query(async () => {
    const products = await db.getAllProducts();
    const withStats = await Promise.all(
      products.map(async (p) => ({
        ...p,
        studentCount: await db.countStudentsByProduct(p.id),
        status: p.isActive ? ("published" as const) : ("draft" as const),
      }))
    );
    return withStats;
  }),

  listCourses: creatorProcedure.query(async () => {
    const products = await db.getAllProducts();
    return products.filter((p) => p.type === "course");
  }),

  getCourseBuilder: creatorProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      const product = await db.getProductById(input.productId);
      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Produto não encontrado" });
      }
      if (product.type !== "course") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Construtor disponível apenas para produtos do tipo curso",
        });
      }
      const structure = await db.getCourseStructureForBuilder(input.productId);
      return { product, ...structure };
    }),

  createModule: creatorProcedure
    .input(
      z.object({
        productId: z.number(),
        title: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const structure = await db.getCourseStructureForBuilder(input.productId);
      const nextOrder =
        structure.modules.reduce((max, m) => Math.max(max, m.order), 0) + 1;
      const id = await db.createCourseModule({
        courseId: structure.course.id,
        title: input.title,
        description: input.description ?? null,
        order: nextOrder,
      });
      return { id };
    }),

  updateModule: creatorProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateCourseModule(id, data);
      return { success: true };
    }),

  deleteModule: creatorProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deleteCourseModule(input.id);
      return { success: true };
    }),

  moveModule: creatorProcedure
    .input(
      z.object({
        productId: z.number(),
        moduleId: z.number(),
        direction: z.enum(["up", "down"]),
      })
    )
    .mutation(async ({ input }) => {
      const { modules } = await db.getCourseStructureForBuilder(input.productId);
      const idx = modules.findIndex((m) => m.id === input.moduleId);
      if (idx < 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Módulo não encontrado" });
      }
      const swapIdx = input.direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= modules.length) {
        return { success: true };
      }
      await db.swapModuleOrder(modules[idx].id, modules[swapIdx].id);
      return { success: true };
    }),

  createLesson: creatorProcedure
    .input(
      z.object({
        moduleId: z.number(),
        title: z.string().min(1),
        description: z.string().optional(),
        type: z.enum(["video", "text", "pdf", "audio"]),
        contentUrl: z.string().optional(),
        duration: z.number().min(0).optional(),
        isFree: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const lessons = await db.getModuleLessons(input.moduleId);
      const nextOrder = lessons.reduce((max, l) => Math.max(max, l.order), 0) + 1;
      const id = await db.createCourseLesson({
        moduleId: input.moduleId,
        title: input.title,
        description: input.description ?? null,
        type: input.type,
        contentUrl: input.contentUrl ?? null,
        duration: input.duration ?? null,
        order: nextOrder,
        isFree: input.isFree ?? false,
      });
      return { id };
    }),

  updateLesson: creatorProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        type: z.enum(["video", "text", "pdf", "audio"]).optional(),
        contentUrl: z.string().optional(),
        duration: z.number().min(0).optional(),
        isFree: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateCourseLesson(id, data);
      return { success: true };
    }),

  deleteLesson: creatorProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deleteCourseLesson(input.id);
      return { success: true };
    }),

  moveLesson: creatorProcedure
    .input(
      z.object({
        moduleId: z.number(),
        lessonId: z.number(),
        direction: z.enum(["up", "down"]),
      })
    )
    .mutation(async ({ input }) => {
      const lessons = await db.getModuleLessons(input.moduleId);
      const idx = lessons.findIndex((l) => l.id === input.lessonId);
      if (idx < 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Aula não encontrada" });
      }
      const swapIdx = input.direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= lessons.length) {
        return { success: true };
      }
      await db.swapLessonOrder(lessons[idx].id, lessons[swapIdx].id);
      return { success: true };
    }),
});
