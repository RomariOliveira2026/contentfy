import type { DiscoveryProductMeta } from "@shared/contentfy";

/**
 * Seed metadata for Discovery v1.
 * Works before/without DB enrichment; keyed by slug — never invents prices.
 */
export const DISCOVERY_META_SEED: DiscoveryProductMeta[] = [
  {
    slug: "desacelere",
    tags: [
      "desaceleração",
      "equilíbrio",
      "rotina",
      "bem-estar",
      "qualidade de vida",
      "ansiedade",
      "sono",
      "mindfulness",
    ],
    category: "Desenvolvimento Pessoal",
    subcategory: "Bem-estar",
    level: "beginner",
    duration: "Leitura prática",
    type: "ebook",
    author: "ContentFy",
    collections: [
      "launches",
      "featured",
      "personal_dev",
      "productivity",
      "start_here",
    ],
    keywords: ["desacelere", "presença", "ritmo", "equilíbrio"],
    objectives: [
      "Reduzir ritmo acelerado",
      "Recuperar presença",
      "Construir rotina sustentável",
    ],
    audience: [
      "Profissionais com rotina acelerada",
      "Pessoas buscando equilíbrio",
    ],
    skills: ["autoconhecimento", "gestão de energia", "hábitos"],
    isFeatured: true,
    isLaunch: true,
    isBeginnerFriendly: true,
  },
  {
    slug: "manual-do-representante-comercial",
    tags: [
      "representação comercial",
      "vendas B2B",
      "prospecção",
      "negociação",
      "carreira",
      "representante 4.0",
      "CRM",
      "IA",
    ],
    category: "Negócios",
    subcategory: "Representação Comercial",
    level: "intermediate",
    duration: "Manual + ecossistema",
    type: "ebook",
    author: "Romário Oliveira",
    collections: [
      "launches",
      "featured",
      "business",
      "sales_rep",
      "ai",
      "bestsellers",
    ],
    keywords: [
      "manual representante",
      "rep4crm",
      "vendas",
      "carteira",
      "prompts",
    ],
    objectives: [
      "Organizar operação comercial",
      "Vender com método",
      "Usar IA no dia a dia comercial",
    ],
    audience: [
      "Representantes comerciais",
      "Profissionais de vendas B2B",
    ],
    skills: ["vendas", "CRM", "prospecção", "negociação", "IA aplicada"],
    isFeatured: true,
    isLaunch: true,
    isBeginnerFriendly: false,
  },
];

export function getSeedMetaBySlug(
  slug: string
): DiscoveryProductMeta | undefined {
  return DISCOVERY_META_SEED.find((m) => m.slug === slug);
}

export function listSeedMeta(): DiscoveryProductMeta[] {
  return [...DISCOVERY_META_SEED];
}
