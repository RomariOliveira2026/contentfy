/**
 * Lógica de apresentação da vitrine — modo catálogo inicial vs completo,
 * visibilidade de trilhos e limite de repetição de produtos.
 */

import { SHOWCASE_RAILS } from "./provisionalCatalog";
import type {
  ShowcaseProduct,
  ShowcaseRailDef,
  ShowcaseRailId,
  ShowcaseVisibility,
} from "./types";
import { getRailProducts, getVisibleShowcaseProducts } from "./catalog";

/** Abaixo deste número: cards grandes + “Primeiros lançamentos”; acima: trilhos completos. */
export const INITIAL_CATALOG_THRESHOLD = 6;

/** Máximo de áreas da página em que o mesmo produto pode aparecer. */
export const MAX_PRODUCT_PAGE_APPEARANCES = 3;

export type ProductCardVariant = "featured" | "large" | "standard" | "compact";

export type ShowcaseCatalogMode = "initial" | "full";

export interface ShowcaseRailSection {
  id: ShowcaseRailId;
  title: string;
  subtitle?: string;
  products: ShowcaseProduct[];
  cardVariant: ProductCardVariant;
}

export interface ShowcasePresentation {
  mode: ShowcaseCatalogMode;
  visibleCount: number;
  firstLaunches: ShowcaseProduct[];
  rails: ShowcaseRailSection[];
  heroProduct: ShowcaseProduct | null;
}

export function getCatalogMode(visibleCount: number): ShowcaseCatalogMode {
  return visibleCount < INITIAL_CATALOG_THRESHOLD ? "initial" : "full";
}

/**
 * Estado público do produto.
 * Rascunho nunca entra na vitrine; pré-lançamento / em breve podem aparecer.
 */
export function getProductVisibility(
  product: ShowcaseProduct
): ShowcaseVisibility {
  if (product.visibility) return product.visibility;
  if (product.isPublished) return "available";
  if (product.isLaunch || product.isFeatured || product.isPrelaunch) {
    return product.isPrelaunch === false ? "coming_soon" : "prelaunch";
  }
  return "draft";
}

export function isPubliclyVisible(product: ShowcaseProduct) {
  const v = getProductVisibility(product);
  return v === "available" || v === "prelaunch" || v === "coming_soon";
}

export function visibilityLabel(v: ShowcaseVisibility): string {
  switch (v) {
    case "available":
      return "Disponível";
    case "prelaunch":
      return "Pré-lançamento";
    case "coming_soon":
      return "Em breve";
    case "draft":
      return "Rascunho";
  }
}

/** Prioridade de imagem: landscape → hero → cover → null (fallback visual). */
export function resolveProductImage(product: ShowcaseProduct): string | null {
  return (
    product.landscapeImage ||
    product.heroImage ||
    product.coverImage ||
    null
  );
}

export function isComingSoonCommerce(product: ShowcaseProduct) {
  const v = getProductVisibility(product);
  return v === "prelaunch" || v === "coming_soon" || !product.isPublished;
}

/**
 * Produtos da seção “Primeiros lançamentos”.
 * Preferência: Desacelere + Manual; depois demais lançamentos.
 */
export function getFirstLaunchesProducts(
  products: ShowcaseProduct[]
): ShowcaseProduct[] {
  const visible = getVisibleShowcaseProducts(products);
  const preferred = [
    "manual-do-representante-comercial",
    "desacelere",
  ];
  const ordered: ShowcaseProduct[] = [];
  const used = new Set<string>();

  for (const slug of preferred) {
    const hit = visible.find((p) => p.slug === slug);
    if (hit) {
      ordered.push(hit);
      used.add(hit.slug);
    }
  }

  const rest = visible
    .filter((p) => !used.has(p.slug))
    .sort(
      (a, b) =>
        Number(b.isLaunch) - Number(a.isLaunch) ||
        a.name.localeCompare(b.name, "pt-BR")
    );

  return [...ordered, ...rest].slice(0, Math.min(4, visible.length));
}

interface AppearanceTracker {
  count: Map<string, number>;
  lastSectionSlugs: Set<string>;
}

function createTracker(): AppearanceTracker {
  return { count: new Map(), lastSectionSlugs: new Set() };
}

function canAppear(tracker: AppearanceTracker, slug: string) {
  return (tracker.count.get(slug) ?? 0) < MAX_PRODUCT_PAGE_APPEARANCES;
}

function markAppearances(
  tracker: AppearanceTracker,
  products: ShowcaseProduct[]
) {
  const slugs = new Set<string>();
  for (const p of products) {
    tracker.count.set(p.slug, (tracker.count.get(p.slug) ?? 0) + 1);
    slugs.add(p.slug);
  }
  tracker.lastSectionSlugs = slugs;
}

function filterByAppearanceCap(
  tracker: AppearanceTracker,
  products: ShowcaseProduct[]
) {
  return products.filter((p) => canAppear(tracker, p.slug));
}

export interface RailVisibilityContext {
  mode: ShowcaseCatalogMode;
  visibleCount: number;
  railId: ShowcaseRailId;
  products: ShowcaseProduct[];
  /** Slugs da seção imediatamente acima (ex.: Primeiros lançamentos ou trilho anterior). */
  previousSectionSlugs: Set<string>;
  /** Já existe lógica real de recomendação (futuro). */
  hasRecommendationEngine?: boolean;
}

/**
 * Função central: decide se uma coleção/trilho deve ser exibida.
 */
export function shouldShowRail(ctx: RailVisibilityContext): boolean {
  const { products, railId, mode, visibleCount, previousSectionSlugs } = ctx;

  if (!products.length) return false;

  if (railId === "most-sought") {
    // Sem métrica real de popularidade.
    return false;
  }

  if (railId === "keep-exploring") {
    if (ctx.hasRecommendationEngine) return products.length > 0;
    return visibleCount >= 4 && products.length >= 2;
  }

  // Modo inicial: trilhos horizontais ficam ocultos (seção dedicada cobre o catálogo).
  if (mode === "initial") {
    return false;
  }

  // Não exibir trilho com um único produto se ele já está na seção imediatamente acima.
  if (
    products.length === 1 &&
    previousSectionSlugs.has(products[0].slug)
  ) {
    return false;
  }

  // Trilho redundante: todos os itens já estavam na seção imediatamente acima.
  if (
    products.length > 0 &&
    products.every((p) => previousSectionSlugs.has(p.slug))
  ) {
    return false;
  }

  return products.length > 0;
}

function railCardVariant(
  mode: ShowcaseCatalogMode,
  productCount: number
): ProductCardVariant {
  if (mode === "initial") return "large";
  if (productCount <= 3) return "large";
  return "standard";
}

/**
 * Monta a apresentação da página /explorar a partir do catálogo visível.
 */
export function buildShowcasePresentation(
  all: ShowcaseProduct[],
  options?: { heroSlug?: string; hasRecommendationEngine?: boolean }
): ShowcasePresentation {
  const visible = getVisibleShowcaseProducts(all);
  const mode = getCatalogMode(visible.length);
  const tracker = createTracker();

  const heroProduct =
    visible.find((p) => p.slug === (options?.heroSlug || "desacelere")) ||
    visible[0] ||
    null;

  if (heroProduct) {
    markAppearances(tracker, [heroProduct]);
  }

  // Modo inicial: seção dedicada. Modo completo: trilhos horizontais.
  const firstLaunches =
    mode === "initial"
      ? getFirstLaunchesProducts(all).filter((p) => {
          const current = tracker.count.get(p.slug) ?? 0;
          return current < MAX_PRODUCT_PAGE_APPEARANCES;
        })
      : [];

  if (firstLaunches.length) {
    markAppearances(tracker, firstLaunches);
  }

  const rails: ShowcaseRailSection[] = [];
  let previousSectionSlugs = new Set(
    firstLaunches.length
      ? firstLaunches.map((p) => p.slug)
      : heroProduct
        ? [heroProduct.slug]
        : []
  );

  for (const def of SHOWCASE_RAILS as ShowcaseRailDef[]) {
    const raw = getRailProducts(all, def.id);
    const capped = filterByAppearanceCap(tracker, raw);

    const show = shouldShowRail({
      mode,
      visibleCount: visible.length,
      railId: def.id,
      products: capped,
      previousSectionSlugs,
      hasRecommendationEngine: options?.hasRecommendationEngine,
    });

    if (!show) continue;

    rails.push({
      id: def.id,
      title: def.title,
      subtitle: def.subtitle,
      products: capped,
      cardVariant: railCardVariant(mode, capped.length),
    });
    markAppearances(tracker, capped);
    previousSectionSlugs = new Set(capped.map((p) => p.slug));
  }

  return {
    mode,
    visibleCount: visible.length,
    firstLaunches,
    rails,
    heroProduct,
  };
}
