/**
 * Assets oficiais do Desacelere (mockup kit horizontal).
 */

const BASE = "/products/desacelere";

export const DESACELERE_ASSETS = {
  /** Mockup completo: livro + laptop + planner */
  mockupKit: `${BASE}/mockup-kit.webp`,
  mockupKitSrcSet: [
    `${BASE}/mockup-kit-640.webp 640w`,
    `${BASE}/mockup-kit-960.webp 960w`,
    `${BASE}/mockup-kit-1280.webp 1280w`,
    `${BASE}/mockup-kit.webp 1600w`,
  ].join(", "),
  mockupKitSizes:
    "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 720px",
} as const;
