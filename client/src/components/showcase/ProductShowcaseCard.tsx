import { Link } from "wouter";
import type { ShowcaseProduct } from "@/lib/showcase";
import { formatShowcasePrice, productHref } from "@/lib/showcase";
import { badgesForProduct, ShowcaseBadgePill } from "./ShowcaseBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpen, Sparkles } from "lucide-react";

interface ProductShowcaseCardProps {
  product: ShowcaseProduct;
  onDetails?: (product: ShowcaseProduct) => void;
  priority?: boolean;
  className?: string;
}

export default function ProductShowcaseCard({
  product,
  onDetails,
  priority,
  className,
}: ProductShowcaseCardProps) {
  const price = formatShowcasePrice(
    product.isPublished ? product.priceCents : null
  );
  const image =
    product.landscapeImage || product.coverImage || product.heroImage;
  const badges = badgesForProduct(product).slice(0, 2);
  const href = productHref(product);

  return (
    <article
      className={cn(
        "cf-showcase-card group relative w-[260px] sm:w-[280px] shrink-0",
        className
      )}
    >
      <Link href={href}>
        <a
          className="block rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0f1522] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          aria-label={`${product.name} — ${product.typeLabel}`}
        >
          <div className="relative aspect-video overflow-hidden bg-[#111827]">
            {image ? (
              <img
                src={image}
                alt=""
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#1a2332] to-[#0c1220]">
                <BookOpen className="h-10 w-10 text-white/25" aria-hidden />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
              {badges.map((id) => (
                <ShowcaseBadgePill key={id} id={id} />
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3.5">
              <p className="text-[11px] text-white/70 mb-0.5">
                {product.typeLabel} · {product.category}
              </p>
              <h3 className="text-sm sm:text-base font-semibold text-white leading-snug line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs text-orange-300/90 mt-1 font-medium">
                {price ?? (product.isPublished ? null : "Em breve")}
              </p>
            </div>
          </div>
        </a>
      </Link>

      {/* Hover panel (desktop) — absolute, no layout shift */}
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
            {product.shortDescription || product.slogan || product.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-3 text-[11px] text-white/60">
            {product.level && <span>{product.level}</span>}
            {product.durationOrPages && <span>· {product.durationOrPages}</span>}
            {product.isNew && (
              <span className="inline-flex items-center gap-1 text-sky-300">
                <Sparkles className="h-3 w-3" /> Novo
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Link href={href}>
              <Button size="sm" className="flex-1 w-full">
                Conhecer
              </Button>
            </Link>
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
    </article>
  );
}
