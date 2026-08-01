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
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

/** Mockup oficial já usado na marca — sem inventar arte nova. */
const DESACELERE_MOCKUP =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663097022226/Qf2ybVS3fKbp69WuPYRytJ/desacelere_mockup_oficial-FDXUTUiPqGyfYHoemKGAag.webp";

export default function Home() {
  const { data: products, isLoading } = trpc.products.list.useQuery();

  const productTypes = [
    {
      icon: GraduationCap,
      title: "Cursos Online",
      description: "Aprenda no seu ritmo com cursos completos e certificados",
      type: "course",
    },
    {
      icon: BookOpen,
      title: "E-books",
      description: "Biblioteca digital com os melhores conteúdos",
      type: "ebook",
    },
    {
      icon: Headphones,
      title: "Audiobooks",
      description: "Ouça enquanto dirige, treina ou relaxa",
      type: "audiobook",
    },
    {
      icon: Smartphone,
      title: "Apps",
      description: "Ferramentas e aplicativos para facilitar sua vida",
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
    <div className="min-h-screen flex flex-col cf-home-page">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Enterprise Premium */}
        <section className="cf-home-hero relative overflow-hidden">
          <div className="absolute inset-0 cf-gradient-hero" aria-hidden />
          <div className="cf-home-hero-atmosphere" aria-hidden />
          <div className="cf-home-hero-particles" aria-hidden />
          <div className="cf-home-hero-vignette" aria-hidden />

          <div className="container relative z-10">
            <div className="cf-home-hero-grid">
              <motion.div
                className="cf-home-hero-copy"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="cf-home-hero-eyebrow">
                  Plataforma premium de infoprodutos
                </p>

                <h1 className="cf-home-hero-title text-balance">
                  Transforme{" "}
                  <span className="text-gradient-owl">conhecimento</span> em{" "}
                  <span className="text-gradient-owl">resultado</span>
                </h1>

                <p className="cf-home-hero-subtitle">
                  Cursos, e-books, audiobooks e apps em uma experiência de nível
                  internacional — feita para quem leva conteúdo a sério.
                </p>

                <div className="cf-home-hero-ctas">
                  <Link href="/explorar">
                    <Button size="lg" className="cf-home-btn-primary w-full sm:w-auto">
                      Explorar Produtos
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button
                      size="lg"
                      variant="outline"
                      className="cf-home-btn-secondary w-full sm:w-auto"
                    >
                      Saiba Mais
                    </Button>
                  </Link>
                </div>

                <div className="cf-home-hero-badges">
                  <div className="cf-home-trust-badge">
                    <Shield className="cf-home-trust-icon" aria-hidden />
                    <span>Garantia de 30 dias</span>
                  </div>
                  <div className="cf-home-trust-badge">
                    <Clock className="cf-home-trust-icon" aria-hidden />
                    <span>Acesso imediato</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="cf-home-mockup-stage"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="cf-home-mockup-glow-blue" aria-hidden />
                <div className="cf-home-mockup-glow-gold" aria-hidden />
                <div className="cf-home-mockup-frame">
                  <img
                    src={DESACELERE_MOCKUP}
                    alt="Mockup premium do e-book Desacelere"
                    width={720}
                    height={900}
                    fetchPriority="high"
                    decoding="async"
                    className="cf-home-mockup-img"
                  />
                  <div className="cf-home-mockup-reflection" aria-hidden />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-24">
          <div className="container">
            <AnimatedSection>
              <div className="cf-section-header">
                <p className="cf-caption mb-3">Categorias</p>
                <h2 className="cf-section-title">O que você vai encontrar</h2>
                <p className="cf-section-subtitle mx-auto">
                  Formatos pensados para diferentes ritmos de aprendizado
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {productTypes.map((type, index) => {
                const Icon = type.icon;
                return (
                  <AnimatedSection key={type.type} delay={index * 0.06}>
                    <Link href={`/products?type=${type.type}`}>
                      <Card className="h-full cf-card-premium cf-home-lift group py-0">
                        <CardContent className="p-6">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-owl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-200 shadow-lg shadow-orange-500/20">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="mb-2 group-hover:text-primary transition-colors">
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

        {!isLoading && products && products.length > 0 && (
          <section className="py-20 lg:py-24 cf-section-muted">
            <div className="container">
              <div className="cf-section-header">
                <p className="cf-caption mb-3">Destaques</p>
                <h2 className="cf-section-title">Produtos em evidência</h2>
                <p className="cf-section-subtitle mx-auto">
                  Seleção do catálogo ContentFy
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                {products.slice(0, 6).map((product, index) => (
                  <AnimatedSection key={product.id} delay={index * 0.05}>
                    <Link href={`/products/${product.slug}`}>
                      <Card className="cf-card-product cf-home-lift group py-0 gap-0">
                        <div className="cf-product-cover">
                          {product.coverImage ? (
                            <img
                              src={product.coverImage}
                              alt={product.name}
                              loading="lazy"
                              width={640}
                              height={360}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <GraduationCap className="w-16 h-16 text-white/40" />
                            </div>
                          )}
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-black/50 text-white border-0 backdrop-blur-md font-medium">
                              {(product as { guaranteeDays?: number })
                                .guaranteeDays || 30}{" "}
                              dias
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="cf-card-product-body">
                          <div className="flex gap-2 mb-3 flex-wrap">
                            <Badge variant="secondary" className="cf-badge-type">
                              {product.category?.name || "Sem categoria"}
                            </Badge>
                            <Badge variant="outline" className="border-border">
                              {product.type === "course" && "Curso"}
                              {product.type === "ebook" && "E-book"}
                              {product.type === "audiobook" && "Audiobook"}
                              {product.type === "app" && "App"}
                            </Badge>
                          </div>
                          <h3 className="text-lg mb-2 line-clamp-2 min-h-[3.25rem]">
                            {product.name}
                          </h3>
                          {product.description && (
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
                              {product.description}
                            </p>
                          )}
                          <div className="cf-card-product-footer">
                            <div>
                              <p className="text-2xl font-bold tracking-tight">
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
                            </div>
                            <Button size="sm" className="shrink-0">
                              Ver
                              <ArrowRight className="ml-1 w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link href="/products">
                  <Button size="lg" variant="outline" className="cf-home-btn-secondary">
                    Ver todos os produtos
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="py-20 lg:py-24 cf-section-dark">
          <div className="container">
            <div className="cf-section-header">
              <p className="cf-caption mb-3">Resultados</p>
              <h2 className="cf-section-title text-white">
                Números que impressionam
              </h2>
              <p className="cf-section-subtitle mx-auto text-muted-foreground">
                Escala e confiança de uma plataforma pensada para crescer
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {[
                {
                  value: "10K+",
                  label: "Usuários Ativos",
                  description: "Criadores e alunos ativos",
                },
                {
                  value: "R$ 10M+",
                  label: "Em Vendas",
                  description: "Processados na plataforma",
                },
                {
                  value: "5K+",
                  label: "Produtos",
                  description: "No catálogo digital",
                },
                {
                  value: "98%",
                  label: "Satisfação",
                  description: "Clientes que recomendam",
                },
              ].map((stat, index) => (
                <AnimatedSection key={stat.label} delay={index * 0.05}>
                  <Card className="text-center cf-card-premium cf-home-lift bg-card/80 border-border py-0">
                    <CardContent className="pt-8 pb-7 px-4">
                      <div className="text-3xl lg:text-4xl font-bold text-gradient-owl mb-2">
                        {stat.value}
                      </div>
                      <h3 className="text-base lg:text-lg mb-2 text-foreground">
                        {stat.label}
                      </h3>
                      <p className="text-xs lg:text-sm text-muted-foreground">
                        {stat.description}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-24">
          <div className="container">
            <div className="cf-section-header">
              <p className="cf-caption mb-3">Vantagens</p>
              <h2 className="cf-section-title">Por que a ContentFy?</h2>
              <p className="cf-section-subtitle mx-auto">
                Experiência premium do catálogo à entrega
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <AnimatedSection key={feature.title} delay={index * 0.05}>
                    <Card className="cf-card-premium cf-home-lift text-center py-0 h-full">
                      <CardContent className="p-6">
                        <div className="cf-kpi-icon mx-auto mb-4">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-24 cf-section-dark">
          <div className="container">
            <div className="cf-section-header">
              <p className="cf-caption mb-3">Social proof</p>
              <h2 className="cf-section-title text-white">
                O que nossos{" "}
                <span className="text-gradient-owl">clientes</span> dizem
              </h2>
              <p className="cf-section-subtitle mx-auto text-muted-foreground">
                Depoimentos de quem já usa a plataforma
              </p>
            </div>
            <TestimonialsCarousel />
          </div>
        </section>

        <section className="relative py-20 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-owl" />
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#F59E0B] rounded-full blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#EF4444] rounded-full blur-[100px]" />
          </div>

          <div className="container text-center relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
              Pronto para começar?
            </h2>
            <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
              Entre no catálogo e descubra produtos que elevam seu conhecimento.
            </p>
            <Link href="/products">
              <Button
                size="lg"
                className="bg-white text-[#F97316] hover:bg-white/95 font-bold shadow-xl cf-home-lift"
              >
                Explorar produtos agora
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
