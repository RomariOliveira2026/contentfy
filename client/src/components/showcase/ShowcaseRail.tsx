import { useCallback, useEffect, useRef, useState } from "react";
import type { ShowcaseProduct } from "@/lib/showcase";
import type { ProductCardVariant } from "@/lib/showcase";
import ProductShowcaseCard from "./ProductShowcaseCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShowcaseRailProps {
  title: string;
  subtitle?: string;
  products: ShowcaseProduct[];
  onDetails?: (product: ShowcaseProduct) => void;
  cardVariant?: ProductCardVariant;
}

export default function ShowcaseRail({
  title,
  subtitle,
  products,
  onDetails,
  cardVariant = "standard",
}: ShowcaseRailProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const overflow = maxScroll > 8;
    setHasOverflow(overflow);
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < maxScroll - 8);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });

    const ro = new ResizeObserver(() => updateScrollState());
    ro.observe(el);
    // Recalcular quando imagens carregarem
    const imgs = el.querySelectorAll("img");
    imgs.forEach((img) => img.addEventListener("load", updateScrollState));

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
      imgs.forEach((img) => img.removeEventListener("load", updateScrollState));
    };
  }, [products, cardVariant, updateScrollState]);

  if (!products.length) return null;

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir * Math.min(el.clientWidth * 0.8, 640),
      behavior: "smooth",
    });
  };

  // Setas só com overflow real (1–2 itens totalmente visíveis → ocultas).
  const showArrows = hasOverflow;

  return (
    <section className="relative" aria-label={title}>
      <div className="container flex items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {showArrows && (
          <div className="hidden sm:flex gap-1.5">
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-9 w-9 rounded-full"
              aria-label={`Anterior: ${title}`}
              disabled={!canPrev}
              onClick={() => scrollBy(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-9 w-9 rounded-full"
              aria-label={`Próximo: ${title}`}
              disabled={!canNext}
              onClick={() => scrollBy(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          className={cn(
            "cf-showcase-rail flex gap-4 overflow-x-auto px-4 sm:px-6",
            "lg:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]",
            "pb-8 pt-2 snap-x snap-mandatory scroll-smooth"
          )}
        >
          {products.map((product, index) => (
            <div key={product.slug} className="snap-start">
              <ProductShowcaseCard
                product={product}
                onDetails={onDetails}
                priority={index < 2}
                variant={cardVariant}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
