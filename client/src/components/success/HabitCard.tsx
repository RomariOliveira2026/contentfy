import { cn } from "@/lib/utils";

interface HabitCardProps {
  currentStreakDays: number;
  label: string;
  milestones: Array<{
    days: number;
    name: string;
    reached: boolean;
    progress: number;
  }>;
  className?: string;
}

export function HabitCard({
  currentStreakDays,
  label,
  milestones,
  className,
}: HabitCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/50 bg-card/40 p-5",
        className
      )}
    >
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        Hábitos
      </p>
      <p className="text-2xl font-light tabular-nums mt-2">
        {currentStreakDays}
        <span className="text-sm text-muted-foreground ml-1">dias</span>
      </p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
      <ul className="mt-4 space-y-2">
        {milestones.map((m) => (
          <li
            key={m.days}
            className={cn(
              "flex items-center justify-between text-xs",
              m.reached ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <span>{m.name}</span>
            <span className="tabular-nums">
              {m.reached ? "Alcançado" : `${m.progress}%`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
