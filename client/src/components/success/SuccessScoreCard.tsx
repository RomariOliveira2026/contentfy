import { cn } from "@/lib/utils";

interface PillarBarProps {
  label: string;
  value: number;
}

function PillarBar({ label, value }: PillarBarProps) {
  const filled = Math.round(Math.max(0, Math.min(100, value)) / 10);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums">{Math.round(value)}</span>
      </div>
      <div className="flex gap-0.5" aria-hidden>
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

export interface SuccessScoreCardProps {
  score: number;
  label: string;
  knowledge: number;
  application: number;
  consistency: number;
  result: number;
  className?: string;
}

export function SuccessScoreCard({
  score,
  label,
  knowledge,
  application,
  consistency,
  result,
  className,
}: SuccessScoreCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/50 bg-card/40 p-5 sm:p-6",
        className
      )}
    >
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        Success Score
      </p>
      <p className="text-4xl font-light tracking-tight mt-2 tabular-nums">
        {score}
        <span className="text-base text-muted-foreground ml-1">%</span>
      </p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
      <div className="mt-6 space-y-3">
        <PillarBar label="Conhecimento" value={knowledge} />
        <PillarBar label="Aplicação" value={application} />
        <PillarBar label="Constância" value={consistency} />
        <PillarBar label="Resultado" value={result} />
      </div>
    </div>
  );
}
