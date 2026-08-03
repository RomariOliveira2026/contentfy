import { cn } from "@/lib/utils";

interface EvolutionCardProps {
  title: string;
  subtitle?: string;
  percent?: number;
  children?: React.ReactNode;
  className?: string;
}

export function EvolutionCard({
  title,
  subtitle,
  percent,
  children,
  className,
}: EvolutionCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-5 sm:p-6",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-medium tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {typeof percent === "number" && (
          <p className="text-2xl font-light tabular-nums tracking-tight">
            {percent}
            <span className="text-sm text-muted-foreground ml-0.5">%</span>
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
