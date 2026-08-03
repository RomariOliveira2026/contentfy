import type {
  LearnerAchievement,
  LearnerCompetencyState,
  LearnerGoalState,
  LearnLearnerSignals,
  SuccessIndexBreakdown,
} from "@shared/contentfy";
import { LEARN_ACHIEVEMENTS } from "./catalog";

export class AchievementEngine {
  evaluate(input: {
    signals: LearnLearnerSignals;
    competencies: LearnerCompetencyState[];
    goals: LearnerGoalState[];
    successIndex: SuccessIndexBreakdown;
  }): LearnerAchievement[] {
    const { signals, competencies, goals, successIndex } = input;
    const unlocked = new Set<string>();

    if (signals.purchasedAtLeastOnce) unlocked.add("first_purchase");
    if (signals.completedLessonCount >= 1) unlocked.add("first_lesson");
    if (signals.completedLessonCount >= 10) unlocked.add("lessons_10");
    if (signals.coursesCompleted >= 1) unlocked.add("course_completed");
    if (signals.streakDays >= 7) unlocked.add("streak_7");

    if (goals.some((g) => g.progress >= 70)) unlocked.add("goal_reached");

    const masteryCount = competencies.filter(
      (c) => c.level === "mastery" || c.level === "proficient"
    ).length;
    if (masteryCount >= 4) unlocked.add("specialist");

    if (successIndex.overall >= 75) unlocked.add("top_performer");
    if (successIndex.overall >= 60) unlocked.add("high_performance");

    const habit = competencies.find((c) => c.competencyId === "habits");
    const routine = competencies.find((c) => c.competencyId === "routine");
    if (
      (habit && habit.progress >= 40) ||
      (routine && routine.progress >= 40)
    ) {
      unlocked.add("habit_builder");
    }

    return LEARN_ACHIEVEMENTS.map((def) => ({
      id: def.id,
      name: def.name,
      description: def.description,
      tier: def.tier,
      unlocked: unlocked.has(def.id),
      unlockedAt: unlocked.has(def.id) ? new Date().toISOString() : undefined,
    }));
  }
}

export const achievementEngine = new AchievementEngine();
