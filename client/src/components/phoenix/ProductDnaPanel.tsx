import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  resolveContentfyDna,
  type ContentfyProductDna,
} from "@shared/contentfy";

interface ProductDnaPanelProps {
  productSlug: string;
  category?: string;
  name?: string;
  typeLabel?: string;
  dna?: ContentfyProductDna;
  className?: string;
}

/**
 * ContentFy DNA™ — premium product identity block for PDP.
 */
export function ProductDnaPanel({
  productSlug,
  category,
  name,
  typeLabel,
  dna: dnaProp,
  className,
}: ProductDnaPanelProps) {
  const dna =
    dnaProp ||
    resolveContentfyDna(productSlug, { category, name, typeLabel });

  return (
    <section
      aria-label="ContentFy DNA"
      className={cn(
        "cf-phoenix-panel rounded-2xl border border-border/40 overflow-hidden",
        className
      )}
    >
      <div className="px-5 sm:px-7 py-6 sm:py-8 border-b border-border/40 bg-gradient-to-br from-primary/[0.07] via-transparent to-transparent">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          ContentFy DNA™
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-2 max-w-3xl text-balance">
          {dna.transformation}
        </h2>
        {dna.ecosystem ? (
          <p className="text-sm text-muted-foreground mt-3">{dna.ecosystem}</p>
        ) : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 p-5 sm:p-7">
        <DnaColumn title="Objetivos">
          {dna.objectives.slice(0, 4).map((g) => (
            <li key={g.id}>
              <span className="font-medium text-foreground/95">{g.name}</span>
              {g.description ? (
                <span className="block text-xs text-muted-foreground mt-0.5">
                  {g.description}
                </span>
              ) : null}
            </li>
          ))}
        </DnaColumn>

        <DnaColumn title="Competências">
          {dna.competencies
            .filter((c) => c.phase === "acquired")
            .slice(0, 5)
            .map((c) => (
              <li key={c.id}>{c.name}</li>
            ))}
        </DnaColumn>

        <DnaColumn title="Resultados esperados">
          {dna.expectedOutcomes.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </DnaColumn>

        <DnaColumn title="Jornadas">
          {dna.journeys.map((j) => (
            <li key={j}>{j}</li>
          ))}
        </DnaColumn>
      </div>
    </section>
  );
}

function DnaColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2.5">
        {title}
      </p>
      <ul className="space-y-2 text-sm text-muted-foreground [&_li]:leading-snug">
        {children}
      </ul>
    </div>
  );
}
