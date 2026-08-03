import type {
  HabitMilestone,
  HabitSnapshot,
  SuccessScoreConfig,
} from "@shared/contentfy";
import { resolveSuccessScoreConfig } from "./config";

export class HabitEngine {
  constructor(private config: SuccessScoreConfig = resolveSuccessScoreConfig()) {}

  evaluate(streakDays: number): HabitSnapshot {
    const milestones: HabitMilestone[] = this.config.habitMilestones.map(
      (days) => {
        const progress = Math.min(100, Math.round((streakDays / days) * 100));
        return {
          days,
          name: `${days} dias`,
          reached: streakDays >= days,
          progress,
        };
      }
    );

    const next = milestones.find((m) => !m.reached);
    const label = next
      ? `Próximo marco: ${next.days} dias`
      : "Todos os marcos de hábito alcançados";

    return {
      currentStreakDays: Math.max(0, streakDays),
      milestones,
      label,
    };
  }
}

export const habitEngine = new HabitEngine();
