import { Link } from "wouter";
import { cn } from "@/lib/utils";
import {
  dnaCompetencyLabels,
  resolveContentfyDna,
  type ContentfyProductDna,
  type DnaCompetencyPhase,
} from "@shared/contentfy";

interface SkillMapProps {
  productSlug: string;
  category?: string;
  name?: string;
  typeLabel?: string;
  dna?: ContentfyProductDna;
  className?: string;
}

const PHASE_LABEL: Record<DnaCompetencyPhase, string> = {
  acquired: "Competências adquiridas",
  related: "Competências relacionadas",
  future: "Competências futuras",
};

const PHASE_ORDER: DnaCompetencyPhase[] = [
  "acquired",
  "related",
  "future",
];

/**
 * Skill Map™ — product competency constellation for PDP / discovery.
 */
export function SkillMap({
  productSlug,
  category,
  name,
  typeLabel,
  dna: dnaProp,
  className,
}: SkillMapProps) {
  const dna =
    dnaProp ||
    resolveContentfyDna(productSlug, { category, name, typeLabel });

  const byPhase = PHASE_ORDER.map((phase) => ({
    phase,
    items: dna.competencies.filter((c) => c.phase === phase).slice(0, 6),
  })).filter((g) => g.items.length > 0);

  return (
    <section
      aria-label="Skill Map"
      className={cn(
        "cf-phoenix-panel rounded-2xl border border-border/40 p-5 sm:p-7",
        className
      )}
    >
      <div className="mb-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Skill Map™
        </p>
        <h2 className="text-xl font-medium tracking-tight mt-1">
          Mapa de competências
        </h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          O que este produto desenvolve — e o que completa a jornada depois.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {byPhase.map(({ phase, items }) => (
          <div key={phase}>
            <p className="text-xs text-muted-foreground mb-2.5">
              {PHASE_LABEL[phase]}
            </p>
            <ul className="space-y-2">
              {items.map((c) => (
                <li
                  key={c.id}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-sm",
                    phase === "acquired" &&
                      "border-primary/25 bg-primary/[0.06]",
                    phase === "related" && "border-border/40 bg-background/40",
                    phase === "future" &&
                      "border-dashed border-border/50 text-muted-foreground"
                  )}
                >
                  <span className="font-medium text-foreground/95">
                    {c.name}
                  </span>
                  <span className="block text-[11px] text-muted-foreground mt-0.5">
                    {c.category}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {dna.relatedProductSlugs.length > 0 ? (
        <div className="mt-6 pt-5 border-t border-border/40">
          <p className="text-xs text-muted-foreground mb-2">
            Produtos que completam esta jornada
          </p>
          <div className="flex flex-wrap gap-2">
            {dna.relatedProductSlugs.map((slug) => {
              const related = resolveContentfyDna(slug);
              const labels = dnaCompetencyLabels(related, 2).join(" · ");
              const title =
                slug === "desacelere"
                  ? "Desacelere"
                  : slug === "manual-do-representante-comercial"
                    ? "Manual do Representante Comercial"
                    : slug;
              return (
                <Link key={slug} href={`/produto/${slug}`}>
                  <a className="inline-flex items-center rounded-full border border-border/50 px-3 py-1.5 text-xs hover:border-primary/40 hover:bg-primary/[0.06] transition-colors">
                    {title}
                    {labels ? (
                      <span className="text-muted-foreground ml-1.5">
                        · {labels}
                      </span>
                    ) : null}
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
