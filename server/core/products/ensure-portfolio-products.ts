import {
  getPortfolioCheckoutProduct,
  type PortfolioCheckoutProduct,
} from "@shared/contentfy/portfolio-checkout-products";
import * as db from "../../db";
import type { Product } from "../../../drizzle/schema";

function toInsert(def: PortfolioCheckoutProduct) {
  return {
    name: def.name,
    slug: def.slug,
    description: def.description,
    type: def.type,
    price: def.price,
    coverImage: def.coverImage,
    thumbnailImage: def.thumbnailImage,
    salesPageUrl: def.salesPageUrl,
    guaranteeDays: def.guaranteeDays,
    maxInstallments: def.maxInstallments,
    allowInstallments: true,
    isRecurring: false,
    isActive: true,
  };
}

/**
 * Garante produto de portfólio no banco para checkout real (Stripe).
 */
export async function ensurePortfolioCheckoutProduct(
  slug: string
): Promise<Product | undefined> {
  const existing = await db.getProductBySlug(slug);
  if (existing?.isActive) return existing;

  const def = getPortfolioCheckoutProduct(slug);
  if (!def) return existing;

  if (existing && !existing.isActive) {
    await db.updateProduct(existing.id, { isActive: true, price: def.price });
    return db.getProductById(existing.id);
  }

  if (!existing) {
    const created = await db.createProduct(toInsert(def));
    return db.getProductById(created.insertId);
  }

  return existing;
}
