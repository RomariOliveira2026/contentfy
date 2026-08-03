/** ContentFy brand system — Design Freeze v1.0 */

export type BrandLogoVariant = "horizontal" | "vertical";

export type BrandSymbolLevel = "master" | "compact" | "micro";

export type BrandTheme =
  | "auto"
  | "light"
  | "dark"
  | "monochrome-light"
  | "monochrome-dark";

export type BrandSizePreset =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "hero";

export type BrandSize = BrandSizePreset | number | `${number}` | `${number}px`;

export type BrandOrientation = "horizontal" | "vertical";
