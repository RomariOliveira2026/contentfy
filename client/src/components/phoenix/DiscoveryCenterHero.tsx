import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  dnaCompetencyLabels,
  formatDnaDuration,
  resolveContentfyDna,
  resolveDiscoveryCardPresentation,
} from "@shared/contentfy";
import type { DiscoveryCardData } from "@/components/discovery";

interface DiscoveryCenterHeroProps {
  featured: DiscoveryCardData | null;
  primaryGoalName?: string | null;
  nextJourneyLabel?: string | null;
  developedCompetencies?: string[];
  ctaHref?: string;
  ctaLabel?: string;
  className?: string;
}

/**
 * Living Discovery Center hero — elegant, discrete motion.
 */
export function DiscoveryCenterHero({
  featured,
  primaryGoalName,
  nextJourneyLabel,
  developedCompetencies,
  ctaHref,
  ctaLabel = "Iniciar jornada",
  className,
}: DiscoveryCenterHeroProps) {
  const dna = featured
    ? resolveContentfyDna(featured.slug, {
        category: featured.category,
        name: featured.name,
        typeLabel: featured.typeLabel,
      })
    : null;

  const skills =
    developedCompetencies?.length
      ? developedCompetencies.slice(0, 4)
      : dna
        ? dnaCompetencyLabels(dna, 4)
        : [];

  const presentation = featured
    ? resolveDiscoveryCardPresentation(
        featured.slug,
        featured.coverImage,
        featured.heroImage,
        featured.name
      )
    : null;
  const image = presentation?.image || "/brand/png/symbol.png";
  const featuredName =
    presentation?.displayName || featured?.name || "Descubra o que evolui com você";
  const featuredAuthor = featured?.author || presentation?.author || undefined;

  const primaryHref =
    ctaHref || featured?.href || "/explorar";

  return (
    <section
      aria-label="Centro de Descoberta"
      className={cn(
        "cf-phoenix-hero relative overflow-hidden border-b border-border/40",
        className
      )}
    >
      <div className="absolute inset-0" aria-hidden>
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover scale-[1.04] opacity-[0.32] cf-phoenix-hero-media"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </div>

      <div className="relative container py-12 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">
              Centro de Descoberta · ContentFy
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-tight text-balance leading-[1.12]">
              {featuredName}
            </h1>
            <p className="mt-3 text-muted-foreground text-base sm:text-lg max-w-xl leading-relaxed">
              {dna?.transformation ||
                "Não é um catálogo. É um centro de descoberta — jornadas, competências e o próximo passo certo."}
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <HeroMeta
                label="Objetivo atual"
                value={
                  primaryGoalName ||
                  dna?.objectives[0]?.name ||
                  "Defina seu objetivo"
                }
              />
              <HeroMeta
                label="Próxima jornada"
                value={
                  nextJourneyLabel ||
                  dna?.journeys[0] ||
                  "Comece por Aqui"
                }
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <Button asChild size="lg" className="cf-phoenix-cta">
                <Link href={primaryHref}>
                  {ctaLabel}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/explorar">Explorar ecossistema</Link>
              </Button>
            </div>
          </div>

          <aside className="cf-phoenix-hero-aside rounded-2xl border border-white/10 bg-background/55 backdrop-blur-md p-5 sm:p-6">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Em destaque
            </p>
            {featured ? (
              <>
                <p className="text-lg font-medium tracking-tight mt-1.5">
                  {featuredName}
                </p>
                {featuredAuthor ? (
                  <p className="text-sm text-muted-foreground mt-1">
                    {featuredAuthor}
                  </p>
                ) : null}
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  {dna?.levelLabel ? (
                    <div>
                      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Nível
                      </dt>
                      <dd className="mt-0.5 font-medium">{dna.levelLabel}</dd>
                    </div>
                  ) : null}
                  {formatDnaDuration(dna?.estimatedHours) ? (
                    <div>
                      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Tempo
                      </dt>
                      <dd className="mt-0.5 font-medium">
                        {formatDnaDuration(dna?.estimatedHours)}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">
                Em breve — novos destaques no ecossistema.
              </p>
            )}

            {skills.length > 0 ? (
              <div className="mt-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
                  Competências desenvolvidas
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border/50 px-2.5 py-1 text-[11px] text-foreground/90"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}

function HeroMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/40 bg-background/40 px-3.5 py-3">
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium mt-1 truncate">{value}</p>
    </div>
  );
}
