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

/** Badges seguros — nunca emite "Mais vendido" sem dados reais. */
export function badgesForProduct(product: ShowcaseProduct): BadgeId[] {
  const list: BadgeId[] = [];
  if (product.isLaunch) list.push("launch");
  if (product.isFeatured) list.push("featured");
  if (product.isNew) list.push("new");
  if (product.typeLabel.toLowerCase() === "manual") list.push("manual");
  else if (product.type === "ebook") list.push("ebook");
  else if (product.type === "course") list.push("course");
  else if (product.type === "audiobook") list.push("audiobook");
  return list;
}
