import { useState } from "react";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import {
  BookOpen,
  Headphones,
  GraduationCap,
  Smartphone,
  ArrowRight,
  Search,
  Filter,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState("recent");

  const { data: products = [], isLoading } = trpc.products.list.useQuery();
  const { data: categories = [] } = trpc.products.listCategories.useQuery();

  const productTypes = [
    { value: "course", label: "Cursos Online", icon: GraduationCap },
    { value: "ebook", label: "E-books", icon: BookOpen },
    { value: "audiobook", label: "Audiobooks", icon: Headphones },
    { value: "app", label: "Apps", icon: Smartphone },
  ];

  // Filtrar e ordenar produtos
  const filteredProducts = products
    ?.filter((product) => {
      // Filtro de busca
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Filtro de tipo
      if (selectedTypes.length > 0 && !selectedTypes.includes(product.type)) {
        return false;
      }

      // Filtro de categoria
      if (selectedCategory && product.categoryId?.toString() !== selectedCategory) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "recent":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const getProductIcon = (type: string) => {
    const typeConfig = productTypes.find((t) => t.value === type);
    return typeConfig ? typeConfig.icon : GraduationCap;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="cf-page-main">
        <div className="container">
          <PageHeader
            title="Catálogo de Produtos"
            subtitle="Explore nossa coleção completa de infoprodutos"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Filtros */}
            <aside className="lg:col-span-1">
              <Card className="cf-card-premium sticky top-24">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5" />
                    <h2 className="font-semibold text-lg">Filtros</h2>
                  </div>

                  {/* Busca */}
                  <div className="mb-6">
                    <Label htmlFor="search" className="mb-2 block">
                      Buscar
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Nome do produto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Categoria */}
                  <div className="mb-6">
                    <Label htmlFor="category" className="mb-2 block">
                      Categoria
                    </Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Todas as categorias" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tipo de Produto */}
                  <div className="mb-6">
                    <Label className="mb-3 block">Tipo de Produto</Label>
                    <div className="space-y-3">
                      {productTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <div key={type.value} className="flex items-center gap-2">
                            <Checkbox
                              id={type.value}
                              checked={selectedTypes.includes(type.value)}
                              onCheckedChange={() => handleTypeToggle(type.value)}
                            />
                            <label
                              htmlFor={type.value}
                              className="flex items-center gap-2 cursor-pointer text-sm"
                            >
                              <Icon className="w-4 h-4" />
                              {type.label}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ordenação */}
                  <div>
                    <Label htmlFor="sort" className="mb-2 block">
                      Ordenar por
                    </Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger id="sort">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Mais Recentes</SelectItem>
                        <SelectItem value="name">Nome (A-Z)</SelectItem>
                        <SelectItem value="price-asc">Menor Preço</SelectItem>
                        <SelectItem value="price-desc">Maior Preço</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Limpar Filtros */}
                  {(searchTerm || selectedTypes.length > 0 || selectedCategory) && (
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedTypes([]);
                        setSelectedCategory("");
                      }}
                    >
                      Limpar Filtros
                    </Button>
                  )}
                </CardContent>
              </Card>
            </aside>

            {/* Grid de Produtos */}
            <div className="lg:col-span-3">
              {/* Contador de Resultados */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-muted-foreground">
                  {isLoading
                    ? "Carregando..."
                    : `${filteredProducts?.length || 0} produto(s) encontrado(s)`}
                </p>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i}>
                      <Skeleton className="aspect-video w-full" />
                      <CardContent className="p-6">
                        <Skeleton className="h-6 w-20 mb-3" />
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-4" />
                        <Skeleton className="h-10 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && filteredProducts?.length === 0 && (
                <Card className="cf-card-premium">
                  <CardContent className="py-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-muted mb-4">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Nenhum produto encontrado
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Tente ajustar os filtros ou fazer uma nova busca
                    </p>
                    <Button
                      variant="outline"
                      className="rounded-lg"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedTypes([]);
                      }}
                    >
                      Limpar Filtros
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Products Grid */}
              {!isLoading && filteredProducts && filteredProducts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => {
                    const Icon = getProductIcon(product.type);
                    return (
                      <Link key={product.id} href={`/products/${product.slug}`}>
                        <Card className="cf-card-product group">
                          <div className="cf-product-cover">
                            {product.coverImage ? (
                              <img src={product.coverImage} alt={product.name} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Icon className="w-16 h-16 text-white/50" />
                              </div>
                            )}
                            <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                              <Badge className="bg-black/40 text-white border-0 backdrop-blur-sm font-medium">
                                {(product as { guaranteeDays?: number }).guaranteeDays || 30} dias
                              </Badge>
                              {product.type === "app" && (
                                <Badge className="bg-primary/90 text-white border-0 font-medium">
                                  Plano Grátis
                                </Badge>
                              )}
                            </div>
                          </div>
                          <CardContent className="cf-card-product-body">
                            <Badge variant="secondary" className="mb-3 cf-badge-type w-fit">
                              {product.type === "course" && "Curso"}
                              {product.type === "ebook" && "E-book"}
                              {product.type === "audiobook" && "Audiobook"}
                              {product.type === "app" && "App"}
                            </Badge>
                            <h3 className="text-lg font-semibold mb-2 line-clamp-2 min-h-[3.5rem]">
                              {product.name}
                            </h3>
                            {product.description && (
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem] leading-relaxed">
                                {product.description}
                              </p>
                            )}
                            <div className="cf-card-product-footer">
                              <div>
                                {product.type === "app" ? (
                                  <>
                                    <p className="text-lg font-bold text-primary">
                                      Grátis para começar
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Planos a partir de R$ 19,90/mês
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <p className="text-2xl font-bold">
                                      R$ {(product.price / 100).toFixed(2)}
                                    </p>
                                    {product.isRecurring && (
                                      <p className="text-xs text-muted-foreground">
                                        /
                                        {product.recurringInterval === "month"
                                          ? "mês"
                                          : "ano"}
                                      </p>
                                    )}
                                  </>
                                )}
                              </div>
                              <Button size="sm" className="shrink-0">
                                Ver Mais
                                <ArrowRight className="ml-1 w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
