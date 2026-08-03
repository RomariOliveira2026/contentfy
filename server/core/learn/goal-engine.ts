import type {
  GoalDef,
  LearnerCompetencyState,
  LearnerGoalState,
  LearnLearnerSignals,
} from "@shared/contentfy";
import { LEARN_GOALS, LEARN_PRODUCT_LINKS } from "./catalog";

export class GoalEngine {
  constructor(private goals: GoalDef[] = LEARN_GOALS) {}

  list(): GoalDef[] {
    return [...this.goals];
  }

  get(id: string): GoalDef | undefined {
    return this.goals.find((g) => g.id === id);
  }

  /**
   * Infer best default goal from owned products' declared goalIds.
   */
  inferActiveGoalId(signals: LearnLearnerSignals): string | null {
    if (signals.activeGoalId) return signals.activeGoalId;
    const votes = new Map<string, number>();
    for (const slug of signals.ownedProductSlugs) {
      const link = LEARN_PRODUCT_LINKS.find((l) => l.productSlug === slug);
      for (const goalId of link?.goalIds || []) {
        votes.set(goalId, (votes.get(goalId) || 0) + 1);
      }
    }
    const ranked = Array.from(votes.entries()).sort((a, b) => b[1] - a[1]);
    return ranked[0]?.[0] ?? this.goals[0]?.id ?? null;
  }

  evaluate(
    competencies: LearnerCompetencyState[],
    signals: LearnLearnerSignals
  ): LearnerGoalState[] {
    const byId = new Map(
      competencies.map((c) => [c.competencyId, c] as const)
    );
    const activeId = this.inferActiveGoalId(signals);

    return this.goals.map((g) => {
      const scores = g.competencyIds.map((id) => byId.get(id)?.progress ?? 0);
      const progress =
        scores.length === 0
          ? 0
          : Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const missingCompetencyIds = g.competencyIds.filter((id) => {
        const c = byId.get(id);
        return !c || c.status === "missing";
      });
      return {
        goalId: g.id,
        name: g.name,
        description: g.description,
        progress,
        isActive: g.id === activeId,
        competencyIds: g.competencyIds,
        missingCompetencyIds,
      };
    });
  }

  productsThatAccelerate(goalId: string): string[] {
    return LEARN_PRODUCT_LINKS.filter((l) =>
      (l.goalIds || []).includes(goalId)
    ).map((l) => l.productSlug);
  }
}

export const goalEngine = new GoalEngine();
