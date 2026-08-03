import { cn } from "@/lib/utils";

interface SuccessIndexBarsProps {
  knowledge: number;
  application: number;
  consistency: number;
  result: number;
  className?: string;
}

function Bar({ label, value }: { label: string; value: number }) {
  const filled = Math.round(Math.max(0, Math.min(100, value)) / 10);
  const blocks = Array.from({ length: 10 }, (_, i) => i < filled);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums">{Math.round(value)}</span>
      </div>
      <div className="flex gap-0.5" aria-hidden>
        {blocks.map((on, i) => (
          <span
            key={i}
            className={cn(
              "h-2 flex-1 rounded-[1px]",
              on ? "bg-foreground/80" : "bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function SuccessIndexBars({
  knowledge,
  application,
  consistency,
  result,
  className,
}: SuccessIndexBarsProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <Bar label="Conhecimento" value={knowledge} />
      <Bar label="Aplicação" value={application} />
      <Bar label="Constância" value={consistency} />
      <Bar label="Resultado" value={result} />
    </div>
  );
}
