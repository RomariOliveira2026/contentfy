import { useParams, useLocation } from "wouter";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import {
  BookOpen,
  Headphones,
  GraduationCap,
  Smartphone,
  Clock,
  CheckCircle2,
  Shield,
  Zap,
  Award,
  Calendar,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ProductReviews from "@/components/ProductReviews";
import ReviewForm from "@/components/ReviewForm";
import { useState } from "react";

export default function ProductDetail() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();
  const [reviewsKey, setReviewsKey] = useState(0);

  const { data: products, isLoading } = trpc.products.list.useQuery();
  const product = products?.find((p) => p.slug === slug);

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
        return GraduationCap;
    }
  };

  const getProductTypeLabel = (type: string) => {
    switch (type) {
      case "course":
        return "Curso Online";
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

  const handleBuyClick = async () => {
    if (!product) return;

    try {
      const res = await fetch("/api/trpc/checkout.createCheckout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          json: {
            name: product.name,
            price: product.price,
          },
        }),
      });

      const data = await res.json();
      const url = data?.result?.data?.json?.url;

      if (url) {
        window.location.href = url;
      } else {
        console.error("Erro no checkout:", data);
      }
    } catch (err) {
      console.error("Erro ao iniciar checkout:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="cf-page-main">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="aspect-video w-full mb-6" />
                <Skeleton className="h-10 w-3/4 mb-4" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-2/3" />
              </div>
              <div className="lg:col-span-1">
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="cf-page-main">
          <div className="container text-center">
            <h1 className="text-4xl font-bold mb-4">Produto não encontrado</h1>
            <p className="text-muted-foreground mb-8">
              O produto que você está procurando não existe ou foi removido.
            </p>
            <Button onClick={() => setLocation("/products")}>
              Ver Todos os Produtos
            </Button>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  const Icon = getProductIcon(product.type);

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1 py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Conteúdo Principal */}
            <div className="lg:col-span-2">
              {/* Imagem de Capa */}
              <div className="aspect-video cf-gradient-accent rounded-xl overflow-hidden mb-6 shadow-lg">
                {product.coverImage ? (
                  <img
                    src={product.coverImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon className="w-24 h-24 text-white opacity-50" />
                  </div>
                )}
              </div>

              {/* Título e Badge */}
              <div className="mb-6">
                <Badge className="mb-3 cf-badge-type" variant="secondary">
                  {getProductTypeLabel(product.type)}
                </Badge>
                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                {product.description && (
                  <p className="text-lg text-muted-foreground">
                    {product.description}
                  </p>
                )}
              </div>

              <Separator className="my-8" />

              {/* Descrição Completa */}
              <div className="mb-8">
                <h2 className="cf-section-title mb-4">Sobre este produto</h2>
                <div className="prose prose-lg max-w-none">
                  <p>
                    {product.description ||
                      "Este é um produto incrível que vai transformar sua vida! Aqui você encontrará todo o conteúdo necessário para alcançar seus objetivos."}
                  </p>
                </div>
              </div>

              {/* O que você vai aprender/receber */}
              <div className="mb-8">
                <h2 className="cf-section-title mb-4">
                  O que você vai {product.type === "course" ? "aprender" : "receber"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Conteúdo de alta qualidade",
                    "Acesso imediato após a compra",
                    "Suporte dedicado",
                    "Atualizações gratuitas",
                    "Certificado de conclusão",
                    `Garantia de ${(product as { guaranteeDays?: number }).guaranteeDays || 30} dias`,
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conteúdo Programático (se for curso) */}
              {product.type === "course" && (
                <div className="mb-8">
                  <h2 className="cf-section-title mb-4">Conteúdo do Curso</h2>
                  <Card className="cf-card-premium">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {[
                          {
                            module: "Módulo 1: Introdução",
                            lessons: [
                              "Boas-vindas",
                              "Como aproveitar o curso",
                              "Materiais necessários",
                            ],
                          },
                          {
                            module: "Módulo 2: Fundamentos",
                            lessons: [
                              "Conceitos básicos",
                              "Primeiros passos",
                              "Exercícios práticos",
                            ],
                          },
                          {
                            module: "Módulo 3: Avançado",
                            lessons: [
                              "Técnicas avançadas",
                              "Casos de uso",
                              "Projeto final",
                            ],
                          },
                        ].map((module, index) => (
                          <div key={index}>
                            <h3 className="font-semibold mb-2">{module.module}</h3>
                            <ul className="space-y-2 ml-6">
                              {module.lessons.map((lesson, lessonIndex) => (
                                <li
                                  key={lessonIndex}
                                  className="flex items-center gap-2 text-sm text-muted-foreground"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                                  {lesson}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Avaliações */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6">Avaliações</h2>
                <div className="space-y-6">
                  <ReviewForm
                    productId={product.id}
                    onReviewSubmitted={() => setReviewsKey((prev) => prev + 1)}
                  />
                  <ProductReviews
                    key={reviewsKey}
                    reviews={[
                      {
                        id: 1,
                        rating: 5,
                        comment:
                          "Produto excelente! Superou minhas expectativas. Recomendo muito!",
                        userName: "Maria Silva",
                        isVerifiedPurchase: true,
                        createdAt: new Date(
                          Date.now() - 7 * 24 * 60 * 60 * 1000
                        ).toISOString(),
                      },
                      {
                        id: 2,
                        rating: 4,
                        comment:
                          "Muito bom, vale a pena. Apenas alguns detalhes poderiam ser melhorados.",
                        userName: "João Santos",
                        isVerifiedPurchase: true,
                        createdAt: new Date(
                          Date.now() - 14 * 24 * 60 * 60 * 1000
                        ).toISOString(),
                      },
                      {
                        id: 3,
                        rating: 5,
                        comment: "Simplesmente perfeito! Exatamente o que eu procurava.",
                        userName: "Ana Costa",
                        isVerifiedPurchase: true,
                        createdAt: new Date(
                          Date.now() - 21 * 24 * 60 * 60 * 1000
                        ).toISOString(),
                      },
                    ]}
                    averageRating={4.7}
                    totalReviews={3}
                  />
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className="mb-8">
                <h2 className="cf-section-title mb-4">Informações</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Data de lançamento
                      </p>
                      <p className="font-medium">
                        {new Date(product.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  {product.type === "course" && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Duração</p>
                        <p className="font-medium">20 horas</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Certificado</p>
                      <p className="font-medium">Sim</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Acesso</p>
                      <p className="font-medium">Vitalício</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Card de Compra */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="cf-card-premium border-primary/10 shadow-lg">
                  <CardContent className="p-6">
                    {/* Preço */}
                    <div className="mb-6">
                      <p className="text-4xl font-bold mb-1">
                        R$ {(product.price / 100).toFixed(2)}
                      </p>
                      {product.isRecurring && (
                        <p className="text-sm text-muted-foreground">
                          /{product.recurringInterval === "month" ? "mês" : "ano"}
                        </p>
                      )}
                      {product.allowInstallments && !product.isRecurring && (
                        <p className="text-sm text-muted-foreground">
                          ou em até {product.maxInstallments}x de R${" "}
                          {(
                            product.price /
                            100 /
                            (product.maxInstallments || 1)
                          ).toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* Botão de Compra/Planos */}
                    <Button
                      size="lg"
                      type="button"
                      className="w-full mb-4 cf-btn-gradient rounded-lg"
                      onClick={handleBuyClick}
                    >
                      {product.type === "app" ? "Ver Planos" : "Comprar Agora"}
                    </Button>

                    <Separator className="my-6" />

                    {/* Benefícios */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Acesso Imediato</p>
                          <p className="text-sm text-muted-foreground">
                            Comece agora mesmo
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">
                            Garantia de{" "}
                            {(product as { guaranteeDays?: number }).guaranteeDays ||
                              30}{" "}
                            Dias
                          </p>
                          <p className="text-sm text-muted-foreground">
                            100% do seu dinheiro de volta
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Pagamento Seguro</p>
                          <p className="text-sm text-muted-foreground">
                            Seus dados protegidos
                          </p>
                        </div>
                      </div>
                      {product.type === "course" && (
                        <div className="flex items-start gap-3">
                          <Award className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">Certificado Incluso</p>
                            <p className="text-sm text-muted-foreground">
                              Ao concluir o curso
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
