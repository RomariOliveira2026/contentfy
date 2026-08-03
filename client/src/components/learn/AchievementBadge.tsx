import { cn } from "@/lib/utils";

interface AchievementBadgeProps {
  name: string;
  description: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  unlocked: boolean;
  className?: string;
}

const TIER_STYLE = {
  bronze: "border-amber-800/40 text-amber-200/90",
  silver: "border-slate-400/40 text-slate-200",
  gold: "border-yellow-500/40 text-yellow-100",
  platinum: "border-white/30 text-white",
} as const;

export function AchievementBadge({
  name,
  description,
  tier,
  unlocked,
  className,
}: AchievementBadgeProps) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-3 min-w-[9.5rem]",
        unlocked ? TIER_STYLE[tier] : "border-border/30 text-muted-foreground/50",
        !unlocked && "opacity-60",
        className
      )}
    >
      <p className="text-[10px] uppercase tracking-[0.14em] mb-1 opacity-70">
        {tier}
      </p>
      <p className="text-sm font-medium leading-snug">{name}</p>
      <p className="text-[11px] mt-1 opacity-70 line-clamp-2">{description}</p>
    </div>
  );
}
