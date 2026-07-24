import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  GraduationCap,
  BookOpen,
  Headphones,
  Code2,
  Dumbbell,
  Utensils,
  Briefcase,
  Heart,
  TrendingUp,
  Music,
  Camera,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Examples() {
  const examples = [
    {
      icon: GraduationCap,
      title: "Curso de Marketing Digital",
      description: "Ensine estratégias de marketing, SEO, tráfego pago e vendas online com vídeo-aulas organizadas em módulos.",
      category: "Curso Online",
      price: "R$ 497",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: BookOpen,
      title: "E-book de Finanças Pessoais",
      description: "Compartilhe conhecimento sobre investimentos, economia e planejamento financeiro em formato PDF.",
      category: "E-book",
      price: "R$ 47",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      icon: Headphones,
      title: "Audiobook de Desenvolvimento Pessoal",
      description: "Transforme seu livro em áudio para quem prefere consumir conteúdo enquanto dirige ou se exercita.",
      category: "Audiobook",
      price: "R$ 67",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Code2,
      title: "Curso de Programação Python",
      description: "Do zero ao avançado: ensine Python com projetos práticos, exercícios e certificado de conclusão.",
      category: "Curso Online",
      price: "R$ 697",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    },
    {
      icon: Dumbbell,
      title: "Programa de Treino e Nutrição",
      description: "Venda planos de treino personalizados, dietas e acompanhamento para transformação física.",
      category: "Curso Online",
      price: "R$ 297",
      color: "text-red-500",
      bgColor: "bg-red-500/10"
    },
    {
      icon: Utensils,
      title: "E-book de Receitas Fit",
      description: "Compartilhe receitas saudáveis, dicas de nutrição e planos alimentares em formato digital.",
      category: "E-book",
      price: "R$ 37",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
    {
      icon: Briefcase,
      title: "Curso de Gestão de Negócios",
      description: "Ensine empreendedorismo, administração, liderança e estratégias para escalar empresas.",
      category: "Curso Online",
      price: "R$ 897",
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10"
    },
    {
      icon: Heart,
      title: "Audiobook de Mindfulness",
      description: "Meditações guiadas, técnicas de respiração e práticas para reduzir estresse e ansiedade.",
      category: "Audiobook",
      price: "R$ 57",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10"
    },
    {
      icon: TrendingUp,
      title: "Curso de Day Trade",
      description: "Estratégias de trading, análise técnica, gestão de risco e operações na bolsa de valores.",
      category: "Curso Online",
      price: "R$ 1.297",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    },
    {
      icon: Music,
      title: "Curso de Produção Musical",
      description: "Aprenda a produzir músicas profissionais, mixagem, masterização e uso de DAWs.",
      category: "Curso Online",
      price: "R$ 597",
      color: "text-violet-500",
      bgColor: "bg-violet-500/10"
    },
    {
      icon: Camera,
      title: "E-book de Fotografia",
      description: "Técnicas de composição, iluminação, edição e como monetizar sua fotografia.",
      category: "E-book",
      price: "R$ 67",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10"
    },
    {
      icon: Palette,
      title: "Curso de Design Gráfico",
      description: "Domine Photoshop, Illustrator, branding e crie portfólio profissional de design.",
      category: "Curso Online",
      price: "R$ 797",
      color: "text-rose-500",
      bgColor: "bg-rose-500/10"
    }
  ];

  const useCases = [
    {
      title: "Criadores de Conteúdo",
      description: "Monetize seu conhecimento criando cursos, e-books e audiobooks sobre sua área de expertise."
    },
    {
      title: "Coaches e Mentores",
      description: "Venda programas de mentoria, workshops gravados e materiais de apoio para seus clientes."
    },
    {
      title: "Professores e Educadores",
      description: "Crie cursos online, apostilas digitais e materiais complementares para seus alunos."
    },
    {
      title: "Empreendedores Digitais",
      description: "Lance infoprodutos escaláveis e construa um negócio digital lucrativo e automatizado."
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
                <BookOpen size={16} />
                <span>Exemplos Práticos</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold">
                Veja O Que Você Pode Criar
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Inspire-se com exemplos reais de infoprodutos que você pode vender na Contentfy. 
                De cursos online a e-books e audiobooks, as possibilidades são infinitas.
              </p>
            </div>
          </div>
        </section>

        {/* Examples Grid */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Exemplos de Produtos Digitais
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Veja alguns tipos de infoprodutos que você pode criar e vender
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {examples.map((example, index) => (
                <Card key={index} className="hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-2xl ${example.bgColor} flex items-center justify-center mb-4`}>
                      <example.icon className={`w-7 h-7 ${example.color}`} />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {example.category}
                      </span>
                      <span className="text-sm font-bold text-primary">
                        {example.price}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{example.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {example.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 bg-card">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Para Quem é a Contentfy?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Profissionais e criadores que querem monetizar seu conhecimento
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {useCases.map((useCase, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <div className="text-2xl font-bold text-primary">{index + 1}</div>
                    </div>
                    <h3 className="text-xl font-bold">{useCase.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {useCase.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="container">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-12 md:p-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Números Que Inspiram
                </h2>
                <p className="text-lg text-muted-foreground">
                  Veja o potencial do mercado de infoprodutos
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    R$ 2.5B
                  </div>
                  <div className="text-muted-foreground">
                    Mercado de infoprodutos no Brasil em 2024
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                    45%
                  </div>
                  <div className="text-muted-foreground">
                    Crescimento anual do setor de educação online
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    5M+
                  </div>
                  <div className="text-muted-foreground">
                    Brasileiros comprando cursos online
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <div className="container text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <GraduationCap className="w-16 h-16 mx-auto opacity-90" />
              <h2 className="text-3xl md:text-5xl font-bold">
                Crie Seu Primeiro Infoproduto Hoje
              </h2>
              <p className="text-lg md:text-xl opacity-90 leading-relaxed">
                Junte-se a milhares de criadores que já estão transformando conhecimento em renda.
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
                <Link href="/features">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="text-lg px-8 border-2 border-background text-background hover:bg-background/10"
                  >
                    Ver Recursos
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
