import { useState } from "react";
import { Link } from "wouter";
import MembersLayout from "@/components/MembersLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
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

export default function MyProducts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const { data: products, isLoading } = trpc.members.myProducts.useQuery();

  const getProductIcon = (type: string) => {
    switch (type) {
      case "course":
        return GraduationCap;
      case "ebook":
        return BookOpen;
      case "audiobook":
        return Headphones;
      case "app":
        return Smartphone;
      default:
        return BookOpen;
    }
  };

  const getProductTypeLabel = (type: string) => {
    switch (type) {
      case "course":
        return "Curso";
      case "ebook":
        return "E-book";
      case "audiobook":
        return "Audiobook";
      case "app":
        return "App";
      default:
        return type;
    }
  };

  // Filtrar produtos
  const filteredProducts = products?.filter((item) => {
    const matchesSearch = item.product?.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === "all" || item.product?.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <MembersLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Meus Produtos</h1>
          <p className="text-muted-foreground">
            Acesse todos os seus cursos, e-books, audiobooks e apps
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter by Type */}
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="course">Cursos</SelectItem>
                  <SelectItem value="ebook">E-books</SelectItem>
                  <SelectItem value="audiobook">Audiobooks</SelectItem>
                  <SelectItem value="app">Apps</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-40 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((item) => {
              const Icon = getProductIcon(item.product?.type || "");
              return (
                <Card
                  key={item.userProduct.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary">
                        {getProductTypeLabel(item.product?.type || "")}
                      </Badge>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2">
                      {item.product?.name}
                    </CardTitle>
                    {item.product?.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                        {item.product.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    {item.product?.type === "course" && (
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progresso</span>
                          <span className="font-medium">{item.progress}%</span>
                        </div>
                        <Progress value={item.progress} />
                      </div>
                    )}

                    <div className="text-sm text-muted-foreground mb-4">
                      Adquirido em{" "}
                      {new Date(item.userProduct.accessGrantedAt).toLocaleDateString(
                        "pt-BR"
                      )}
                    </div>

                    {item.product?.type === "app" && item.product?.salesPageUrl ? (
                      <Button 
                        className="w-full" 
                        onClick={() => window.open(item.product?.salesPageUrl!, "_blank")}
                      >
                        Acessar App
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    ) : (
                      <Link
                        href={
                          item.product?.type === "course"
                            ? `/my-account/course/${item.product.id}`
                            : `/my-account/product/${item.product?.id}`
                        }
                      >
                        <Button className="w-full">
                          {item.product?.type === "course"
                            ? item.progress > 0
                              ? "Continuar"
                              : "Começar"
                            : "Acessar"}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery || filterType !== "all"
                  ? "Nenhum produto encontrado"
                  : "Nenhum produto ainda"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || filterType !== "all"
                  ? "Tente ajustar os filtros de busca"
                  : "Explore nosso catálogo e comece sua jornada de aprendizado"}
              </p>
              {!searchQuery && filterType === "all" && (
                <Link href="/products">
                  <Button>
                    Explorar Produtos
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </MembersLayout>
  );
}
