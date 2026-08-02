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
    <ChartContainer config={config} className="aspect-auto h-[280px] w-full">
      <BarChart
        data={demoSalesByDay}
        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval={4}
        />
        <YAxis tickLine={false} axisLine={false} width={28} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="sales"
          fill="var(--color-sales)"
          radius={[4, 4, 0, 0]}
          maxBarSize={18}
        />
      </BarChart>
    </ChartContainer>
  );
}
