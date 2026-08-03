import type { SuccessDashboardPayload } from "@shared/contentfy";
import { SuccessScoreCard } from "./SuccessScoreCard";
import {
  EvolutionChart,
  MonthlyEvolution,
  WeeklyProgress,
} from "./EvolutionChart";
import { ConsistencyCard } from "./ConsistencyCard";
import { HabitCard } from "./HabitCard";
import { GoalProgressCard } from "./GoalProgressCard";
import { RecommendationCard } from "./RecommendationCard";
import { NextActionCard } from "./NextActionCard";

interface SuccessDashboardProps {
  data: SuccessDashboardPayload;
}

export function SuccessDashboard({ data }: SuccessDashboardProps) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
          ContentFy Success
        </p>
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight">
          Minha Evolução
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
          Evolução, aplicação e transformação — motor proprietário com pesos
          configuráveis.
        </p>
      </div>

      {data.nextAction && (
        <NextActionCard
          title={data.nextAction.title}
          reason={data.nextAction.reason}
          href={data.nextAction.href}
        />
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <SuccessScoreCard
          className="lg:col-span-2"
          score={data.score.score}
          label={data.score.label}
          {...data.score.pillars}
        />
        <ConsistencyCard
          label={data.consistency.label}
          score={data.consistency.score}
          band={data.consistency.band}
          trend={data.consistency.trend}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <HabitCard
          currentStreakDays={data.habits.currentStreakDays}
          label={data.habits.label}
          milestones={data.habits.milestones}
        />
        <WeeklyProgress points={data.weeklyProgress} />
      </div>

      <MonthlyEvolution points={data.monthlyEvolution} />

      {data.insights.length > 0 && (
        <section className="grid gap-3 sm:grid-cols-2">
          {data.insights.map((insight) => (
            <div
              key={insight.id}
              className="rounded-xl border border-border/40 bg-background/40 p-4"
            >
              <p className="text-sm font-medium">{insight.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{insight.body}</p>
            </div>
          ))}
        </section>
      )}

      <section>
        <h2 className="text-sm font-medium mb-3">Objetivos</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {data.goals
            .filter((g) => g.progress > 0 || g.nextStep)
            .slice(0, 6)
            .map((g) => (
              <GoalProgressCard
                key={g.goalId}
                goalName={g.goalName}
                progress={g.progress}
                nextStep={g.nextStep}
                nextStepHref={g.nextStepHref}
              />
            ))}
        </div>
      </section>

      {data.stagnantCompetencies.length > 0 && (
        <section>
          <h2 className="text-sm font-medium mb-3">Competências estagnadas</h2>
          <div className="flex flex-wrap gap-2">
            {data.stagnantCompetencies.map((c) => (
              <span
                key={c.id}
                className="text-xs rounded-full border border-border/50 px-3 py-1 text-muted-foreground"
              >
                {c.name} · {c.progress}%
              </span>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-sm font-medium mb-3">Recomendações</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {data.recommendations.slice(0, 6).map((r) => (
            <RecommendationCard
              key={r.id}
              title={r.title}
              reason={r.reason}
              href={r.href}
              score={r.score}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium mb-3">Linha do tempo</h2>
        <EvolutionChart
          title="Timeline"
          points={data.timeline.slice(0, 6).map((t, i) => ({
            key: t.id,
            label: t.title,
            value: Math.max(20, 100 - i * 12),
          }))}
        />
        <ul className="mt-4 space-y-2">
          {data.timeline.map((t) => (
            <li key={t.id} className="text-sm">
              <p className="font-medium">{t.title}</p>
              {t.subtitle && (
                <p className="text-xs text-muted-foreground">{t.subtitle}</p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
