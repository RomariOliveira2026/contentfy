import { Link } from "wouter";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/design-system/ProgressBar";
import AnimatedSection from "@/components/AnimatedSection";
import {
  BookOpen,
  GraduationCap,
  Library,
  Play,
  Download,
  ArrowRight,
} from "lucide-react";

type LibraryProduct = {
  id: number;
  name: string;
  type: "course" | "ebook";
  description: string;
  actionLabel: string;
  href: string;
  progress: number;
};

const libraryProducts: LibraryProduct[] = [
  {
    id: 1,
    name: "Curso Dominando o TDAH",
    type: "course",
    description:
      "Aprenda técnicas práticas para foco, organização e produtividade.",
    actionLabel: "Continuar",
    href: "/my-account/course/1",
    progress: 42,
  },
  {
    id: 2,
    name: "Desacelere",
    type: "ebook",
    description: "Controle a ansiedade e recupere a paz mental.",
    actionLabel: "Abrir",
    href: "/my-account/product/2",
    progress: 18,
  },
];

function getProductTypeLabel(type: LibraryProduct["type"]) {
  switch (type) {
    case "course":
      return "Curso";
    case "ebook":
      return "E-book";
    default:
      return type;
  }
}

function getProductIcon(type: LibraryProduct["type"]) {
  return type === "course" ? GraduationCap : BookOpen;
}

function getActionIcon(type: LibraryProduct["type"]) {
  return type === "course" ? Play : Download;
}

export default function MyProducts() {
  const hasProducts = libraryProducts.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="cf-page-main">
        <div className="container">
          <PageHeader
            title="Minha Biblioteca"
            subtitle="Seu conteúdo adquirido, pronto para continuar"
            icon={<Library className="w-6 h-6 text-primary" />}
          />

          {hasProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
              {libraryProducts.map((product, index) => {
                const Icon = getProductIcon(product.type);
                const ActionIcon = getActionIcon(product.type);

                return (
                  <AnimatedSection key={product.id} delay={index * 0.06}>
                    <Card className="cf-card-library group py-0 gap-0 h-full">
                      <div className="cf-product-cover aspect-[16/10]">
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[#070B12] via-transparent to-transparent">
                          <Icon className="w-20 h-20 text-white/35 group-hover:scale-110 transition-transform duration-200" />
                        </div>
                        <div className="absolute top-4 left-4 flex gap-2">
                          <Badge className="bg-black/55 text-white border-0 backdrop-blur-md">
                            {getProductTypeLabel(product.type)}
                          </Badge>
                          <Badge className="cf-badge-type border">
                            Em progresso
                          </Badge>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="h-14 w-14 rounded-full bg-gradient-owl flex items-center justify-center shadow-xl shadow-orange-500/30">
                            <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-5 lg:p-6 flex flex-col flex-1">
                        <h2 className="text-lg font-bold mb-2 line-clamp-2 min-h-[3.25rem]">
                          {product.name}
                        </h2>
                        <p className="text-sm text-muted-foreground mb-5 line-clamp-2 flex-1">
                          {product.description}
                        </p>

                        <ProgressBar
                          value={product.progress}
                          label="Progresso"
                          className="mb-5"
                        />

                        <Link href={product.href}>
                          <Button className="w-full">
                            <ActionIcon className="mr-2 w-4 h-4" />
                            {product.actionLabel}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                );
              })}
            </div>
          ) : (
            <Card className="cf-card-premium py-0">
              <CardContent className="py-16 px-6 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary border border-border mb-6">
                  <Library className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Você ainda não possui produtos.
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Explore nosso catálogo e comece sua jornada de aprendizado.
                </p>
                <Link href="/products">
                  <Button size="lg">
                    Explorar Produtos
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
