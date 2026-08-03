/**
 * ContentFy — Digital Knowledge Operating System
 * BuilderTudo Technologies · Proprietary Platform
 */

export const CONTENTFY_IDENTITY = {
  name: "ContentFy",
  company: "BuilderTudo Technologies",
  category: "Sistema Operacional do Conhecimento Digital",
  tagline: "Tecnologia proprietária para criar, vender e evoluir conhecimento digital.",
  paymentLabel: "Pagamento ContentFy",
  guaranteeDays: 30,
  guaranteeLabel: "Garantia ContentFy",
} as const;

export type ContentFyIdentity = typeof CONTENTFY_IDENTITY;
