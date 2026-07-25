import { PROVISIONAL_SHOWCASE_CATALOG, SHOWCASE_RAILS } from "./provisionalCatalog";
import type {
  ShowcaseFilters,
  ShowcaseProduct,
  ShowcaseProductType,
  ShowcaseRailId,
  ShowcaseVisibility,
} from "./types";

/** Shape mínimo vindo do tRPC/DB — evita acoplar a tipos gerados. */
export interface DbProductLike {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  type: ShowcaseProductType;
  categoryId: number | null;
  price: number;
  coverImage: string | null;
  thumbnailImage: string | null;
  salesPageUrl: string | null;
  isActive: boolean;
  guaranteeDays?: number | null;
  createdAt?: string | Date;
}

export interface DbCategoryLike {
  id: number;
  name: string;
  slug: string;
}

const TYPE_LABELS: Record<ShowcaseProductType, string> = {
  ebook: "E-book",
  audiobook: "Audiobook",
  course: "Curso",
  app: "App",
};

function toIso(value?: string | Date) {
  if (!value) return undefined;
  return value instanceof Date ? value.toISOString() : String(value);
}

/**
 * Mescla catálogo provisório + produtos do banco.
 * Banco publicado prevalece em preço/status/imagens quando disponíveis.
 * Não inventa preço: rascunhos ficam sem priceCents.
 */
export function mergeShowcaseCatalog(
  dbProducts: DbProductLike[] = [],
  categories: DbCategoryLike[] = []
): ShowcaseProduct[] {
  const catName = (id: number | null) =>
    categories.find((c) => c.id === id)?.name;

  const bySlug = new Map<string, ShowcaseProduct>();

  for (const provisional of PROVISIONAL_SHOWCASE_CATALOG) {
    bySlug.set(provisional.slug, { ...provisional });
  }

  for (const db of dbProducts) {
    const base = bySlug.get(db.slug);
    const published = Boolean(db.isActive);
    const merged: ShowcaseProduct = {
      id: String(db.id),
      slug: db.slug,
      name: db.name || base?.name || db.slug,
      type: db.type,
      typeLabel: base?.typeLabel || TYPE_LABELS[db.type],
      category: catName(db.categoryId) || base?.category || "Catálogo",
      tags: base?.tags || [],
      collections: base?.collections || ["keep-exploring"],
      slogan: base?.slogan,
      shortDescription: base?.shortDescription || db.description || undefined,
      description: base?.description || db.description || undefined,
      benefits: base?.benefits,
      audience: base?.audience,
      included: base?.included,
      author: base?.author,
      heroImage: base?.heroImage || db.coverImage || undefined,
      coverImage: db.coverImage || base?.coverImage || undefined,
      landscapeImage:
        base?.landscapeImage || db.coverImage || base?.heroImage || undefined,
      // Preço só quando publicado e valor numérico válido do banco
      priceCents: published ? db.price : null,
      isPublished: published,
      visibility: (published
        ? "available"
        : base?.visibility ||
          (base?.isLaunch || base?.isPrelaunch || base?.isFeatured
            ? "prelaunch"
            : "draft")) as ShowcaseVisibility,
      isPrelaunch: base?.isPrelaunch ?? (!published && Boolean(base?.isLaunch)),
      isLaunch: base?.isLaunch,
      isFeatured: base?.isFeatured,
      isNew: base?.isNew,
      level: base?.level,
      durationOrPages: base?.durationOrPages,
      guaranteeDays: db.guaranteeDays ?? base?.guaranteeDays ?? null,
      salesPageUrl: db.salesPageUrl || base?.salesPageUrl || null,
      previewUrl: base?.previewUrl,
      seoTitle: base?.seoTitle || `${db.name} | ContentFy`,
      seoDescription:
        base?.seoDescription ||
        db.description ||
        `Conheça ${db.name} na ContentFy.`,
      source: "database",
      createdAt: toIso(db.createdAt) || base?.createdAt,
    };
    bySlug.set(db.slug, merged);
  }

  return Array.from(bySlug.values());
}

/**
 * Produtos visíveis na vitrine.
 * Rascunho nunca aparece. Publicados, pré-lançamento e “em breve” configurados sim.
 */
export function getVisibleShowcaseProducts(all: ShowcaseProduct[]) {
  return all.filter((p) => {
    if (p.visibility === "draft") return false;
    if (p.isPublished || p.visibility === "available") return true;
    if (
      p.visibility === "prelaunch" ||
      p.visibility === "coming_soon" ||
      p.isPrelaunch ||
      p.isLaunch ||
      p.isFeatured
    ) {
      return true;
    }
    return false;
  });
}

export function getShowcaseProductBySlug(
  all: ShowcaseProduct[],
  slug: string
) {
  return all.find((p) => p.slug === slug);
}

export function getRailProducts(
  all: ShowcaseProduct[],
  railId: ShowcaseRailId
) {
  const visible = getVisibleShowcaseProducts(all);
  if (railId === "most-sought") {
    // Sem métrica real de popularidade — trilha fica vazia até haver dados.
    return [];
  }
  const list = visible.filter((p) => p.collections.includes(railId));
  // Sem duplicar o mesmo slug no trilho
  const seen = new Set<string>();
  return list.filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });
}

export function filterShowcaseProducts(
  products: ShowcaseProduct[],
  filters: ShowcaseFilters
) {
  const q = filters.query.trim().toLowerCase();

  let list = getVisibleShowcaseProducts(products).filter((p) => {
    if (q) {
      const hay = [
        p.name,
        p.slogan,
        p.shortDescription,
        p.description,
        p.category,
        p.typeLabel,
        ...p.tags,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (filters.types.length && !filters.types.includes(p.type)) return false;
    if (filters.category && p.category !== filters.category) return false;
    if (filters.level && p.level !== filters.level) return false;
    if (filters.price === "free") {
      if (!(p.isPublished && p.priceCents === 0)) return false;
    } else if (filters.price === "paid") {
      if (!(p.isPublished && (p.priceCents ?? 0) > 0)) return false;
    } else if (filters.price === "unpriced") {
      if (p.priceCents != null && p.isPublished) return false;
    }
    return true;
  });

  list = [...list].sort((a, b) => {
    switch (filters.sort) {
      case "price-asc":
        return (a.priceCents ?? Number.MAX_SAFE_INTEGER) -
          (b.priceCents ?? Number.MAX_SAFE_INTEGER);
      case "price-desc":
        return (b.priceCents ?? -1) - (a.priceCents ?? -1);
      case "name":
        return a.name.localeCompare(b.name, "pt-BR");
      case "popularity":
        // Sem ranking real — fallback estável por destaque + nome
        return Number(b.isFeatured) - Number(a.isFeatured) ||
          a.name.localeCompare(b.name, "pt-BR");
      case "launch":
      default:
        return Number(b.isLaunch) - Number(a.isLaunch) ||
          a.name.localeCompare(b.name, "pt-BR");
    }
  });

  return list;
}

export function formatShowcasePrice(priceCents?: number | null) {
  if (priceCents == null) return null;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceCents / 100);
}

export function productHref(product: ShowcaseProduct) {
  return `/produto/${product.slug}`;
}

export function checkoutHref(product: ShowcaseProduct) {
  return `/checkout/${product.slug}`;
}

export { SHOWCASE_RAILS, TYPE_LABELS };
