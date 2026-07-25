import { useRef } from "react";
import type { ShowcaseProduct } from "@/lib/showcase";
import ProductShowcaseCard from "./ProductShowcaseCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ShowcaseRailProps {
  title: string;
  subtitle?: string;
  products: ShowcaseProduct[];
  onDetails?: (product: ShowcaseProduct) => void;
}

export default function ShowcaseRail({
  title,
  subtitle,
  products,
  onDetails,
}: ShowcaseRailProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (!products.length) return null;

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };

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
        <div className="hidden sm:flex gap-1.5">
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-9 w-9 rounded-full"
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
            aria-label={`Próximo: ${title}`}
            onClick={() => scrollBy(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          className="cf-showcase-rail flex gap-4 overflow-x-auto px-4 sm:px-6 lg:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] pb-8 pt-2 snap-x snap-mandatory scroll-smooth"
        >
          {products.map((product, index) => (
            <div key={product.slug} className="snap-start">
              <ProductShowcaseCard
                product={product}
                onDetails={onDetails}
                priority={index < 2}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
