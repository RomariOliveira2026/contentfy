import { Link } from "wouter";
import CreatorLayout from "@/components/CreatorLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BookOpen, Plus } from "lucide-react";

export default function CreatorCourses() {
  const { data, isLoading, isError, error, refetch } =
    trpc.creator.listCourses.useQuery();

  return (
    <CreatorLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cursos</h1>
            <p className="text-muted-foreground mt-1">
              Produtos do tipo curso e acesso rápido ao construtor.
            </p>
          </div>
          <Link href="/creator/products/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo curso
            </Button>
          </Link>
        </div>

        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-36 rounded-xl bg-muted/30 animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <Card className="border-destructive/40">
            <CardContent className="py-8 text-center space-y-3">
              <p className="text-destructive">{error.message}</p>
              <Button variant="outline" onClick={() => refetch()}>
                Tentar novamente
              </Button>
            </CardContent>
          </Card>
        )}

        {data && data.length === 0 && (
          <Card className="border-white/[0.08] bg-[#0f1522]">
            <CardContent className="py-14 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <h3 className="text-lg font-semibold">Nenhum curso cadastrado</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Crie um produto do tipo curso para usar o construtor.
              </p>
              <Link href="/creator/products/new">
                <Button>Criar curso</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {data && data.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {data.map((course) => (
              <Card key={course.id} className="border-white/[0.08] bg-[#0f1522]">
                <CardHeader className="flex flex-row items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="truncate">{course.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      /{course.slug}
                    </p>
                  </div>
                  <Badge variant={course.isActive ? "default" : "secondary"}>
                    {course.isActive ? "Publicado" : "Rascunho"}
                  </Badge>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Link href={`/creator/courses/${course.id}/builder`}>
                    <Button className="gap-2">
                      <BookOpen className="h-4 w-4" />
                      Abrir construtor
                    </Button>
                  </Link>
                  <Link href={`/creator/products/${course.id}/edit`}>
                    <Button variant="outline">Editar produto</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </CreatorLayout>
  );
}
