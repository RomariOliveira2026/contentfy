import type {
  CompetencyDef,
  LearnerCompetencyState,
  LearnLearnerSignals,
  ProductCompetencyLink,
} from "@shared/contentfy";
import {
  competencyStatusFromProgress,
  levelFromProgress,
} from "@shared/contentfy";
import { LEARN_COMPETENCIES, LEARN_PRODUCT_LINKS } from "./catalog";

export class CompetencyEngine {
  constructor(
    private competencies: CompetencyDef[] = LEARN_COMPETENCIES,
    private links: ProductCompetencyLink[] = LEARN_PRODUCT_LINKS
  ) {}

  list(): CompetencyDef[] {
    return [...this.competencies];
  }

  forProduct(slug: string): CompetencyDef[] {
    const link = this.links.find((l) => l.productSlug === slug);
    if (!link) return [];
    return link.competencyIds
      .map((id) => this.competencies.find((c) => c.id === id))
      .filter((c): c is CompetencyDef => Boolean(c));
  }

  /**
   * Progress on a competency = max over owned products of
   * (productProgress * weight).
   */
  evaluate(signals: LearnLearnerSignals): LearnerCompetencyState[] {
    const progressByCompetency = new Map<
      string,
      { progress: number; sources: Set<string> }
    >();

    for (const slug of signals.ownedProductSlugs) {
      const link = this.links.find((l) => l.productSlug === slug);
      if (!link) continue;
      const productProgress = signals.progressBySlug[slug] ?? 0;
      for (const competencyId of link.competencyIds) {
        const weight = link.weights?.[competencyId] ?? 0.7;
        const score = Math.min(100, productProgress * weight);
        const prev = progressByCompetency.get(competencyId) || {
          progress: 0,
          sources: new Set<string>(),
        };
        prev.progress = Math.max(prev.progress, score);
        prev.sources.add(slug);
        progressByCompetency.set(competencyId, prev);
      }
    }

    // Soft credit for any touch on linked catalog products even if not owned
    // (views not required — keep owned-only for honesty)

    return this.competencies.map((c) => {
      const row = progressByCompetency.get(c.id);
      const progress = Math.round(row?.progress ?? 0);
      return {
        competencyId: c.id,
        name: c.name,
        category: c.category,
        level: levelFromProgress(progress),
        progress,
        status: competencyStatusFromProgress(progress),
        sourceProductSlugs: Array.from(row?.sources || []),
      };
    });
  }

  /** Competencies with little movement despite ownership — stagnation heuristic. */
  stagnant(
    states: LearnerCompetencyState[],
    signals: LearnLearnerSignals
  ): LearnerCompetencyState[] {
    return states.filter((s) => {
      if (s.status !== "in_progress") return false;
      if (s.progress >= 55) return false;
      // Owned source but low progress → stalled
      return s.sourceProductSlugs.some((slug) =>
        signals.ownedProductSlugs.includes(slug)
      );
    });
  }
}

export const competencyEngine = new CompetencyEngine();
