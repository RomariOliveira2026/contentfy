import { useState } from "react";
import type { ShowcaseGalleryImage } from "@/lib/showcase";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: ShowcaseGalleryImage[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  if (!images.length) return null;

  const current = images[Math.min(active, images.length - 1)];
  const fit = current.fit || "contain";

  return (
    <section aria-label={`Galeria de ${productName}`}>
      <h2 className="text-xl font-semibold mb-4">Galeria do produto</h2>

      <div className="rounded-2xl border border-white/[0.08] bg-[#0c1220] overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.45)]">
        <div className="relative aspect-[16/10] sm:aspect-[21/12] bg-[#070b12]">
          <img
            key={current.src}
            src={current.src}
            srcSet={current.srcSet}
            sizes={current.sizes}
            alt={current.alt}
            loading="lazy"
            decoding="async"
            className={cn(
              "h-full w-full",
              fit === "contain" ? "object-contain p-4 sm:p-6" : "object-cover"
            )}
          />
        </div>
      </div>

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
          {images.map((img, index) => (
            <li key={`${img.src}-${index}`}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={img.alt}
                aria-current={index === active}
                className={cn(
                  "w-full aspect-video rounded-xl overflow-hidden border bg-[#0c1220] transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                  index === active
                    ? "border-primary/70 ring-1 ring-primary/40"
                    : "border-white/[0.08] hover:border-white/25"
                )}
              >
                <img
                  src={img.src}
                  alt=""
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
