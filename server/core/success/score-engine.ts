import {
  clampScore,
  gradeFromScore,
  normalizeWeights,
  type SuccessPillarScores,
  type SuccessRawSignals,
  type SuccessScoreConfig,
  type SuccessScoreSnapshot,
} from "@shared/contentfy";
import { resolveSuccessScoreConfig } from "./config";

function ratioToScore(value: number, target: number): number {
  if (target <= 0) return 0;
  return clampScore((value / target) * 100);
}

export class ScoreEngine {
  constructor(private config: SuccessScoreConfig = resolveSuccessScoreConfig()) {}

  withConfig(config: Partial<SuccessScoreConfig>): ScoreEngine {
    return new ScoreEngine(resolveSuccessScoreConfig(config));
  }

  getConfig(): SuccessScoreConfig {
    return this.config;
  }

  pillars(signals: SuccessRawSignals): SuccessPillarScores {
    const t = this.config.targets;
    const knowledge = clampScore(
      ratioToScore(signals.modulesCompleted, t.modulesCompleted) * 0.7 +
        (signals.modulesTotal > 0
          ? (signals.modulesCompleted / signals.modulesTotal) * 100 * 0.3
          : signals.avgProgress * 0.3)
    );

    const application = ratioToScore(
      signals.applicationTasks,
      t.applicationTasks
    );

    const consistency = clampScore(
      ratioToScore(signals.activeDays, t.activeDays) * 0.55 +
        ratioToScore(signals.streakDays, t.streakDays) * 0.45
    );

    const result = clampScore(
      ratioToScore(signals.goalsCompleted, t.goalsCompleted) * 0.45 +
        ratioToScore(
          signals.competenciesAcquired,
          t.competenciesAcquired
        ) * 0.55
    );

    return { knowledge, application, consistency, result };
  }

  compute(signals: SuccessRawSignals): SuccessScoreSnapshot {
    const pillars = this.pillars(signals);
    const weights = normalizeWeights(this.config.weights);
    const weighted = clampScore(
      pillars.knowledge * weights.knowledge +
        pillars.application * weights.application +
        pillars.consistency * weights.consistency +
        pillars.result * weights.result
    );

    const grade = gradeFromScore(weighted, this.config.gradeThresholds);
    return {
      score: weighted,
      grade,
      pillars,
      weightsUsed: weights,
      label: gradeLabel(grade),
    };
  }
}

function gradeLabel(grade: SuccessScoreSnapshot["grade"]): string {
  switch (grade) {
    case "master":
      return "Transformação avançada";
    case "rise":
      return "Evolução sólida";
    case "grow":
      return "Em crescimento";
    default:
      return "Início da jornada";
  }
}

export const scoreEngine = new ScoreEngine();
