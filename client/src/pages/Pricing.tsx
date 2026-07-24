import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap } from "lucide-react";
import { Link } from "wouter";

export default function Pricing() {
  const plans = [
    {
      name: "Básico",
      price: "R$ 97",
      period: "/mês",
      description: "Perfeito para começar sua jornada",
      features: [
        "Até 3 produtos",
        "100 vendas/mês",
        "Suporte por email",
        "Certificados básicos",
        "Dashboard simples"
      ],
      cta: "Começar Agora",
      popular: false
    },
    {
      name: "Pro",
      price: "R$ 197",
      period: "/mês",
      description: "Ideal para criadores profissionais",
      features: [
        "Produtos ilimitados",
        "Vendas ilimitadas",
        "Suporte prioritário",
        "Certificados personalizados",
        "Dashboard avançado",
        "Sistema de afiliados",
        "Webhooks e API",
        "Domínio personalizado"
      ],
      cta: "Escolher Pro",
      popular: true
    },
    {
      name: "Premium",
      price: "R$ 397",
      period: "/mês",
      description: "Para quem quer escalar ao máximo",
      features: [
        "Tudo do Pro +",
        "Gerente de conta dedicado",
        "Consultoria mensal",
        "White label completo",
        "Integrações customizadas",
        "Prioridade máxima",
        "Relatórios personalizados",
        "Treinamento da equipe"
      ],
      cta: "Escolher Premium",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--owl-dark)] via-[var(--owl-graphite)] to-[var(--owl-dark)]" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 right-20 w-96 h-96 bg-[var(--owl-orange)] rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-[var(--owl-yellow)] rounded-full blur-3xl" />
          </div>
          
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4 bg-gradient-owl border-0 text-white hover:scale-105 transition-transform">
                💰 Planos e Preços
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
                Escolha o <span className="text-gradient-owl">Plano Perfeito</span> para Você
              </h1>
              <p className="text-lg lg:text-xl text-gray-300 mb-8">
                Comece gratuitamente e escale conforme seu negócio cresce. Sem taxas ocultas, sem surpresas.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 lg:py-24">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <AnimatedSection key={plan.name} delay={index * 0.15}>
                  <Card 
                    className={`relative h-full flex flex-col transition-all duration-300 ${
                      plan.popular 
                        ? 'card-owl-border hover-glow-owl bg-[var(--owl-graphite)] border-[var(--owl-orange)] scale-105 shadow-2xl' 
                        : 'hover:shadow-lg hover:scale-105'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge className="bg-gradient-owl border-0 text-white px-4 py-1 text-sm font-bold animate-pulse glow-orange">
                          <Zap className="w-4 h-4 mr-1 inline" />
                          MAIS POPULAR
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center pt-8">
                      <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : ''}`}>
                        {plan.name}
                      </h3>
                      <p className={`text-sm mb-4 ${plan.popular ? 'text-gray-300' : 'text-muted-foreground'}`}>
                        {plan.description}
                      </p>
                      <div className="mb-4">
                        <span className={`text-5xl font-bold ${plan.popular ? 'text-gradient-owl' : ''}`}>
                          {plan.price}
                        </span>
                        <span className={`text-lg ${plan.popular ? 'text-gray-300' : 'text-muted-foreground'}`}>
                          {plan.period}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col">
                      <ul className="space-y-3 mb-8 flex-1">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                              plan.popular ? 'text-[var(--owl-yellow)]' : 'text-primary'
                            }`} />
                            <span className={`text-sm ${plan.popular ? 'text-gray-300' : ''}`}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <Link href="/products">
                        <Button 
                          size="lg" 
                          className={`w-full ${
                            plan.popular 
                              ? 'bg-gradient-owl hover-glow-owl border-0 text-white font-bold' 
                              : ''
                          }`}
                        >
                          {plan.cta}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>

            {/* FAQ Section */}
            <AnimatedSection delay={0.5}>
              <div className="mt-20 max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Dúvidas Frequentes
                </h2>
                <p className="text-muted-foreground mb-8">
                  Não encontrou o que procurava? Entre em contato conosco!
                </p>
                <div className="grid gap-6 text-left">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">Posso mudar de plano a qualquer momento?</h3>
                      <p className="text-sm text-muted-foreground">
                        Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças são aplicadas imediatamente.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">Existe período de teste gratuito?</h3>
                      <p className="text-sm text-muted-foreground">
                        Sim! Todos os planos têm 14 dias de teste gratuito. Sem compromisso, sem cartão de crédito necessário.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">Quais formas de pagamento são aceitas?</h3>
                      <p className="text-sm text-muted-foreground">
                        Aceitamos cartão de crédito, boleto bancário e PIX. Pagamentos processados com segurança pelo Stripe.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-owl" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-[var(--owl-yellow)] rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[var(--owl-orange)] rounded-full blur-3xl animate-pulse" />
          </div>
          
          <div className="container text-center relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
              Ainda tem dúvidas?
            </h2>
            <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
              Nossa equipe está pronta para te ajudar a escolher o melhor plano para o seu negócio
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-white text-[var(--owl-orange)] hover:bg-white/90 hover:scale-105 transition-all font-bold glow-yellow">
                Falar com Especialista
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
