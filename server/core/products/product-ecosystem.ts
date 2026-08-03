import {
  DEFAULT_PRODUCT_SURFACES,
  type ProductEcosystem,
  type ProductSurface,
} from "@shared/contentfy";

/** ContentFy Products — ecosystem model over classic product types. */
export class ProductEcosystemEngine {
  forProduct(input: {
    productId: number;
    slug: string;
    surfaces?: ProductSurface[];
    aiSlug?: string;
  }): ProductEcosystem {
    return {
      productId: input.productId,
      slug: input.slug,
      surfaces: input.surfaces ?? [...DEFAULT_PRODUCT_SURFACES],
      aiSlug: input.aiSlug ?? `${input.slug}-ai`,
    };
  }
}

export const productEcosystemEngine = new ProductEcosystemEngine();
