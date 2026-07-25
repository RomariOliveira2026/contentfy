import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ShowcaseFilters, ShowcaseProductType } from "@/lib/showcase";
import { Search } from "lucide-react";

const TYPES: { value: ShowcaseProductType; label: string }[] = [
  { value: "course", label: "Cursos" },
  { value: "ebook", label: "E-books / Manuais" },
  { value: "audiobook", label: "Audiobooks" },
  { value: "app", label: "Apps" },
];

interface ShowcaseDiscoveryBarProps {
  filters: ShowcaseFilters;
  onChange: (next: ShowcaseFilters) => void;
  categories: string[];
  levels: string[];
}

export default function ShowcaseDiscoveryBar({
  filters,
  onChange,
  categories,
  levels,
}: ShowcaseDiscoveryBarProps) {
  const patch = (partial: Partial<ShowcaseFilters>) =>
    onChange({ ...filters, ...partial });

  return (
    <section
      id="filtros"
      className="container scroll-mt-28"
      aria-label="Busca e filtros da vitrine"
    >
      <div className="rounded-2xl border border-white/[0.08] bg-[#0f1522]/90 p-4 sm:p-5 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={filters.query}
            onChange={(e) => patch({ query: e.target.value })}
            placeholder="Buscar por nome ou palavra-chave..."
            className="pl-10 h-11 bg-[#0c1220] border-white/10"
            aria-label="Buscar produtos"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Tipo</Label>
            <Select
              value={filters.types[0] || "all"}
              onValueChange={(v) =>
                patch({ types: v === "all" ? [] : [v as ShowcaseProductType] })
              }
            >
              <SelectTrigger className="bg-[#0c1220] border-white/10">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Categoria</Label>
            <Select
              value={filters.category || "all"}
              onValueChange={(v) =>
                patch({ category: v === "all" ? "" : v })
              }
            >
              <SelectTrigger className="bg-[#0c1220] border-white/10">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Preço</Label>
            <Select
              value={filters.price}
              onValueChange={(v) =>
                patch({ price: v as ShowcaseFilters["price"] })
              }
            >
              <SelectTrigger className="bg-[#0c1220] border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="paid">Com preço publicado</SelectItem>
                <SelectItem value="free">Gratuito</SelectItem>
                <SelectItem value="unpriced">Em preparação</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Nível</Label>
            <Select
              value={filters.level || "all"}
              onValueChange={(v) => patch({ level: v === "all" ? "" : v })}
              disabled={!levels.length}
            >
              <SelectTrigger className="bg-[#0c1220] border-white/10">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {levels.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Ordenar</Label>
            <Select
              value={filters.sort}
              onValueChange={(v) =>
                patch({ sort: v as ShowcaseFilters["sort"] })
              }
            >
              <SelectTrigger className="bg-[#0c1220] border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="launch">Lançamento</SelectItem>
                <SelectItem value="popularity">Popularidade</SelectItem>
                <SelectItem value="price-asc">Menor preço</SelectItem>
                <SelectItem value="price-desc">Maior preço</SelectItem>
                <SelectItem value="name">Nome</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </section>
  );
}
