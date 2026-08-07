import { cn } from "@/lib/utils";
import type { JourneySummaryView } from "@shared/contentfy";

interface JourneySummaryProps {
  summary: JourneySummaryView;
  className?: string;
}

export function JourneySummary({ summary, className }: JourneySummaryProps) {
  return (
    <section
      aria-label="Resumo da jornada"
      className={cn(
        "rounded-xl border border-border/40 bg-background/40 p-4 sm:p-5",
        className
      )}
    >
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
        Minha jornada
      </p>
      <p className="text-sm text-foreground/90">{summary.message}</p>
      <dl className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Objetivo</dt>
          <dd className="mt-0.5 font-medium">
            {summary.primaryGoalName || "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Evolução</dt>
          <dd className="mt-0.5 font-medium tabular-nums">
            {summary.evolutionPercent != null
              ? `${summary.evolutionPercent}%`
              : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Última aula</dt>
          <dd className="mt-0.5 font-medium truncate">
            {summary.lastLessonTitle || "—"}
          </dd>
        </div>
      </dl>
    </section>
  );
}
