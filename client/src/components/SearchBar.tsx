import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

/**
 * Header search — prefers ContentFy Discovery search (title/author/category/tags/keywords/objectives),
 * falls back to classic products.list filter.
 */
export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: discovery, isLoading: discoveryLoading } =
    trpc.discovery.search.useQuery(
      { query, limit: 12 },
      { enabled: query.trim().length > 1, staleTime: 10_000 }
    );

  const { data: products, isLoading: productsLoading } =
    trpc.products.list.useQuery(undefined, {
      enabled: query.trim().length > 0 && !(discovery?.hits?.length),
    });

  const isLoading = discoveryLoading || productsLoading;

  const discoveryHits = discovery?.hits || [];
  const filteredProducts =
    discoveryHits.length > 0
      ? []
      : products?.filter((product) => {
          const searchLower = query.toLowerCase();
          return (
            product.name.toLowerCase().includes(searchLower) ||
            product.description?.toLowerCase().includes(searchLower) ||
            product.category?.name?.toLowerCase().includes(searchLower)
          );
        }) || [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleProductClick = (slug: string, href?: string) => {
    setLocation(href || `/produto/${slug}`);
    setIsOpen(false);
    setQuery("");
  };

  const hasResults = discoveryHits.length > 0 || filteredProducts.length > 0;

  return (
    <div ref={searchRef} className="relative w-full max-w-lg">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por título, autor, tags…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && query && (
        <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Buscando…
            </div>
          ) : hasResults ? (
            <div className="py-2">
              {discoveryHits.map((hit) => (
                <button
                  key={hit.slug}
                  type="button"
                  onClick={() => handleProductClick(hit.slug, hit.href)}
                  className="w-full px-4 py-3 hover:bg-muted transition-colors text-left flex items-start gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{hit.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {[hit.category, hit.author].filter(Boolean).join(" · ")}
                    </p>
                    {hit.matchedOn?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {hit.matchedOn.slice(0, 3).map((m) => (
                          <Badge key={m} variant="secondary" className="text-[10px]">
                            {m}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              ))}
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleProductClick(product.slug)}
                  className="w-full px-4 py-3 hover:bg-muted transition-colors text-left flex items-start gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {product.category?.name}
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-[10px]">
                    {product.type}
                  </Badge>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Nenhum resultado para “{query}”
            </div>
          )}
        </div>
      )}
    </div>
  );
}
