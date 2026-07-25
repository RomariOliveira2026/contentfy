import { Badge } from "@/components/ui/badge";
import type { ShowcaseBadge as BadgeId, ShowcaseProduct } from "@/lib/showcase";
import { cn } from "@/lib/utils";

const LABELS: Record<BadgeId, string> = {
  launch: "Lançamento",
  featured: "Em destaque",
  new: "Novo",
  bestseller: "Mais vendido",
  ebook: "E-book",
  manual: "Manual",
  course: "Curso",
  audiobook: "Audiobook",
};

const STYLES: Partial<Record<BadgeId, string>> = {
  launch: "bg-primary/90 text-primary-foreground border-0",
  featured: "bg-amber-500/20 text-amber-200 border-amber-500/30",
  new: "bg-sky-500/20 text-sky-200 border-sky-500/30",
  bestseller: "bg-emerald-500/20 text-emerald-200 border-emerald-500/30",
};

const MAX_BADGES = 2;

/** Prioridade: Lançamento → Em destaque → Novo → Tipo. */
const PRIORITY: BadgeId[] = [
  "launch",
  "featured",
  "new",
  "manual",
  "ebook",
  "course",
  "audiobook",
  "bestseller",
];

export function ShowcaseBadgePill({
  id,
  className,
}: {
  id: BadgeId;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] uppercase tracking-wider font-semibold",
        STYLES[id],
        className
      )}
    >
      {LABELS[id]}
    </Badge>
  );
}

/**
 * Badges seguros — máx. 2, por prioridade.
 * Nunca emite "Mais vendido" sem dados reais.
 * Evita poluição (Lançamento + Destaque + Novo + tipo todos juntos).
 */
export function badgesForProduct(
  product: ShowcaseProduct,
  max = MAX_BADGES
): BadgeId[] {
  const candidates: BadgeId[] = [];

  if (product.isLaunch) candidates.push("launch");
  if (product.isFeatured) candidates.push("featured");
  if (product.isNew) candidates.push("new");

  if (product.typeLabel.toLowerCase() === "manual") candidates.push("manual");
  else if (product.type === "ebook") candidates.push("ebook");
  else if (product.type === "course") candidates.push("course");
  else if (product.type === "audiobook") candidates.push("audiobook");

  // "Mais vendido" só com flag futura real — não emitir por enquanto.

  const ranked = PRIORITY.filter((id) => candidates.includes(id));
  return ranked.slice(0, max);
}
