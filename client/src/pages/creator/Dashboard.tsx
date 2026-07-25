import { Link } from "wouter";
import CreatorLayout from "@/components/CreatorLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { DollarSign, FileEdit, Package, Users, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

function formatBRL(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export default function CreatorDashboard() {
  const { data, isLoading, isError, error, refetch } =
    trpc.creator.dashboard.useQuery();

  return (
    <CreatorLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-orange-400/80 font-semibold mb-2">
              Criador
            </p>
            <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe produtos, alunos e receita da sua operação.
            </p>
          </div>
          <Link href="/creator/products/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo produto
            </Button>
          </Link>
        </div>

        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-muted/30 animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <Card className="border-destructive/40">
            <CardContent className="py-8 text-center space-y-3">
              <p className="text-destructive">{error.message}</p>
              <Button variant="outline" onClick={() => refetch()}>
                Tentar novamente
              </Button>
            </CardContent>
          </Card>
        )}

        {data && (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <Stat
                title="Total de produtos"
                value={String(data.totalProducts)}
                icon={Package}
              />
              <Stat
                title="Publicados"
                value={String(data.publishedProducts)}
                icon={Package}
                accent="text-emerald-400"
              />
              <Stat
                title="Rascunhos"
                value={String(data.draftProducts)}
                icon={FileEdit}
                accent="text-amber-400"
              />
              <Stat
                title="Total de alunos"
                value={String(data.totalStudents)}
                icon={Users}
              />
              <Stat
                title="Receita bruta"
                value={formatBRL(data.grossRevenue)}
                icon={DollarSign}
                accent="text-orange-400"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Fonte: {data.meta.note}
            </p>

            <Card className="border-white/[0.08] bg-[#0f1522]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Vendas recentes</CardTitle>
                <Link href="/creator/sales">
                  <Button variant="ghost" size="sm">
                    Ver todas
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {data.recentSales.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground text-sm">
                    Nenhuma venda concluída ainda.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.recentSales.map((sale) => (
                      <div
                        key={sale.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] px-3 py-3"
                      >
                        <div className="min-w-0">
                          <p className="font-medium truncate">
                            {sale.customerName || sale.customerEmail || `Pedido #${sale.id}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(sale.createdAt), "dd MMM yyyy · HH:mm", {
                              locale: ptBR,
                            })}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-semibold">{formatBRL(sale.amount)}</p>
                          <Badge variant="secondary" className="mt-1">
                            {sale.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </CreatorLayout>
  );
}

function Stat({
  title,
  value,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string;
  icon: typeof Package;
  accent?: string;
}) {
  return (
    <Card className="border-white/[0.08] bg-[#0f1522]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${accent || "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${accent || ""}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
