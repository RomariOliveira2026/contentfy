import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface LearningPathItem {
  slug: string;
  name: string;
  href: string;
  reason: string;
}

interface LearningPathProps {
  items: LearningPathItem[];
  className?: string;
}

export function LearningPath({ items, className }: LearningPathProps) {
  if (!items.length) return null;

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, i) => (
        <Link key={item.slug} href={item.href}>
          <a className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/40 px-3 py-2.5 hover:bg-background/70 transition-colors">
            <span className="text-xs text-muted-foreground tabular-nums w-5">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">
                {item.reason}
              </p>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
}
