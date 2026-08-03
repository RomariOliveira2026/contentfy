import { cn } from "@/lib/utils";

interface CompetencyCardProps {
  name: string;
  category: string;
  progress: number;
  level: string;
  status: "acquired" | "in_progress" | "missing";
  className?: string;
}

const STATUS_LABEL = {
  acquired: "Adquirida",
  in_progress: "Em evolução",
  missing: "A desenvolver",
} as const;

export function CompetencyCard({
  name,
  category,
  progress,
  level,
  status,
  className,
}: CompetencyCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/40 bg-background/50 p-4",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className="text-sm font-medium truncate">{name}</p>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {STATUS_LABEL[status]}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        {category} · {level}
      </p>
      <div className="h-1 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-foreground/80 transition-all duration-500"
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground mt-1.5 tabular-nums">
        {progress}%
      </p>
    </div>
  );
}
