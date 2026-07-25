import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Zap, 
  Code2, 
  Palette, 
  Database, 
  Shield,
  Rocket,
  DollarSign,
  Users,
  Globe,
  Award,
  BarChart3,
  Video,
  BookOpen,
  Headphones,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Features() {
  const mainFeatures = [
    {
      icon: Zap,
      title: "Performance Otimizada",
      description: "Carregamento ultra-rápido e experiência fluida para seus clientes. Plataforma otimizada para conversão máxima.",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    },
    {
      icon: DollarSign,
      title: "Taxas Mais Baixas",
      description: "Apenas 3,99% por transação vs 9,9% dos concorrentes. Economize até 60% em taxas e aumente seus lucros.",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Criptografia de ponta a ponta, certificado SSL, conformidade PCI-DSS e proteção contra fraudes.",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Users,
      title: "Sistema de Afiliados",
      description: "Crie sua rede de afiliados, defina comissões personalizadas e escale suas vendas exponencialmente.",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Globe,
      title: "Multi-idioma e Multi-moeda",
      description: "Venda globalmente com suporte a português, inglês, espanhol e múltiplas moedas (BRL, USD, EUR).",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10"
    },
    {
      icon: BarChart3,
      title: "Dashboard Completo",
      description: "Acompanhe vendas, receita, clientes e performance em tempo real com relatórios detalhados.",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    }
  ];

  const productFeatures = [
    {
      icon: Video,
      title: "Cursos Online",
      description: "Player de vídeo profissional, módulos e aulas organizados, controle de progresso e certificados automáticos."
    },
    {
      icon: BookOpen,
      title: "E-books",
      description: "Visualizador de PDF integrado, proteção contra cópia, download controlado e biblioteca digital."
    },
    {
      icon: Headphones,
      title: "Audiobooks",
      description: "Player de áudio com controles avançados, velocidade ajustável, marcadores e retomada automática."
    },
    {
      icon: Smartphone,
      title: "Apps e Softwares",
      description: "Venda aplicativos, softwares, ferramentas e qualquer produto digital com entrega automática."
    }
  ];

  const technicalFeatures = [
    {
      icon: Code2,
      title: "API Completa",
      description: "Integre com suas ferramentas favoritas através de nossa API RESTful documentada."
    },
    {
      icon: Database,
      title: "Banco de Dados Robusto",
      description: "Infraestrutura escalável que cresce com seu negócio sem perda de performance."
    },
    {
      icon: Palette,
      title: "Design Responsivo",
      description: "Interface moderna que funciona perfeitamente em desktop, tablet e mobile."
    },
    {
      icon: Rocket,
      title: "Deploy Instantâneo",
      description: "Publique atualizações em segundos com nosso sistema de deploy automatizado."
    },
    {
      icon: Award,
      title: "Certificados Digitais",
      description: "Gere certificados personalizados automaticamente quando alunos completarem cursos."
    },
    {
      icon: Shield,
      title: "Backup Automático",
      description: "Seus dados são protegidos com backups automáticos diários e redundância."
    }
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
                <Zap size={16} />
                <span>Recursos Poderosos</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold">
                Tudo Que Você Precisa Para Vender Infoprodutos
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Uma plataforma completa com todas as ferramentas necessárias para criar, 
                vender e entregar seus produtos digitais com excelência.
              </p>
            </div>
          </div>
        </section>

        {/* Main Features */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Recursos Principais
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Funcionalidades que fazem a diferença no seu negócio digital
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mainFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-2">
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                      <feature.icon className={`w-7 h-7 ${feature.color}`} />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Product Types */}
        <section className="py-20 bg-card">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Tipos de Produtos Suportados
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Venda qualquer tipo de infoproduto digital
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {productFeatures.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Features */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Tecnologia de Ponta
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Infraestrutura robusta e escalável para seu negócio
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {technicalFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-owl text-primary-foreground">
          <div className="container text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <Rocket className="w-16 h-16 mx-auto opacity-90" />
              <h2 className="text-3xl md:text-5xl font-bold">
                Pronto Para Começar?
              </h2>
              <p className="text-lg md:text-xl opacity-90 leading-relaxed">
                Experimente todos esses recursos e comece a vender seus infoprodutos hoje mesmo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="text-lg px-8 bg-background text-foreground hover:bg-background/90"
                  >
                    Ver Produtos
                  </Button>
                </Link>
                <Link href="/about">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="text-lg px-8 border-2 border-background text-background hover:bg-background/10"
                  >
                    Sobre Nós
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
