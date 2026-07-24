import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { TrendingUp, Users, DollarSign, Target, Loader2 } from "lucide-react";

export default function MRRDashboard() {
  const { data: mrrStats, isLoading: loadingStats } = trpc.affiliates.getMRRStats.useQuery();
  const { data: subscribers, isLoading: loadingSubscribers } = trpc.affiliates.getActiveSubscribers.useQuery();
  const { data: mrrHistory, isLoading: loadingHistory } = trpc.affiliates.getMRRHistory.useQuery();

  if (loadingStats || loadingSubscribers || loadingHistory) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = mrrStats || { mrr: 0, arr: 0, activeSubscribers: 0, conversionRate: "0.00", nextPaymentDate: "" };
  const chartData = mrrHistory || [];

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* MRR Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {(stats.mrr / 100).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Receita Mensal Recorrente
            </p>
          </CardContent>
        </Card>

        {/* ARR Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ARR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {(stats.arr / 100).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Projeção Anual
            </p>
          </CardContent>
        </Card>

        {/* Active Subscribers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinantes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscribers}</div>
            <p className="text-xs text-muted-foreground">
              Clientes recorrentes
            </p>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Cliques → Assinaturas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* MRR Growth Chart - Simplified version without recharts */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução do MRR</CardTitle>
          <CardDescription>
            Crescimento da receita mensal recorrente nos últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="space-y-2">
              {chartData.map((data: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 border-b">
                  <span className="text-sm font-medium">{data.month}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {data.newSubscribers} novos
                    </span>
                    <span className="text-sm font-bold">
                      R$ {(data.mrr / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              Nenhum dado disponível ainda
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Subscribers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assinantes Ativos</CardTitle>
          <CardDescription>
            Lista de clientes que geram comissões recorrentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscribers && subscribers.length > 0 ? (
            <div className="space-y-3">
              {subscribers.map((sub: any) => (
                <div 
                  key={sub.id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{sub.customerName || "Cliente"}</p>
                    <p className="text-sm text-muted-foreground">{sub.customerEmail}</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-medium">{sub.planName}</p>
                    <p className="text-sm text-muted-foreground">
                      R$ {(sub.commissionAmount / 100).toFixed(2)}/
                      {sub.recurringInterval === 'year' ? 'ano' : 'mês'}
                    </p>
                  </div>
                  <Badge variant={sub.cancelAtPeriodEnd ? "destructive" : "default"}>
                    {sub.cancelAtPeriodEnd ? "Cancelando" : "Ativo"}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Você ainda não possui assinantes ativos.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Comece a promover os planos do LibroFy para gerar comissões recorrentes!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Payment Info */}
      {stats.activeSubscribers > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Próximo Pagamento</p>
                <p className="text-2xl font-bold text-primary">
                  R$ {(stats.mrr / 100).toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Previsto para</p>
                <p className="font-medium">
                  {new Date(stats.nextPaymentDate).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
