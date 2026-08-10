/**
 * Produtos do portfólio com checkout ContentFy ativo.
 * Garante que /checkout/{slug} funcione mesmo antes do cadastro manual no admin.
 */

export interface PortfolioCheckoutProduct {
  slug: string;
  name: string;
  description: string;
  type: "ebook" | "audiobook" | "course" | "app";
  price: number;
  coverImage: string;
  thumbnailImage: string;
  salesPageUrl: string;
  guaranteeDays: number;
  maxInstallments: number;
}

export const PORTFOLIO_CHECKOUT_PRODUCTS: PortfolioCheckoutProduct[] = [
  {
    slug: "desacelere",
    name: "Desacelere",
    description:
      "Paz e equilíbrio para sua mente — guia completo com módulos, exercícios e quizzes.",
    type: "ebook",
    price: 9700,
    coverImage: "/products/desacelere/mockup-kit.webp",
    thumbnailImage: "/products/desacelere/mockup-kit.webp",
    salesPageUrl: "https://desacelere.contentfy.com.br/",
    guaranteeDays: 30,
    maxInstallments: 10,
  },
  {
    slug: "manual-do-representante-comercial",
    name: "Manual Representante 4.0",
    description:
      "Ecossistema premium do representante comercial moderno com IA — manual, CRM e bônus.",
    type: "ebook",
    price: 9700,
    coverImage: "/products/representante40/mockup-kit.webp",
    thumbnailImage: "/products/representante40/cover-premium.webp",
    salesPageUrl: "https://representante40.com.br/",
    guaranteeDays: 30,
    maxInstallments: 10,
  },
];

export function getPortfolioCheckoutProduct(slug: string) {
  return PORTFOLIO_CHECKOUT_PRODUCTS.find((p) => p.slug === slug) ?? null;
}
