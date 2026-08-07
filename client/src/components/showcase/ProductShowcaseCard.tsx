import { Link } from "wouter";
import type { ShowcaseProduct } from "@/lib/showcase";
import {
  formatShowcasePrice,
  isComingSoonCommerce,
  productHref,
  visibilityLabel,
  getProductVisibility,
  type ProductCardVariant,
} from "@/lib/showcase";
import { badgesForProduct, ShowcaseBadgePill } from "./ShowcaseBadge";
import ProductCoverMedia from "./ProductCoverMedia";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  dnaCompetencyLabels,
  formatDnaDuration,
  resolveContentfyDna,
} from "@shared/contentfy";

interface ProductShowcaseCardProps {
  product: ShowcaseProduct;
  onDetails?: (product: ShowcaseProduct) => void;
  priority?: boolean;
  variant?: ProductCardVariant;
  className?: string;
}

const VARIANT_SHELL: Record<ProductCardVariant, string> = {
  featured:
    "w-full max-w-none shrink-0 sm:shrink",
  large: "w-full max-w-none shrink-0 sm:shrink",
  standard: "w-[260px] sm:w-[280px] shrink-0",
  compact: "w-[200px] sm:w-[220px] shrink-0",
};

const VARIANT_ASPECT: Record<ProductCardVariant, string> = {
  featured: "aspect-[16/10] sm:aspect-[21/11]",
  large: "aspect-[16/10] sm:aspect-[16/9]",
  standard: "aspect-video",
  compact: "aspect-video",
};

export default function ProductShowcaseCard({
  product,
  onDetails,
  priority,
  variant = "standard",
  className,
}: ProductShowcaseCardProps) {
  const comingSoon = isComingSoonCommerce(product);
  const price = formatShowcasePrice(
    product.isPublished ? product.priceCents : null
  );
  const badges = badgesForProduct(product, 2);
  const href = productHref(product);
  const status = getProductVisibility(product);
  const showHoverPanel = variant === "standard" || variant === "compact";
  const isExpanded = variant === "featured" || variant === "large";
  const dna = resolveContentfyDna(product.slug, {
    category: product.category,
    name: product.name,
    typeLabel: product.typeLabel,
  });
  const skills = dnaCompetencyLabels(dna, 2);
  const duration = formatDnaDuration(dna.estimatedHours);

  const commerceLabel = comingSoon
    ? "Em breve"
    : price ?? (status === "available" ? null : visibilityLabel(status));

  return (
    <article
      className={cn(
        "cf-showcase-card group relative",
        VARIANT_SHELL[variant],
        className
      )}
    >
      <Link href={href}>
        <a
          className={cn(
            "block overflow-hidden border border-white/[0.08] bg-[#0f1522]",
            "shadow-[0_18px_48px_rgba(0,0,0,0.42)]",
            "transition-shadow duration-500 ease-out motion-safe:group-hover:shadow-[0_28px_64px_rgba(0,0,0,0.55)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
            isExpanded ? "rounded-2xl sm:rounded-3xl" : "rounded-2xl"
          )}
          aria-label={`${product.name} — ${product.typeLabel}`}
        >
          <div
            className={cn(
              "relative overflow-hidden bg-[#070b12]",
              VARIANT_ASPECT[variant]
            )}
          >
            <div
              className={cn(
                "h-full w-full",
                "transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.05]"
              )}
            >
              <ProductCoverMedia product={product} priority={priority} />
            </div>
            <div
              className={cn(
                "absolute inset-0 pointer-events-none",
                product.imageFit === "contain"
                  ? "bg-gradient-to-t from-black/90 via-black/20 to-transparent"
                  : "bg-gradient-to-t from-black/90 via-black/35 to-transparent"
              )}
            />
            <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 max-w-[85%]">
              {badges.map((id) => (
                <ShowcaseBadgePill key={id} id={id} />
              ))}
            </div>
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0",
                isExpanded ? "p-4 sm:p-5 lg:p-6" : "p-3.5"
              )}
            >
              <p
                className={cn(
                  "text-white/70 mb-0.5",
                  isExpanded ? "text-xs sm:text-sm" : "text-[11px]"
                )}
              >
                {product.typeLabel} · {product.category}
              </p>
              <h3
                className={cn(
                  "font-semibold text-white leading-snug line-clamp-2",
                  isExpanded
                    ? "text-lg sm:text-xl lg:text-2xl tracking-tight"
                    : "text-sm sm:text-base"
                )}
              >
                {product.name}
              </h3>
              {isExpanded && (product.slogan || product.shortDescription) && (
                <p className="mt-2 text-sm text-white/75 line-clamp-2 max-w-xl">
                  {product.slogan || product.shortDescription}
                </p>
              )}
              <p
                className={cn(
                  "mt-1.5 font-medium",
                  comingSoon ? "text-amber-200/95" : "text-orange-300/90",
                  isExpanded ? "text-sm" : "text-xs"
                )}
              >
                {commerceLabel}
              </p>
              {(skills.length > 0 || dna.levelLabel || duration) && (
                <div
                  className={cn(
                    "mt-2 flex flex-wrap gap-1.5",
                    isExpanded ? "" : "hidden sm:flex"
                  )}
                >
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-white/80"
                    >
                      {s}
                    </span>
                  ))}
                  {dna.levelLabel ? (
                    <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70">
                      {dna.levelLabel}
                    </span>
                  ) : null}
                  {duration ? (
                    <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70">
                      {duration}
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </a>
      </Link>

      {/* CTAs sempre visíveis no mobile / variantes grandes — sem depender de hover */}
      {isExpanded && (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button asChild size="sm" className="min-w-[7.5rem]">
            <Link href={href}>Conhecer</Link>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onDetails?.(product)}
          >
            Detalhes
          </Button>
        </div>
      )}

      {/* Hover panel (desktop) — só em variantes de trilho */}
      {showHoverPanel && (
        <div
          className={cn(
            "cf-showcase-card-panel pointer-events-none absolute left-0 right-0 top-[72%] z-20",
            "opacity-0 translate-y-1 scale-[0.98]",
            "transition-all duration-300 ease-out",
            "motion-safe:group-hover:opacity-100 motion-safe:group-hover:translate-y-0 motion-safe:group-hover:scale-100",
            "motion-safe:group-focus-within:opacity-100 motion-safe:group-focus-within:translate-y-0",
            "hidden md:block"
          )}
        >
          <div className="pointer-events-auto rounded-2xl border border-white/10 bg-[#111827]/95 backdrop-blur-xl p-3.5 shadow-[0_20px_48px_rgba(0,0,0,0.55)]">
            <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
              {dna.transformation ||
                product.shortDescription ||
                product.slogan ||
                product.description}
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm" className="flex-1">
                <Link href={href}>Explorar jornada</Link>
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={(e) => {
                  e.preventDefault();
                  onDetails?.(product);
                }}
              >
                Detalhes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile: ações sob o card nas variantes de trilho */}
      {showHoverPanel && (
        <div className="mt-2 flex gap-2 md:hidden">
          <Button asChild size="sm" className="flex-1">
            <Link href={href}>Conhecer</Link>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onDetails?.(product)}
          >
            Detalhes
          </Button>
        </div>
      )}
    </article>
  );
}
