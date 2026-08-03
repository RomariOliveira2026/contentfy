/**
 * ContentFy Brand System — public API
 * DESIGN FREEZE v1.0 · PRODUCTION READY
 *
 * Architecture: /brand (source) → client/public/brand (runtime) → this layer → components
 *
 * ContentFyBrandProvider: not created.
 * ThemeContext already owns light/dark; brand assets are static path maps.
 * A provider would add indirection without value.
 */

export { brandAssets, brandAspectRatios } from "./assets";
export {
  brandColors,
  brandThemeColor,
  brandBackgroundColor,
  brandAccentColor,
} from "./colors";
export type { BrandColorToken } from "./colors";
export { brandMetadata } from "./metadata";
export type { BrandMetadata } from "./metadata";
export {
  brandSizePresets,
  symbolMinSize,
  symbolMaxSize,
  logoDefaultHeight,
  brandClearanceRatio,
  brandContexts,
  resolveBrandSize,
  resolveSymbolLevel,
} from "./tokens";
export {
  resolveTheme,
  resolveLogoSrc,
  resolveSymbolSrc,
  logoDimensions,
  symbolDimensions,
} from "./resolve";
export type {
  BrandLogoVariant,
  BrandSymbolLevel,
  BrandTheme,
  BrandSize,
  BrandSizePreset,
  BrandOrientation,
} from "./types";
