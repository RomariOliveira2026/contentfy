import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface RecommendationCardProps {
  title: string;
  reason: string;
  href?: string;
  score?: number;
  className?: string;
}

export function RecommendationCard({
  title,
  reason,
  href,
  score,
  className,
}: RecommendationCardProps) {
  const body = (
    <div
      className={cn(
        "rounded-xl border border-border/40 bg-background/40 p-4 hover:bg-background/70 transition-colors",
        className
      )}
    >
      <div className="flex justify-between gap-2">
        <p className="text-sm font-medium">{title}</p>
        {typeof score === "number" && (
          <span className="text-[10px] tabular-nums text-muted-foreground">
            {score}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1">{reason}</p>
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        <a className="block">{body}</a>
      </Link>
    );
  }
  return body;
}
