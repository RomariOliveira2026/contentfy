import type {
  LearnerCompetencyState,
  LearnerGoalState,
  LearnLearnerSignals,
  SkillGraphEdge,
  SkillGraphSnapshot,
} from "@shared/contentfy";
import { LEARN_PRODUCT_LINKS } from "./catalog";

/**
 * Skill graph: Course → Competency → Goal → Learner → Related product.
 * Consumable later by Discovery (read-only export).
 */
export class SkillGraph {
  build(input: {
    signals: LearnLearnerSignals;
    competencies: LearnerCompetencyState[];
    goals: LearnerGoalState[];
  }): SkillGraphSnapshot {
    const edges: SkillGraphEdge[] = [];
    const competencyIds = new Set<string>();
    const goalIds = new Set<string>();
    const productSlugs = new Set<string>();

    for (const link of LEARN_PRODUCT_LINKS) {
      productSlugs.add(link.productSlug);
      for (const competencyId of link.competencyIds) {
        competencyIds.add(competencyId);
        edges.push({
          fromType: "product",
          fromId: link.productSlug,
          toType: "competency",
          toId: competencyId,
          weight: link.weights?.[competencyId] ?? 0.7,
          relation: "develops",
        });
      }
      for (const goalId of link.goalIds || []) {
        goalIds.add(goalId);
        edges.push({
          fromType: "product",
          fromId: link.productSlug,
          toType: "goal",
          toId: goalId,
          weight: 0.8,
          relation: "supports_goal",
        });
      }
    }

    for (const g of input.goals) {
      goalIds.add(g.goalId);
      for (const competencyId of g.competencyIds) {
        competencyIds.add(competencyId);
        edges.push({
          fromType: "competency",
          fromId: competencyId,
          toType: "goal",
          toId: g.goalId,
          weight: 1,
          relation: "advances",
        });
      }
    }

    const learnerId = String(input.signals.userId);
    for (const c of input.competencies) {
      if (c.progress <= 0) continue;
      edges.push({
        fromType: "learner",
        fromId: learnerId,
        toType: "competency",
        toId: c.competencyId,
        weight: c.progress / 100,
        relation: "possesses",
      });
    }

    const active = input.goals.find((g) => g.isActive);
    if (active) {
      edges.push({
        fromType: "learner",
        fromId: learnerId,
        toType: "goal",
        toId: active.goalId,
        weight: active.progress / 100,
        relation: "pursues",
      });
    }

    // Related products along goal (for Discovery handoff)
    if (active) {
      const related = LEARN_PRODUCT_LINKS.filter((l) =>
        (l.goalIds || []).includes(active.goalId)
      ).map((l) => l.productSlug);
      for (let i = 0; i < related.length - 1; i++) {
        edges.push({
          fromType: "product",
          fromId: related[i],
          toType: "related_product",
          toId: related[i + 1],
          weight: 0.6,
          relation: "journey_next",
        });
      }
    }

    return {
      edges,
      competencyIds: Array.from(competencyIds),
      goalIds: Array.from(goalIds),
      productSlugs: Array.from(productSlugs),
    };
  }
}

export const skillGraph = new SkillGraph();
