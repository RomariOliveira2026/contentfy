/**
 * Official brand asset paths (runtime copies under /public/brand).
 * Source of truth: /brand (DESIGN FREEZE v1.0)
 */

const BRAND_SVG = "/brand/svg";
const BRAND_PNG = "/brand/png";
const BRAND_PWA = "/brand/app-icons/pwa";
const BRAND_IOS = "/brand/app-icons/ios";
const BRAND_ANDROID = "/brand/app-icons/android";

export const brandAssets = {
  svg: {
    master: `${BRAND_SVG}/master.svg`,
    compact: `${BRAND_SVG}/compact.svg`,
    micro: `${BRAND_SVG}/micro.svg`,
    favicon: `${BRAND_SVG}/favicon.svg`,
    avatar: `${BRAND_SVG}/avatar.svg`,
    logoHorizontal: `${BRAND_SVG}/logo-horizontal.svg`,
    logoHorizontalOnLight: `${BRAND_SVG}/logo-horizontal-on-light.svg`,
    logoVertical: `${BRAND_SVG}/logo-vertical.svg`,
    monoDark: `${BRAND_SVG}/mono-dark.svg`,
    monoLight: `${BRAND_SVG}/mono-light.svg`,
    outline: `${BRAND_SVG}/outline.svg`,
    silhouette: `${BRAND_SVG}/silhouette.svg`,
  },
  png: {
    favicon16: `${BRAND_PNG}/favicon-16.png`,
    favicon32: `${BRAND_PNG}/favicon-32.png`,
    favicon48: `${BRAND_PNG}/favicon-48.png`,
    symbol64: `${BRAND_PNG}/symbol-64.png`,
    symbol96: `${BRAND_PNG}/symbol-96.png`,
    symbol128: `${BRAND_PNG}/symbol-128.png`,
    symbol256: `${BRAND_PNG}/symbol-256.png`,
    symbol512: `${BRAND_PNG}/symbol-512.png`,
  },
  appIcons: {
    pwa192: `${BRAND_PWA}/icon-192.png`,
    pwa512: `${BRAND_PWA}/icon-512.png`,
    ios512: `${BRAND_IOS}/AppIcon-512.png`,
    ios1024: `${BRAND_IOS}/AppIcon-1024.png`,
    android512: `${BRAND_ANDROID}/ic_launcher-512.png`,
    android1024: `${BRAND_ANDROID}/ic_launcher-1024.png`,
  },
  /** Legacy public paths kept for index.html / manifest compatibility */
  distributed: {
    faviconSvg: "/favicon.svg",
    favicon16: "/favicon-16.png",
    favicon32: "/favicon-32.png",
    favicon48: "/favicon-48.png",
    favicon192: "/favicon-192.png",
    favicon512: "/favicon.png",
    appleTouchIcon: "/apple-touch-icon.png",
    icon192: "/icon-192.png",
    icon512: "/icon-512.png",
    logoContentfy: "/logo-contentfy.svg",
  },
} as const;

/** Intrinsic aspect ratios from official viewBoxes (width / height). */
export const brandAspectRatios = {
  logoHorizontal: 440 / 90,
  logoVertical: 280 / 280,
  symbol: 128 / 154,
  favicon: 1,
  avatar: 1,
} as const;
