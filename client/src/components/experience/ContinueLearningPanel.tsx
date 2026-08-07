import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { ContinueLearningView } from "@shared/contentfy";

interface ContinueLearningPanelProps {
  items: ContinueLearningView[];
  emptyHref?: string;
  emptyLabel?: string;
  className?: string;
  onContinue?: (item: ContinueLearningView) => void;
}

export function ContinueLearningPanel({
  items,
  emptyHref = "/my-account/products",
  emptyLabel = "Abrir minha biblioteca",
  className,
  onContinue,
}: ContinueLearningPanelProps) {
  if (!items.length) {
    return (
      <section
        aria-label="Continue Evoluindo"
        className={cn(
          "rounded-2xl border border-border/40 p-5 sm:p-6",
          className
        )}
      >
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
          Continue Evoluindo
        </p>
        <p className="text-sm text-muted-foreground">
          Seu primeiro passo está pronto — inicie um produto da sua biblioteca.
        </p>
        <Button asChild size="sm" className="mt-4" variant="outline">
          <Link href={emptyHref}>{emptyLabel}</Link>
        </Button>
      </section>
    );
  }

  return (
    <section aria-label="Continue Evoluindo" className={cn("space-y-3", className)}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Continue Evoluindo
          </p>
          <h2 className="text-lg font-medium tracking-tight mt-1">Retome sua jornada</h2>
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1 -mx-1 px-1">
        {items.map((item) => (
          <article
            key={item.productSlug}
            className="min-w-[260px] max-w-[320px] snap-start rounded-2xl border border-border/40 bg-background/50 p-4 shrink-0"
          >
            <p className="text-xs text-muted-foreground truncate">
              {item.lastModuleTitle || item.productName}
            </p>
            <h3 className="text-sm font-medium mt-1 line-clamp-2">
              {item.lastLessonTitle || item.productName}
            </h3>
            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{item.progressPercent}%</span>
                <span>{item.remainingLabel || item.lastActivityLabel}</span>
              </div>
              <Progress value={item.progressPercent} className="h-1.5" />
            </div>
            <Button
              asChild
              size="sm"
              className="mt-4 w-full"
              onClick={() => onContinue?.(item)}
            >
              <Link href={item.href}>
                Continuar
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
