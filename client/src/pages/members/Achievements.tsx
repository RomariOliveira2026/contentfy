import MembersLayout from "@/components/MembersLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { useExperienceAnalytics } from "@/core/experience";
import { useEffect } from "react";
import { Link } from "wouter";

export default function AchievementsPage() {
  const { data, isLoading, error } = trpc.experience.achievements.useQuery(
    undefined,
    { staleTime: 30_000 }
  );
  const { track } = useExperienceAnalytics();

  useEffect(() => {
    if (data) track("experience.achievement_viewed");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.generatedAt]);

  return (
    <MembersLayout>
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      ) : error || !data ? (
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar suas conquistas.
        </p>
      ) : (
        <div className="space-y-8">
          <header className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Conquistas
            </p>
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight">
              Marcos da sua jornada
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Apenas conquistas reais do ContentFy Learn — sem badges inventados.
            </p>
          </header>

          {data.emptyInvite ? (
            <div className="rounded-2xl border border-dashed border-border/50 p-6 text-center">
              <p className="text-sm text-muted-foreground">{data.emptyInvite}</p>
              <Link
                href="/dashboard"
                className="inline-block mt-4 text-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                Ir ao Centro de Evolução
              </Link>
            </div>
          ) : null}

          {data.nextTarget ? (
            <section
              aria-label="Próxima conquista"
              className="rounded-2xl border border-border/40 p-5"
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Próximo marco
              </p>
              <h2 className="text-lg font-medium mt-1">{data.nextTarget.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {data.nextTarget.description}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Origem: {data.nextTarget.origin}
              </p>
              {data.nextTarget.progressToUnlock != null ? (
                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progresso na jornada de conquistas</span>
                    <span className="tabular-nums">
                      {data.nextTarget.progressToUnlock}%
                    </span>
                  </div>
                  <Progress
                    value={data.nextTarget.progressToUnlock}
                    className="h-1.5"
                  />
                </div>
              ) : null}
            </section>
          ) : null}

          {data.unlocked.length > 0 ? (
            <section aria-label="Conquistas desbloqueadas">
              <h2 className="text-lg font-medium tracking-tight mb-3">
                Desbloqueadas
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {data.unlocked.map((a) => (
                  <li
                    key={a.id}
                    className="rounded-xl border border-border/40 bg-background/50 p-4"
                  >
                    <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {a.tier}
                    </p>
                    <p className="text-sm font-medium mt-1">{a.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {a.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Origem: {a.origin}
                    </p>
                    {a.unlockedAt ? (
                      <p className="text-xs text-muted-foreground mt-1">
                        Data:{" "}
                        {new Date(a.unlockedAt).toLocaleDateString("pt-BR")}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">
                        Status: conquistada
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {data.locked.length > 0 ? (
            <section aria-label="Conquistas futuras">
              <h2 className="text-lg font-medium tracking-tight mb-3">
                A conquistar
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2 opacity-80">
                {data.locked.map((a) => (
                  <li
                    key={a.id}
                    className="rounded-xl border border-border/30 p-4"
                  >
                    <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {a.tier}
                    </p>
                    <p className="text-sm font-medium mt-1">{a.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {a.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Origem: {a.origin}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}
    </MembersLayout>
  );
}
