import CreatorLayout from "@/components/CreatorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

function money(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function CreatorIntelligence() {
  const { data, isLoading, error } =
    trpc.intelligence.creatorDashboard.useQuery(undefined, {
      staleTime: 60_000,
    });

  return (
    <CreatorLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Creator Intelligence
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Inteligência do produtor
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Conversão, conclusão, retenção e sugestões baseadas em dados reais.
          </p>
          {data?.note ? (
            <Badge variant="outline" className="mt-3 whitespace-normal max-w-3xl">
              {data.note}
            </Badge>
          ) : null}
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Carregando…</p>
        ) : error || !data ? (
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar sua inteligência.
          </p>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Visualizações", value: data.summary.views },
                { label: "Compras", value: data.summary.sales },
                {
                  label: "Conversão",
                  value: `${data.summary.conversionRate}%`,
                },
                {
                  label: "Conclusão",
                  value: `${data.summary.completionRate}%`,
                },
                {
                  label: "Retenção",
                  value: `${data.summary.retentionProxy}%`,
                },
                {
                  label: "Receita",
                  value: money(data.summary.revenueCents),
                },
                {
                  label: "Reembolso",
                  value: `${data.summary.refundRate}%`,
                },
                { label: "Favoritos", value: data.summary.favorites },
              ].map((k) => (
                <Card key={k.label}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {k.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-light tabular-nums">{k.value}</p>
                  </CardContent>
                </Card>
              ))}
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Produtos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {data.products.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhum produto no escopo atual.
                    </p>
                  ) : (
                    data.products.map((p) => (
                      <div
                        key={p.slug}
                        className="flex justify-between gap-3 text-sm"
                      >
                        <span className="truncate">{p.name}</span>
                        <span className="text-muted-foreground tabular-nums shrink-0">
                          {p.sales} vendas · {p.completionRate}% concl.
                        </span>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Ranking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {data.ranking.map((p, i) => (
                    <div
                      key={p.slug}
                      className="flex justify-between gap-3 text-sm"
                    >
                      <span className="truncate">
                        {i + 1}. {p.name}
                      </span>
                      <span className="text-muted-foreground tabular-nums">
                        Score {p.productScore.score}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {data.suggestions.length > 0 ? (
              <section className="space-y-3">
                <h2 className="text-lg font-medium">Sugestões</h2>
                <ul className="grid gap-3 md:grid-cols-2">
                  {data.suggestions.map((s) => (
                    <li
                      key={s.id}
                      className="rounded-xl border border-border/40 p-4"
                    >
                      <p className="text-sm font-medium">{s.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {s.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {data.insights.length > 0 ? (
              <section className="space-y-3">
                <h2 className="text-lg font-medium">Insights</h2>
                <ul className="grid gap-3 md:grid-cols-2">
                  {data.insights.map((i) => (
                    <li
                      key={i.id}
                      className="rounded-xl border border-border/40 p-4"
                    >
                      <p className="text-sm font-medium">{i.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {i.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {data.alerts.length > 0 ? (
              <section className="space-y-3">
                <h2 className="text-lg font-medium">Alertas</h2>
                <ul className="space-y-2">
                  {data.alerts.slice(0, 8).map((a) => (
                    <li
                      key={a.id}
                      className="rounded-lg border border-border/30 px-3 py-2 text-sm"
                    >
                      <span className="font-medium">{a.title}</span>
                      <span className="text-muted-foreground"> — {a.body}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        )}
      </div>
    </CreatorLayout>
  );
}
