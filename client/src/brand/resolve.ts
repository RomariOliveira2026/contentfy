import { brandAssets, brandAspectRatios } from "./assets";
import { resolveBrandSize, resolveSymbolLevel } from "./tokens";
import type {
  BrandLogoVariant,
  BrandSize,
  BrandSymbolLevel,
  BrandTheme,
} from "./types";

function isDocumentDark(): boolean {
  if (typeof document === "undefined") return true;
  return document.documentElement.classList.contains("dark");
}

export function resolveTheme(theme: BrandTheme): Exclude<BrandTheme, "auto"> {
  if (theme === "auto") {
    return isDocumentDark() ? "dark" : "light";
  }
  return theme;
}

export function resolveLogoSrc(
  variant: BrandLogoVariant,
  theme: BrandTheme
): string {
  const resolved = resolveTheme(theme);

  if (resolved === "monochrome-light") return brandAssets.svg.monoLight;
  if (resolved === "monochrome-dark") return brandAssets.svg.monoDark;

  if (variant === "vertical") {
    return brandAssets.svg.logoVertical;
  }

  // Official lockup: snow wordmark for dark surfaces; charcoal wordmark for light.
  if (resolved === "light") {
    return brandAssets.svg.logoHorizontalOnLight;
  }
  return brandAssets.svg.logoHorizontal;
}

export function resolveSymbolSrc(
  level: BrandSymbolLevel | "auto",
  theme: BrandTheme,
  size: BrandSize | undefined
): { src: string; level: BrandSymbolLevel; pixelSize: number } {
  const pixelSize = resolveBrandSize(size, 32);
  const resolvedLevel = resolveSymbolLevel(level, pixelSize);
  const resolvedTheme = resolveTheme(theme);

  if (resolvedTheme === "monochrome-light") {
    return { src: brandAssets.svg.monoLight, level: resolvedLevel, pixelSize };
  }
  if (resolvedTheme === "monochrome-dark") {
    return { src: brandAssets.svg.monoDark, level: resolvedLevel, pixelSize };
  }

  const src =
    resolvedLevel === "master"
      ? brandAssets.svg.master
      : resolvedLevel === "compact"
        ? brandAssets.svg.compact
        : brandAssets.svg.micro;

  return { src, level: resolvedLevel, pixelSize };
}

export function logoDimensions(
  variant: BrandLogoVariant,
  height: number
): { width: number; height: number } {
  const ratio =
    variant === "vertical"
      ? brandAspectRatios.logoVertical
      : brandAspectRatios.logoHorizontal;
  return {
    width: Math.round(height * ratio),
    height,
  };
}

export function symbolDimensions(height: number): {
  width: number;
  height: number;
} {
  return {
    width: Math.round(height * brandAspectRatios.symbol),
    height,
  };
}
