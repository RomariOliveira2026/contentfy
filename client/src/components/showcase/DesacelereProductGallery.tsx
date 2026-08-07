import { useState } from "react";
import { BookOpen, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

type GalleryKind = "image" | "placeholder";

interface GalleryItem {
  id: string;
  label: string;
  kind: GalleryKind;
  src?: string;
  alt: string;
  fit?: "cover" | "contain";
  placeholderTitle: string;
  placeholderSubtitle: string;
}

interface DesacelereProductGalleryProps {
  mockupSrc: string;
  coverSrc: string;
}

const ITEMS = (
  mockupSrc: string,
  coverSrc: string
): GalleryItem[] => [
  {
    id: "mockup",
    label: "Mockup",
    kind: "image",
    src: mockupSrc,
    alt: "Mockup oficial do e-book Desacelere",
    fit: "contain",
    placeholderTitle: "",
    placeholderSubtitle: "",
  },
  {
    id: "cover",
    label: "Capa",
    kind: "image",
    src: coverSrc,
    alt: "Capa frontal Desacelere",
    fit: "cover",
    placeholderTitle: "",
    placeholderSubtitle: "",
  },
  {
    id: "index",
    label: "Índice",
    kind: "placeholder",
    alt: "Prévia do índice do e-book Desacelere",
    placeholderTitle: "Índice",
    placeholderSubtitle: "Estrutura clara para desacelerar com método",
  },
  {
    id: "page",
    label: "Página",
    kind: "placeholder",
    alt: "Prévia de página interna do e-book Desacelere",
    placeholderTitle: "Página interna",
    placeholderSubtitle: "Leitura limpa, foco e presença",
  },
];

/**
 * Galeria premium exclusiva da PDP Desacelere (portfólio).
 * Não altera ProductGallery compartilhado.
 */
export function DesacelereProductGallery({
  mockupSrc,
  coverSrc,
}: DesacelereProductGalleryProps) {
  const items = ITEMS(mockupSrc, coverSrc);
  const [active, setActive] = useState(0);
  const current = items[Math.min(active, items.length - 1)];

  return (
    <div
      className={cn(
        "space-y-3",
        "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-500"
      )}
    >
      <div className="rounded-2xl border border-white/[0.1] bg-[#0c1220] overflow-hidden shadow-[0_22px_52px_rgba(0,0,0,0.42)]">
        <div className="relative aspect-[16/9] max-h-[380px] sm:max-h-[420px] bg-[#070b12]">
          {current.kind === "image" && current.src ? (
            <img
              key={current.id}
              src={current.src}
              alt={current.alt}
              width={1200}
              height={675}
              loading="lazy"
              decoding="async"
              className={cn(
                "h-full w-full motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-300",
                current.fit === "cover"
                  ? "object-cover"
                  : "object-contain p-4 sm:p-6"
              )}
            />
          ) : (
            <PlaceholderPanel
              key={current.id}
              title={current.placeholderTitle}
              subtitle={current.placeholderSubtitle}
              variant={current.id === "index" ? "index" : "page"}
            />
          )}
        </div>
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {items.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setActive(index)}
              aria-label={item.alt}
              aria-current={index === active}
              className={cn(
                "group w-full rounded-xl overflow-hidden border bg-[#0c1220] text-left",
                "transition-[border-color,transform,opacity,background-color] duration-200 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                "motion-safe:hover:-translate-y-0.5",
                index === active
                  ? "border-primary/70 ring-1 ring-primary/35"
                  : "border-white/[0.1] hover:border-white/30"
              )}
            >
              <div className="aspect-[16/10] relative">
                {item.kind === "image" && item.src ? (
                  <img
                    src={item.src}
                    alt=""
                    width={320}
                    height={200}
                    loading="lazy"
                    decoding="async"
                    className={cn(
                      "h-full w-full",
                      item.fit === "cover"
                        ? "object-cover"
                        : "object-contain p-1.5"
                    )}
                  />
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center gap-1.5 px-2 bg-gradient-to-br from-white/[0.04] to-transparent">
                    {item.id === "index" ? (
                      <ListOrdered
                        className="h-5 w-5 text-primary/80"
                        aria-hidden
                      />
                    ) : (
                      <BookOpen
                        className="h-5 w-5 text-primary/80"
                        aria-hidden
                      />
                    )}
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {item.label}
                    </span>
                  </div>
                )}
              </div>
              <p className="px-2.5 py-1.5 text-[11px] text-muted-foreground border-t border-white/[0.06] group-hover:text-foreground/85 transition-colors duration-200">
                {item.label}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PlaceholderPanel({
  title,
  subtitle,
  variant,
}: {
  title: string;
  subtitle: string;
  variant: "index" | "page";
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center p-6 sm:p-10",
        "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-300"
      )}
      role="img"
      aria-label={`${title}. ${subtitle}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(249,115,22,0.12),transparent_55%),radial-gradient(ellipse_at_80%_80%,rgba(245,158,11,0.08),transparent_50%)]" />
      <div className="relative w-full max-w-md rounded-xl border border-white/12 bg-[#0f1522]/90 shadow-[0_16px_40px_rgba(0,0,0,0.35)] overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-owl opacity-80" />
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            {variant === "index" ? (
              <ListOrdered className="h-4 w-4 text-primary" aria-hidden />
            ) : (
              <BookOpen className="h-4 w-4 text-primary" aria-hidden />
            )}
            <p className="text-sm font-medium tracking-tight">{title}</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
          {variant === "index" ? (
            <ul className="space-y-2.5 pt-1">
              {[
                "01 · Respirar e chegar",
                "02 · Reduzir o ruído",
                "03 · Rotina com presença",
                "04 · Clareza no dia a dia",
              ].map((line) => (
                <li
                  key={line}
                  className="flex items-center gap-3 text-xs text-foreground/80"
                >
                  <span className="h-px flex-1 max-w-[2rem] bg-white/15" />
                  {line}
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-2.5 pt-1">
              <div className="h-2 w-[88%] rounded-full bg-white/12" />
              <div className="h-2 w-[96%] rounded-full bg-white/10" />
              <div className="h-2 w-[72%] rounded-full bg-white/10" />
              <div className="h-2 w-[90%] rounded-full bg-white/8" />
              <div className="h-2 w-[64%] rounded-full bg-white/8" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
