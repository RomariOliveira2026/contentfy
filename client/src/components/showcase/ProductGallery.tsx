import { useState } from "react";
import type { ShowcaseGalleryImage } from "@/lib/showcase";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: ShowcaseGalleryImage[];
  productName: string;
  /** Compacta a área principal — melhor densidade acima da dobra. */
  compact?: boolean;
}

export default function ProductGallery({
  images,
  productName,
  compact = false,
}: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  if (!images.length) return null;

  const current = images[Math.min(active, images.length - 1)];
  const fit = current.fit || "contain";

  return (
    <section aria-label={`Galeria de ${productName}`}>
      <div
        className={cn(
          "rounded-2xl border border-white/[0.08] bg-[#0c1220] overflow-hidden",
          "shadow-[0_20px_48px_rgba(0,0,0,0.4)]"
        )}
      >
        <div
          className={cn(
            "relative bg-[#070b12]",
            compact
              ? "aspect-[16/9] max-h-[360px] sm:max-h-[400px]"
              : "aspect-[16/10] sm:aspect-[21/12]"
          )}
        >
          <img
            key={current.src}
            src={current.src}
            srcSet={current.srcSet}
            sizes={current.sizes}
            alt={current.alt}
            width={1200}
            height={compact ? 675 : 720}
            loading="lazy"
            decoding="async"
            className={cn(
              "h-full w-full",
              fit === "contain"
                ? "object-contain p-3 sm:p-5"
                : "object-cover"
            )}
          />
        </div>
      </div>

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {images.map((img, index) => (
            <li key={`${img.src}-${index}`}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={img.alt}
                aria-current={index === active}
                className={cn(
                  "w-full aspect-[16/10] rounded-xl overflow-hidden border bg-[#0c1220]",
                  "transition-[border-color,transform,opacity] duration-200 ease-out",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                  "motion-safe:hover:-translate-y-0.5",
                  index === active
                    ? "border-primary/70 ring-1 ring-primary/40"
                    : "border-white/[0.08] hover:border-white/25"
                )}
              >
                <img
                  src={img.src}
                  alt=""
                  width={320}
                  height={200}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain p-1.5"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
