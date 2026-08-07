import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ExperienceEmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function ExperienceEmptyState({
  title,
  description,
  action,
  className,
}: ExperienceEmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-border/50 p-6 text-center",
        className
      )}
    >
      <p className="text-sm font-medium">{title}</p>
      {description ? (
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
