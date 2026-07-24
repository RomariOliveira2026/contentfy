import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar,
  Clock,
  User,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  ArrowLeft,
  BookOpen,
  TrendingUp
} from "lucide-react";
import { Link, useParams } from "wouter";
import { toast } from "sonner";

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug;

  // Mock article data - in production, fetch from API/database
  const article = {
    title: "Como Criar um Infoproduto Lucrativo em 2024",
    excerpt: "Descubra o passo a passo completo para criar, validar e lançar seu primeiro infoproduto e começar a faturar online.",
    category: "Empreendedorismo",
    author: {
      name: "Equipe Contentfy",
      avatar: "EC",
      bio: "Especialistas em infoprodutos e marketing digital"
    },
    date: "15 Nov 2024",
    readTime: "8 min",
    image: "/blog/infoproduto-lucrativo.jpg",
    content: `
## Introdução

Criar um infoproduto lucrativo é o sonho de muitos empreendedores digitais. Com o mercado de educação online crescendo exponencialmente, nunca houve momento melhor para transformar seu conhecimento em um negócio rentável.

Neste guia completo, você vai aprender o passo a passo para criar, validar e lançar seu primeiro infoproduto com sucesso.

## 1. Escolha um Nicho Lucrativo

O primeiro passo é identificar um nicho que combine três elementos essenciais:

- **Sua expertise:** Escolha um tema que você domina
- **Demanda do mercado:** Verifique se há pessoas buscando soluções
- **Capacidade de pagamento:** Certifique-se que seu público pode pagar

### Como Validar Seu Nicho

Antes de investir tempo criando conteúdo, valide sua ideia:

1. Pesquise no Google Trends
2. Analise grupos do Facebook e fóruns
3. Verifique produtos similares no mercado
4. Faça uma pesquisa com potenciais clientes

## 2. Defina o Formato do Seu Infoproduto

Existem diversos formatos de infoprodutos. Escolha o que melhor se adequa ao seu conteúdo:

- **E-books:** Ideais para guias práticos e passo a passo
- **Cursos em vídeo:** Perfeitos para ensinar habilidades práticas
- **Audiobooks:** Ótimos para conteúdo consumível em movimento
- **Mentorias:** Para acompanhamento personalizado
- **Templates e ferramentas:** Soluções prontas para usar

## 3. Crie Conteúdo de Qualidade

A qualidade do seu conteúdo é o que vai determinar seu sucesso a longo prazo. Siga estas diretrizes:

### Estrutura Clara

- Introdução envolvente
- Módulos bem organizados
- Exercícios práticos
- Conclusão com próximos passos

### Produção Profissional

Invista em:
- Boa iluminação (para vídeos)
- Áudio de qualidade
- Edição profissional
- Design atraente

## 4. Precifique Estrategicamente

A precificação é crucial para o sucesso do seu infoproduto. Considere:

- **Valor percebido:** Quanto vale a transformação que você oferece?
- **Concorrência:** Como estão os preços no mercado?
- **Público-alvo:** Qual a capacidade de pagamento?
- **Custo de produção:** Quanto você investiu?

### Estratégias de Precificação

- Preço de lançamento promocional
- Parcelamento facilitado
- Upsells e downsells
- Programas de afiliados

## 5. Lance com Estratégia

Um lançamento bem planejado pode multiplicar suas vendas. Siga este cronograma:

### Pré-lançamento (30 dias antes)

- Crie expectativa nas redes sociais
- Produza conteúdo gratuito de valor
- Construa sua lista de email
- Faça lives e webinars

### Lançamento (7 dias)

- Abra o carrinho com oferta especial
- Envie emails diários
- Faça lives de vendas
- Compartilhe depoimentos

### Pós-lançamento

- Mantenha vendas evergreen
- Colete feedback dos alunos
- Melhore continuamente o produto
- Crie novos produtos complementares

## 6. Escale com Afiliados

Um programa de afiliados pode multiplicar suas vendas exponencialmente:

- Ofereça comissões atrativas (30-50%)
- Forneça materiais de divulgação prontos
- Crie desafios e bonificações
- Mantenha comunicação constante

## Conclusão

Criar um infoproduto lucrativo exige planejamento, execução e persistência. Mas com as estratégias certas, você pode transformar seu conhecimento em um negócio digital rentável.

Lembre-se: o sucesso não vem da noite para o dia. Continue aprendendo, testando e melhorando. Sua jornada como criador de infoprodutos está apenas começando!

## Próximos Passos

Pronto para começar? Aqui está o que fazer agora:

1. Escolha seu nicho e valide a ideia
2. Defina o formato do seu infoproduto
3. Crie um MVP (Produto Mínimo Viável)
4. Lance para um grupo pequeno
5. Colete feedback e melhore
6. Escale suas vendas

**Boa sorte na sua jornada!** 🚀
    `
  };

  const relatedPosts = [
    {
      slug: "marketing-digital-para-iniciantes",
      title: "Marketing Digital para Iniciantes",
      category: "Marketing",
      readTime: "10 min"
    },
    {
      slug: "sistema-afiliados-aumentar-vendas",
      title: "Sistema de Afiliados para Aumentar Vendas",
      category: "Vendas",
      readTime: "7 min"
    },
    {
      slug: "precificar-curso-online",
      title: "Como Precificar Seu Curso Online",
      category: "Estratégia",
      readTime: "6 min"
    }
  ];

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = article.title;

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Link copiado para a área de transferência!");
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-20">
        {/* Breadcrumb */}
        <section className="py-6 border-b border-border">
          <div className="container">
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft size={16} />
                Voltar para o Blog
              </Button>
            </Link>
          </div>
        </section>

        {/* Article Header */}
        <section className="py-12">
          <div className="container max-w-4xl">
            <Badge className="mb-4">{article.category}</Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              {article.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              {article.excerpt}
            </p>

            {/* Author Info */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {article.author.avatar}
                </div>
                <div>
                  <div className="font-semibold">{article.author.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {article.author.bio}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="py-8">
          <div className="container max-w-4xl">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
              <BookOpen className="w-24 h-24 text-primary/30" />
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-12">
          <div className="container max-w-4xl">
            <div className="grid lg:grid-cols-[1fr_250px] gap-12">
              {/* Main Content */}
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-line leading-relaxed">
                  {article.content.split('\n').map((line, index) => {
                    if (line.startsWith('## ')) {
                      return (
                        <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
                          {line.replace('## ', '')}
                        </h2>
                      );
                    } else if (line.startsWith('### ')) {
                      return (
                        <h3 key={index} className="text-xl font-semibold mt-6 mb-3">
                          {line.replace('### ', '')}
                        </h3>
                      );
                    } else if (line.startsWith('- ')) {
                      return (
                        <li key={index} className="ml-6 mb-2">
                          {line.replace('- ', '')}
                        </li>
                      );
                    } else if (line.trim() === '') {
                      return <br key={index} />;
                    } else if (line.startsWith('**') && line.endsWith('**')) {
                      return (
                        <p key={index} className="font-semibold mb-4">
                          {line.replace(/\*\*/g, '')}
                        </p>
                      );
                    } else {
                      return (
                        <p key={index} className="mb-4 text-muted-foreground">
                          {line}
                        </p>
                      );
                    }
                  })}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Share */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Share2 size={18} />
                      Compartilhar
                    </h3>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start gap-2"
                        onClick={() => handleShare("facebook")}
                      >
                        <Facebook size={16} />
                        Facebook
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start gap-2"
                        onClick={() => handleShare("twitter")}
                      >
                        <Twitter size={16} />
                        Twitter
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start gap-2"
                        onClick={() => handleShare("linkedin")}
                      >
                        <Linkedin size={16} />
                        LinkedIn
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start gap-2"
                        onClick={() => handleShare("copy")}
                      >
                        <LinkIcon size={16} />
                        Copiar Link
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Author Card */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {article.author.avatar}
                      </div>
                      <div>
                        <div className="font-semibold">{article.author.name}</div>
                        <div className="text-xs text-muted-foreground">Autor</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {article.author.bio}
                    </p>
                  </CardContent>
                </Card>

                {/* CTA Card */}
                <Card className="bg-primary/5">
                  <CardContent className="pt-6">
                    <TrendingUp className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">
                      Pronto para Começar?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Crie e venda seus infoprodutos na Contentfy!
                    </p>
                    <Button className="w-full" asChild>
                      <Link href="/admin">Começar Agora</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Related Posts */}
        <section className="py-16 bg-card">
          <div className="container max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              Artigos Relacionados
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
                    <CardContent className="pt-6">
                      <Badge variant="secondary" className="mb-3">
                        {post.category}
                      </Badge>
                      <h3 className="font-semibold mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock size={12} />
                        <span>{post.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
