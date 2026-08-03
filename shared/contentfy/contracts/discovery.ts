/**
 * ContentFy Discovery — rule/behavior/relationship recommendation contracts.
 * No generative AI, embeddings, or OpenAI.
 */

export type DiscoverySignalType =
  | "view"
  | "purchase"
  | "complete"
  | "wishlist"
  | "search"
  | "click"
  | "dwell"
  | "favorite";

export interface DiscoveryProfile {
  userId: number;
  preferences: string[];
  goals: string[];
  completedProductIds: number[];
  ownedProductIds: number[];
  favoriteSlugs: string[];
  recentViewSlugs: string[];
  recentSearchQueries: string[];
  signals: DiscoverySignal[];
}

export interface DiscoverySignal {
  type: DiscoverySignalType;
  productId?: number;
  productSlug?: string;
  category?: string;
  query?: string;
  weight: number;
  at: string;
}

export type DiscoveryStrategy =
  | "behavior"
  | "goals"
  | "related"
  | "trending"
  | "category"
  | "continue"
  | "favorites"
  | "fallback";

export interface DiscoveryResult {
  productIds: number[];
  productSlugs: string[];
  strategy: DiscoveryStrategy;
  reason: string;
  scoreBySlug?: Record<string, number>;
}

export type DiscoveryLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "all";

export type DiscoveryProductType = "ebook" | "audiobook" | "course" | "app";

/** Rich discovery metadata — lives beside products, does not replace product rows. */
export interface DiscoveryProductMeta {
  slug: string;
  productId?: number | null;
  tags: string[];
  category: string;
  subcategory?: string;
  level?: DiscoveryLevel | string;
  duration?: string;
  type: DiscoveryProductType | string;
  author?: string;
  collections: string[];
  keywords: string[];
  objectives: string[];
  audience: string[];
  skills: string[];
  isFeatured?: boolean;
  isLaunch?: boolean;
  isBeginnerFriendly?: boolean;
}

export type DiscoveryRelationType =
  | "next"
  | "prerequisite"
  | "companion"
  | "upsell"
  | "bundle";

export interface DiscoveryRelationship {
  fromSlug: string;
  toSlug: string;
  type: DiscoveryRelationType;
  weight: number;
  label?: string;
}

export type DiscoveryRailId =
  | "continue_learning"
  | "launches"
  | "bestsellers"
  | "featured"
  | "recommended"
  | "start_here"
  | "ai"
  | "business"
  | "sales_rep"
  | "personal_dev"
  | "productivity"
  | "buildertudo"
  | "favorites"
  | "trending"
  | "related";

export interface DiscoveryRailDef {
  id: DiscoveryRailId;
  title: string;
  subtitle?: string;
  strategy: DiscoveryStrategy;
}

export const DISCOVERY_RAIL_DEFS: DiscoveryRailDef[] = [
  {
    id: "continue_learning",
    title: "Continue aprendendo",
    subtitle: "Retome de onde parou",
    strategy: "continue",
  },
  {
    id: "recommended",
    title: "Recomendados para você",
    subtitle: "Com base no seu comportamento",
    strategy: "behavior",
  },
  {
    id: "favorites",
    title: "Minha Lista",
    subtitle: "Salvos por você",
    strategy: "favorites",
  },
  {
    id: "launches",
    title: "Lançamentos",
    subtitle: "Novidades da ContentFy",
    strategy: "category",
  },
  {
    id: "bestsellers",
    title: "Mais vendidos",
    subtitle: "O que a comunidade mais escolhe",
    strategy: "trending",
  },
  {
    id: "trending",
    title: "Em alta",
    subtitle: "Crescimento recente na plataforma",
    strategy: "trending",
  },
  {
    id: "featured",
    title: "Em destaque",
    subtitle: "Seleção editorial ContentFy",
    strategy: "category",
  },
  {
    id: "start_here",
    title: "Comece por aqui",
    subtitle: "Entrada suave para novos alunos",
    strategy: "category",
  },
  {
    id: "ai",
    title: "IA",
    subtitle: "Prompts, automações e inteligência aplicada",
    strategy: "category",
  },
  {
    id: "business",
    title: "Negócios",
    subtitle: "Crescimento comercial e operação",
    strategy: "category",
  },
  {
    id: "sales_rep",
    title: "Representação Comercial",
    subtitle: "Carreira e ecossistema do representante",
    strategy: "category",
  },
  {
    id: "personal_dev",
    title: "Desenvolvimento Pessoal",
    subtitle: "Equilíbrio, hábitos e presença",
    strategy: "category",
  },
  {
    id: "productivity",
    title: "Produtividade",
    subtitle: "Foco, rotina e execução",
    strategy: "category",
  },
  {
    id: "buildertudo",
    title: "BuilderTudo",
    subtitle: "Ferramentas e stacks práticos",
    strategy: "category",
  },
];

export interface DiscoveryCardModel {
  id: string;
  slug: string;
  name: string;
  type: string;
  typeLabel?: string;
  category: string;
  tags: string[];
  author?: string;
  coverImage?: string | null;
  heroImage?: string | null;
  priceCents?: number | null;
  level?: string;
  duration?: string;
  progressPercent?: number;
  href: string;
  score?: number;
  reason?: string;
}

export interface ContinueLearningItem {
  productSlug: string;
  productId?: number;
  productName: string;
  lastLessonTitle?: string;
  lastModuleTitle?: string;
  progressPercent: number;
  remainingLabel?: string;
  href: string;
  coverImage?: string | null;
}

export interface DiscoveryHomePayload {
  hero: DiscoveryCardModel | null;
  rails: Array<{
    id: DiscoveryRailId;
    title: string;
    subtitle?: string;
    items: DiscoveryCardModel[];
  }>;
  continueLearning: ContinueLearningItem[];
  personalized: boolean;
  generatedAt: string;
  cacheHit: boolean;
}

export interface DiscoverySearchHit {
  slug: string;
  name: string;
  score: number;
  matchedOn: string[];
  href: string;
  category?: string;
  tags?: string[];
  author?: string;
}

export interface DiscoverySearchResult {
  query: string;
  hits: DiscoverySearchHit[];
  total: number;
}

export interface TrendingScoreBreakdown {
  slug: string;
  score: number;
  views: number;
  purchases: number;
  favorites: number;
  ratings: number;
  recentGrowth: number;
}

/** Simple text search scoring — title > author > category > tags > keywords > objectives. */
export function scoreDiscoverySearch(
  query: string,
  doc: {
    name: string;
    author?: string;
    category?: string;
    tags?: string[];
    keywords?: string[];
    objectives?: string[];
    subcategory?: string;
  }
): { score: number; matchedOn: string[] } {
  const q = query.trim().toLowerCase();
  if (!q) return { score: 0, matchedOn: [] };
  const parts = q.split(/\s+/).filter(Boolean);
  const matchedOn: string[] = [];
  let score = 0;

  const hit = (field: string, weight: number, label: string) => {
    const hay = field.toLowerCase();
    let fieldHits = 0;
    for (const p of parts) {
      if (hay.includes(p)) fieldHits += 1;
    }
    if (fieldHits > 0) {
      score += weight * fieldHits;
      if (!matchedOn.includes(label)) matchedOn.push(label);
    }
  };

  hit(doc.name, 10, "title");
  if (doc.author) hit(doc.author, 6, "author");
  if (doc.category) hit(doc.category, 5, "category");
  if (doc.subcategory) hit(doc.subcategory, 4, "subcategory");
  for (const t of doc.tags || []) hit(t, 3, "tags");
  for (const k of doc.keywords || []) hit(k, 2.5, "keywords");
  for (const o of doc.objectives || []) hit(o, 2, "objectives");

  return { score, matchedOn };
}

/** Trending weights — tunable, no ML. */
export const TRENDING_WEIGHTS = {
  views: 1,
  purchases: 8,
  favorites: 4,
  ratings: 3,
  recentGrowth: 6,
} as const;

export function computeTrendingScore(input: {
  views: number;
  purchases: number;
  favorites: number;
  ratings: number;
  recentGrowth: number;
}): number {
  return (
    input.views * TRENDING_WEIGHTS.views +
    input.purchases * TRENDING_WEIGHTS.purchases +
    input.favorites * TRENDING_WEIGHTS.favorites +
    input.ratings * TRENDING_WEIGHTS.ratings +
    input.recentGrowth * TRENDING_WEIGHTS.recentGrowth
  );
}
