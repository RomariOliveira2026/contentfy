import { experienceCopy } from "@/experience";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export function EmptyState({
  title = "Espaço pronto para evoluir",
  description = experienceCopy.empty,
  action,
  className,
  icon,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-12 text-center",
        className
      )}
      data-cf-state="empty"
    >
      {icon ? <div className="mb-1 text-orange-400">{icon}</div> : null}
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
