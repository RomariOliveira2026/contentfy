import { Link } from "wouter";
import MembersLayout from "@/components/MembersLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import ContinueWatching from "@/components/lms/ContinueWatching";
import {
  BookOpen,
  Headphones,
  GraduationCap,
  Smartphone,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MembersDashboard() {
  const { data: products, isLoading: productsLoading } =
    trpc.members.myProducts.useQuery();
  const { data: stats, isLoading: statsLoading } =
    trpc.members.getMyStats.useQuery();

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

  return (
    <MembersLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <p className="cf-caption mb-2">Centro de Evolução</p>
          <h1 className="cf-page-title mb-2">Bem-vindo de volta</h1>
          <p className="text-muted-foreground">
            Continue de onde parou e explore seus produtos
          </p>
        </div>

        <ContinueWatching
          courseTitle="Curso Dominando o TDAH"
          lessonTitle="Como o cérebro com TDAH funciona"
          href="/my-account/course/1"
          progressPercentage={42}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              <Card className="cf-card-premium py-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Total de Produtos</p>
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-3xl font-bold">{stats?.totalProducts || 0}</p>
                </CardContent>
              </Card>

              <Card className="cf-card-premium py-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Cursos</p>
                    <GraduationCap className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-3xl font-bold">{stats?.courses || 0}</p>
                </CardContent>
              </Card>

              <Card className="cf-card-premium py-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">E-books</p>
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-3xl font-bold">{stats?.ebooks || 0}</p>
                </CardContent>
              </Card>

              <Card className="cf-card-premium py-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Audiobooks</p>
                    <Headphones className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-3xl font-bold">{stats?.audiobooks || 0}</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Continue Aprendendo */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Continue Aprendendo</h2>
            <Link href="/my-account/products">
              <Button variant="ghost">
                Ver Todos
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.slice(0, 4).map((item) => {
                const Icon = getProductIcon(item.product?.type || "");
                return (
                  <Card key={item.userProduct.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Badge variant="secondary" className="mb-2">
                            {getProductTypeLabel(item.product?.type || "")}
                          </Badge>
                          <CardTitle className="line-clamp-2">
                            {item.product?.name}
                          </CardTitle>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 ml-4">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>
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
                      <Link
                        href={
                          item.product?.type === "course"
                            ? `/my-account/course/${item.product.id}`
                            : `/my-account/product/${item.product?.id}`
                        }
                      >
                        <Button className="w-full">
                          {item.product?.type === "course"
                            ? "Continuar Curso"
                            : "Acessar"}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
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
                  Nenhum produto ainda
                </h3>
                <p className="text-muted-foreground mb-6">
                  Explore nosso catálogo e comece sua jornada de aprendizado
                </p>
                <Link href="/products">
                  <Button>
                    Explorar Produtos
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MembersLayout>
  );
}
