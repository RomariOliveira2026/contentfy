import { experienceCopy } from "@/experience";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
  label?: string;
  className?: string;
  rows?: number;
}

export function LoadingState({
  label = experienceCopy.loading,
  className,
  rows = 3,
}: LoadingStateProps) {
  return (
    <div
      className={cn("space-y-3", className)}
      role="status"
      aria-live="polite"
      aria-label={label}
      data-cf-state="loading"
    >
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-xl" />
      ))}
    </div>
  );
}
