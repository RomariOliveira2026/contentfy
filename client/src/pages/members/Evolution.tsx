import type { LearnDashboardPayload } from "@shared/contentfy";
import MembersLayout from "@/components/MembersLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  AchievementBadge,
  CompetencyCard,
  EvolutionCard,
  GoalCard,
  JourneyTimeline,
  LearningPath,
  NextStepCard,
  SkillRadar,
  SuccessIndexBars,
} from "@/components/learn";

export default function EvolutionPage() {
  const utils = trpc.useUtils();
  const { data, isLoading, error } = trpc.learn.dashboard.useQuery(undefined, {
    staleTime: 30_000,
  });

  const setGoal = trpc.learn.setActiveGoal.useMutation({
    onSuccess: () => {
      void utils.learn.dashboard.invalidate();
      void utils.learn.goals.invalidate();
      toast.success("Objetivo atualizado");
    },
    onError: () => toast.error("Não foi possível definir o objetivo"),
  });

  return (
    <MembersLayout>
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      ) : error || !data ? (
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar sua evolução. Tente novamente em instantes.
        </p>
      ) : (
        <EvolutionContent
          data={data}
          onSelectGoal={(goalId) => setGoal.mutate({ goalId })}
        />
      )}
    </MembersLayout>
  );
}

function EvolutionContent({
  data,
  onSelectGoal,
}: {
  data: LearnDashboardPayload;
  onSelectGoal: (goalId: string) => void;
}) {
  const radarAxes = [
    ...data.competencies.acquired,
    ...data.competencies.inProgress,
  ]
    .slice(0, 6)
    .map((c) => ({ label: c.name, value: c.progress }));

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
          ContentFy Learn
        </p>
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight">
          Evolução
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
          Objetivos, competências e jornada — inteligência por regras
          proprietárias, sem IA generativa.
        </p>
      </div>

      {data.nextStep && (
        <NextStepCard
          title={data.nextStep.title}
          reason={data.nextStep.reason}
          href={data.nextStep.href}
        />
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <EvolutionCard
          title="Objetivo atual"
          subtitle={data.activeGoal?.description || "Defina um objetivo abaixo"}
          percent={data.activeGoal?.progress ?? data.evolutionPercent}
          className="lg:col-span-2"
        >
          {data.activeGoal && (
            <p className="text-sm text-muted-foreground">{data.activeGoal.name}</p>
          )}
        </EvolutionCard>
        <EvolutionCard
          title="Success Index"
          subtitle={`Geral ${data.successIndex.overall}`}
          percent={data.successIndex.overall}
        >
          <SuccessIndexBars {...data.successIndex} />
        </EvolutionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <EvolutionCard title="Competências" subtitle="Adquiridas e em evolução">
          <div className="grid gap-3 sm:grid-cols-2">
            {[...data.competencies.acquired, ...data.competencies.inProgress]
              .slice(0, 6)
              .map((c) => (
                <CompetencyCard
                  key={c.competencyId}
                  name={c.name}
                  category={c.category}
                  progress={c.progress}
                  level={c.level}
                  status={c.status}
                />
              ))}
            {data.competencies.acquired.length +
              data.competencies.inProgress.length ===
              0 && (
              <p className="text-sm text-muted-foreground col-span-full">
                Adquira um produto alinhado para começar a desenvolver
                competências.
              </p>
            )}
          </div>
        </EvolutionCard>

        <EvolutionCard title="Mapa de habilidades">
          {radarAxes.length > 0 ? (
            <SkillRadar axes={radarAxes} />
          ) : (
            <p className="text-sm text-muted-foreground">
              O radar aparece quando houver progresso em competências.
            </p>
          )}
        </EvolutionCard>
      </div>

      <EvolutionCard title="Objetivos" subtitle="Escolha o foco da sua jornada">
        <div className="grid gap-3 sm:grid-cols-2">
          {data.goals.map((g) => (
            <GoalCard
              key={g.goalId}
              name={g.name}
              description={g.description}
              progress={g.progress}
              isActive={g.isActive}
              onSelect={() => onSelectGoal(g.goalId)}
            />
          ))}
        </div>
      </EvolutionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <EvolutionCard title="Jornada" subtitle="Linha do tempo da evolução">
          <JourneyTimeline steps={data.journey.steps} />
        </EvolutionCard>
        <div className="space-y-6">
          <EvolutionCard title="Cursos relacionados">
            <LearningPath items={data.relatedCourses} />
          </EvolutionCard>
          <EvolutionCard title="Linha do tempo">
            <ul className="space-y-3">
              {data.timeline.map((e) => (
                <li key={e.id} className="text-sm">
                  <p className="font-medium">{e.title}</p>
                  {e.subtitle && (
                    <p className="text-xs text-muted-foreground">{e.subtitle}</p>
                  )}
                </li>
              ))}
            </ul>
          </EvolutionCard>
        </div>
      </div>

      <EvolutionCard title="Conquistas" subtitle="Marcos elegantes da jornada">
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
          {data.achievements.map((a) => (
            <div key={a.id} className="snap-start shrink-0">
              <AchievementBadge
                name={a.name}
                description={a.description}
                tier={a.tier}
                unlocked={a.unlocked}
              />
            </div>
          ))}
        </div>
      </EvolutionCard>
    </div>
  );
}
