import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import * as db from "../db";

/**
 * Members Router - Área de membros e gestão de produtos do usuário
 */
export const membersRouter = router({
  // Listar produtos do usuário
  myProducts: protectedProcedure.query(async ({ ctx }) => {
    const userProducts = await db.getUserProducts(ctx.user.id);
    
    return userProducts.map((up) => ({
      userProduct: up.userProduct,
      product: up.product,
      progress: 0, // TODO: Calcular progresso real baseado nas aulas concluídas
    }));
  }),

  // Obter detalhes de um produto específico do usuário
  getMyProduct: protectedProcedure
    .input(z.object({
      productId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const userProducts = await db.getUserProducts(ctx.user.id);
      const userProduct = userProducts.find(
        (up) => up.userProduct.productId === input.productId
      );

      if (!userProduct) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Você não possui acesso a este produto",
        });
      }

      return {
        userProduct: userProduct.userProduct,
        product: userProduct.product,
        progress: 0, // TODO: Calcular progresso real
      };
    }),

  // Obter estrutura de curso (módulos + aulas)
  getCourseStructure: protectedProcedure
    .input(z.object({
      productId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      // Verificar se usuário tem acesso
      const userProducts = await db.getUserProducts(ctx.user.id);
      const hasAccess = userProducts.some(
        (up) => up.userProduct.productId === input.productId
      );

      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Você não possui acesso a este curso",
        });
      }

      // Buscar curso
      const course = await db.getCourseByProductId(input.productId);
      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Curso não encontrado",
        });
      }

      // Buscar módulos e aulas
      const modules = await db.getCourseModules(course.id);
      const modulesWithLessons = await Promise.all(
        modules.map(async (module) => {
          const lessons = await db.getModuleLessons(module.id);
          
          // Buscar progresso de cada aula
          const lessonsWithProgress = await Promise.all(
            lessons.map(async (lesson) => {
              const progress = await db.getUserLessonProgress(ctx.user.id, lesson.id);
              return {
                ...lesson,
                isCompleted: progress?.isCompleted || false,
                lastWatchedAt: progress?.lastWatchedAt || null,
              };
            })
          );

          return {
            ...module,
            lessons: lessonsWithProgress,
          };
        })
      );

      // Calcular progresso total
      const totalLessons = modulesWithLessons.reduce(
        (sum, module) => sum + module.lessons.length,
        0
      );
      const completedLessons = modulesWithLessons.reduce(
        (sum, module) =>
          sum + module.lessons.filter((l) => l.isCompleted).length,
        0
      );
      const progressPercentage =
        totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        course,
        modules: modulesWithLessons,
        stats: {
          totalModules: modulesWithLessons.length,
          totalLessons,
          completedLessons,
          progressPercentage,
        },
      };
    }),

  // Marcar aula como concluída
  markLessonComplete: protectedProcedure
    .input(z.object({
      lessonId: z.number(),
      isCompleted: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Adicionar validação de acesso ao curso
      // Por enquanto, apenas salvar o progresso

      // Atualizar progresso
      await db.updateLessonProgress({
        userId: ctx.user.id,
        lessonId: input.lessonId,
        isCompleted: input.isCompleted,
        lastWatchedAt: new Date(),
      });

      return {
        success: true,
        message: input.isCompleted
          ? "Aula marcada como concluída"
          : "Progresso salvo",
      };
    }),

  // Obter estatísticas do usuário
  getMyStats: protectedProcedure.query(async ({ ctx }) => {
    const userProducts = await db.getUserProducts(ctx.user.id);

    // Contar por tipo
    const stats = {
      totalProducts: userProducts.length,
      courses: userProducts.filter((up) => up.product?.type === "course").length,
      ebooks: userProducts.filter((up) => up.product?.type === "ebook").length,
      audiobooks: userProducts.filter((up) => up.product?.type === "audiobook")
        .length,
      apps: userProducts.filter((up) => up.product?.type === "app").length,
    };

    return stats;
  }),
});
