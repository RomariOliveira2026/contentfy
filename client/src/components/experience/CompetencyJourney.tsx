import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import type { CompetencyViewItem } from "@shared/contentfy";

interface CompetencyJourneyProps {
  acquired: CompetencyViewItem[];
  inProgress: CompetencyViewItem[];
  stagnant: CompetencyViewItem[];
  className?: string;
}

function Group({
  title,
  items,
  empty,
}: {
  title: string;
  items: CompetencyViewItem[];
  empty: string;
}) {
  if (!items.length) {
    return (
      <div>
        <p className="text-xs text-muted-foreground mb-2">{title}</p>
        <p className="text-sm text-muted-foreground/80">{empty}</p>
      </div>
    );
  }
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">{title}</p>
      <ul className="space-y-2">
        {items.slice(0, 4).map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-border/30 px-3 py-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium truncate">{c.name}</span>
              <span className="text-xs tabular-nums text-muted-foreground">
                {Math.round(c.progress)}%
              </span>
            </div>
            <Progress value={c.progress} className="h-1 mt-2" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CompetencyJourney({
  acquired,
  inProgress,
  stagnant,
  className,
}: CompetencyJourneyProps) {
  return (
    <section
      aria-label="Competências"
      className={cn(
        "rounded-2xl border border-border/40 p-5 sm:p-6 space-y-5",
        className
      )}
    >
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Detalhe da jornada
        </p>
        <h2 className="text-lg font-medium tracking-tight mt-1">
          Progresso por competência
        </h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <Group
          title="Adquiridas"
          items={acquired}
          empty="Ainda não há competências consolidadas."
        />
        <Group
          title="Em evolução"
          items={inProgress}
          empty="Nenhuma competência em evolução no momento."
        />
        <Group
          title="Atenção"
          items={stagnant}
          empty="Nenhuma estagnação detectada."
        />
      </div>
    </section>
  );
}
