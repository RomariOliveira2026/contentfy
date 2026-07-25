import type { EmailKind, WriterContentType } from "./types";

export const WRITER_LABELS: Record<WriterContentType, string> = {
  headline: "Headline",
  subtitle: "Subtítulo",
  promise: "Promessa",
  short_description: "Descrição curta",
  long_description: "Descrição longa",
  bullets: "Bullets de benefícios",
  faq: "FAQ",
  cta: "CTA",
  sales_page: "Página de vendas (copy)",
};

export function buildWriterPrompt(
  contentType: WriterContentType,
  topic: string,
  audience?: string
) {
  return [
    `Gere ${WRITER_LABELS[contentType]} em português brasileiro.`,
    `Tema/produto: ${topic}`,
    audience ? `Público: ${audience}` : null,
    "Tom: premium, direto, persuasivo, sem exageros absurdos.",
    "Formato pronto para colar em uma landing ou ficha de produto.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildCoursePrompt(input: {
  title: string;
  audience: string;
  objective: string;
  workloadHours: number;
  level: string;
}) {
  return [
    "Monte a estrutura completa de um curso digital.",
    `Título: ${input.title}`,
    `Público: ${input.audience}`,
    `Objetivo: ${input.objective}`,
    `Carga horária: ${input.workloadHours}h`,
    `Nível: ${input.level}`,
    "Entregue módulos, aulas, objetivos, exercícios e materiais sugeridos.",
  ].join("\n");
}

export function buildQuizPrompt(topic: string, count: number, level: string) {
  return [
    `Crie um quiz com ${count} questões sobre: ${topic}`,
    `Nível: ${level}`,
    "Cada questão com 4 alternativas, 1 correta e explicação curta.",
  ].join("\n");
}

export function buildCertificatePrompt(input: {
  courseName: string;
  issuerName: string;
  workloadHours: number;
  signatureName: string;
}) {
  return [
    "Gere o texto e metadados de um certificado digital.",
    `Curso: ${input.courseName}`,
    `Emissor: ${input.issuerName}`,
    `Carga horária: ${input.workloadHours}h`,
    `Assinatura: ${input.signatureName}`,
    "Reserve espaço para QR Code de validação futura.",
  ].join("\n");
}

export const EMAIL_LABELS: Record<EmailKind, string> = {
  launch: "Lançamento",
  cart_open: "Carrinho aberto",
  cart_closing: "Carrinho fechando",
  welcome: "Boas-vindas",
  recovery: "Recuperação",
  post_sale: "Pós-venda",
};

export function buildEmailPrompt(kind: EmailKind, productName: string) {
  return [
    `Escreva um email de ${EMAIL_LABELS[kind]} em português.`,
    `Produto: ${productName}`,
    "Inclua assunto + corpo + CTA.",
    "Tom: humano, premium, conversacional.",
  ].join("\n");
}

export function buildSalesPagePrompt(productName: string, audience: string) {
  return [
    "Gere a estrutura completa de uma página de vendas.",
    `Produto: ${productName}`,
    `Público: ${audience}`,
    "Seções: Hero, Benefícios, Depoimentos, Oferta, Garantia, CTA, FAQ.",
  ].join("\n");
}
