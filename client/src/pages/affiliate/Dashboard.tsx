import AffiliateLayout from "@/components/AffiliateLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { DollarSign, TrendingUp, Users, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import MRRDashboard from "@/components/affiliate/MRRDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AffiliateDashboard() {
  const { data: affiliateData, isLoading: loadingAffiliate } =
    trpc.affiliates.getMyAffiliateData.useQuery();
  const { data: stats, isLoading: loadingStats } =
    trpc.affiliates.getMyStats.useQuery();

  if (loadingAffiliate || loadingStats) {
    return (
      <AffiliateLayout>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </AffiliateLayout>
    );
  }

  if (!affiliateData) {
    return (
      <AffiliateLayout>
        <Card>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Você ainda não é um afiliado
            </h2>
            <p className="text-muted-foreground">
              Cadastre-se como afiliado para começar a ganhar comissões!
            </p>
          </CardContent>
        </Card>
      </AffiliateLayout>
    );
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  };

  const statsCards = [
    {
      title: "Ganhos Totais",
      value: formatCurrency(stats?.totalEarnings || 0),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Ganhos Pendentes",
      value: formatCurrency(stats?.pendingEarnings || 0),
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Total de Vendas",
      value: stats?.totalSales || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Taxa de Comissão",
      value: `${stats?.commissionRate || 0}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <AffiliateLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard do Afiliado</h1>
          <p className="text-muted-foreground">
            Acompanhe suas vendas e comissões
          </p>
        </div>

        {/* Status do Afiliado */}
        {!affiliateData.isActive && (
          <Card className="border-yellow-500 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-900">
                    Cadastro Pendente
                  </h3>
                  <p className="text-sm text-yellow-700">
                    Seu cadastro está aguardando aprovação do administrador.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs: Vendas vs Assinaturas */}
        <Tabs defaultValue="subscriptions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="subscriptions">Assinaturas Recorrentes</TabsTrigger>
            <TabsTrigger value="sales">Vendas Únicas</TabsTrigger>
          </TabsList>

          {/* MRR Dashboard */}
          <TabsContent value="subscriptions" className="space-y-6">
            <MRRDashboard />
          </TabsContent>

          {/* One-time Sales Dashboard */}
          <TabsContent value="sales" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Informações do Afiliado */}
        <Card>
          <CardHeader>
            <CardTitle>Suas Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Código de Afiliado
              </label>
              <p className="text-lg font-mono font-semibold">
                {affiliateData.affiliateCode}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Taxa de Comissão
              </label>
              <p className="text-lg font-semibold">
                {affiliateData.commissionRate}%
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <p className="text-lg font-semibold">
                {affiliateData.isActive ? (
                  <span className="text-green-600">Ativo</span>
                ) : (
                  <span className="text-yellow-600">Pendente</span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AffiliateLayout>
  );
}
