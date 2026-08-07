import type {
  DiscoveryCardModel,
  DiscoveryProductMeta,
  DiscoveryProfile,
  DiscoveryResult,
} from "@shared/contentfy";
import { resolveShowcaseProductImages } from "@shared/contentfy";
import { relationshipEngine } from "./relationship-engine";
import { categoryEngine } from "./category-engine";

export interface CatalogProduct {
  id?: number;
  slug: string;
  name: string;
  type: string;
  description?: string | null;
  coverImage?: string | null;
  thumbnailImage?: string | null;
  price?: number | null;
  categoryName?: string | null;
  isActive?: boolean;
  createdAt?: Date | string | null;
}

export function mergeCatalogMeta(
  products: CatalogProduct[],
  seedMeta: DiscoveryProductMeta[],
  dbMeta: DiscoveryProductMeta[] = []
): DiscoveryProductMeta[] {
  const bySlug = new Map<string, DiscoveryProductMeta>();

  for (const m of seedMeta) bySlug.set(m.slug, { ...m });
  for (const m of dbMeta) {
    const prev = bySlug.get(m.slug);
    bySlug.set(m.slug, prev ? { ...prev, ...m } : { ...m });
  }

  for (const p of products) {
    if (!p.slug) continue;
    const prev = bySlug.get(p.slug);
    const type = (p.type || prev?.type || "ebook") as DiscoveryProductMeta["type"];
    bySlug.set(p.slug, {
      slug: p.slug,
      productId: p.id ?? prev?.productId ?? null,
      tags: prev?.tags ?? [],
      category: prev?.category || p.categoryName || "Geral",
      subcategory: prev?.subcategory,
      level: prev?.level,
      duration: prev?.duration,
      type,
      author: prev?.author,
      collections: prev?.collections ?? [],
      keywords: prev?.keywords ?? [],
      objectives: prev?.objectives ?? [],
      audience: prev?.audience ?? [],
      skills: prev?.skills ?? [],
      isFeatured: prev?.isFeatured,
      isLaunch: prev?.isLaunch,
      isBeginnerFriendly: prev?.isBeginnerFriendly,
    });
  }

  return Array.from(bySlug.values());
}

export function toCardModel(
  meta: DiscoveryProductMeta,
  product?: CatalogProduct,
  extras?: Partial<DiscoveryCardModel>
): DiscoveryCardModel {
  const slug = meta.slug;
  const name = product?.name || slug;
  const typeLabel =
    meta.type === "ebook"
      ? "E-book"
      : meta.type === "course"
        ? "Curso"
        : meta.type === "audiobook"
          ? "Audiobook"
          : meta.type === "app"
            ? "App"
            : String(meta.type);

  const images = resolveShowcaseProductImages(
    slug,
    product?.coverImage || product?.thumbnailImage,
    product?.coverImage || product?.thumbnailImage
  );

  return {
    id: product?.id != null ? String(product.id) : `slug:${slug}`,
    slug,
    name,
    type: String(meta.type),
    typeLabel,
    category: meta.category,
    tags: meta.tags,
    author: meta.author,
    coverImage: images.coverImage,
    heroImage: images.heroImage,
    priceCents: product?.price ?? null,
    level: meta.level ? String(meta.level) : undefined,
    duration: meta.duration,
    href: product?.id ? `/produto/${slug}` : `/produto/${slug}`,
    ...extras,
  };
}

export class RecommendationService {
  recommend(
    profile: DiscoveryProfile,
    catalog: DiscoveryProductMeta[],
    excludeSlugs: Set<string> = new Set()
  ): DiscoveryResult {
    const anchors = [
      ...profile.recentViewSlugs,
      ...profile.favoriteSlugs,
    ].filter((s, i, a) => a.indexOf(s) === i);

    const scores = new Map<string, number>();

    for (const item of catalog) {
      if (excludeSlugs.has(item.slug)) continue;
      let score = 0;
      score += relationshipEngine.scoreByGraph(item.slug, anchors) * 3;

      for (const pref of profile.preferences) {
        const p = pref.toLowerCase();
        if (item.category.toLowerCase().includes(p)) score += 5;
        if (item.tags.some((t) => t.toLowerCase().includes(p))) score += 3;
        if (item.skills.some((s) => s.toLowerCase().includes(p))) score += 2;
      }

      for (const goal of profile.goals) {
        const g = goal.toLowerCase();
        if (item.objectives.some((o) => o.toLowerCase().includes(g))) score += 4;
        if (item.keywords.some((k) => k.toLowerCase().includes(g))) score += 2;
      }

      for (const q of profile.recentSearchQueries) {
        const qq = q.toLowerCase();
        if (item.tags.some((t) => t.toLowerCase().includes(qq))) score += 2;
        if (item.keywords.some((k) => k.toLowerCase().includes(qq))) score += 2;
        if (item.category.toLowerCase().includes(qq)) score += 2;
      }

      // Soft boost featured for cold start
      if (anchors.length === 0 && item.isFeatured) score += 2;
      if (anchors.length === 0 && item.isBeginnerFriendly) score += 1;

      if (score > 0) scores.set(item.slug, score);
    }

    const ranked = Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([slug]) => slug);

    if (ranked.length === 0) {
      const fallback = categoryEngine
        .railItems(catalog, "featured", 12)
        .map((m) => m.slug);
      return {
        productIds: [],
        productSlugs: fallback,
        strategy: "fallback",
        reason: "Catálogo editorial — perfil ainda sem sinais suficientes.",
      };
    }

    const strategy =
      anchors.length > 0
        ? "behavior"
        : profile.goals.length > 0
          ? "goals"
          : "related";

    return {
      productIds: [],
      productSlugs: ranked.slice(0, 12),
      strategy,
      reason:
        strategy === "behavior"
          ? "Relacionamentos e comportamento recente."
          : strategy === "goals"
            ? "Alinhado aos objetivos informados."
            : "Produtos relacionados ao seu histórico.",
      scoreBySlug: Object.fromEntries(scores),
    };
  }
}

export const recommendationService = new RecommendationService();
