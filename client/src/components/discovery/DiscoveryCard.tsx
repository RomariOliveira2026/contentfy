import { Link } from "wouter";
import { Heart, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  dnaCompetencyLabels,
  formatDnaDuration,
  resolveContentfyDna,
} from "@shared/contentfy";

export interface DiscoveryCardData {
  id: string;
  slug: string;
  name: string;
  type?: string;
  typeLabel?: string;
  category?: string;
  tags?: string[];
  author?: string;
  coverImage?: string | null;
  heroImage?: string | null;
  priceCents?: number | null;
  level?: string;
  duration?: string;
  progressPercent?: number;
  href: string;
  reason?: string;
  /** Soft status for perception — never invent ratings. */
  statusLabel?: string;
}

interface DiscoveryCardProps {
  product: DiscoveryCardData;
  onFavoriteToggle?: (slug: string) => void;
  isFavorite?: boolean;
  priority?: boolean;
  className?: string;
}

export function DiscoveryCard({
  product,
  onFavoriteToggle,
  isFavorite,
  priority,
  className,
}: DiscoveryCardProps) {
  const image =
    product.heroImage || product.coverImage || "/brand/png/symbol.png";
  const dna = resolveContentfyDna(product.slug, {
    category: product.category,
    name: product.name,
    typeLabel: product.typeLabel,
  });
  const skills = dnaCompetencyLabels(dna, 2);
  const level = product.level || dna.levelLabel;
  const duration =
    product.duration || formatDnaDuration(dna.estimatedHours);
  const status =
    product.statusLabel ||
    (typeof product.progressPercent === "number"
      ? "Em andamento"
      : product.reason
        ? "Recomendado"
        : "Disponível");

  return (
    <article
      className={cn(
        "cf-phoenix-card group relative w-[13.5rem] sm:w-[16rem] shrink-0 snap-start",
        className
      )}
    >
      <Link href={product.href}>
        <a className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border/50 bg-muted/30 shadow-[0_16px_40px_rgba(0,0,0,0.28)] transition-[box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:shadow-[0_28px_56px_rgba(0,0,0,0.4)]">
            <img
              src={image}
              alt={product.name}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
            <div className="absolute top-2.5 left-2.5">
              <span className="rounded-full border border-white/15 bg-black/45 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/85 backdrop-blur-sm">
                {status}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3.5">
              {product.typeLabel ? (
                <p className="text-[10px] uppercase tracking-wider text-white/65 mb-1">
                  {product.typeLabel}
                </p>
              ) : null}
              <h3 className="text-sm sm:text-[15px] font-semibold leading-snug line-clamp-2 text-white">
                {product.name}
              </h3>
              {product.author ? (
                <p className="text-xs text-white/70 line-clamp-1 mt-1">
                  {product.author}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-3 space-y-2 px-0.5">
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-border/40 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              {duration ? <span>{duration}</span> : null}
              {level ? <span>{level}</span> : null}
            </div>

            {typeof product.progressPercent === "number" ? (
              <div className="pt-0.5">
                <div className="h-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-[width] duration-500"
                    style={{ width: `${product.progressPercent}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                  <PlayCircle className="h-3 w-3" />
                  {product.progressPercent}% da jornada
                </p>
              </div>
            ) : null}

            <span className="inline-flex items-center text-xs font-medium text-primary/90 group-hover:text-primary transition-colors">
              Explorar jornada
              <span className="ml-1 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </div>
        </a>
      </Link>

      {onFavoriteToggle && (
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-90 backdrop-blur-sm"
          aria-label={
            isFavorite ? "Remover da Sua Coleção" : "Salvar na Sua Coleção"
          }
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFavoriteToggle(product.slug);
          }}
        >
          <Heart
            className={cn(
              "h-4 w-4",
              isFavorite && "fill-current text-rose-500"
            )}
          />
        </Button>
      )}
    </article>
  );
}
