/**
 * Assets oficiais do Representante 4.0 (importados da LP).
 * Origem: representante-40-vendas — sem placeholders SVG.
 */

const BASE = "/products/representante40";

export const REPRESENTANTE40_ASSETS = {
  /** Mockup completo: livro 3D + notebook Rep4.0CRM + bônus + mapa */
  mockupKit: `${BASE}/mockup-kit.webp`,
  mockupKitSrcSet: [
    `${BASE}/mockup-kit-640.webp 640w`,
    `${BASE}/mockup-kit-960.webp 960w`,
    `${BASE}/mockup-kit-1280.webp 1280w`,
    `${BASE}/mockup-kit.webp 1600w`,
  ].join(", "),
  mockupKitSizes:
    "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 720px",

  /** Capa premium do Manual */
  coverPremium: `${BASE}/cover-premium.webp`,
  coverPremiumSrcSet: [
    `${BASE}/cover-premium-400.webp 400w`,
    `${BASE}/cover-premium-800.webp 800w`,
    `${BASE}/cover-premium-1200.webp 1200w`,
  ].join(", "),
  coverPremiumSizes: "(max-width: 640px) 70vw, 320px",

  /** Capa alternativa (versão LP) */
  coverAlt: `${BASE}/cover-alt.webp`,
  coverAltSrcSet: [
    `${BASE}/cover-alt-400.webp 400w`,
    `${BASE}/cover-alt-800.webp 800w`,
  ].join(", "),

  /** Screenshot / mockup laptop Rep4.0CRM */
  crmLaptop: `${BASE}/livro-crm.webp`,
  crmLaptopSrcSet: [
    `${BASE}/livro-crm-640.webp 640w`,
    `${BASE}/livro-crm-960.webp 960w`,
    `${BASE}/livro-crm-1280.webp 1280w`,
  ].join(", "),
  crmLaptopSizes: "(max-width: 768px) 100vw, 640px",

  kitHero: `${BASE}/kit-hero.webp`,
  logo: `${BASE}/logo.webp`,
} as const;
