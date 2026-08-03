import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

function RankList({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ label: string; count: number }>;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem dados ainda.</p>
        ) : (
          <ol className="space-y-2">
            {rows.map((r, i) => (
              <li
                key={`${r.label}-${i}`}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="truncate">
                  <span className="text-muted-foreground mr-2">{i + 1}.</span>
                  {r.label}
                </span>
                <Badge variant="secondary">{r.count}</Badge>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDiscovery() {
  const { data, isLoading } = trpc.discovery.adminInsights.useQuery();

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Discovery Insights
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visões, vendas, favoritos e buscas — motor proprietário (sem IA
            generativa).
          </p>
          {data?.persistence && (
            <Badge variant="outline" className="mt-3">
              Persistência: {data.persistence}
            </Badge>
          )}
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Carregando…</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <RankList
              title="Mais vistos"
              rows={(data?.mostViewed || []).map((r) => ({
                label: r.slug,
                count: r.count,
              }))}
            />
            <RankList
              title="Mais vendidos"
              rows={(data?.mostSold || []).map((r) => ({
                label: r.slug,
                count: r.count,
              }))}
            />
            <RankList
              title="Mais favoritados"
              rows={(data?.mostFavorited || []).map((r) => ({
                label: r.slug,
                count: r.count,
              }))}
            />
            <RankList
              title="Mais pesquisados"
              rows={(data?.mostSearched || []).map((r) => ({
                label: r.query,
                count: r.count,
              }))}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
