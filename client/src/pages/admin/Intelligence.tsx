import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

function money(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function AdminIntelligence() {
  const { data, isLoading, error } = trpc.intelligence.adminDashboard.useQuery(
    undefined,
    { staleTime: 60_000 }
  );

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
            ContentFy Intelligence
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Marketplace Health
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Motor estatístico da plataforma — comportamento, conversão, retenção
            e alertas. Sem IA generativa.
          </p>
          {data?.note ? (
            <Badge variant="outline" className="mt-3 whitespace-normal">
              {data.note}
            </Badge>
          ) : null}
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Carregando inteligência…</p>
        ) : error || !data ? (
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar o painel.
          </p>
        ) : (
          <>
            <section
              aria-label="Saúde do marketplace"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {[
                {
                  label: "Receita",
                  value: money(data.health.revenueCents),
                },
                {
                  label: "Conversão",
                  value: `${data.health.conversionProxy}%`,
                },
                {
                  label: "Retenção",
                  value: `${data.health.retentionProxy}%`,
                },
                {
                  label: "Conclusão",
                  value: `${data.health.completionProxy}%`,
                },
                {
                  label: "Reembolso",
                  value: `${data.health.refundRate}%`,
                },
                {
                  label: "Pedidos",
                  value: data.health.ordersCompleted,
                },
                {
                  label: "Views",
                  value: data.health.totalViews,
                },
                {
                  label: "Produtos",
                  value: data.health.activeProducts,
                },
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

            {data.alerts.length > 0 ? (
              <section aria-label="Alertas" className="space-y-3">
                <h2 className="text-lg font-medium">Alertas</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {data.alerts.slice(0, 12).map((a) => (
                    <div
                      key={a.id}
                      className="rounded-xl border border-border/40 p-4"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{a.severity}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {a.kind}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {a.body}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-2">
              <RankCard
                title="TOP Produtos"
                rows={data.topProducts.map((p) => ({
                  key: p.slug,
                  label: p.name,
                  value: `Score ${p.productScore.score} · ${p.sales} vendas`,
                }))}
              />
              <RankCard
                title="TOP Autores"
                rows={data.topCreators.map((c) => ({
                  key: c.authorKey,
                  label: c.authorLabel,
                  value: `Score ${c.creatorScore.score} · ${c.sales} vendas`,
                }))}
              />
              <RankCard
                title="TOP Categorias"
                rows={data.topCategories.map((c) => ({
                  key: c.category,
                  label: c.category,
                  value: `${c.trend} · Score ${c.categoryScore.score}`,
                }))}
              />
              <RankCard
                title="Emergentes"
                rows={data.emerging.map((p) => ({
                  key: p.slug,
                  label: p.name,
                  value:
                    p.salesDeltaPercent != null
                      ? `+${p.salesDeltaPercent}%`
                      : "—",
                }))}
              />
              <RankCard
                title="Em queda"
                rows={data.declining.map((p) => ({
                  key: p.slug,
                  label: p.name,
                  value:
                    p.salesDeltaPercent != null
                      ? `${p.salesDeltaPercent}%`
                      : "—",
                }))}
              />
              <RankCard
                title="Alto abandono"
                rows={data.highAbandonment.map((p) => ({
                  key: p.slug,
                  label: p.name,
                  value: `${p.abandonmentRate}%`,
                }))}
              />
              <RankCard
                title="Alto reembolso"
                rows={data.highRefund.map((p) => ({
                  key: p.slug,
                  label: p.name,
                  value: `${p.refundRate}%`,
                }))}
              />
              <RankCard
                title="Estáveis"
                rows={data.stable.map((p) => ({
                  key: p.slug,
                  label: p.name,
                  value: `Score ${p.productScore.score}`,
                }))}
              />
            </div>

            {data.insights.length > 0 ? (
              <section aria-label="Insights" className="space-y-3">
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
          </>
        )}
      </div>
    </AdminLayout>
  );
}

function RankCard({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ key: string; label: string; value: string }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem dados neste recorte.</p>
        ) : (
          rows.map((r) => (
            <div
              key={r.key}
              className="flex justify-between gap-3 text-sm"
            >
              <span className="truncate">{r.label}</span>
              <span className="text-muted-foreground tabular-nums shrink-0">
                {r.value}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
