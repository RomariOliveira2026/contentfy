/**
 * Capas oficiais da vitrine — fallback quando o DB não tem URL válida.
 *
 * Padrão para novos produtos:
 * - mockup-kit.webp em /products/{slug}/ (kit horizontal, como Representante 4.0)
 * - discoveryVariant: "mockup" → card com fundo laranja ContentFy + object-contain
 * - Registrar slug, displayName, author e discoveryImage em SHOWCASE_PRODUCT_ASSETS
 */

const DESACELERE_HERO =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663097022226/Qf2ybVS3fKbp69WuPYRytJ/desacelere_hero_bg-49SjHkZ9Zq4VXLF5SeHWvU.webp";
const DESACELERE = "/products/desacelere";

const R40 = "/products/representante40";

export type ShowcaseDiscoveryVariant = "mockup" | "portrait";

export interface ShowcaseProductAssets {
  coverImage: string;
  heroImage?: string;
  discoveryImage: string;
  discoveryVariant: ShowcaseDiscoveryVariant;
  displayName: string;
  author?: string;
}

export const SHOWCASE_PRODUCT_ASSETS: Record<string, ShowcaseProductAssets> = {
  desacelere: {
    coverImage: `${DESACELERE}/mockup-kit.webp`,
    heroImage: DESACELERE_HERO,
    discoveryImage: `${DESACELERE}/mockup-kit.webp`,
    discoveryVariant: "mockup",
    displayName: "Desacelere",
    author: "ContentFy",
  },
  "manual-do-representante-comercial": {
    coverImage: `${R40}/cover-premium.webp`,
    heroImage: `${R40}/mockup-kit.webp`,
    discoveryImage: `${R40}/mockup-kit.webp`,
    discoveryVariant: "mockup",
    displayName: "Manual Representante 4.0",
    author: "Romário Oliveira",
  },
};

/** @deprecated use SHOWCASE_PRODUCT_ASSETS */
export const SHOWCASE_PRODUCT_IMAGES = Object.fromEntries(
  Object.entries(SHOWCASE_PRODUCT_ASSETS).map(([slug, assets]) => [
    slug,
    { coverImage: assets.coverImage, heroImage: assets.heroImage },
  ])
);

export function isValidShowcaseImageUrl(url?: string | null): url is string {
  if (!url?.trim()) return false;
  const value = url.trim();
  if (/^https?:\/\//i.test(value)) return true;
  if (value.startsWith("/products/") || value.startsWith("/brand/")) return true;
  return false;
}

export function looksLikeProductSlug(name: string, slug: string) {
  const normalized = name.trim().toLowerCase();
  return (
    normalized === slug ||
    normalized === slug.replace(/-/g, " ") ||
    /^[a-z0-9]+(-[a-z0-9]+)+$/.test(normalized)
  );
}

export function resolveShowcaseDisplayName(
  slug: string,
  rawName?: string | null
) {
  const assets = SHOWCASE_PRODUCT_ASSETS[slug];
  if (!rawName?.trim() || looksLikeProductSlug(rawName, slug)) {
    return assets?.displayName || rawName?.trim() || slug;
  }
  return rawName.trim();
}

export function resolveShowcaseProductImages(
  slug: string,
  coverImage?: string | null,
  heroImage?: string | null
) {
  const assets = SHOWCASE_PRODUCT_ASSETS[slug];
  const resolvedCover = isValidShowcaseImageUrl(coverImage)
    ? coverImage
    : assets?.coverImage ?? null;
  const resolvedHero = isValidShowcaseImageUrl(heroImage)
    ? heroImage
    : assets?.heroImage ?? resolvedCover;

  return {
    coverImage: resolvedCover,
    heroImage: resolvedHero,
  };
}

/** Imagem e variante padronizados para cards do Centro de Descoberta. */
export function resolveDiscoveryCardPresentation(
  slug: string,
  coverImage?: string | null,
  heroImage?: string | null,
  rawName?: string | null
) {
  const assets = SHOWCASE_PRODUCT_ASSETS[slug];
  const images = resolveShowcaseProductImages(slug, coverImage, heroImage);

  return {
    image:
      assets?.discoveryImage || images.coverImage || images.heroImage || null,
    variant: assets?.discoveryVariant ?? ("portrait" as const),
    displayName: resolveShowcaseDisplayName(slug, rawName),
    author: assets?.author ?? null,
  };
}
