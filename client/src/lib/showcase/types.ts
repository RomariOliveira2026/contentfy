export type ShowcaseProductType = "ebook" | "audiobook" | "course" | "app";

export type ShowcaseBadge =
  | "launch"
  | "featured"
  | "new"
  | "bestseller"
  | "ebook"
  | "manual"
  | "course"
  | "audiobook";

export type ShowcaseRailId =
  | "launches"
  | "featured"
  | "routine"
  | "sales-career"
  | "ebooks-manuals"
  | "keep-exploring"
  | "most-sought";

export type ShowcaseSort =
  | "launch"
  | "popularity"
  | "price-asc"
  | "price-desc"
  | "name";

/**
 * View-model da vitrine. Campos comerciais opcionais — nunca inventar preço/autor/avaliações.
 */
export interface ShowcaseProduct {
  /** ID estável (slug para provisório, ou id numérico do banco como string). */
  id: string;
  slug: string;
  name: string;
  type: ShowcaseProductType;
  /** Rótulo de UI (ex.: Manual) sem alterar o enum do banco. */
  typeLabel: string;
  category: string;
  tags: string[];
  collections: ShowcaseRailId[];
  slogan?: string;
  shortDescription?: string;
  description?: string;
  benefits?: string[];
  audience?: string[];
  included?: string[];
  /** Só preencher com dado real; caso contrário omitir. */
  author?: string;
  heroImage?: string;
  coverImage?: string;
  landscapeImage?: string;
  /** Centavos — apenas quando houver preço real (banco / publicação). */
  priceCents?: number | null;
  isPublished: boolean;
  isLaunch?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  level?: string;
  durationOrPages?: string;
  guaranteeDays?: number | null;
  salesPageUrl?: string | null;
  previewUrl?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  source: "database" | "provisional";
  createdAt?: string;
}

export interface ShowcaseFilters {
  query: string;
  types: ShowcaseProductType[];
  category: string;
  price: "all" | "free" | "paid" | "unpriced";
  level: string;
  sort: ShowcaseSort;
}

export interface ShowcaseRailDef {
  id: ShowcaseRailId;
  title: string;
  subtitle?: string;
}
