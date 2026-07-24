import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import * as db from "../db";

/**
 * Certificates Router - Sistema de certificados
 */
export const certificatesRouter = router({
  // Gerar certificado para um curso concluído
  generate: protectedProcedure
    .input(z.object({
      courseId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verificar se o usuário tem acesso ao curso
      const userProducts = await db.getUserProducts(ctx.user.id);
      const hasCourse = userProducts.some(up => up.userProduct.productId === input.courseId);
      
      if (!hasCourse) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Você não tem acesso a este curso",
        });
      }

      // Obter informações do curso
      const course = await db.getProductById(input.courseId);
      if (!course || course.type !== "course") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Curso não encontrado",
        });
      }

      // TODO: Verificar progresso do curso quando implementarmos tracking de progresso
      // Por enquanto, permitir geração do certificado se o usuário tem acesso ao curso

      // Verificar se já existe certificado
      const existing = await db.getCertificateByUserAndCourse(
        ctx.user.id,
        input.courseId
      );

      if (existing) {
        return {
          certificate: existing,
          message: "Certificado já foi gerado anteriormente",
        };
      }

      // Gerar código único
      const certificateCode = `CERT${ctx.user.id}${input.courseId}${Date.now().toString().slice(-8)}`.toUpperCase();

      // Criar certificado
      const certificate = await db.createCertificate({
        userId: ctx.user.id,
        courseId: input.courseId,
        certificateCode,
        issuedAt: new Date(),
      });

      return {
        certificate,
        message: "Certificado gerado com sucesso!",
      };
    }),

  // Listar certificados do usuário
  getMyCertificates: protectedProcedure.query(async ({ ctx }) => {
    const certificates = await db.getUserCertificates(ctx.user.id);
    return certificates;
  }),

  // Validar certificado por código (público)
  validate: protectedProcedure
    .input(z.object({
      certificateCode: z.string(),
    }))
    .query(async ({ input }) => {
      const certificate = await db.getCertificateByCode(input.certificateCode);
      
      if (!certificate) {
        return {
          valid: false,
          message: "Certificado não encontrado",
        };
      }

      return {
        valid: true,
        certificate,
        message: "Certificado válido",
      };
    }),
});
