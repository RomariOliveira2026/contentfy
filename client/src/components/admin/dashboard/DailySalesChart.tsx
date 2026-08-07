import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { demoSalesByDay } from "@/lib/admin/demoDashboardData";

const config: ChartConfig = {
  sales: {
    label: "Vendas",
    color: "#f59e0b",
  },
};

export default function DailySalesChart() {
  return (
    <ChartContainer
      config={config}
      className="aspect-auto h-[320px] w-full min-w-0"
    >
      <BarChart
        data={demoSalesByDay}
        margin={{ top: 12, right: 8, left: 0, bottom: 2 }}
        barCategoryGap="18%"
      >
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 8"
          stroke="rgba(255,255,255,0.04)"
        />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          interval={4}
          tick={{ fill: "#94a3b8", fontSize: 11 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={28}
          tick={{ fill: "#64748b", fontSize: 11 }}
        />
        <ChartTooltip
          cursor={{ fill: "rgba(249,115,22,0.06)" }}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar
          dataKey="sales"
          fill="#f59e0b"
          radius={[5, 5, 0, 0]}
          maxBarSize={16}
          activeBar={{
            fill: "#f97316",
            stroke: "rgba(255,247,237,0.35)",
            strokeWidth: 1,
          }}
        />
      </BarChart>
    </ChartContainer>
  );
}
