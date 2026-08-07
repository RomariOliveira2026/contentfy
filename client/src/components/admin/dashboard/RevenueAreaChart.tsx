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
import { demoRevenueByMonth } from "@/lib/admin/demoDashboardData";

const config: ChartConfig = {
  revenue: {
    label: "Receita",
    color: "#f97316",
  },
};

export default function RevenueAreaChart() {
  const lastIndex = demoRevenueByMonth.length - 1;

  return (
    <ChartContainer
      config={config}
      className="aspect-auto h-[320px] w-full min-w-0"
    >
      <AreaChart
        data={demoRevenueByMonth}
        margin={{ top: 14, right: 12, left: 0, bottom: 4 }}
      >
        <defs>
          <linearGradient id="cfRevenueFillV4" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.22} />
            <stop offset="50%" stopColor="#f97316" stopOpacity={0.1} />
            <stop offset="100%" stopColor="#f97316" stopOpacity={0.005} />
          </linearGradient>
        </defs>
        <CartesianGrid
          vertical={false}
          strokeDasharray="2 10"
          stroke="rgba(255,255,255,0.035)"
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
          width={48}
          tick={{ fill: "#64748b", fontSize: 11 }}
          tickFormatter={(v) =>
            `R$${Number(v) >= 1000 ? `${Math.round(Number(v) / 1000)}k` : v}`
          }
        />
        <ChartTooltip
          cursor={{
            stroke: "rgba(249,115,22,0.22)",
            strokeWidth: 1,
          }}
          content={
            <ChartTooltipContent
              indicator="line"
              className="rounded-xl border-white/10 bg-[#0f1522]/95 shadow-lg"
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
          fill="url(#cfRevenueFillV4)"
          isAnimationActive
          animationDuration={650}
          dot={(props) => {
            const { cx, cy, index } = props;
            if (index !== lastIndex || cx == null || cy == null) {
              return <g key={`dot-${index}`} />;
            }
            return (
              <g key={`dot-current-${index}`}>
                <circle cx={cx} cy={cy} r={11} fill="rgba(249,115,22,0.07)" />
                <circle cx={cx} cy={cy} r={6.5} fill="rgba(249,115,22,0.14)" />
                <circle
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill="#f97316"
                  stroke="#fff7ed"
                  strokeWidth={1.5}
                />
              </g>
            );
          }}
          activeDot={{
            r: 5,
            fill: "#f97316",
            stroke: "#fff7ed",
            strokeWidth: 1.5,
          }}
        />
      </AreaChart>
    </ChartContainer>
  );
}
