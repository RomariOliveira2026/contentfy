import type {
  GoalProgressSnapshot,
  LearnerAchievement,
  LearnerCompetencyState,
  LearnerGoalState,
  NextStepRecommendation,
} from "@shared/contentfy";
import { LEARN_PRODUCT_LINKS } from "../learn/catalog";

export class GoalProgressEngine {
  build(input: {
    goals: LearnerGoalState[];
    competencies: LearnerCompetencyState[];
    achievements: LearnerAchievement[];
    nextStep: NextStepRecommendation | null;
  }): GoalProgressSnapshot[] {
    const unlockedAchievements = input.achievements
      .filter((a) => a.unlocked)
      .map((a) => a.id);

    return input.goals.map((g) => {
      const courseSlugs = LEARN_PRODUCT_LINKS.filter((l) =>
        (l.goalIds || []).includes(g.goalId)
      ).map((l) => l.productSlug);

      const nextStep =
        g.isActive && input.nextStep
          ? input.nextStep.title
          : g.missingCompetencyIds[0]
            ? `Desenvolver competência pendente`
            : g.progress >= 70
              ? "Objetivo quase concluído"
              : null;

      return {
        goalId: g.goalId,
        goalName: g.name,
        progress: g.progress,
        competencyIds: g.competencyIds,
        courseSlugs,
        achievementIds: unlockedAchievements.slice(0, 3),
        nextStep,
        nextStepHref:
          g.isActive && input.nextStep?.href ? input.nextStep.href : null,
      };
    });
  }
}

export const goalProgressEngine = new GoalProgressEngine();
