import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedNumber from "./AnimatedNumber";
import Sparkline from "./Sparkline";
import { cn } from "@/lib/utils";

const ACCENT: Record<string, string> = {
  orange: "#f97316",
  amber: "#f59e0b",
  sky: "#38bdf8",
  emerald: "#34d399",
};

interface KpiCardProps {
  title: string;
  value?: number;
  valueLabel?: string;
  prefix?: string;
  decimals?: number;
  change: string;
  trend: "up" | "down";
  sparkline?: number[];
  accent?: string;
  compact?: boolean;
}

export default function KpiCard({
  title,
  value,
  valueLabel,
  prefix = "",
  decimals = 0,
  change,
  trend,
  sparkline,
  accent = "orange",
  compact,
}: KpiCardProps) {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  const color = ACCENT[accent] || ACCENT.orange;

  return (
    <Card className={cn("cf-admin-kpi cf-card-premium py-0 gap-0", compact && "cf-admin-kpi-compact")}>
      <CardHeader className="flex flex-row items-start justify-between pb-0 pt-5 px-5">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "inline-flex items-center text-xs font-semibold rounded-full px-2 py-0.5",
            trend === "up"
              ? "text-emerald-400 bg-emerald-400/10"
              : "text-sky-300 bg-sky-400/10"
          )}
        >
          <TrendIcon className="w-3.5 h-3.5 mr-0.5" />
          {change}
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-4 pt-2">
        <div className="text-2xl lg:text-[1.75rem] font-bold tracking-tight mb-2">
          {valueLabel != null ? (
            valueLabel
          ) : (
            <AnimatedNumber
              value={value || 0}
              prefix={prefix}
              decimals={decimals}
            />
          )}
        </div>
        {sparkline && <Sparkline data={sparkline} color={color} />}
        {!compact && (
          <p className="text-[11px] text-muted-foreground mt-2">
            vs período anterior
          </p>
        )}
      </CardContent>
    </Card>
  );
}
