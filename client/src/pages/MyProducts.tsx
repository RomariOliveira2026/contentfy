import { Link } from "wouter";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
};

const libraryProducts: LibraryProduct[] = [
  {
    id: 1,
    name: "Curso Dominando o TDAH",
    type: "course",
    description:
      "Aprenda técnicas práticas para foco, organização e produtividade.",
    actionLabel: "Assistir Curso",
    href: "/my-account/course/1",
  },
  {
    id: 2,
    name: "Desacelere",
    type: "ebook",
    description: "Controle a ansiedade e recupere a paz mental.",
    actionLabel: "Baixar E-book",
    href: "/my-account/product/2",
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
            subtitle="Acesse seus produtos adquiridos"
            icon={<Library className="w-6 h-6 text-primary" />}
          />

          {hasProducts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {libraryProducts.map((product) => {
                const Icon = getProductIcon(product.type);
                const ActionIcon = getActionIcon(product.type);

                return (
                  <Card key={product.id} className="cf-card-product group">
                    <div className="cf-product-cover">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="w-16 h-16 text-white/50 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="absolute top-4 left-4">
                        <Badge
                          variant="secondary"
                          className="bg-black/40 text-white border-0 backdrop-blur-sm"
                        >
                          {getProductTypeLabel(product.type)}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="cf-card-product-body">
                      <h2 className="text-lg font-bold mb-2 line-clamp-2 min-h-[3.5rem]">
                        {product.name}
                      </h2>
                      <p className="text-sm text-muted-foreground mb-6 line-clamp-2 min-h-[2.5rem] leading-relaxed flex-1">
                        {product.description}
                      </p>

                      <Link href={product.href}>
                        <Button className="w-full rounded-lg cf-btn-gradient">
                          <ActionIcon className="mr-2 w-4 h-4" />
                          {product.actionLabel}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="cf-card-premium">
              <CardContent className="py-16 px-6 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-muted/60 border border-border/50 mb-6">
                  <Library className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Você ainda não possui produtos.
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                  Explore nosso catálogo e comece sua jornada de aprendizado.
                </p>
                <Link href="/products">
                  <Button size="lg" className="cf-btn-gradient rounded-lg">
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
