import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

export default function AdminOrchestrator() {
  const utils = trpc.useUtils();
  const { data, isLoading, error } = trpc.orchestrator.dashboard.useQuery(
    undefined,
    { refetchInterval: 8_000 }
  );
  const drain = trpc.orchestrator.drain.useMutation({
    onSuccess: () => void utils.orchestrator.dashboard.invalidate(),
  });
  const emit = trpc.orchestrator.emit.useMutation({
    onSuccess: () => void utils.orchestrator.dashboard.invalidate(),
  });

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
              ContentFy Orchestrator
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Sistema nervoso central
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Coordena eventos entre motores — sem regras de negócio embutidas.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={drain.isPending}
              onClick={() => drain.mutate()}
            >
              Drain fila
            </Button>
            <Button
              size="sm"
              disabled={emit.isPending}
              onClick={() =>
                emit.mutate({
                  name: "SUCCESS_SCORE_CHANGED",
                  payload: { meta: { retentionDelta: 12 } },
                  sync: true,
                })
              }
            >
              Emit teste
            </Button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Carregando…</p>
        ) : error || !data ? (
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar o Orchestrator.
          </p>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { label: "Fila", value: data.queueDepth },
                { label: "Processados", value: data.processedTotal },
                { label: "Falhas", value: data.failedTotal },
                { label: "Retries", value: data.retryTotal },
                { label: "Latência média", value: `${data.avgLatencyMs} ms` },
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
                  <CardTitle className="text-base">Eventos recentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-80 overflow-auto">
                  {data.recentEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum evento ainda.</p>
                  ) : (
                    data.recentEvents.map((e) => (
                      <div
                        key={e.id}
                        className="flex justify-between gap-3 text-sm border-b border-border/30 pb-2"
                      >
                        <div className="min-w-0">
                          <p className="font-medium truncate">{e.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {e.source} · p{e.priority}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                          {new Date(e.createdAt).toLocaleTimeString("pt-BR")}
                        </span>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Workflows processados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-80 overflow-auto">
                  {data.recentRuns.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma execução.</p>
                  ) : (
                    data.recentRuns.map((r) => (
                      <div
                        key={r.id}
                        className="rounded-lg border border-border/30 p-3 text-sm"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{r.status}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {r.workflowId}
                          </span>
                        </div>
                        <p className="font-medium">{r.eventName}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {r.steps.length} ações · {r.totalLatencyMs} ms ·{" "}
                          {r.motors.join(", ") || "—"}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Workflows configurados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {data.workflows.map((w) => (
                    <div
                      key={w.id}
                      className="flex justify-between text-sm gap-3"
                    >
                      <span className="truncate">
                        {w.id}{" "}
                        <span className="text-muted-foreground">({w.event})</span>
                      </span>
                      <span className="text-muted-foreground tabular-nums">
                        {w.enabled ? `${w.steps} steps` : "off"}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Reações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {data.reactions.map((r) => (
                    <div
                      key={r.id}
                      className="flex justify-between text-sm gap-3"
                    >
                      <span className="truncate">{r.id}</span>
                      <span className="text-muted-foreground">
                        {r.enabled ? r.onEvent : "off"}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Registry de eventos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-64 overflow-auto">
                {data.registry.map((d) => (
                  <div
                    key={d.name}
                    className="flex justify-between gap-3 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">{d.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {d.description} · {d.consumers.join(", ")}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      p{d.defaultPriority}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
