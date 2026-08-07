import { Link } from "wouter";
import { PlayCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export interface ContinueLearningData {
  productSlug: string;
  productId?: number;
  productName: string;
  lastLessonTitle?: string;
  lastModuleTitle?: string;
  progressPercent: number;
  remainingLabel?: string;
  href: string;
  coverImage?: string | null;
}

interface ContinueLearningProps {
  items: ContinueLearningData[];
}

export function ContinueLearning({ items }: ContinueLearningProps) {
  if (!items.length) return null;

  return (
    <section className="container py-8" aria-label="Continue Evoluindo">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
        Jornada
      </p>
      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-1">
        Continue Evoluindo
      </h2>
      <p className="text-sm text-muted-foreground mb-5">
        Retome o fio — o próximo passo já está pronto
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link key={item.productSlug} href={item.href}>
            <a className="flex gap-3 rounded-xl border border-border/50 bg-card/40 p-3 hover:bg-card/70 transition-colors">
              <div className="h-16 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                {item.coverImage ? (
                  <img
                    src={item.coverImage}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <PlayCircle className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium line-clamp-1">
                  {item.productName}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {[item.lastModuleTitle, item.lastLessonTitle]
                    .filter(Boolean)
                    .join(" · ") || "Continuar"}
                </p>
                <Progress value={item.progressPercent} className="h-1.5 mt-2" />
                <p className="text-[10px] text-muted-foreground mt-1">
                  {item.remainingLabel || `${item.progressPercent}%`}
                </p>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
}
