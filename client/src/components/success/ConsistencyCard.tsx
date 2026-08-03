import { cn } from "@/lib/utils";

interface ConsistencyCardProps {
  label: string;
  score: number;
  band: string;
  trend: "up" | "flat" | "down";
  className?: string;
}

export function ConsistencyCard({
  label,
  score,
  band,
  trend,
  className,
}: ConsistencyCardProps) {
  const filled = Math.round(Math.max(0, Math.min(100, score)) / 10);
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/50 bg-card/40 p-5",
        className
      )}
    >
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        Consistência
      </p>
      <p className="text-lg font-medium mt-2">{label}</p>
      <p className="text-xs text-muted-foreground mt-1 capitalize">
        Tendência: {trend === "up" ? "alta" : trend === "down" ? "queda" : "estável"} · {band}
      </p>
      <div className="flex gap-0.5 mt-4" aria-hidden>
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-2 flex-1 rounded-[1px]",
              i < filled ? "bg-foreground/80" : "bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  );
}
