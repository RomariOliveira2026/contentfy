import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { JourneySummaryView, NextBestAction } from "@shared/contentfy";

interface EvolutionHeroProps {
  primaryGoalName: string | null;
  evolutionPercent: number | null;
  successScore: number | null;
  productName: string | null;
  message: string;
  nextAction: NextBestAction | null;
  journey?: JourneySummaryView;
  className?: string;
  onCta?: () => void;
}

export function EvolutionHero({
  primaryGoalName,
  evolutionPercent,
  successScore,
  productName,
  message,
  nextAction,
  className,
  onCta,
}: EvolutionHeroProps) {
  return (
    <section
      aria-label="Resumo da evolução"
      className={cn(
        "rounded-2xl border border-border/50 bg-gradient-to-br from-foreground/[0.05] via-background to-transparent p-5 sm:p-7",
        className
      )}
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div className="space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Objetivo da jornada
            </p>
            <p className="text-lg font-medium tracking-tight mt-1">
              {primaryGoalName || "Defina um objetivo para personalizar"}
            </p>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">{message}</p>
          {productName ? (
            <p className="text-xs text-muted-foreground">
              Jornada atual:{" "}
              <span className="text-foreground/90">{productName}</span>
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-4 sm:gap-6">
          {evolutionPercent != null ? (
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Evolução
              </p>
              <p
                className="text-3xl font-medium tracking-tight mt-1 tabular-nums"
                aria-label={`Evolução ${evolutionPercent} por cento`}
              >
                {evolutionPercent}%
              </p>
            </div>
          ) : null}
          {successScore != null ? (
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Success Score
              </p>
              <p
                className="text-3xl font-medium tracking-tight mt-1 tabular-nums"
                aria-label={`Success Score ${successScore}`}
              >
                {Math.round(successScore)}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {nextAction?.href ? (
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Próximo passo
            </p>
            <p className="text-sm font-medium mt-1 truncate">{nextAction.title}</p>
          </div>
          <Button asChild className="shrink-0" onClick={onCta}>
            <Link href={nextAction.href}>
              {nextAction.ctaLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : null}
    </section>
  );
}
