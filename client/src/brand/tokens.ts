import type { BrandSize, BrandSizePreset, BrandSymbolLevel } from "./types";

/**
 * Brand usage tokens — sizes, clearance, variant rules.
 * DESIGN FREEZE v1.0
 */

export const brandSizePresets: Record<BrandSizePreset, number> = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
  "2xl": 96,
  hero: 128,
};

/** Minimum rendered height (px) per symbol level */
export const symbolMinSize: Record<BrandSymbolLevel, number> = {
  master: 96,
  compact: 32,
  micro: 16,
};

/** Maximum recommended height (px) per symbol level */
export const symbolMaxSize: Record<BrandSymbolLevel, number> = {
  master: Number.POSITIVE_INFINITY,
  compact: 95,
  micro: 32,
};

/** Default logo height in headers (px) */
export const logoDefaultHeight = 52;

/** Clearance around mark as fraction of mark height */
export const brandClearanceRatio = 0.25;

export function resolveBrandSize(size: BrandSize | undefined, fallback = 32): number {
  if (size == null) return fallback;
  if (typeof size === "number" && Number.isFinite(size)) return size;
  if (typeof size === "string") {
    if (size in brandSizePresets) {
      return brandSizePresets[size as BrandSizePreset];
    }
    const parsed = Number.parseFloat(size);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

/**
 * Pick the correct symbol level for a target pixel size.
 * Never downscale Master below its minimum — switch to Compact/Micro instead.
 */
export function resolveSymbolLevel(
  requested: BrandSymbolLevel | "auto",
  pixelSize: number
): BrandSymbolLevel {
  if (requested !== "auto") {
    if (requested === "master" && pixelSize < symbolMinSize.master) {
      return pixelSize <= symbolMaxSize.micro ? "micro" : "compact";
    }
    return requested;
  }
  if (pixelSize >= symbolMinSize.master) return "master";
  if (pixelSize >= symbolMinSize.compact) return "compact";
  return "micro";
}

export const brandContexts = {
  master: ["homepage", "landing", "hero", "splash", "campaign", "institutional"] as const,
  compact: ["header", "dashboard", "checkout", "marketplace", "login", "internal"] as const,
  micro: ["sidebar", "mobile-menu", "avatar", "notification", "compact-button", "favicon"] as const,
} as const;
