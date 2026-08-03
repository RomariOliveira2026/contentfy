/**
 * Official ContentFy brand color tokens.
 * DESIGN FREEZE v1.0 — do not alter without brand approval.
 */

export const brandColors = {
  midnight: "#070B12",
  charcoal: "#111827",
  orange: "#F97316",
  amber: "#F59E0B",
  gold: "#EAB308",
  snow: "#F8FAFC",
  /** Eye ring / secondary accent used in lock */
  crimson: "#DC2626",
} as const;

export type BrandColorToken = keyof typeof brandColors;

/** Theme / PWA / browser chrome */
export const brandThemeColor = brandColors.midnight;
export const brandBackgroundColor = brandColors.midnight;
export const brandAccentColor = brandColors.orange;
