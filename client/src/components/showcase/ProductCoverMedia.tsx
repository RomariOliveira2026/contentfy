import type { ShowcaseProduct } from "@/lib/showcase";
import { resolveProductImage } from "@/lib/showcase";
import { cn } from "@/lib/utils";
import { BookMarked, BriefcaseBusiness } from "lucide-react";

interface ProductCoverMediaProps {
  product: ShowcaseProduct;
  priority?: boolean;
  className?: string;
  /** object-fit da imagem real */
  objectPosition?: string;
}

/**
 * Imagem do produto com prioridade landscape → hero → cover → fallback premium.
 * Fallback marcado internamente (data-fallback) — não inventa capa oficial.
 */
export default function ProductCoverMedia({
  product,
  priority,
  className,
  objectPosition = "center",
}: ProductCoverMediaProps) {
  const image = resolveProductImage(product);

  if (image) {
    return (
      <img
        src={image}
        alt=""
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        data-fallback="false"
        className={cn("h-full w-full object-cover", className)}
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
      {/* Textura discreta */}
      <div
        className="absolute inset-0 opacity-[0.14] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)",
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
