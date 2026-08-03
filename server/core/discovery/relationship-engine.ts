import type {
  DiscoveryProductMeta,
  DiscoveryRelationship,
} from "@shared/contentfy";
import { getSeedRelationshipsFrom, walkRelationshipChain } from "./seed-relationships";

export class RelationshipEngine {
  constructor(private extra: DiscoveryRelationship[] = []) {}

  private allFrom(fromSlug: string): DiscoveryRelationship[] {
    return [...getSeedRelationshipsFrom(fromSlug), ...this.extra.filter((r) => r.fromSlug === fromSlug)]
      .sort((a, b) => b.weight - a.weight);
  }

  relatedSlugs(fromSlug: string, limit = 8): string[] {
    return this.allFrom(fromSlug)
      .map((r) => r.toSlug)
      .filter((slug, i, arr) => arr.indexOf(slug) === i)
      .slice(0, limit);
  }

  chain(fromSlug: string, maxDepth = 8): string[] {
    const seeded = walkRelationshipChain(fromSlug, maxDepth);
    if (seeded.length > 1) return seeded;
    return [fromSlug, ...this.relatedSlugs(fromSlug, maxDepth - 1)];
  }

  /** Score candidate by graph proximity to owned/viewed slugs. */
  scoreByGraph(
    candidateSlug: string,
    anchors: string[]
  ): number {
    let score = 0;
    for (const anchor of anchors) {
      if (anchor === candidateSlug) continue;
      const related = this.relatedSlugs(anchor, 12);
      const idx = related.indexOf(candidateSlug);
      if (idx >= 0) score += Math.max(1, 10 - idx);
      const chain = this.chain(anchor, 6);
      const cIdx = chain.indexOf(candidateSlug);
      if (cIdx > 0) score += Math.max(1, 12 - cIdx);
    }
    return score;
  }

  enrichMeta(
    meta: DiscoveryProductMeta[],
    slug: string
  ): DiscoveryProductMeta | undefined {
    return meta.find((m) => m.slug === slug);
  }
}

export const relationshipEngine = new RelationshipEngine();
