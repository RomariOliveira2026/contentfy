import { Link } from "wouter";
import type { ShowcaseProduct } from "@/lib/showcase";
import {
  formatShowcasePrice,
  isComingSoonCommerce,
  productHref,
  resolveProductImage,
} from "@/lib/showcase";
import { badgesForProduct, ShowcaseBadgePill } from "./ShowcaseBadge";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface ShowcaseHeroProps {
  product: ShowcaseProduct;
  onDetails?: (product: ShowcaseProduct) => void;
}

export default function ShowcaseHero({ product, onDetails }: ShowcaseHeroProps) {
  const image = resolveProductImage(product);
  const comingSoon = isComingSoonCommerce(product);
  const price = formatShowcasePrice(
    product.isPublished ? product.priceCents : null
  );
  const badges = badgesForProduct(product, 2);
  const href = product.salesPageUrl || productHref(product);

  return (
    <section
      className="relative min-h-[68vh] lg:min-h-[76vh] overflow-hidden rounded-none lg:rounded-[1.5rem] lg:mx-6 lg:mt-3 border-y lg:border border-white/[0.06]"
      aria-labelledby="showcase-hero-title"
    >
      {image ? (
        <img
          src={image}
          srcSet={product.imageSrcSet}
          sizes={product.imageSizes || "100vw"}
          alt=""
          fetchPriority="high"
          decoding="async"
          data-fallback="false"
          className={
            product.imageFit === "contain"
              ? "absolute inset-0 h-full w-full object-contain object-center p-6 sm:p-10 bg-[#070b12]"
              : "absolute inset-0 h-full w-full object-cover object-[center_30%] sm:object-center"
          }
        />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#1a2332] via-[#0c1220] to-[#070b12]"
          data-fallback="true"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#070b12] via-[#070b12]/88 to-[#070b12]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070b12] via-transparent to-[#070b12]/45" />

      <div className="relative z-10 container flex min-h-[68vh] lg:min-h-[76vh] items-end lg:items-center pt-24 pb-12 sm:pt-28 lg:py-16">
        <div className="max-w-xl lg:max-w-2xl">
          <div className="flex flex-wrap gap-2 mb-4">
            {badges.map((id) => (
              <ShowcaseBadgePill key={id} id={id} />
            ))}
          </div>

          <p className="text-xs sm:text-sm text-orange-300/90 mb-2 font-medium">
            {product.typeLabel} · {product.category}
          </p>
          <h1
            id="showcase-hero-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
          >
            {product.name}
          </h1>
          {product.slogan && (
            <p className="text-lg sm:text-xl text-white/92 font-medium mb-3">
              {product.slogan}
            </p>
          )}
          <p className="text-sm sm:text-base text-white/75 leading-relaxed mb-5 max-w-lg line-clamp-4 sm:line-clamp-none">
            {product.shortDescription || product.description}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/60 mb-6">
            {product.level && <span>Nível: {product.level}</span>}
            {product.durationOrPages && <span>{product.durationOrPages}</span>}
            {price && !comingSoon && (
              <span className="text-orange-300 font-semibold">{price}</span>
            )}
            {comingSoon && (
              <span className="text-amber-200/95 font-medium">Em breve</span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href={href}>Conhecer o produto</Link>
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-white/20 bg-black/20 text-white hover:bg-white/10"
              onClick={() => onDetails?.(product)}
            >
              Ver detalhes
            </Button>
            {product.previewUrl && (
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="w-full sm:w-auto text-white hover:bg-white/10"
              >
                <a href={product.previewUrl}>
                  <Play className="h-4 w-4 mr-2" />
                  Prévia
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
