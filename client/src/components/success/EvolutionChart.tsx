import { cn } from "@/lib/utils";

export interface EvolutionChartProps {
  points: Array<{ key: string; label: string; value: number }>;
  className?: string;
  title?: string;
}

export function EvolutionChart({
  points,
  className,
  title = "Evolução",
}: EvolutionChartProps) {
  if (!points.length) return null;
  const max = Math.max(100, ...points.map((p) => p.value));

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/50 bg-card/40 p-5",
        className
      )}
    >
      <h3 className="text-sm font-medium mb-4">{title}</h3>
      <div className="space-y-3">
        {points.map((p) => (
          <div key={p.key} className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{p.label}</span>
              <span className="tabular-nums">{Math.round(p.value)}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-foreground/75 transition-all duration-500"
                style={{ width: `${(p.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MonthlyEvolution(props: EvolutionChartProps) {
  return <EvolutionChart {...props} title={props.title || "Evolução mensal"} />;
}

export function WeeklyProgress(props: EvolutionChartProps) {
  return <EvolutionChart {...props} title={props.title || "Progresso semanal"} />;
}
