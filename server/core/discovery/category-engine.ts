import type { DiscoveryProductMeta, DiscoveryRailId } from "@shared/contentfy";

const COLLECTION_TO_RAIL: Record<string, DiscoveryRailId> = {
  launches: "launches",
  featured: "featured",
  start_here: "start_here",
  ai: "ai",
  business: "business",
  sales_rep: "sales_rep",
  personal_dev: "personal_dev",
  productivity: "productivity",
  buildertudo: "buildertudo",
  bestsellers: "bestsellers",
};

const CATEGORY_ALIASES: Record<string, DiscoveryRailId[]> = {
  ia: ["ai"],
  "inteligência artificial": ["ai"],
  negócios: ["business"],
  negocios: ["business"],
  "representação comercial": ["sales_rep"],
  "representacao comercial": ["sales_rep"],
  "desenvolvimento pessoal": ["personal_dev"],
  "bem-estar": ["personal_dev"],
  produtividade: ["productivity"],
  buildertudo: ["buildertudo"],
};

export class CategoryEngine {
  byCollection(
    catalog: DiscoveryProductMeta[],
    collection: string,
    limit = 12
  ): DiscoveryProductMeta[] {
    const key = collection.toLowerCase();
    return catalog
      .filter((p) => p.collections.some((c) => c.toLowerCase() === key))
      .slice(0, limit);
  }

  byCategoryName(
    catalog: DiscoveryProductMeta[],
    category: string,
    limit = 12
  ): DiscoveryProductMeta[] {
    const q = category.trim().toLowerCase();
    if (!q) return [];
    return catalog
      .filter(
        (p) =>
          p.category.toLowerCase().includes(q) ||
          (p.subcategory || "").toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, limit);
  }

  railItems(
    catalog: DiscoveryProductMeta[],
    railId: DiscoveryRailId,
    limit = 12
  ): DiscoveryProductMeta[] {
    const byCollection = this.byCollection(catalog, railId, limit);
    if (byCollection.length) return byCollection;

    // Fallback: map rail to category aliases
    for (const [alias, rails] of Object.entries(CATEGORY_ALIASES)) {
      if (rails.includes(railId)) {
        const found = this.byCategoryName(catalog, alias, limit);
        if (found.length) return found;
      }
    }

    if (railId === "start_here") {
      return catalog.filter((p) => p.isBeginnerFriendly).slice(0, limit);
    }
    if (railId === "featured") {
      return catalog.filter((p) => p.isFeatured).slice(0, limit);
    }
    if (railId === "launches") {
      return catalog.filter((p) => p.isLaunch).slice(0, limit);
    }
    return [];
  }

  collectionRailId(collection: string): DiscoveryRailId | null {
    return COLLECTION_TO_RAIL[collection] ?? null;
  }
}

export const categoryEngine = new CategoryEngine();
