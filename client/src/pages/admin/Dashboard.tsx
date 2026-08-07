import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import {
  DEMO_BADGE_LABEL,
  adminDisplayName,
  demoPrimaryKpis,
  demoProducts,
  demoQuickActions,
  demoRecentSales,
  demoRevenueMap,
  demoSecondaryKpis,
  demoTodaySummary,
  demoTopProducts,
  formatBRLFromNumber,
} from "@/lib/admin/demoDashboardData";
import DashboardCommandBar from "@/components/admin/dashboard/DashboardCommandBar";
import KpiCard from "@/components/admin/dashboard/KpiCard";
import RevenueAreaChart from "@/components/admin/dashboard/RevenueAreaChart";
import DailySalesChart from "@/components/admin/dashboard/DailySalesChart";
import LiveActivityFeed from "@/components/admin/dashboard/LiveActivityFeed";
import { Link } from "wouter";
import {
  Star,
  Activity,
  Target,
  Zap,
  BookOpen,
  PackagePlus,
  LayoutTemplate,
  UserPlus,
  Upload,
  Ticket,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const QUICK_ICONS = [
  PackagePlus,
  BookOpen,
  LayoutTemplate,
  UserPlus,
  Upload,
  Ticket,
];

export default function AdminDashboard() {
  const { data: user } = trpc.auth.me.useQuery();
  const [syncSeconds, setSyncSeconds] = useState(27);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSyncSeconds((s) => (s >= 59 ? 12 : s + 3));
    }, 3000);
    return () => window.clearInterval(id);
  }, []);

  const name = adminDisplayName(user?.name);

  return (
    <AdminLayout>
      <div className="cf-admin-dashboard p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <Badge variant="outline" className="cf-admin-demo-badge">
            {DEMO_BADGE_LABEL}
          </Badge>
          <p className="text-[10px] text-muted-foreground/80">
            Métricas ilustrativas para demonstração e captura de portfólio
          </p>
        </div>

        <DashboardCommandBar userName={user?.name} />

        {/* Executive Hero */}
        <section className="cf-admin-hero">
          <div className="min-w-0">
            <p className="cf-caption mb-2">Admin · Visão Geral</p>
            <h1 className="cf-admin-hero-title">
              <span className="lg:block">Bem-vindo de volta,</span>{" "}
              <span className="lg:block">{name}.</span>
            </h1>
            <p className="cf-admin-hero-sub">
              Hoje sua operação registrou{" "}
              <span className="text-foreground/95 font-medium tabular-nums">
                {demoTodaySummary.sales} vendas
              </span>
              ,{" "}
              <span className="text-foreground/95 font-medium tabular-nums">
                {formatBRLFromNumber(demoTodaySummary.revenueCents / 100)}
              </span>{" "}
              em receita,{" "}
              <span className="text-foreground/95 font-medium tabular-nums">
                {demoTodaySummary.newAffiliates} novos afiliados
              </span>{" "}
              e{" "}
              <span className="text-foreground/95 font-medium tabular-nums">
                {demoTodaySummary.newProducts} novos produtos publicados
              </span>
              .
            </p>
          </div>

          <div className="cf-admin-status-panel">
            <div className="cf-admin-status-panel-inner">
              <div className="cf-admin-status-badge">
                <span className="cf-admin-status-dot" aria-hidden>
                  <span className="cf-admin-status-ping" />
                  <span className="cf-admin-status-core" />
                </span>
                Sistema Online
              </div>
              <p className="cf-admin-status-sync tabular-nums">
                Última sincronização: há {syncSeconds} segundos
              </p>
            </div>
          </div>
        </section>

        {/* Primary KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[1.06fr_1fr_1fr_1fr] gap-4">
          {demoPrimaryKpis.map((kpi) => (
            <KpiCard
              key={kpi.id}
              title={kpi.title}
              value={kpi.value}
              prefix={kpi.prefix}
              decimals={kpi.decimals}
              change={kpi.change}
              trend={kpi.trend}
              changeTone={kpi.changeTone}
              sparkline={kpi.sparkline}
              accent={kpi.accent}
              featured={"featured" in kpi && kpi.featured}
            />
          ))}
        </section>

        <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {demoSecondaryKpis.map((kpi) => (
            <KpiCard
              key={kpi.id}
              title={kpi.title}
              valueLabel={
                "valueLabel" in kpi && kpi.valueLabel
                  ? kpi.valueLabel
                  : undefined
              }
              value={"value" in kpi ? kpi.value : undefined}
              change={kpi.change}
              trend={kpi.trend}
              changeTone={kpi.changeTone}
              compact
            />
          ))}
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 xl:grid-cols-5 gap-4 lg:gap-6">
          <Card className="cf-card-premium cf-admin-panel xl:col-span-3 py-0 gap-0">
            <CardHeader className="pb-2 pt-5 px-5">
              <CardTitle className="text-base lg:text-lg font-semibold">
                Receita — últimos 12 meses
              </CardTitle>
              <p className="text-sm text-slate-400 font-normal">
                Evolução mensal da operação
              </p>
            </CardHeader>
            <CardContent className="px-3 pb-5 sm:px-5">
              <RevenueAreaChart />
            </CardContent>
          </Card>

          <Card className="cf-card-premium cf-admin-panel xl:col-span-2 py-0 gap-0">
            <CardHeader className="pb-2 pt-5 px-5">
              <CardTitle className="text-base lg:text-lg font-semibold">
                Vendas por dia
              </CardTitle>
              <p className="text-sm text-slate-400 font-normal">Últimos 30 dias</p>
            </CardHeader>
            <CardContent className="px-3 pb-5 sm:px-5">
              <DailySalesChart />
            </CardContent>
          </Card>
        </section>

        {/* Products + Sales + Live */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-5">
          <Card className="cf-card-premium cf-admin-panel xl:col-span-4 py-0 gap-0">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-base lg:text-lg font-semibold">
                Produtos recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-5 space-y-3">
              {demoProducts.map((product) => (
                <div key={product.id} className="cf-admin-product-row">
                  <div className="cf-admin-product-cover">
                    <img
                      src={product.cover}
                      alt=""
                      loading="lazy"
                      width={56}
                      height={72}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-sm truncate">
                        {product.name}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn(
                          "shrink-0 text-[10px]",
                          product.status === "Publicado"
                            ? "border-emerald-400/30 text-emerald-300"
                            : "border-amber-400/30 text-amber-200"
                        )}
                      >
                        {product.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {product.category} · {product.priceLabel}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span>{product.sales} vendas</span>
                      <span className="inline-flex items-center gap-0.5 text-amber-300">
                        <Star className="h-3 w-3 fill-amber-300" />
                        {product.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="cf-card-premium cf-admin-panel xl:col-span-5 py-0 gap-0">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-base lg:text-lg font-semibold">
                Vendas recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-3 overflow-x-auto">
              <table className="cf-admin-table w-full min-w-[520px]">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Produto</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th>Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {demoRecentSales.map((sale) => (
                    <tr key={sale.id}>
                      <td className="font-medium">{sale.customer}</td>
                      <td className="text-muted-foreground">{sale.product}</td>
                      <td className="font-semibold">{sale.amountLabel}</td>
                      <td>
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold",
                            sale.status === "Pago"
                              ? "bg-emerald-400/15 text-emerald-300"
                              : "bg-amber-400/15 text-amber-200"
                          )}
                        >
                          {sale.status}
                        </span>
                      </td>
                      <td className="text-muted-foreground tabular-nums">
                        {sale.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card className="cf-card-premium cf-admin-panel xl:col-span-3 py-0 gap-0">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-base lg:text-lg font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Atividade em tempo real
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <LiveActivityFeed />
            </CardContent>
          </Card>
        </section>

        {/* Ranking + Revenue map + Quick actions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
          <Card className="cf-card-premium cf-admin-panel py-0 gap-0">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-base lg:text-lg font-semibold">
                Produtos mais vendidos
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-3.5">
              {demoTopProducts.map((item) => (
                <div key={item.rank}>
                  <div className="flex items-center justify-between gap-2 text-sm mb-1.5">
                    <span className="font-medium truncate">
                      <span className="text-muted-foreground mr-2 tabular-nums">
                        {item.rank}
                      </span>
                      {item.name}
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                      {item.sales}
                    </span>
                  </div>
                  <div className="cf-admin-bar-track">
                    <div
                      className="cf-admin-bar-fill"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="cf-card-premium cf-admin-panel py-0 gap-0">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-base lg:text-lg font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Mapa de receita
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Receita hoje", value: demoRevenueMap.todayLabel },
                  { label: "Receita semana", value: demoRevenueMap.weekLabel },
                  { label: "Receita mês", value: demoRevenueMap.monthLabel },
                  { label: "Meta mensal", value: demoRevenueMap.goalLabel },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-border/70 bg-card/40 px-3 py-2.5"
                  >
                    <p className="text-[11px] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-sm font-bold mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Progresso da meta</span>
                  <span className="font-semibold text-primary">
                    {demoRevenueMap.goalProgress}%
                  </span>
                </div>
                <Progress value={demoRevenueMap.goalProgress} className="h-2.5" />
              </div>
            </CardContent>
          </Card>

          <Card className="cf-card-premium cf-admin-panel py-0 gap-0">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-base lg:text-lg font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-5 grid grid-cols-2 gap-2.5">
              {demoQuickActions.map((action, i) => {
                const Icon = QUICK_ICONS[i] || PackagePlus;
                return (
                  <Link key={action.id} href={action.href}>
                    <Button
                      variant="outline"
                      className="cf-admin-quick-action w-full h-auto py-3 px-2.5 flex-col gap-1.5"
                    >
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="text-[11px] font-medium leading-tight text-center">
                        {action.label}
                      </span>
                    </Button>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </section>
      </div>
    </AdminLayout>
  );
}
