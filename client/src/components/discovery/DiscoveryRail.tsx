import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DiscoveryCard, type DiscoveryCardData } from "./DiscoveryCard";

interface DiscoveryRailProps {
  title: string;
  subtitle?: string;
  items: DiscoveryCardData[];
  onFavoriteToggle?: (slug: string) => void;
  favorites?: Set<string> | string[];
  className?: string;
}

export function DiscoveryRail({
  title,
  subtitle,
  items,
  onFavoriteToggle,
  favorites,
  className,
}: DiscoveryRailProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const favSet =
    favorites instanceof Set
      ? favorites
      : new Set(favorites || []);

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < max - 8);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [items, update]);

  if (!items.length) return null;

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir * Math.min(el.clientWidth * 0.85, 640),
      behavior: "smooth",
    });
  };

  return (
    <section className={cn("relative", className)} aria-label={title}>
      <div className="container flex items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className="hidden sm:flex gap-1.5">
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-9 w-9 rounded-full"
            disabled={!canPrev}
            aria-label={`Anterior: ${title}`}
            onClick={() => scrollBy(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-9 w-9 rounded-full"
            disabled={!canNext}
            aria-label={`Próximo: ${title}`}
            onClick={() => scrollBy(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div
        ref={scrollerRef}
        className={cn(
          "flex gap-4 overflow-x-auto px-4 sm:px-6",
          "lg:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]",
          "pb-8 pt-2 snap-x snap-mandatory scroll-smooth"
        )}
      >
        {items.map((item, i) => (
          <DiscoveryCard
            key={`${item.slug}-${i}`}
            product={item}
            priority={i < 2}
            isFavorite={favSet.has(item.slug)}
            onFavoriteToggle={onFavoriteToggle}
          />
        ))}
      </div>
    </section>
  );
}

export function RecommendationRail(props: DiscoveryRailProps) {
  return <DiscoveryRail {...props} />;
}

export function TrendingRail(props: DiscoveryRailProps) {
  return <DiscoveryRail {...props} />;
}

export function CategoryShelf(props: DiscoveryRailProps) {
  return <DiscoveryRail {...props} />;
}
