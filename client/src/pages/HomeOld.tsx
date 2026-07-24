import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Zap,
  Code2,
  Palette,
  Database,
  Shield,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Globe,
  Smartphone,
  Cloud,
} from "lucide-react";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 md:py-32">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Sparkles size={16} />
                  <span>Desenvolvimento Web Profissional</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Construa Apps{" "}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Robustos
                  </span>{" "}
                  com Manus
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Transforme suas ideias em aplicações web completas e profissionais. 
                  Desenvolvimento ágil, tecnologia de ponta e resultados que impressionam.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    onClick={() => scrollToSection("cta")}
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg px-8"
                  >
                    Começar Agora
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => scrollToSection("exemplos")}
                    className="text-lg px-8"
                  >
                    Ver Exemplos
                  </Button>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-card border border-border rounded-2xl p-8 shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-destructive"></div>
                      <div className="w-3 h-3 rounded-full bg-accent"></div>
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                    </div>
                    <div className="space-y-2 font-mono text-sm">
                      <div className="text-muted-foreground">
                        <span className="text-accent">const</span>{" "}
                        <span className="text-primary">app</span> ={" "}
                        <span className="text-accent">new</span>{" "}
                        <span className="text-primary">ManusApp</span>();
                      </div>
                      <div className="text-muted-foreground">
                        app.<span className="text-primary">build</span>({"{"}
                      </div>
                      <div className="text-muted-foreground pl-4">
                        features: [<span className="text-accent">'robust'</span>,{" "}
                        <span className="text-accent">'scalable'</span>],
                      </div>
                      <div className="text-muted-foreground pl-4">
                        quality: <span className="text-accent">'professional'</span>
                      </div>
                      <div className="text-muted-foreground">{"});"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* O que é possível criar */}
        <section className="py-20 bg-card">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                O que é possível criar?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Com a Manus, você pode desenvolver praticamente qualquer tipo de aplicação web moderna
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <Globe className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Sites Institucionais</CardTitle>
                  <CardDescription>
                    Landing pages, portfólios e sites corporativos com design moderno e responsivo
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <Smartphone className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Aplicações SaaS</CardTitle>
                  <CardDescription>
                    Plataformas completas com autenticação, banco de dados e painéis administrativos
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <Cloud className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Dashboards & APIs</CardTitle>
                  <CardDescription>
                    Painéis de controle interativos e APIs RESTful para integração com outros sistemas
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Recursos Section */}
        <section id="recursos" className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Recursos Poderosos
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Tecnologias modernas e práticas recomendadas para criar aplicações de alto nível
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Zap className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Performance Otimizada</CardTitle>
                  <CardDescription>
                    Carregamento rápido e experiência fluida com otimizações automáticas
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Code2 className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Código Limpo</CardTitle>
                  <CardDescription>
                    Arquitetura bem estruturada seguindo as melhores práticas de desenvolvimento
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Palette className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Design Moderno</CardTitle>
                  <CardDescription>
                    Interface elegante e responsiva que funciona perfeitamente em todos os dispositivos
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Database className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Banco de Dados</CardTitle>
                  <CardDescription>
                    Integração completa com bancos de dados relacionais e NoSQL
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Shield className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Segurança</CardTitle>
                  <CardDescription>
                    Autenticação robusta e proteção contra vulnerabilidades comuns
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Rocket className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Deploy Simplificado</CardTitle>
                  <CardDescription>
                    Publicação rápida e fácil com um clique direto da plataforma
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Exemplos Section */}
        <section id="exemplos" className="py-20 bg-card">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Exemplos de Projetos
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Veja alguns tipos de aplicações que você pode construir
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="overflow-hidden group">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Code2 className="w-20 h-20 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <CardHeader>
                  <CardTitle>E-commerce Completo</CardTitle>
                  <CardDescription>
                    Loja virtual com carrinho de compras, pagamentos integrados, painel administrativo e gestão de produtos
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="overflow-hidden group">
                <div className="h-48 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                  <Database className="w-20 h-20 text-accent group-hover:scale-110 transition-transform" />
                </div>
                <CardHeader>
                  <CardTitle>Sistema de Gestão</CardTitle>
                  <CardDescription>
                    CRM ou ERP personalizado com dashboards, relatórios, gestão de usuários e integrações com APIs externas
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="overflow-hidden group">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Palette className="w-20 h-20 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <CardHeader>
                  <CardTitle>Plataforma de Conteúdo</CardTitle>
                  <CardDescription>
                    Blog, portal de notícias ou plataforma de cursos online com sistema de assinaturas e área de membros
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="overflow-hidden group">
                <div className="h-48 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                  <Rocket className="w-20 h-20 text-accent group-hover:scale-110 transition-transform" />
                </div>
                <CardHeader>
                  <CardTitle>Aplicação em Tempo Real</CardTitle>
                  <CardDescription>
                    Chat, sistema de notificações, rastreamento ao vivo ou colaboração em equipe com atualizações instantâneas
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Processo Section */}
        <section id="processo" className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Processo de Desenvolvimento
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Um fluxo de trabalho otimizado para entregar resultados rápidos e de qualidade
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Planejamento</h3>
                <p className="text-muted-foreground text-sm">
                  Definição de requisitos, escopo e tecnologias a serem utilizadas
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Design</h3>
                <p className="text-muted-foreground text-sm">
                  Criação da interface e experiência do usuário com foco em usabilidade
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Desenvolvimento</h3>
                <p className="text-muted-foreground text-sm">
                  Implementação das funcionalidades com código limpo e testado
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Deploy</h3>
                <p className="text-muted-foreground text-sm">
                  Publicação da aplicação e monitoramento de performance
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-card">
          <div className="container max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Perguntas Frequentes
              </h2>
              <p className="text-lg text-muted-foreground">
                Tire suas dúvidas sobre o desenvolvimento com Manus
              </p>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <span>Quanto tempo leva para desenvolver uma aplicação?</span>
                  </CardTitle>
                  <CardDescription className="ml-9">
                    O tempo varia de acordo com a complexidade do projeto. Aplicações simples podem ficar prontas em poucos dias, 
                    enquanto sistemas mais complexos podem levar algumas semanas. O desenvolvimento é ágil e iterativo.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <span>Quais tecnologias são utilizadas?</span>
                  </CardTitle>
                  <CardDescription className="ml-9">
                    Utilizamos tecnologias modernas e consolidadas como React, TypeScript, Tailwind CSS, Node.js e bancos de dados 
                    relacionais e NoSQL. Todas as escolhas são feitas pensando em performance, escalabilidade e manutenibilidade.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <span>A aplicação será responsiva?</span>
                  </CardTitle>
                  <CardDescription className="ml-9">
                    Sim! Todas as aplicações são desenvolvidas com design responsivo, garantindo uma experiência perfeita em 
                    dispositivos móveis, tablets e desktops.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <span>Como funciona o processo de deploy?</span>
                  </CardTitle>
                  <CardDescription className="ml-9">
                    O deploy é simplificado e pode ser feito com um clique através da plataforma Manus. A aplicação fica 
                    disponível imediatamente com SSL, CDN e todas as otimizações necessárias.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <span>Posso solicitar alterações após o desenvolvimento?</span>
                  </CardTitle>
                  <CardDescription className="ml-9">
                    Absolutamente! O código é organizado e bem documentado, facilitando futuras manutenções e adição de novas 
                    funcionalidades. Você pode solicitar ajustes a qualquer momento.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Final Section */}
        <section id="cta" className="py-20 bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Pronto para Começar?
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Transforme sua ideia em uma aplicação web profissional e robusta. 
              Comece seu projeto hoje mesmo!
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 bg-background text-foreground hover:bg-background/90"
            >
              Iniciar Projeto
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
