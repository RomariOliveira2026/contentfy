import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface PageShellProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
}

/** Premium page frame for ContentFy Experience screens. */
export function PageShell({
  children,
  className,
  title,
  description,
  actions,
}: PageShellProps) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 py-8 md:px-6", className)}>
      {(title || actions) && (
        <header className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            {title ? (
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
            ) : null}
            {description ? (
              <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
      )}
      {children}
    </div>
  );
}
