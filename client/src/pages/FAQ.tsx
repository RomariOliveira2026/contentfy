import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  HelpCircle,
  MessageCircle,
  Mail,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function FAQ() {
  const faqs = [
    {
      category: "Geral",
      questions: [
        {
          question: "O que é a Contentfy?",
          answer: "A Contentfy é uma plataforma completa para criação, venda e entrega de infoprodutos digitais. Oferecemos todas as ferramentas necessárias para você vender cursos online, e-books, audiobooks e apps com as menores taxas do mercado."
        },
        {
          question: "Quanto custa usar a Contentfy?",
          answer: "Não cobramos mensalidade! Você paga apenas quando vende: 3,99% + R$ 0,39 por transação (taxa do Stripe). Isso é 60% mais barato que plataformas como Hotmart (9,9%) e Eduzz (8,9%)."
        },
        {
          question: "Preciso de conhecimentos técnicos?",
          answer: "Não! Nossa plataforma foi desenvolvida para ser intuitiva e fácil de usar. Em menos de 15 minutos você consegue criar e publicar seu primeiro produto digital."
        },
        {
          question: "Posso vender em outras moedas?",
          answer: "Sim! A Contentfy suporta múltiplas moedas (BRL, USD, EUR) e múltiplos idiomas (Português, Inglês, Espanhol), permitindo que você venda globalmente."
        }
      ]
    },
    {
      category: "Produtos",
      questions: [
        {
          question: "Que tipos de produtos posso vender?",
          answer: "Você pode vender cursos online (vídeos), e-books (PDFs), audiobooks (áudios), apps, softwares e qualquer tipo de produto digital. Não há limitações de formato ou tamanho."
        },
        {
          question: "Quantos produtos posso cadastrar?",
          answer: "Ilimitados! Você pode cadastrar quantos produtos quiser sem custo adicional. Organize seu catálogo da forma que preferir."
        },
        {
          question: "Como funciona a entrega dos produtos?",
          answer: "A entrega é 100% automática! Assim que o pagamento é aprovado, o cliente recebe acesso imediato ao produto na área de membros. Você não precisa fazer nada manualmente."
        },
        {
          question: "Posso atualizar meus produtos depois de vendidos?",
          answer: "Sim! Você pode atualizar o conteúdo dos seus produtos a qualquer momento. Todos os clientes que já compraram terão acesso automático às atualizações."
        }
      ]
    },
    {
      category: "Pagamentos",
      questions: [
        {
          question: "Como recebo os pagamentos?",
          answer: "Os pagamentos são processados via Stripe e caem diretamente na sua conta bancária. O Stripe repassa o dinheiro em até 2 dias úteis após a aprovação da compra."
        },
        {
          question: "Quais formas de pagamento são aceitas?",
          answer: "Aceitamos cartões de crédito (Visa, Mastercard, American Express, Elo) e cartões de débito. O Stripe processa os pagamentos com segurança máxima."
        },
        {
          question: "Preciso ter CNPJ?",
          answer: "Não necessariamente. Você pode receber como pessoa física (CPF) ou pessoa jurídica (CNPJ). Consulte seu contador sobre a melhor opção para o seu caso."
        },
        {
          question: "Há taxa de saque ou transferência?",
          answer: "Não! O Stripe transfere o dinheiro automaticamente para sua conta sem cobrar taxa adicional de saque. Você paga apenas a taxa de 3,99% + R$ 0,39 por transação."
        }
      ]
    },
    {
      category: "Afiliados",
      questions: [
        {
          question: "Como funciona o sistema de afiliados?",
          answer: "Você pode criar um programa de afiliados para seus produtos, definindo a comissão que deseja pagar. Os afiliados recebem um link único e ganham comissão por cada venda realizada através dele."
        },
        {
          question: "Posso definir comissões diferentes por produto?",
          answer: "Sim! Você tem total controle para definir a porcentagem de comissão de cada produto individualmente, permitindo estratégias personalizadas."
        },
        {
          question: "Como os afiliados recebem?",
          answer: "Os afiliados recebem diretamente via Stripe, de acordo com as regras que você definir (pagamento imediato, semanal ou mensal)."
        },
        {
          question: "Posso aprovar afiliados manualmente?",
          answer: "Sim! Você pode configurar para aprovar cada afiliado manualmente ou permitir cadastro automático. Você tem total controle sobre quem promove seus produtos."
        }
      ]
    },
    {
      category: "Suporte",
      questions: [
        {
          question: "Como funciona o suporte?",
          answer: "Oferecemos suporte via email, chat e documentação completa. Nossa equipe responde em até 24 horas em dias úteis. Para emergências, temos suporte prioritário."
        },
        {
          question: "Há treinamentos disponíveis?",
          answer: "Sim! Oferecemos documentação completa, tutoriais em vídeo e guias passo a passo para você aproveitar ao máximo a plataforma."
        },
        {
          question: "Posso migrar de outra plataforma?",
          answer: "Sim! Ajudamos você a migrar seus produtos e clientes de outras plataformas (Hotmart, Eduzz, Kiwify, etc.) de forma simples e segura."
        },
        {
          question: "A plataforma tem atualizações?",
          answer: "Sim! Lançamos atualizações e novos recursos constantemente, sempre gratuitos para todos os usuários. Você não paga nada a mais por isso."
        }
      ]
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
                <HelpCircle size={16} />
                <span>Perguntas Frequentes</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold">
                Tire Suas Dúvidas
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Encontre respostas para as perguntas mais comuns sobre a Contentfy. 
                Se não encontrar o que procura, entre em contato conosco!
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container max-w-4xl">
            <div className="space-y-12">
              {faqs.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">{categoryIndex + 1}</span>
                    </div>
                    {category.category}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem 
                        key={faqIndex} 
                        value={`${categoryIndex}-${faqIndex}`}
                        className="border rounded-lg px-6 hover:shadow-md transition-shadow"
                      >
                        <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-card">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ainda Tem Dúvidas?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Entre em contato conosco através dos canais abaixo
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <MessageCircle className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg">Chat Online</h3>
                    <p className="text-sm text-muted-foreground">
                      Resposta em minutos durante horário comercial
                    </p>
                    <Button variant="outline" className="w-full">
                      Iniciar Chat
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                      <Mail className="w-7 h-7 text-accent" />
                    </div>
                    <h3 className="font-bold text-lg">Email</h3>
                    <p className="text-sm text-muted-foreground">
                      Resposta em até 24 horas
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="mailto:suporte@contentfy.com.br">
                        Enviar Email
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Phone className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg">WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">
                      Suporte direto e personalizado
                    </p>
                    <Button variant="outline" className="w-full">
                      Chamar no WhatsApp
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <div className="container text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <HelpCircle className="w-16 h-16 mx-auto opacity-90" />
              <h2 className="text-3xl md:text-5xl font-bold">
                Pronto Para Começar?
              </h2>
              <p className="text-lg md:text-xl opacity-90 leading-relaxed">
                Não deixe suas dúvidas te impedirem de transformar seu conhecimento em renda. 
                Comece agora e veja como é fácil!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/admin">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="text-lg px-8 bg-background text-foreground hover:bg-background/90"
                  >
                    Criar Meu Produto
                  </Button>
                </Link>
                <Link href="/process">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="text-lg px-8 border-2 border-background text-background hover:bg-background/10"
                  >
                    Ver Como Funciona
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
