import {
  certificateTemplate,
  courseTemplate,
  emailTemplate,
  formatCertificate,
  formatCourseOutline,
  formatQuiz,
  formatSalesPage,
  quizTemplate,
  salesPageTemplate,
  writerTemplate,
} from "../AITemplates";
import type { AIGenerateRequest, AIGenerateResult, EmailKind, WriterContentType } from "../types";
import type { AIProviderAdapter } from "./types";

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function uid() {
  return crypto.randomUUID();
}

export const mockProvider: AIProviderAdapter = {
  id: "mock",
  label: "Mock Demo",
  ready: true,

  async generate(request: AIGenerateRequest): Promise<AIGenerateResult> {
    const started = performance.now();
    await delay(650 + Math.random() * 500);

    const ctx = request.context ?? {};
    let content = "";
    let structured: unknown;

    switch (request.tool) {
      case "writer": {
        const type = (ctx.contentType as WriterContentType) || "headline";
        const topic = String(ctx.topic || request.prompt);
        content = writerTemplate(type, topic);
        structured = { contentType: type, topic };
        break;
      }
      case "course": {
        const outline = courseTemplate({
          title: String(ctx.title || ""),
          audience: String(ctx.audience || ""),
          objective: String(ctx.objective || ""),
          workloadHours: Number(ctx.workloadHours || 8),
          level: String(ctx.level || "Iniciante"),
        });
        structured = outline;
        content = formatCourseOutline(outline);
        break;
      }
      case "quiz": {
        const quiz = quizTemplate(
          String(ctx.topic || request.prompt),
          Number(ctx.count || 5)
        );
        structured = quiz;
        content = formatQuiz(quiz);
        break;
      }
      case "certificate": {
        const cert = certificateTemplate({
          courseName: String(ctx.courseName || ""),
          issuerName: String(ctx.issuerName || "ContentFy"),
          workloadHours: Number(ctx.workloadHours || 8),
          signatureName: String(ctx.signatureName || "Direção Acadêmica"),
        });
        structured = cert;
        content = formatCertificate(cert);
        break;
      }
      case "emails": {
        const kind = (ctx.kind as EmailKind) || "launch";
        content = emailTemplate(kind, String(ctx.productName || request.prompt));
        structured = { kind };
        break;
      }
      case "sales-page": {
        const page = salesPageTemplate(
          String(ctx.productName || request.prompt),
          String(ctx.audience || "")
        );
        structured = page;
        content = formatSalesPage(page);
        break;
      }
      default:
        content = "Geração demonstrativa concluída.";
    }

    return {
      id: uid(),
      content,
      structured,
      provider: "mock",
      latencyMs: Math.round(performance.now() - started),
      demo: true,
    };
  },
};
