/**
 * PROVISIONAL SHOWCASE CATALOG
 * ---------------------------
 * Camada tipada e centralizada para a vitrine pública.
 * Substituir/mesclar pela API (`trpc.products`) quando os registros
 * estiverem persistidos e publicados. Não inventa preços, autores,
 * avaliações nem métricas comerciais.
 */

import type { ShowcaseProduct } from "./types";

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
      "Conteúdo para quem deseja reduzir o ritmo, recuperar presença e viver com mais equilíbrio.",
    description:
      "Produto voltado a pessoas que desejam reduzir o ritmo, recuperar presença e construir uma rotina mais equilibrada. Detalhes comerciais, preço e arquivos serão confirmados no painel do criador antes da publicação.",
    benefits: [
      "Clareza para priorizar o que importa",
      "Práticas para recuperar presença no dia a dia",
      "Caminho para uma rotina mais sustentável",
    ],
    audience: [
      "Profissionais com rotina acelerada",
      "Pessoas buscando equilíbrio e bem-estar",
      "Quem quer reduzir ansiedade e ruído mental",
    ],
    included: [
      "Conteúdo principal do produto",
      "Orientação prática para aplicação",
    ],
    heroImage: DESACELERE_HERO,
    coverImage: DESACELERE_COVER,
    landscapeImage: DESACELERE_HERO,
    priceCents: null,
    isPublished: false,
    isLaunch: true,
    isFeatured: true,
    isNew: true,
    salesPageUrl: "/desacelere",
    seoTitle: "Desacelere | ContentFy",
    seoDescription:
      "Explore Desacelere — conteúdo ContentFy para equilíbrio, presença e qualidade de vida.",
    source: "provisional",
  },
  {
    id: "provisional:manual-do-representante-comercial",
    slug: "manual-do-representante-comercial",
    name: "Manual do Representante Comercial",
    type: "ebook",
    typeLabel: "Manual",
    category: "Vendas e carreira",
    tags: [
      "representação comercial",
      "vendas B2B",
      "prospecção",
      "negociação",
      "carreira",
    ],
    collections: [
      "launches",
      "sales-career",
      "ebooks-manuals",
      "keep-exploring",
    ],
    slogan: "Atue com mais estratégia, organização e profissionalismo.",
    shortDescription:
      "Guia prático para representantes comerciais que querem evoluir na carreira com método.",
    description:
      "Guia prático para representantes comerciais que desejam atuar com mais estratégia, organização e profissionalismo. Preço, autor, páginas e arquivos serão definidos no cadastro oficial.",
    benefits: [
      "Estrutura clara para organizar a operação comercial",
      "Foco em prospecção e negociação com critério",
      "Posicionamento profissional mais consistente",
    ],
    audience: [
      "Representantes comerciais",
      "Profissionais de vendas B2B",
      "Quem está estruturando a carreira em representação",
    ],
    included: [
      "Manual em formato digital",
      "Diretrizes práticas de aplicação",
    ],
    heroImage: undefined,
    coverImage: undefined,
    landscapeImage: undefined,
    priceCents: null,
    isPublished: false,
    isLaunch: true,
    isFeatured: false,
    isNew: true,
    seoTitle: "Manual do Representante Comercial | ContentFy",
    seoDescription:
      "Manual prático para representantes comerciais — estratégia, organização e carreira.",
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
