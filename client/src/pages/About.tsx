import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  TrendingUp, 
  Shield,
  Zap,
  Globe,
  Award,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function About() {
  const stats = [
    { value: "10K+", label: "Usuários Ativos" },
    { value: "5K+", label: "Produtos Digitais" },
    { value: "98%", label: "Satisfação" },
    { value: "50+", label: "Países" },
  ];

  const values = [
    {
      icon: Shield,
      title: "Segurança",
      description: "Proteção total dos seus dados e transações com criptografia de ponta a ponta.",
    },
    {
      icon: Zap,
      title: "Inovação",
      description: "Tecnologia de ponta para proporcionar a melhor experiência em infoprodutos.",
    },
    {
      icon: Heart,
      title: "Paixão",
      description: "Acreditamos no poder da educação e do conhecimento para transformar vidas.",
    },
    {
      icon: Users,
      title: "Comunidade",
      description: "Construímos uma rede de criadores e alunos que crescem juntos.",
    },
  ];

  const differentials = [
    "Taxas mais baixas do mercado (3,99% vs 9,9% dos concorrentes)",
    "Você é dono da sua plataforma e dos seus dados",
    "Sistema de afiliados integrado para escalar suas vendas",
    "Suporte a múltiplos idiomas e moedas",
    "Certificados automáticos para cursos online",
    "Suporte dedicado e documentação completa",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Heart size={16} />
                <span>Nossa História</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold">
                Transformando Conhecimento em Oportunidade
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                A Contentfy nasceu da visão de democratizar o acesso ao conhecimento digital, 
                oferecendo uma plataforma completa e acessível para criadores de conteúdo 
                venderem seus infoprodutos sem taxas abusivas ou limitações.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-card border-y">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12">
              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-8 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Target className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Nossa Missão</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Empoderar criadores de conteúdo digital com uma plataforma completa, 
                    justa e transparente. Acreditamos que o conhecimento deve ser acessível 
                    e que os criadores merecem manter a maior parte do valor que geram.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-accent transition-colors">
                <CardContent className="pt-8 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                    <Eye className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Nossa Visão</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Ser a plataforma líder global em infoprodutos digitais, reconhecida pela 
                    inovação, transparência e pelo impacto positivo na vida de milhões de 
                    criadores e alunos ao redor do mundo.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-card">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Nossos Valores
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Princípios que guiam cada decisão e ação na Contentfy
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Differentials Section */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-primary text-sm font-medium mb-6">
                  <Award size={16} />
                  <span>Diferenciais</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  Por Que Escolher a Contentfy?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Vantagens competitivas que fazem a diferença no seu negócio
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {differentials.map((differential, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent/5 transition-colors">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {differential}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-owl text-primary-foreground">
          <div className="container text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <Globe className="w-16 h-16 mx-auto opacity-90" />
              <h2 className="text-3xl md:text-5xl font-bold">
                Junte-se a Milhares de Criadores
              </h2>
              <p className="text-lg md:text-xl opacity-90 leading-relaxed">
                Comece a vender seus infoprodutos hoje mesmo e faça parte da revolução 
                do conhecimento digital.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="text-lg px-8 bg-background text-foreground hover:bg-background/90"
                  >
                    <TrendingUp className="mr-2" size={20} />
                    Explorar Produtos
                  </Button>
                </Link>
                <Link href="/">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="text-lg px-8 border-2 border-background text-background hover:bg-background/10"
                  >
                    Voltar ao Início
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
