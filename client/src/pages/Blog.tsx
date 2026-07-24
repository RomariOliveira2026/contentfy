import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  BookOpen,
  Calendar,
  Clock,
  Search,
  TrendingUp,
  Users,
  Lightbulb,
  Target,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";

export default function Blog() {
  const blogPosts = [
    {
      slug: "como-criar-infoproduto-lucrativo",
      title: "Como Criar um Infoproduto Lucrativo em 2024",
      excerpt: "Descubra o passo a passo completo para criar, validar e lançar seu primeiro infoproduto e começar a faturar online.",
      category: "Empreendedorismo",
      author: "Equipe Contentfy",
      date: "15 Nov 2024",
      readTime: "8 min",
      image: "/blog/infoproduto-lucrativo.jpg",
      featured: true
    },
    {
      slug: "marketing-digital-para-iniciantes",
      title: "Marketing Digital para Iniciantes: Guia Completo",
      excerpt: "Aprenda as estratégias essenciais de marketing digital para promover seus infoprodutos e alcançar mais clientes.",
      category: "Marketing",
      author: "Ana Silva",
      date: "12 Nov 2024",
      readTime: "10 min",
      image: "/blog/marketing-digital.jpg",
      featured: true
    },
    {
      slug: "sistema-afiliados-aumentar-vendas",
      title: "Como Usar Sistema de Afiliados para Aumentar Vendas",
      excerpt: "Descubra como criar um programa de afiliados eficiente e escalar suas vendas de forma exponencial.",
      category: "Vendas",
      author: "Carlos Mendes",
      date: "10 Nov 2024",
      readTime: "7 min",
      image: "/blog/afiliados.jpg",
      featured: false
    },
    {
      slug: "precificar-curso-online",
      title: "Como Precificar Seu Curso Online Corretamente",
      excerpt: "Estratégias comprovadas para definir o preço ideal do seu curso e maximizar seus lucros sem perder clientes.",
      category: "Estratégia",
      author: "Juliana Oliveira",
      date: "08 Nov 2024",
      readTime: "6 min",
      image: "/blog/precificacao.jpg",
      featured: false
    },
    {
      slug: "copywriting-vendas-infoprodutos",
      title: "Copywriting: A Arte de Escrever para Vender",
      excerpt: "Técnicas de copywriting que convertem visitantes em compradores e aumentam suas vendas drasticamente.",
      category: "Marketing",
      author: "Roberto Alves",
      date: "05 Nov 2024",
      readTime: "9 min",
      image: "/blog/copywriting.jpg",
      featured: false
    },
    {
      slug: "criar-area-membros-engajadora",
      title: "Como Criar uma Área de Membros Engajadora",
      excerpt: "Dicas práticas para estruturar sua área de membros e manter seus alunos motivados até o final do curso.",
      category: "Educação",
      author: "Mariana Costa",
      date: "03 Nov 2024",
      readTime: "8 min",
      image: "/blog/area-membros.jpg",
      featured: false
    }
  ];

  const categories = [
    { name: "Todos", count: 24, icon: BookOpen },
    { name: "Empreendedorismo", count: 8, icon: TrendingUp },
    { name: "Marketing", count: 6, icon: Target },
    { name: "Vendas", count: 5, icon: Users },
    { name: "Estratégia", count: 3, icon: Lightbulb },
    { name: "Educação", count: 2, icon: BookOpen }
  ];

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <BookOpen size={16} />
                <span>Blog Contentfy</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold">
                Aprenda a Vender Mais
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Artigos, guias e estratégias para você criar, lançar e escalar 
                seus infoprodutos com sucesso.
              </p>

              {/* Search Bar */}
              <div className="max-w-xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input
                    type="search"
                    placeholder="Buscar artigos..."
                    className="pl-12 h-12 text-base"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 border-b border-border">
          <div className="container">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.name}
                    variant="outline"
                    className="gap-2"
                  >
                    <Icon size={16} />
                    {category.name}
                    <Badge variant="secondary" className="ml-1">
                      {category.count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="py-16">
            <div className="container">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold">
                  Artigos em Destaque
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}>
                    <Card className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group h-full">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative overflow-hidden">
                        <BookOpen className="w-16 h-16 text-primary/30" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <Badge className="absolute top-4 left-4 bg-primary">
                          {post.category}
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{post.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="py-16 bg-card">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">
                Todos os Artigos
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group h-full flex flex-col">
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative overflow-hidden">
                      <BookOpen className="w-12 h-12 text-primary/20" />
                      <Badge className="absolute top-4 left-4 bg-secondary">
                        {post.category}
                      </Badge>
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-12">
              <Button size="lg" variant="outline">
                Carregar Mais Artigos
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-20 bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <div className="container text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <BookOpen className="w-16 h-16 mx-auto opacity-90" />
              <h2 className="text-3xl md:text-4xl font-bold">
                Receba Conteúdo Exclusivo
              </h2>
              <p className="text-lg opacity-90">
                Inscreva-se na nossa newsletter e receba dicas semanais para 
                vender mais infoprodutos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Seu melhor email"
                  className="bg-background text-foreground h-12"
                />
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-background text-foreground hover:bg-background/90 whitespace-nowrap"
                >
                  Inscrever-se
                </Button>
              </div>
              <p className="text-sm opacity-75">
                ✓ Sem spam · ✓ Cancele quando quiser
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
