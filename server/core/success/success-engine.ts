import type {
  LearnerAchievement,
  LearnerCompetencyState,
  LearnerGoalState,
  NextStepRecommendation,
  SuccessDashboardPayload,
  SuccessInsight,
  SuccessRawSignals,
  SuccessScoreConfig,
  SuccessScoreSnapshot,
} from "@shared/contentfy";
import { successCacheGet, successCacheSet } from "./cache";
import { resolveSuccessScoreConfig } from "./config";
import { ConsistencyEngine } from "./consistency-engine";
import { evolutionEngine } from "./evolution-engine";
import { goalProgressEngine } from "./goal-progress-engine";
import { HabitEngine } from "./habit-engine";
import { recommendationScore } from "./recommendation-score";
import { ScoreEngine } from "./score-engine";

export interface SuccessEngineInput {
  signals: SuccessRawSignals;
  goals: LearnerGoalState[];
  competencies: LearnerCompetencyState[];
  achievements: LearnerAchievement[];
  nextStep: NextStepRecommendation | null;
  productNames?: Record<string, string>;
  config?: Partial<SuccessScoreConfig>;
}

function buildInsights(
  signals: SuccessRawSignals,
  score: SuccessScoreSnapshot,
  goals: LearnerGoalState[],
  stagnant: LearnerCompetencyState[]
): SuccessInsight[] {
  const insights: SuccessInsight[] = [];
  const weekly = Math.round(signals.weeklyDeltaPercent);
  if (weekly !== 0) {
    insights.push({
      id: "weekly",
      kind: "weekly_evolution",
      title: weekly > 0 ? "Você evoluiu" : "Ritmo em ajuste",
      body:
        weekly > 0
          ? `Você evoluiu ${weekly}% esta semana.`
          : `Variação de ${weekly}% esta semana — retome o próximo passo.`,
      metric: Math.abs(weekly),
      unit: "%",
    });
  }

  const active = goals.find((g) => g.isActive);
  if (active) {
    insights.push({
      id: "goal",
      kind: "goal_progress",
      title: "Progresso do objetivo",
      body: `Você concluiu ${active.progress}% do objetivo “${active.name}”.`,
      metric: active.progress,
      unit: "%",
    });
    const left = active.missingCompetencyIds.length;
    if (left > 0) {
      insights.push({
        id: "comps-left",
        kind: "competencies_left",
        title: "Quase lá",
        body: `Mais ${left} competência${left === 1 ? "" : "s"} e você conclui sua jornada.`,
        metric: left,
      });
    }
  }

  if (stagnant.length > 0) {
    insights.push({
      id: "stagnant",
      kind: "stagnant",
      title: "Competência estagnada",
      body: `${stagnant[0].name} precisa de atenção para acelerar seu sucesso.`,
      metric: stagnant[0].progress,
      unit: "%",
    });
  }

  if (signals.streakDays >= 7) {
    insights.push({
      id: "habit",
      kind: "habit",
      title: "Constância",
      body: `${signals.streakDays} dias de ritmo — hábito em formação.`,
      metric: signals.streakDays,
      unit: "dias",
    });
  }

  if (score.pillars.consistency >= 50 && score.pillars.knowledge >= 40) {
    insights.push({
      id: "morning",
      kind: "morning_hint",
      title: "Padrão de desempenho",
      body: "Seu melhor desempenho tende a ocorrer em blocos focados — priorize sessões curtas e regulares.",
    });
  }

  return insights.slice(0, 6);
}

/** ContentFy Success Engine — transformation orchestrator. */
export class SuccessEngine {
  constructor(private config: SuccessScoreConfig = resolveSuccessScoreConfig()) {}

  buildDashboard(input: SuccessEngineInput): SuccessDashboardPayload {
    const cfg = resolveSuccessScoreConfig({
      ...this.config,
      ...input.config,
    });
    const cacheKey = `success:dashboard:${input.signals.userId}`;
    const cached = successCacheGet<SuccessDashboardPayload>(cacheKey);
    if (cached) return { ...cached, cacheHit: true };

    const score = new ScoreEngine(cfg).compute(input.signals);
    const habits = new HabitEngine(cfg).evaluate(input.signals.streakDays);
    const consistency = new ConsistencyEngine(cfg).evaluate(input.signals);

    const goals = goalProgressEngine.build({
      goals: input.goals,
      competencies: input.competencies,
      achievements: input.achievements,
      nextStep: input.nextStep,
    });

    const stagnant = input.competencies.filter(
      (c) => c.status === "in_progress" && c.progress > 0 && c.progress < 55
    );

    const recommendations = recommendationScore.rank({
      signals: input.signals,
      score,
      productNames: input.productNames,
      stagnantIds: stagnant.map((s) => s.competencyId),
    });

    const nextAction = recommendations[0] || null;
    const relatedProducts = recommendations
      .filter((r) => r.productSlug)
      .slice(0, 6)
      .map((r) => ({
        slug: r.productSlug!,
        name: r.title,
        href: r.href || `/produto/${r.productSlug}`,
        reason: r.reason,
      }));

    const payload: SuccessDashboardPayload = {
      score,
      habits,
      consistency,
      goals,
      evolution: evolutionEngine.series(input.signals),
      monthlyEvolution: evolutionEngine.monthly(input.signals),
      weeklyProgress: evolutionEngine.weekly(input.signals),
      timeline: input.signals.timeline,
      insights: buildInsights(input.signals, score, input.goals, stagnant),
      recommendations,
      nextAction,
      stagnantCompetencies: stagnant.map((s) => ({
        id: s.competencyId,
        name: s.name,
        progress: s.progress,
      })),
      relatedProducts,
      generatedAt: new Date().toISOString(),
      cacheHit: false,
    };

    successCacheSet(cacheKey, payload, 45_000);
    return payload;
  }
}

export const successEngine = new SuccessEngine();
