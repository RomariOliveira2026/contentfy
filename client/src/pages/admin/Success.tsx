import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

export default function AdminSuccess() {
  const { data, isLoading } = trpc.success.adminAnalytics.useQuery();

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Success Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Evolução média, hábitos e abandono — ContentFy Success Engine.
          </p>
          {data?.note && (
            <Badge variant="outline" className="mt-3 max-w-full whitespace-normal">
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
                { label: "Score médio", value: data?.averageScore ?? 0 },
                { label: "Evolução média", value: data?.averageEvolution ?? 0 },
                { label: "Hábitos", value: data?.habitReachRate ?? 0 },
                { label: "Abandono", value: data?.abandonmentRate ?? 0 },
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
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Por curso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {(data?.byCourse || []).slice(0, 12).map((c) => (
                    <div
                      key={c.slug}
                      className="flex justify-between text-sm gap-3"
                    >
                      <span className="truncate">{c.slug}</span>
                      <span className="text-muted-foreground tabular-nums">
                        {c.avgProgress}% · {c.learners}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Por categoria</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {(data?.byCategory || []).map((c) => (
                    <div
                      key={c.category}
                      className="flex justify-between text-sm gap-3"
                    >
                      <span className="truncate">{c.category}</span>
                      <span className="text-muted-foreground tabular-nums">
                        {c.avgScore}% · {c.learners}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
