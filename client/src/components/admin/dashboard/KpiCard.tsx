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

type ChangeTone = "positive" | "neutral" | "inverse" | "warning";

function changeBadgeClass(changeTone: ChangeTone, trend: "up" | "down") {
  if (changeTone === "inverse")
    return "text-emerald-400 bg-emerald-400/10 border border-emerald-400/15";
  if (changeTone === "warning")
    return "text-amber-300 bg-amber-400/10 border border-amber-400/15";
  if (changeTone === "neutral")
    return "text-sky-300 bg-sky-400/10 border border-sky-400/15";
  if (trend === "up")
    return "text-emerald-400 bg-emerald-400/10 border border-emerald-400/15";
  return "text-amber-300 bg-amber-400/10 border border-amber-400/15";
}

interface KpiCardProps {
  title: string;
  value?: number;
  valueLabel?: string;
  prefix?: string;
  decimals?: number;
  change: string;
  trend: "up" | "down";
  changeTone?: ChangeTone;
  sparkline?: number[];
  accent?: string;
  compact?: boolean;
  featured?: boolean;
}

export default function KpiCard({
  title,
  value,
  valueLabel,
  prefix = "",
  decimals = 0,
  change,
  trend,
  changeTone = "positive",
  sparkline,
  accent = "orange",
  compact,
  featured,
}: KpiCardProps) {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  const color = ACCENT[accent] || ACCENT.orange;
  const deltaValue = change.replace(/^\+/, "");

  return (
    <Card
      className={cn(
        "cf-admin-kpi cf-card-premium py-0 gap-0 h-full",
        compact && "cf-admin-kpi-compact",
        featured && "cf-admin-kpi-featured"
      )}
    >
      <CardHeader
        className={cn(
          "flex flex-row items-start justify-between gap-2 pb-0",
          featured ? "pt-5 px-5 sm:px-6" : "pt-4 px-4 sm:pt-5 sm:px-5"
        )}
      >
        <CardTitle className="text-xs sm:text-sm font-medium text-slate-400 leading-none">
          {title}
        </CardTitle>
        {!featured ? (
          <div
            className={cn(
              "inline-flex items-center text-[11px] font-medium rounded-full px-2 py-0.5 shrink-0",
              changeBadgeClass(changeTone, trend)
            )}
          >
            <TrendIcon className="w-3 h-3 mr-0.5" aria-hidden />
            {change}
          </div>
        ) : null}
      </CardHeader>
      <CardContent
        className={cn(
          "flex flex-col flex-1",
          featured ? "px-5 pb-5 pt-3 sm:px-6" : "px-4 pb-4 pt-3 sm:px-5"
        )}
      >
        <div
          className={cn(
            "font-bold tracking-tight tabular-nums leading-none",
            featured
              ? "text-[1.7rem] sm:text-[1.9rem] text-orange-50 mt-1"
              : compact
                ? "text-xl sm:text-2xl"
                : "text-2xl lg:text-[1.75rem] mt-1"
          )}
        >
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
        {featured ? (
          <div className="mt-3 flex flex-col gap-0.5 leading-none">
            <span className="text-[11px] font-medium text-emerald-400 tabular-nums">
              <span aria-hidden>▲ </span>
              {deltaValue}
            </span>
            <span className="text-[10px] font-normal text-slate-400">
              vs mês anterior
            </span>
          </div>
        ) : null}
        {sparkline ? (
          <div className={cn("mt-3", featured && "mt-4")}>
            <Sparkline data={sparkline} color={color} />
          </div>
        ) : null}
        {!compact && !featured ? (
          <p className="text-[11px] font-normal text-slate-400 mt-2 leading-none">
            vs período anterior
          </p>
        ) : compact ? (
          <p
            className="mt-auto text-[11px] leading-none text-transparent select-none"
            aria-hidden
          >
            —
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
