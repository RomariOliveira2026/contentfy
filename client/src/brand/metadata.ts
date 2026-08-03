import { brandAccentColor, brandBackgroundColor, brandThemeColor } from "./colors";
import { brandAssets } from "./assets";

/**
 * Brand metadata for SEO, PWA, and accessibility.
 * DESIGN FREEZE v1.0
 */

export const brandMetadata = {
  name: "ContentFy",
  shortName: "ContentFy",
  /** Canonical accessible description */
  description: "ContentFy — plataforma premium de produtos digitais.",
  /** Longer product description for manifest / store */
  longDescription:
    "Acesse cursos online, e-books, audiobooks e apps que vão impulsionar seu crescimento pessoal e profissional",
  themeColor: brandThemeColor,
  backgroundColor: brandBackgroundColor,
  accentColor: brandAccentColor,
  display: "standalone" as const,
  startUrl: "/",
  orientation: "portrait-primary" as const,
  categories: ["education", "productivity", "business"] as const,
  lang: "pt-BR",
  accessibleLabel: "ContentFy — plataforma premium de produtos digitais.",
  ogImage: brandAssets.png.symbol512,
  twitterImage: brandAssets.png.symbol512,
  icons: {
    faviconSvg: brandAssets.distributed.faviconSvg,
    favicon16: brandAssets.distributed.favicon16,
    favicon32: brandAssets.distributed.favicon32,
    favicon48: brandAssets.distributed.favicon48,
    favicon192: brandAssets.distributed.favicon192,
    favicon512: brandAssets.distributed.favicon512,
    appleTouchIcon: brandAssets.distributed.appleTouchIcon,
    pwa192: brandAssets.appIcons.pwa192,
    pwa512: brandAssets.appIcons.pwa512,
  },
} as const;

export type BrandMetadata = typeof brandMetadata;
