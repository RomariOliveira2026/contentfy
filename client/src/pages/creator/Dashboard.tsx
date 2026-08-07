import { Link } from "wouter";
import CreatorLayout from "@/components/CreatorLayout";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Cloud,
  DollarSign,
  FileEdit,
  Package,
  Percent,
  Plus,
  Server,
  ShieldCheck,
  Star,
  Users,
  Wallet,
} from "lucide-react";

/** Apresentação de portfólio — alinhada ao Design Freeze ContentFy. */
const PORTFOLIO = {
  products: 18,
  published: 12,
  drafts: 6,
  students: 1482,
  revenueLabel: "R$ 86.470",
  revenueDelta: "+18%",
  conversion: "5,8%",
  avgTicket: "R$ 187",
  affiliates: 46,
  rating: "4,9",
  uptime: "99,98%",
  revenueByMonth: [
    { month: "Set", revenue: 4200 },
    { month: "Out", revenue: 5100 },
    { month: "Nov", revenue: 5800 },
    { month: "Dez", revenue: 7200 },
    { month: "Jan", revenue: 6900 },
    { month: "Fev", revenue: 7600 },
    { month: "Mar", revenue: 8100 },
    { month: "Abr", revenue: 7800 },
    { month: "Mai", revenue: 8600 },
    { month: "Jun", revenue: 9200 },
    { month: "Jul", revenue: 9800 },
    { month: "Ago", revenue: 10470 },
  ],
  productsTable: [
    {
      name: "Desacelere",
      status: "Publicado" as const,
      students: "842",
      revenue: "R$ 38.900",
    },
    {
      name: "Dominando o TDAH",
      status: "Publicado" as const,
      students: "420",
      revenue: "R$ 24.500",
    },
    {
      name: "Manual do Representante",
      status: "Rascunho" as const,
      students: "—",
      revenue: "—",
    },
    {
      name: "Arquitetura da Prosperidade",
      status: "Em revisão" as const,
      students: "—",
      revenue: "—",
    },
  ],
  activity: [
    {
      when: "Hoje",
      title: "Venda concluída",
      detail: "Desacelere",
      meta: "R$ 97",
    },
    {
      when: "Ontem",
      title: "Novo aluno",
      detail: "Dominando o TDAH",
      meta: "",
    },
    {
      when: "2 dias atrás",
      title: "Produto atualizado",
      detail: "Manual do Representante",
      meta: "",
    },
  ],
  performance: [
    { label: "Uptime", value: "99,98%", icon: ShieldCheck },
    { label: "Checkout", value: "Online", icon: Wallet },
    { label: "API", value: "Normal", icon: Server },
    { label: "Storage", value: "Ativo", icon: Cloud },
  ],
};

const chartConfig: ChartConfig = {
  revenue: {
    label: "Receita",
    color: "#f97316",
  },
};

/** Personalização: evita saudação genérica de aluno na área do criador. */
function creatorDisplayName(name?: string | null) {
  const first = name?.trim().split(/\s+/)[0];
  if (!first || /^aluno/i.test(first)) return "Romário";
  return first;
}

function statusTone(status: string) {
  if (status === "Publicado")
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  if (status === "Rascunho")
    return "border-amber-400/30 bg-amber-400/10 text-amber-200";
  return "border-sky-400/30 bg-sky-400/10 text-sky-200";
}

const PANEL =
  "rounded-2xl border border-white/[0.08] bg-[#0f1522]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]";

export default function CreatorDashboard() {
  const { data: user } = trpc.auth.me.useQuery();
  const name = creatorDisplayName(user?.name);
  const lastMonthIndex = PORTFOLIO.revenueByMonth.length - 1;

  return (
    <CreatorLayout>
      <div className="mx-auto max-w-6xl">
        {/* Hero — presença +8–12% via padding / ritmo interno */}
        <section
          aria-label="Área exclusiva do criador"
          className={cn(
            "relative overflow-hidden rounded-[1.35rem]",
            "border border-white/[0.09]",
            "bg-gradient-to-br from-white/[0.05] via-[#0f1522]/85 to-transparent",
            "backdrop-blur-xl",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_56px_rgba(0,0,0,0.28)]",
            "px-5 py-7 sm:px-7 sm:py-8 lg:px-8 lg:py-9",
            "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-500"
          )}
        >
          <div
            className="pointer-events-none absolute -top-24 right-10 h-56 w-56 rounded-full bg-[#f97316]/[0.11] blur-[90px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 left-16 h-48 w-48 rounded-full bg-[#3b82f6]/[0.08] blur-[80px]"
            aria-hidden
          />

          <div className="relative flex flex-col lg:flex-row lg:items-stretch gap-7 lg:gap-8">
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-orange-400/80 font-semibold">
                Área do Criador · ContentFy
              </p>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-2.5 text-balance">
                Bem-vindo de volta, {name}.
              </h1>
              <p className="text-sm text-muted-foreground mt-3 max-w-xl leading-relaxed">
                Sua operação está ativa. Acompanhe produtos, vendas, alunos e
                desempenho em tempo real.
              </p>
              <div className="mt-5">
                <Link href="/creator/products/new" className="inline-flex w-full sm:w-auto">
                  <Button
                    className={cn(
                      "gap-2.5 h-[52px] px-6 w-full sm:w-auto",
                      "rounded-xl text-sm font-semibold",
                      "bg-gradient-owl text-white border-0",
                      "shadow-[0_8px_22px_rgba(249,115,22,0.24)]",
                      "transition-[transform,box-shadow] duration-200 ease-out",
                      "motion-safe:hover:-translate-y-px motion-safe:hover:scale-[1.015]",
                      "hover:shadow-[0_12px_28px_rgba(249,115,22,0.32)]",
                      "focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1522]"
                    )}
                  >
                    <Plus className="h-4 w-4 shrink-0" aria-hidden />
                    Novo produto
                  </Button>
                </Link>
              </div>
            </div>

            {/* Painel operacional — estrutura preservada */}
            <aside
              className={cn(
                "shrink-0 w-full lg:w-[18.5rem]",
                "rounded-2xl border border-white/[0.09] bg-background/45 backdrop-blur-md",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]",
                "px-5 py-5 sm:px-[1.35rem] sm:py-[1.35rem]",
                "flex flex-col gap-4"
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className="mt-1 relative flex h-2.5 w-2.5 shrink-0"
                  aria-hidden
                >
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/35 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.45)]" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/90">
                    Sistema
                  </p>
                  <p className="text-sm font-semibold text-emerald-200 mt-1 leading-none">
                    Operacional
                  </p>
                </div>
              </div>

              <div className="h-px bg-white/[0.07]" role="separator" />

              <dl className="space-y-3.5 text-xs">
                <StatusMetric label="Ambiente" value="Produção" />
                <StatusMetric
                  label="Última sincronização"
                  value="Há 2 minutos"
                />
                <StatusMetric
                  label="Uptime"
                  value={PORTFOLIO.uptime}
                  emphasize
                />
              </dl>
            </aside>
          </div>
        </section>

        {/* +12px de respiro Hero → KPIs (40px) */}
        <div className="mt-10 space-y-7 lg:space-y-8">
          {/* KPIs — grid com Receita ~15% mais larga em xl */}
          <section
            aria-label="Indicadores"
            className="grid gap-3 sm:gap-3.5 grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_1.14fr]"
          >
            <KpiCard
              title="Produtos"
              value={String(PORTFOLIO.products)}
              icon={Package}
            />
            <KpiCard
              title="Publicados"
              value={String(PORTFOLIO.published)}
              icon={CheckCircle2}
              accent="emerald"
            />
            <KpiCard
              title="Rascunhos"
              value={String(PORTFOLIO.drafts)}
              icon={FileEdit}
              accent="amber"
            />
            <KpiCard
              title="Alunos"
              value={PORTFOLIO.students.toLocaleString("pt-BR")}
              icon={Users}
            />
            <KpiCard
              title="Receita"
              value={PORTFOLIO.revenueLabel}
              icon={DollarSign}
              accent="orange"
              featured
              delta={PORTFOLIO.revenueDelta}
            />
          </section>

          {/* Gráfico — +40px área útil */}
          <section
            className={cn(
              PANEL,
              "p-5 sm:p-6",
              "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-500"
            )}
          >
            <div className="flex items-end justify-between gap-3 mb-4 sm:mb-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Performance
                </p>
                <h2 className="text-lg font-medium tracking-tight mt-0.5">
                  Receita dos últimos 12 meses
                </h2>
              </div>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Acumulado · {PORTFOLIO.revenueLabel}
              </span>
            </div>
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[280px] sm:h-[320px] w-full min-w-0"
            >
              <AreaChart
                data={PORTFOLIO.revenueByMonth}
                margin={{ top: 14, right: 10, left: 0, bottom: 2 }}
              >
                <defs>
                  <linearGradient
                    id="creatorRevenueFillV3"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.28} />
                    <stop offset="42%" stopColor="#f97316" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 8"
                  stroke="rgba(255,255,255,0.04)"
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={42}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) =>
                    Number(v) >= 1000
                      ? `${Math.round(Number(v) / 1000)}k`
                      : String(v)
                  }
                />
                <ChartTooltip
                  cursor={{
                    stroke: "rgba(249,115,22,0.28)",
                    strokeWidth: 1,
                  }}
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      formatter={(value) =>
                        new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          maximumFractionDigits: 0,
                        }).format(Number(value))
                      }
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f97316"
                  strokeWidth={2.25}
                  fill="url(#creatorRevenueFillV3)"
                  isAnimationActive
                  animationDuration={650}
                  dot={(props) => {
                    const { cx, cy, index } = props;
                    if (
                      index !== lastMonthIndex ||
                      cx == null ||
                      cy == null
                    ) {
                      return <g key={`dot-${index}`} />;
                    }
                    return (
                      <g key={`dot-current-${index}`}>
                        {/* Halo sutil — sem neon */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={9}
                          fill="rgba(249,115,22,0.1)"
                        />
                        <circle
                          cx={cx}
                          cy={cy}
                          r={5.5}
                          fill="rgba(249,115,22,0.18)"
                        />
                        <circle
                          cx={cx}
                          cy={cy}
                          r={3.25}
                          fill="#f97316"
                          stroke="#fff7ed"
                          strokeWidth={1.25}
                        />
                      </g>
                    );
                  }}
                  activeDot={{
                    r: 4.5,
                    fill: "#f97316",
                    stroke: "#fff7ed",
                    strokeWidth: 1.25,
                  }}
                />
              </AreaChart>
            </ChartContainer>
          </section>

          {/* Widgets inferiores — ritmo unificado */}
          <section
            aria-label="Métricas rápidas"
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5"
          >
            <QuickStat
              title="Conversão"
              value={PORTFOLIO.conversion}
              icon={Percent}
            />
            <QuickStat
              title="Ticket médio"
              value={PORTFOLIO.avgTicket}
              icon={Wallet}
            />
            <QuickStat
              title="Afiliados ativos"
              value={String(PORTFOLIO.affiliates)}
              icon={Users}
            />
            <QuickStat
              title="Avaliação média"
              value={`${PORTFOLIO.rating}★`}
              icon={Star}
            />
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
            <section className={cn(PANEL, "xl:col-span-3 overflow-hidden")}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Catálogo
                  </p>
                  <h2 className="text-lg font-medium tracking-tight mt-0.5">
                    Produtos recentes
                  </h2>
                </div>
                <Link href="/creator/products">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    Ver todos
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-white/[0.05]">
                      <th className="px-5 py-3 font-medium">Produto</th>
                      <th className="px-3 py-3 font-medium">Status</th>
                      <th className="px-3 py-3 font-medium text-right">Alunos</th>
                      <th className="px-5 py-3 font-medium text-right">Receita</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PORTFOLIO.productsTable.map((row) => (
                      <tr
                        key={row.name}
                        className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.025] transition-colors duration-200"
                      >
                        <td className="px-5 py-3.5 font-medium">{row.name}</td>
                        <td className="px-3 py-3.5">
                          <span
                            className={cn(
                              "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                              statusTone(row.status)
                            )}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 text-right tabular-nums text-muted-foreground">
                          {row.students}
                        </td>
                        <td className="px-5 py-3.5 text-right tabular-nums font-medium">
                          {row.revenue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="xl:col-span-2 space-y-5">
              <section className={cn(PANEL, "px-5 py-5")}>
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Timeline
                </p>
                <h2 className="text-lg font-medium tracking-tight mt-0.5 mb-4">
                  Atividade recente
                </h2>
                <ol className="space-y-4 border-l border-white/[0.08] pl-4 ml-1">
                  {PORTFOLIO.activity.map((item) => (
                    <li key={`${item.when}-${item.title}`} className="relative">
                      <span
                        className="absolute -left-[1.3rem] top-1.5 h-2 w-2 rounded-full bg-gradient-owl shadow-[0_0_10px_rgba(249,115,22,0.35)]"
                        aria-hidden
                      />
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {item.when}
                      </p>
                      <p className="text-sm font-medium mt-0.5">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.detail}
                        {item.meta ? (
                          <span className="text-foreground/80">
                            {" "}
                            · {item.meta}
                          </span>
                        ) : null}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>

              <section
                className={cn(
                  "rounded-2xl border border-white/[0.08]",
                  "bg-gradient-to-br from-primary/[0.06] via-[#0f1522] to-transparent",
                  "px-5 py-5",
                  "shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                )}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-4 w-4 text-primary" />
                  <h2 className="text-lg font-medium tracking-tight">
                    Performance
                  </h2>
                </div>
                <ul className="space-y-2.5">
                  {PORTFOLIO.performance.map((row) => {
                    const Icon = row.icon;
                    return (
                      <li
                        key={row.label}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <span className="inline-flex items-center gap-2 text-muted-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          <Icon
                            className="h-3.5 w-3.5 opacity-60"
                            aria-hidden
                          />
                          {row.label}
                        </span>
                        <span className="font-medium tabular-nums">
                          {row.value}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </CreatorLayout>
  );
}

function StatusMetric({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 min-h-[1.25rem]">
      <dt className="text-muted-foreground/85">{label}</dt>
      <dd
        className={cn(
          "font-medium text-right text-foreground/95",
          emphasize && "text-emerald-200 tabular-nums"
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function KpiCard({
  title,
  value,
  icon: Icon,
  accent,
  featured,
  delta,
}: {
  title: string;
  value: string;
  icon: typeof Package;
  accent?: "orange" | "emerald" | "amber";
  featured?: boolean;
  delta?: string;
}) {
  const iconColor =
    accent === "orange"
      ? "text-orange-400"
      : accent === "emerald"
        ? "text-emerald-400"
        : accent === "amber"
          ? "text-amber-400"
          : "text-muted-foreground";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border h-[7.5rem]",
        "transition-[transform,box-shadow,border-color] duration-200 ease-out",
        "motion-safe:hover:-translate-y-0.5",
        featured
          ? "col-span-2 xl:col-span-1 border-orange-400/35 bg-gradient-to-br from-orange-500/[0.14] via-amber-500/[0.04] to-[#0f1522] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] hover:border-orange-400/45 hover:shadow-[0_14px_32px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.08)]"
          : "border-white/[0.08] bg-[#0f1522]/95 hover:border-white/[0.14] hover:shadow-[0_14px_32px_rgba(0,0,0,0.2)]"
      )}
    >
      <div className="relative h-full px-4 py-4 flex flex-col">
        <div className="flex items-center justify-between gap-2 h-4">
          <p className="text-xs font-medium text-muted-foreground leading-none">
            {title}
          </p>
          <Icon className={cn("h-4 w-4 shrink-0", iconColor)} aria-hidden />
        </div>
        <p
          className={cn(
            "mt-3 font-semibold tracking-tight tabular-nums leading-none",
            featured
              ? "text-[1.45rem] sm:text-[1.65rem] text-orange-50"
              : "text-[1.35rem] sm:text-2xl"
          )}
        >
          {value}
        </p>
        {delta ? (
          <p className="mt-2.5 inline-flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[11px] font-medium text-emerald-400 leading-none">
            <span aria-hidden>▲</span>
            <span>{delta}</span>
            <span className="text-muted-foreground font-normal">
              vs. mês anterior
            </span>
          </p>
        ) : (
          <p
            className="mt-2.5 text-[11px] leading-none text-transparent select-none"
            aria-hidden
          >
            —
          </p>
        )}
      </div>
    </article>
  );
}

function QuickStat({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: typeof Percent;
}) {
  return (
    <div
      className={cn(
        "h-[5.5rem] rounded-2xl border border-white/[0.08] bg-[#0f1522]/95",
        "px-4 py-4 flex flex-col",
        "transition-[transform,border-color,box-shadow] duration-200 ease-out",
        "motion-safe:hover:-translate-y-0.5 hover:border-white/[0.14]",
        "hover:shadow-[0_12px_28px_rgba(0,0,0,0.18)]"
      )}
    >
      <div className="flex items-center justify-between gap-2 h-4">
        <p className="text-xs font-medium text-muted-foreground leading-none">
          {title}
        </p>
        <Icon
          className="h-3.5 w-3.5 text-muted-foreground shrink-0"
          aria-hidden
        />
      </div>
      <p className="mt-auto text-xl font-semibold tracking-tight tabular-nums leading-none">
        {value}
      </p>
    </div>
  );
}
