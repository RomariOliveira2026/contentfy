/** ContentFy Products — product as ecosystem (not just a file). */

export type ProductSurface =
  | "landing"
  | "library"
  | "ai"
  | "community"
  | "downloads"
  | "updates"
  | "roadmap"
  | "tools"
  | "certificates"
  | "resources";

export interface ProductEcosystem {
  productId: number;
  slug: string;
  surfaces: ProductSurface[];
  aiSlug?: string;
  communitySpaceId?: string;
}

export const DEFAULT_PRODUCT_SURFACES: ProductSurface[] = [
  "landing",
  "library",
  "downloads",
  "certificates",
  "resources",
];
