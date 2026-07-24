import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Upload,
  Settings,
  Share2,
  DollarSign,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Process() {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Crie Seu Produto",
      description: "Faça upload do seu conteúdo: vídeos de cursos, PDFs de e-books, áudios de audiobooks ou arquivos de apps. Nossa plataforma aceita todos os formatos.",
      details: [
        "Upload ilimitado de arquivos",
        "Organização em módulos e aulas",
        "Suporte a vídeos, PDFs, áudios e mais",
        "Interface intuitiva e fácil de usar"
      ]
    },
    {
      number: "02",
      icon: Settings,
      title: "Configure Seu Produto",
      description: "Defina preço, descrição, imagens, categorias e todas as informações do seu produto. Personalize a experiência de compra para seus clientes.",
      details: [
        "Defina preços em múltiplas moedas",
        "Crie descrições atrativas",
        "Adicione imagens e vídeos de apresentação",
        "Configure certificados automáticos"
      ]
    },
    {
      number: "03",
      icon: Share2,
      title: "Divulgue e Venda",
      description: "Compartilhe o link do seu produto nas redes sociais, crie campanhas de afiliados e comece a vender. Nossa plataforma cuida do resto.",
      details: [
        "Links de vendas personalizados",
        "Sistema de afiliados integrado",
        "Páginas de vendas otimizadas",
        "Checkout de alta conversão"
      ]
    },
    {
      number: "04",
      icon: DollarSign,
      title: "Receba Seus Pagamentos",
      description: "Os pagamentos são processados automaticamente via Stripe. Você recebe diretamente na sua conta com as menores taxas do mercado.",
      details: [
        "Apenas 3,99% de taxa por transação",
        "Pagamentos via cartão de crédito",
        "Recebimento automático",
        "Dashboard com relatórios completos"
      ]
    }
  ];

  const benefits = [
    "Sem mensalidade: pague apenas quando vender",
    "Taxas 60% menores que os concorrentes",
    "Entrega automática dos produtos",
    "Área de membros profissional",
    "Suporte dedicado em português",
    "Atualizações constantes e gratuitas"
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
                <CheckCircle2 size={16} />
                <span>Simples e Eficiente</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold">
                Como Funciona a Contentfy
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Em apenas 4 passos simples, você cria, configura e começa a vender seus 
                infoprodutos. Sem complicação, sem burocracia.
              </p>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20">
          <div className="container">
            <div className="space-y-24">
              {steps.map((step, index) => (
                <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
                  {/* Content */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="text-6xl font-bold text-primary/20">
                        {step.number}
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <step.icon className="w-7 h-7 text-primary" />
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold">
                      {step.title}
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                    <ul className="space-y-3">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual */}
                  <div className="flex-1">
                    <Card className="border-2 hover:shadow-2xl transition-shadow">
                      <CardContent className="p-12">
                        <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <step.icon className="w-24 h-24 text-primary" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-card">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  Por Que Escolher a Contentfy?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Vantagens que fazem a diferença no seu negócio
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4 p-6 rounded-lg hover:bg-accent/5 transition-colors">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-lg font-medium">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  Linha do Tempo
                </h2>
                <p className="text-lg text-muted-foreground">
                  Do cadastro à primeira venda em minutos
                </p>
              </div>
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
                
                <div className="space-y-12">
                  <div className="relative flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold z-10">
                      0min
                    </div>
                    <div className="flex-1 pt-3">
                      <h3 className="text-xl font-bold mb-2">Cadastro Rápido</h3>
                      <p className="text-muted-foreground">Crie sua conta em menos de 1 minuto</p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold z-10">
                      5min
                    </div>
                    <div className="flex-1 pt-3">
                      <h3 className="text-xl font-bold mb-2">Upload do Conteúdo</h3>
                      <p className="text-muted-foreground">Faça upload dos seus arquivos</p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold z-10">
                      10min
                    </div>
                    <div className="flex-1 pt-3">
                      <h3 className="text-xl font-bold mb-2">Configuração</h3>
                      <p className="text-muted-foreground">Defina preço, descrição e imagens</p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold z-10">
                      15min
                    </div>
                    <div className="flex-1 pt-3">
                      <h3 className="text-xl font-bold mb-2">Primeira Venda! 🎉</h3>
                      <p className="text-muted-foreground">Compartilhe o link e comece a vender</p>
                    </div>
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
              <CheckCircle2 className="w-16 h-16 mx-auto opacity-90" />
              <h2 className="text-3xl md:text-5xl font-bold">
                Comece Agora em 4 Passos
              </h2>
              <p className="text-lg md:text-xl opacity-90 leading-relaxed">
                Não perca mais tempo com plataformas complicadas. 
                Comece a vender hoje mesmo de forma simples e eficiente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/admin">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="text-lg px-8 bg-background text-foreground hover:bg-background/90"
                  >
                    <ArrowRight className="mr-2" size={20} />
                    Criar Meu Produto
                  </Button>
                </Link>
                <Link href="/examples">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="text-lg px-8 border-2 border-background text-background hover:bg-background/10"
                  >
                    Ver Exemplos
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
