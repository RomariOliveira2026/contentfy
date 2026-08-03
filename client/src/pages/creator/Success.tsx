import CreatorLayout from "@/components/CreatorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

export default function CreatorSuccess() {
  const { data, isLoading } = trpc.success.creatorAnalytics.useQuery();

  return (
    <CreatorLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Evolução dos alunos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Competências, abandono e taxa de transformação — Success Engine.
          </p>
          {data?.note && (
            <Badge
              variant="outline"
              className="mt-3 max-w-full whitespace-normal"
            >
              {data.note}
            </Badge>
          )}
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Carregando…</p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Alunos", value: data?.learnerCount ?? 0 },
                { label: "Evolução média", value: data?.averageEvolution ?? 0 },
                {
                  label: "Competências no catálogo",
                  value: data?.competenciesDeveloped ?? 0,
                },
                {
                  label: "Taxa de transformação",
                  value: `${data?.transformationRate ?? 0}%`,
                },
              ].map((k) => (
                <Card key={k.label}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">
                      {k.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-light tabular-nums">{k.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Objetivos mais buscados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {(data?.topGoals || []).map((g) => (
                    <div
                      key={g.goalId}
                      className="flex justify-between text-sm gap-3"
                    >
                      <span>{g.goalName}</span>
                      <span className="text-muted-foreground">{g.seekers}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pontos de abandono</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {(data?.abandonmentPoints || []).map((a) => (
                    <div
                      key={a.slug}
                      className="flex justify-between text-sm gap-3"
                    >
                      <span className="truncate">{a.slug}</span>
                      <span className="text-muted-foreground">
                        {a.dropOffPercent}%
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </CreatorLayout>
  );
}
