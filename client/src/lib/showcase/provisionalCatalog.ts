/**
 * PROVISIONAL SHOWCASE CATALOG
 * ---------------------------
 * Camada tipada e centralizada para a vitrine pública.
 * Substituir/mesclar pela API (`trpc.products`) quando os registros
 * estiverem persistidos e publicados. Não inventa preços, autores,
 * avaliações nem métricas comerciais.
 */

import type { ShowcaseProduct } from "./types";
import { REPRESENTANTE40_ASSETS as R40 } from "./representante40Assets";

const DESACELERE_HERO =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663097022226/Qf2ybVS3fKbp69WuPYRytJ/desacelere_hero_bg-49SjHkZ9Zq4VXLF5SeHWvU.webp";
const DESACELERE_COVER =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663097022226/Qf2ybVS3fKbp69WuPYRytJ/desacelere_mockup_oficial-FDXUTUiPqGyfYHoemKGAag.webp";

export const PROVISIONAL_SHOWCASE_CATALOG: ShowcaseProduct[] = [
  {
    id: "provisional:desacelere",
    slug: "desacelere",
    name: "Desacelere",
    type: "ebook",
    typeLabel: "E-book",
    category: "Bem-estar e desenvolvimento pessoal",
    tags: [
      "desaceleração",
      "equilíbrio",
      "rotina",
      "bem-estar",
      "qualidade de vida",
    ],
    collections: ["launches", "featured", "routine", "keep-exploring"],
    slogan: "Recupere presença e construa uma rotina mais equilibrada.",
    shortDescription:
      "Um guia completo para desacelerar, recuperar presença e construir uma rotina mais equilibrada.",
    description:
      "Um guia completo para desacelerar, recuperar presença e construir uma rotina mais equilibrada. Conteúdo prático para quem deseja organizar pensamentos, reduzir o ritmo e viver com mais clareza, leveza e propósito.",
    benefits: [
      "Clareza para priorizar o que importa",
      "Práticas para recuperar presença no dia a dia",
      "Rotina mais sustentável, sem performance tóxica",
      "Leitura objetiva, aplicável na vida real",
    ],
    audience: [
      "Profissionais com rotina acelerada",
      "Pessoas buscando equilíbrio e bem-estar",
      "Quem quer reduzir o ruído mental do dia a dia",
    ],
    included: [
      "E-book digital completo",
      "Orientação prática para aplicação imediata",
      "Acesso em qualquer dispositivo",
    ],
    heroImage: DESACELERE_HERO,
    coverImage: DESACELERE_COVER,
    landscapeImage: DESACELERE_HERO,
    imageFit: "contain",
    galleryImages: [
      {
        src: DESACELERE_COVER,
        alt: "Mockup oficial do e-book Desacelere",
        fit: "contain",
      },
      {
        src: DESACELERE_HERO,
        alt: "Atmosfera visual Desacelere — presença e equilíbrio",
        fit: "cover",
      },
    ],
    priceCents: 9700,
    isPublished: true,
    visibility: "available",
    isPrelaunch: false,
    isLaunch: true,
    isFeatured: true,
    isNew: true,
    level: "Iniciante",
    guaranteeDays: 30,
    salesPageUrl: "/desacelere",
    seoTitle: "Desacelere | ContentFy",
    seoDescription:
      "Desacelere — guia ContentFy para presença, equilíbrio e rotina com mais clareza.",
    source: "provisional",
  },
  {
    id: "provisional:manual-do-representante-comercial",
    slug: "manual-do-representante-comercial",
    name: "Manual Representante 4.0",
    type: "ebook",
    typeLabel: "Manual",
    category: "Vendas e carreira",
    tags: [
      "representação comercial",
      "vendas B2B",
      "prospecção",
      "negociação",
      "carreira",
      "representante 4.0",
      "CRM",
    ],
    collections: [
      "launches",
      "featured",
      "sales-career",
      "ebooks-manuals",
      "keep-exploring",
    ],
    slogan: "Venda mais. Organize melhor. Represente com inteligência.",
    shortDescription:
      "O manual premium do representante comercial moderno com IA — ecossistema com CRM, bônus e mapa de alta performance.",
    description:
      "Ecossistema Representante 4.0: manual premium, Rep4.0CRM, prompts de IA, mensagens prontas, checklists e modelos comerciais. Preço e publicação oficial serão confirmados no cadastro.",
    benefits: [
      "Estrutura clara para organizar a operação comercial",
      "Rep4.0CRM para visão 360° da carteira",
      "Bônus práticos: metas, prospecção e checklists",
    ],
    audience: [
      "Representantes comerciais",
      "Profissionais de vendas B2B",
      "Quem está estruturando a carreira em representação",
    ],
    included: [
      "Manual Representante 4.0 (digital)",
      "Acesso ao ecossistema Rep4.0CRM",
      "Bônus e mapa do representante",
    ],
    author: "Romário Oliveira",
    heroImage: R40.mockupKit,
    coverImage: R40.coverPremium,
    landscapeImage: R40.mockupKit,
    imageFit: "contain",
    imageSrcSet: R40.mockupKitSrcSet,
    imageSizes: R40.mockupKitSizes,
    galleryImages: [
      {
        src: R40.mockupKit,
        alt: "Mockup completo Representante 4.0 — livro, CRM, bônus e mapa",
        srcSet: R40.mockupKitSrcSet,
        sizes: "(max-width: 768px) 100vw, 800px",
        fit: "contain",
      },
      {
        src: R40.coverPremium,
        alt: "Capa premium do Manual Representante 4.0",
        srcSet: R40.coverPremiumSrcSet,
        sizes: "(max-width: 768px) 80vw, 360px",
        fit: "contain",
      },
      {
        src: R40.crmLaptop,
        alt: "Rep4.0CRM — dashboard no notebook",
        srcSet: R40.crmLaptopSrcSet,
        sizes: "(max-width: 768px) 100vw, 720px",
        fit: "contain",
      },
      {
        src: R40.coverAlt,
        alt: "Capa do Manual Representante 4.0",
        srcSet: R40.coverAltSrcSet,
        sizes: "(max-width: 768px) 80vw, 360px",
        fit: "contain",
      },
      {
        src: R40.kitHero,
        alt: "Composição kit Representante 4.0",
        fit: "contain",
      },
    ],
    priceCents: null,
    isPublished: false,
    visibility: "prelaunch",
    isPrelaunch: true,
    isLaunch: true,
    isFeatured: true,
    isNew: true,
    seoTitle: "Manual Representante 4.0 | ContentFy",
    seoDescription:
      "Manual premium do representante comercial moderno com IA — CRM, bônus e mapa de alta performance.",
    source: "provisional",
  },
];

export const SHOWCASE_RAILS = [
  {
    id: "launches" as const,
    title: "Lançamentos",
    subtitle: "Novidades da ContentFy",
  },
  {
    id: "featured" as const,
    title: "Em destaque",
    subtitle: "Seleção da curadoria",
  },
  {
    id: "routine" as const,
    title: "Para transformar sua rotina",
    subtitle: "Equilíbrio, presença e bem-estar",
  },
  {
    id: "sales-career" as const,
    title: "Vendas e carreira",
    subtitle: "Performance comercial com método",
  },
  {
    id: "ebooks-manuals" as const,
    title: "E-books e manuais",
    subtitle: "Conhecimento para consultar e aplicar",
  },
  {
    id: "keep-exploring" as const,
    title: "Continue explorando",
    subtitle: "Mais conteúdos da vitrine",
  },
  {
    id: "most-sought" as const,
    title: "Mais procurados",
    subtitle: "Disponível quando houver dados reais de popularidade",
  },
];
