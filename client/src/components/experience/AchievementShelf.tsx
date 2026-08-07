import { Link } from "wouter";
import { cn } from "@/lib/utils";
import type { AchievementViewItem } from "@shared/contentfy";

interface AchievementShelfProps {
  items: AchievementViewItem[];
  className?: string;
}

export function AchievementShelf({ items, className }: AchievementShelfProps) {
  const unlocked = items.filter((a) => a.unlocked);

  return (
    <section
      aria-label="Conquistas"
      className={cn(
        "rounded-2xl border border-border/40 p-5 sm:p-6",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Conquistas
          </p>
          <h2 className="text-lg font-medium tracking-tight mt-1">Marcos reais</h2>
        </div>
        <Link
          href="/my-account/achievements"
          className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          Ver conquistas
        </Link>
      </div>

      {!unlocked.length ? (
        <p className="text-sm text-muted-foreground mt-4">
          Comece sua jornada para desbloquear as primeiras conquistas.
        </p>
      ) : (
        <ul className="mt-4 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1">
          {unlocked.map((a) => (
            <li
              key={a.id}
              className="min-w-[180px] snap-start rounded-xl border border-border/30 bg-background/50 p-3 shrink-0"
            >
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {a.tier}
              </p>
              <p className="text-sm font-medium mt-1">{a.name}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {a.description}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
