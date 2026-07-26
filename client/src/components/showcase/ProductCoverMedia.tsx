import type { ShowcaseProduct } from "@/lib/showcase";
import { resolveProductImage } from "@/lib/showcase";
import { cn } from "@/lib/utils";
import { BookMarked, BriefcaseBusiness } from "lucide-react";

interface ProductCoverMediaProps {
  product: ShowcaseProduct;
  priority?: boolean;
  className?: string;
  objectPosition?: string;
  /** Override do fit do produto. */
  fit?: "cover" | "contain";
  /**
   * Qual campo priorizar.
   * - landscape: padrão da vitrine (mockup)
   * - cover: capa na página do produto
   */
  prefer?: "landscape" | "cover" | "hero";
}

/**
 * Imagem do produto com prioridade landscape → hero → cover → fallback premium.
 * Suporta srcSet responsivo e object-contain para mockups sem corte.
 */
export default function ProductCoverMedia({
  product,
  priority,
  className,
  objectPosition = "center",
  fit,
  prefer = "landscape",
}: ProductCoverMediaProps) {
  const image =
    prefer === "cover"
      ? product.coverImage || resolveProductImage(product)
      : prefer === "hero"
        ? product.heroImage || resolveProductImage(product)
        : resolveProductImage(product);

  const objectFit = fit || product.imageFit || "cover";
  const useLandscapeSrcSet = prefer === "landscape" || prefer === "hero";

  if (image) {
    return (
      <img
        src={image}
        srcSet={useLandscapeSrcSet ? product.imageSrcSet : undefined}
        sizes={useLandscapeSrcSet ? product.imageSizes : undefined}
        alt=""
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        data-fallback="false"
        className={cn(
          "h-full w-full",
          objectFit === "contain" ? "object-contain p-2 sm:p-3" : "object-cover",
          className
        )}
        style={{ objectPosition }}
      />
    );
  }

  const isSales =
    product.category.toLowerCase().includes("venda") ||
    product.slug.includes("representante") ||
    product.typeLabel.toLowerCase() === "manual";

  const Icon = isSales ? BriefcaseBusiness : BookMarked;

  return (
    <div
      data-fallback="true"
      role="img"
      aria-label={`Arte provisória: ${product.name}`}
      className={cn(
        "relative h-full w-full overflow-hidden",
        "bg-[radial-gradient(120%_80%_at_10%_0%,rgba(249,115,22,0.28),transparent_55%),linear-gradient(145deg,#1a2332_0%,#0c1220_48%,#070b12_100%)]",
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-[0.14] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
          <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-orange-300/90" aria-hidden />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/50 mb-1.5">
            {product.typeLabel}
          </p>
          <p className="text-base sm:text-lg font-semibold text-white leading-snug line-clamp-3 max-w-[16rem]">
            {product.name}
          </p>
        </div>
      </div>
    </div>
  );
}
