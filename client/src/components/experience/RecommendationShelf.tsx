import { Link } from "wouter";
import { cn } from "@/lib/utils";
import type { RecommendationViewItem } from "@shared/contentfy";

interface RecommendationShelfProps {
  items: RecommendationViewItem[];
  className?: string;
  onSelect?: (item: RecommendationViewItem) => void;
  onDismiss?: (id: string) => void;
}

export function RecommendationShelf({
  items,
  className,
  onSelect,
  onDismiss,
}: RecommendationShelfProps) {
  if (!items.length) return null;

  return (
    <section
      aria-label="Seu próximo conteúdo"
      className={cn("space-y-3", className)}
    >
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Recomendações
        </p>
        <h2 className="text-lg font-medium tracking-tight mt-1">
          Seu próximo conteúdo
        </h2>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-xl border border-border/40 p-4 flex flex-col"
          >
            <p className="text-sm font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground mt-1.5 flex-1">
              {item.reason}
            </p>
            <div className="mt-3 flex items-center gap-3">
              {item.href ? (
                <Link
                  href={item.href}
                  onClick={() => onSelect?.(item)}
                  className="text-xs font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  Conhecer
                </Link>
              ) : null}
              {onDismiss ? (
                <button
                  type="button"
                  onClick={() => onDismiss(item.id)}
                  className="text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  Dispensar
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
