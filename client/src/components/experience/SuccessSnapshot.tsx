import { Link } from "wouter";
import { cn } from "@/lib/utils";
import type { SuccessSnapshotView } from "@shared/contentfy";

interface SuccessSnapshotProps {
  snapshot: SuccessSnapshotView;
  className?: string;
}

const TREND_LABEL = {
  up: "Tendência positiva esta semana",
  flat: "Ritmo estável esta semana",
  down: "Ritmo em ajuste esta semana",
} as const;

export function SuccessSnapshot({ snapshot, className }: SuccessSnapshotProps) {
  const pillars = [
    { label: "Conhecimento", value: snapshot.knowledge },
    { label: "Aplicação", value: snapshot.application },
    { label: "Constância", value: snapshot.consistency },
    { label: "Resultado", value: snapshot.result },
  ];

  return (
    <section
      aria-label="Minha evolução"
      className={cn(
        "rounded-2xl border border-border/40 bg-background/40 p-5 sm:p-6",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Minha evolução
          </p>
          <h2 className="text-lg font-medium tracking-tight mt-1">
            Success Score {Math.round(snapshot.score)}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">{snapshot.label}</p>
        </div>
        <Link
          href="/my-account/sucesso"
          className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          Ver detalhes
        </Link>
      </div>

      <p className="text-sm text-muted-foreground mt-3">{snapshot.explanation}</p>
      <p className="text-xs text-muted-foreground mt-2" aria-live="polite">
        {TREND_LABEL[snapshot.weeklyTrend]}
      </p>

      <ul className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {pillars.map((p) => (
          <li key={p.label} className="rounded-lg border border-border/30 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {p.label}
            </p>
            <p
              className="text-lg font-medium tabular-nums mt-1"
              aria-label={`${p.label}: ${Math.round(p.value)}`}
            >
              {Math.round(p.value)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
