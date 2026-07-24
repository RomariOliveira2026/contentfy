import PublicHeader from "@/components/PublicHeader";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import AnimatedSection from "@/components/AnimatedSection";
import PublicFooter from "@/components/PublicFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import {
  BookOpen,
  Headphones,
  GraduationCap,
  Smartphone,
  ArrowRight,
  Star,
  Shield,
  Zap,
  Users,
} from "lucide-react";

export default function Home() {
  const { data: products, isLoading } = trpc.products.list.useQuery();

  const productTypes = [
    {
      icon: GraduationCap,
      title: "Cursos Online",
      description: "Aprenda no seu ritmo com cursos completos e certificados",
      color: "from-blue-500 to-cyan-500",
      type: "course",
    },
    {
      icon: BookOpen,
      title: "E-books",
      description: "Biblioteca digital com os melhores conteúdos",
      color: "from-purple-500 to-pink-500",
      type: "ebook",
    },
    {
      icon: Headphones,
      title: "Audiobooks",
      description: "Ouça enquanto dirige, treina ou relaxa",
      color: "from-orange-500 to-red-500",
      type: "audiobook",
    },
    {
      icon: Smartphone,
      title: "Apps",
      description: "Ferramentas e aplicativos para facilitar sua vida",
      color: "from-green-500 to-emerald-500",
      type: "app",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Acesso Imediato",
      description: "Comece a usar assim que finalizar a compra",
    },
    {
      icon: Shield,
      title: "Pagamento Seguro",
      description: "Checkout protegido com criptografia de ponta",
    },
    {
      icon: Users,
      title: "Suporte Dedicado",
      description: "Equipe pronta para ajudar quando precisar",
    },
    {
      icon: Star,
      title: "Qualidade Garantida",
      description: "Produtos selecionados e aprovados",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="absolute inset-0 cf-gradient-hero" />
          <div className="absolute inset-0 opacity-25">
            <div className="absolute top-20 right-20 w-96 h-96 bg-[var(--owl-orange)] rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-[var(--owl-yellow)] rounded-full blur-3xl" />
          </div>

          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-5 bg-white/10 text-white border-white/20 backdrop-blur-sm hover:bg-white/15 transition-colors">
                Plataforma de Infoprodutos
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white leading-tight">
                Transforme <span className="text-gradient-owl">Conhecimento</span> em{" "}
                <span className="text-gradient-owl">Resultado</span>
              </h1>
              <p className="text-lg lg:text-xl text-white/75 mb-10 leading-relaxed max-w-2xl mx-auto">
                Acesse cursos online, e-books, audiobooks e apps que vão
                impulsionar seu crescimento pessoal e profissional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button size="lg" className="w-full sm:w-auto cf-btn-gradient">
                    Explorar Produtos
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-white/25 text-white bg-white/5 hover:bg-white/10 hover:text-white backdrop-blur-sm"
                  >
                    Saiba Mais
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Product Types */}
        <section className="py-16 lg:py-24">
          <div className="container">
            <AnimatedSection>
              <div className="cf-section-header">
                <h2 className="cf-section-title">O Que Você Vai Encontrar</h2>
                <p className="cf-section-subtitle mx-auto">
                  Uma variedade de formatos para você escolher a melhor forma de
                  aprender
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {productTypes.map((type, index) => {
                const Icon = type.icon;
                return (
                  <AnimatedSection key={type.type} delay={index * 0.1}>
                    <Link href={`/products?type=${type.type}`}>
                      <Card className="h-full cf-card-premium card-owl-border group">
                        <CardContent className="p-6">
                          <div className="h-14 w-14 rounded-xl bg-gradient-owl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                            {type.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {type.description}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {!isLoading && products && products.length > 0 && (
          <section className="py-16 lg:py-24 cf-section-muted">
            <div className="container">
              <div className="cf-section-header">
                <h2 className="cf-section-title">Produtos em Destaque</h2>
                <p className="cf-section-subtitle mx-auto">
                  Confira os produtos mais populares da plataforma
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.slice(0, 6).map((product) => (
                  <Link key={product.id} href={`/products/${product.slug}`}>
                    <Card className="cf-card-product group">
                      <div className="cf-product-cover">
                        {product.coverImage ? (
                          <img src={product.coverImage} alt={product.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <GraduationCap className="w-16 h-16 text-white/50" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-black/40 text-white border-0 backdrop-blur-sm font-medium">
                            {(product as { guaranteeDays?: number }).guaranteeDays || 30} dias de garantia
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="cf-card-product-body">
                        <div className="flex gap-2 mb-3 flex-wrap">
                          <Badge variant="secondary" className="cf-badge-type">
                            {product.category?.name || "Sem categoria"}
                          </Badge>
                          <Badge variant="outline">
                            {product.type === "course" && "Curso"}
                            {product.type === "ebook" && "E-book"}
                            {product.type === "audiobook" && "Audiobook"}
                            {product.type === "app" && "App"}
                          </Badge>
                        </div>
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
                            <p className="text-2xl font-bold">
                              R$ {(product.price / 100).toFixed(2)}
                            </p>
                            {product.isRecurring && (
                              <p className="text-xs text-muted-foreground">
                                /{product.recurringInterval === "month" ? "mês" : "ano"}
                              </p>
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
                ))}
              </div>

              <div className="text-center mt-12">
                <Link href="/products">
                  <Button size="lg" variant="outline" className="rounded-lg">
                    Ver Todos os Produtos
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="py-16 lg:py-24 cf-section-dark">
          <div className="container">
            <div className="cf-section-header">
              <h2 className="cf-section-title text-white">Números Que Impressionam</h2>
              <p className="cf-section-subtitle mx-auto text-white/70">
                Resultados reais de uma plataforma que transforma vidas
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {[
                {
                  value: "10K+",
                  label: "Usuários Ativos",
                  description: "Criadores de conteúdo vendendo diariamente",
                },
                {
                  value: "R$ 10M+",
                  label: "Em Vendas",
                  description: "Processados na plataforma este ano",
                },
                {
                  value: "5K+",
                  label: "Produtos",
                  description: "Infoprodutos disponíveis no catálogo",
                },
                {
                  value: "98%",
                  label: "Satisfação",
                  description: "Clientes recomendam a plataforma",
                },
              ].map((stat, index) => (
                <Card
                  key={index}
                  className="text-center cf-card-premium bg-white/5 border-white/10 hover:border-primary/30 backdrop-blur-sm"
                >
                  <CardContent className="pt-8 pb-6 px-4">
                    <div className="text-3xl lg:text-4xl font-bold text-gradient-owl mb-2">
                      {stat.value}
                    </div>
                    <h3 className="text-base lg:text-lg font-semibold mb-2 text-white">
                      {stat.label}
                    </h3>
                    <p className="text-xs lg:text-sm text-white/60 leading-relaxed">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 lg:py-24">
          <div className="container">
            <div className="cf-section-header">
              <h2 className="cf-section-title">Por Que Escolher a ContentFy?</h2>
              <p className="cf-section-subtitle mx-auto">
                A melhor experiência em infoprodutos digitais
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="cf-card-premium text-center">
                    <CardContent className="p-6">
                      <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 lg:py-24 cf-section-dark">
          <div className="container">
            <div className="cf-section-header">
              <h2 className="cf-section-title text-white">
                O Que Nossos <span className="text-gradient-owl">Clientes</span> Dizem
              </h2>
              <p className="cf-section-subtitle mx-auto text-white/70">
                Depoimentos reais de pessoas que transformaram suas vidas
              </p>
            </div>

            <TestimonialsCarousel />
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-owl" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-[var(--owl-yellow)] rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[var(--owl-orange)] rounded-full blur-3xl" />
          </div>

          <div className="container text-center relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
              Pronto para Começar?
            </h2>
            <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
              Junte-se a milhares de pessoas que já estão transformando suas
              vidas com nossos produtos
            </p>
            <Link href="/products">
              <Button
                size="lg"
                className="bg-white text-[var(--owl-orange)] hover:bg-white/90 font-bold rounded-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
              >
                Explorar Produtos Agora
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
