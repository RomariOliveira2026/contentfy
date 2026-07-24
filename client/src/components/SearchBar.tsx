import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: products, isLoading } = trpc.products.list.useQuery(undefined, {
    enabled: query.length > 0,
  });

  // Filtrar produtos baseado na busca
  const filteredProducts = products?.filter((product) => {
    const searchLower = query.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower) ||
      product.category?.name?.toLowerCase().includes(searchLower)
    );
  }) || [];

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fechar ao pressionar ESC
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

  const handleProductClick = (slug: string) => {
    setLocation(`/products/${slug}`);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-lg">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar produtos..."
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

      {/* Resultados da busca */}
      {isOpen && query && (
        <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Buscando...
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="py-2">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product.slug)}
                  className="w-full px-4 py-3 hover:bg-muted transition-colors text-left flex items-start gap-3"
                >
                  {product.thumbnailImage ? (
                    <img
                      src={product.thumbnailImage}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {product.category && (
                        <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-0 text-xs">
                          {product.category.name}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {product.type === "course" && "Curso"}
                        {product.type === "ebook" && "E-book"}
                        {product.type === "audiobook" && "Audiobook"}
                        {product.type === "app" && "App"}
                      </Badge>
                    </div>
                    <p className="font-medium text-sm line-clamp-1">
                      {product.name}
                    </p>
                    {product.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {product.description}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-primary mt-1">
                      R$ {(product.price / 100).toFixed(2)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Nenhum produto encontrado
            </div>
          )}
        </div>
      )}
    </div>
  );
}
