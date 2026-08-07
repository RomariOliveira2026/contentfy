/**
 * Capas oficiais da vitrine — fallback quando o DB não tem URL válida.
 * Mantém Discovery, Explore e PDP alinhados ao catálogo provisório.
 */

const DESACELERE_HERO =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663097022226/Qf2ybVS3fKbp69WuPYRytJ/desacelere_hero_bg-49SjHkZ9Zq4VXLF5SeHWvU.webp";
const DESACELERE_COVER =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663097022226/Qf2ybVS3fKbp69WuPYRytJ/desacelere_mockup_oficial-FDXUTUiPqGyfYHoemKGAag.webp";

const R40 = "/products/representante40";

export const SHOWCASE_PRODUCT_IMAGES: Record<
  string,
  { coverImage: string; heroImage?: string }
> = {
  desacelere: {
    coverImage: DESACELERE_COVER,
    heroImage: DESACELERE_HERO,
  },
  "manual-do-representante-comercial": {
    coverImage: `${R40}/cover-premium.webp`,
    heroImage: `${R40}/mockup-kit.webp`,
  },
};

export function isValidShowcaseImageUrl(url?: string | null): url is string {
  if (!url?.trim()) return false;
  const value = url.trim();
  if (/^https?:\/\//i.test(value)) return true;
  if (value.startsWith("/products/") || value.startsWith("/brand/")) return true;
  return false;
}

export function resolveShowcaseProductImages(
  slug: string,
  coverImage?: string | null,
  heroImage?: string | null
) {
  const fallback = SHOWCASE_PRODUCT_IMAGES[slug];
  const resolvedCover = isValidShowcaseImageUrl(coverImage)
    ? coverImage
    : fallback?.coverImage ?? null;
  const resolvedHero = isValidShowcaseImageUrl(heroImage)
    ? heroImage
    : fallback?.heroImage ?? resolvedCover;

  return {
    coverImage: resolvedCover,
    heroImage: resolvedHero,
  };
}
