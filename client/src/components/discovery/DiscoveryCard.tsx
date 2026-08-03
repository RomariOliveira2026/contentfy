import { Link } from "wouter";
import { Heart, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

  return (
    <article
      className={cn(
        "group relative w-[11.5rem] sm:w-[14rem] shrink-0 snap-start",
        className
      )}
    >
      <Link href={product.href}>
        <a className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg overflow-hidden">
          <div className="aspect-[3/4] bg-muted/40 overflow-hidden rounded-lg border border-border/40">
            <img
              src={image}
              alt={product.name}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
          <div className="mt-2.5 space-y-0.5 px-0.5">
            {product.typeLabel && (
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {product.typeLabel}
              </p>
            )}
            <h3 className="text-sm font-medium leading-snug line-clamp-2 text-foreground">
              {product.name}
            </h3>
            {product.author && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {product.author}
              </p>
            )}
            {typeof product.progressPercent === "number" && (
              <div className="pt-1">
                <div className="h-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${product.progressPercent}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                  <PlayCircle className="h-3 w-3" />
                  {product.progressPercent}%
                </p>
              </div>
            )}
          </div>
        </a>
      </Link>
      {onFavoriteToggle && (
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-90"
          aria-label={isFavorite ? "Remover da Minha Lista" : "Salvar na Minha Lista"}
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
