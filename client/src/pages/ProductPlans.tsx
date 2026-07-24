import { useParams, useLocation } from "wouter";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, Zap, Crown, Sparkles, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useState } from "react";

export default function ProductPlans() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const { data: products } = trpc.products.list.useQuery();
  const product = products?.find((p) => p.slug === slug);
  
  const createSubscriptionMutation = trpc.checkout.createSubscriptionSession.useMutation({
    onSuccess: (data) => {
      // Redirecionar para Stripe Checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar sessão de checkout");
      setLoadingPlan(null);
    },
  });

  // TODO: Criar endpoint trpc para buscar planos por produto
  // Por enquanto, vamos buscar planos do LibroFy diretamente
  const plans = [
    {
      id: 1,
      name: "LibroFy Freemium",
      slug: "librofy-freemium",
      description: "Experimente grátis com funcionalidades básicas",
      price: 0,
      interval: "month" as const,
      features: [
        "3 e-books por mês",
        "Funcionalidades básicas de leitura",
        "Marcadores simples",
        "Anúncios leves"
      ],
      icon: Sparkles,
      badge: null,
      buttonText: "Começar Grátis",
      buttonVariant: "outline" as const
    },
    {
      id: 2,
      name: "LibroFy Premium Mensal",
      slug: "librofy-premium-mensal",
      description: "Acesso ilimitado com todos os recursos premium",
      price: 1990,
      interval: "month" as const,
      features: [
        "Biblioteca ilimitada",
        "Sem anúncios",
        "Sincronização multi-dispositivos",
        "Marcadores e anotações avançadas",
        "Modo offline",
        "Suporte prioritário"
      ],
      icon: Zap,
      badge: "Mais Popular",
      buttonText: "Assinar Agora",
      buttonVariant: "default" as const
    },
    {
      id: 3,
      name: "LibroFy Premium Anual",
      slug: "librofy-premium-anual",
      description: "Economize 17% com o plano anual",
      price: 19700,
      interval: "year" as const,
      features: [
        "Biblioteca ilimitada",
        "Sem anúncios",
        "Sincronização multi-dispositivos",
        "Marcadores e anotações avançadas",
        "Modo offline",
        "Suporte prioritário",
        "Acesso antecipado a lançamentos",
        "2 meses grátis (economia de R$ 41,80)"
      ],
      icon: Crown,
      badge: "Melhor Custo-Benefício",
      buttonText: "Assinar Anual",
      buttonVariant: "default" as const
    }
  ];

  const handleSelectPlan = async (planSlug: string, price: number) => {
    if (price === 0) {
      // Plano gratuito - redirecionar para registro/login
      toast.info("Crie sua conta para começar a usar o plano gratuito!");
      setLocation("/");
    } else {
      // Planos pagos - criar sessão de assinatura
      setLoadingPlan(planSlug);
      try {
        await createSubscriptionMutation.mutateAsync({
          planSlug,
          // TODO: Capturar código de afiliado da URL se existir
        });
      } catch (error) {
        // Erro já tratado no onError
      }
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-1 py-12">
          <div className="container text-center">
            <h1 className="text-4xl font-bold mb-4">Produto não encontrado</h1>
            <Button onClick={() => setLocation("/products")}>
              Ver Todos os Produtos
            </Button>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1 py-12 bg-gradient-to-b from-background to-muted/20">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Escolha seu Plano {product.name}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comece grátis e faça upgrade quando quiser. Cancele a qualquer momento.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isPopular = plan.badge === "Mais Popular";
              const isBestValue = plan.badge === "Melhor Custo-Benefício";

              return (
                <Card
                  key={plan.id}
                  className={`relative ${
                    isPopular || isBestValue
                      ? "border-primary shadow-xl scale-105"
                      : "border-border"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <Badge
                        className={`${
                          isPopular
                            ? "bg-primary text-primary-foreground"
                            : "bg-green-500 text-white"
                        } px-4 py-1 text-sm font-semibold shadow-lg`}
                      >
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-8 pt-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl mb-2">
                      {plan.name.replace("LibroFy ", "")}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Price */}
                    <div className="text-center">
                      {plan.price === 0 ? (
                        <div className="text-4xl font-bold">Grátis</div>
                      ) : (
                        <>
                          <div className="text-4xl font-bold">
                            R$ {(plan.price / 100).toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            /{plan.interval === "month" ? "mês" : "ano"}
                          </div>
                          {plan.interval === "year" && (
                            <div className="text-xs text-green-600 font-medium mt-2">
                              R$ 16,42/mês • Economize 17%
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Button
                      variant={plan.buttonVariant}
                      className="w-full"
                      size="lg"
                      onClick={() => handleSelectPlan(plan.slug, plan.price)}
                      disabled={loadingPlan !== null}
                    >
                      {loadingPlan === plan.slug ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        plan.buttonText
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* FAQ / Additional Info */}
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6">Perguntas Frequentes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Posso cancelar a qualquer momento?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Sim! Você pode cancelar sua assinatura a qualquer momento sem multas ou taxas adicionais.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Como funciona o plano gratuito?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    O plano gratuito permite acesso a 3 e-books por mês com funcionalidades básicas. Sem cartão de crédito necessário.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Posso trocar de plano depois?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento através do painel de controle.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Há garantia de reembolso?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Sim! Oferecemos garantia de 30 dias. Se não ficar satisfeito, devolvemos seu dinheiro integralmente.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
