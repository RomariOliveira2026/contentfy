import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import type { DiscoveryCardData } from "./DiscoveryCard";

interface DiscoveryHeroProps {
  product: DiscoveryCardData | null;
}

export function DiscoveryHero({ product }: DiscoveryHeroProps) {
  if (!product) return null;
  const image =
    product.heroImage || product.coverImage || "/brand/png/symbol.png";

  return (
    <section
      className="relative overflow-hidden border-b border-border/40"
      aria-label="Destaque Discovery"
    >
      <div className="absolute inset-0">
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover scale-105 opacity-40"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
      </div>
      <div className="relative container py-16 sm:py-24 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
          ContentFy Discovery
        </p>
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-foreground">
          {product.name}
        </h1>
        {product.category && (
          <p className="mt-3 text-muted-foreground max-w-xl">
            {product.category}
            {product.author ? ` · ${product.author}` : ""}
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href={product.href}>Explorar</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/explorar#filtros">Ver catálogo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
