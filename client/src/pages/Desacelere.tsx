import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Star,
  ArrowRight,
  Shield,
  Clock,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";

const HERO_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663097022226/Qf2ybVS3fKbp69WuPYRytJ/desacelere_hero_bg-49SjHkZ9Zq4VXLF5SeHWvU.webp";
const MOCKUP_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663097022226/Qf2ybVS3fKbp69WuPYRytJ/desacelere_mockup_oficial-FDXUTUiPqGyfYHoemKGAag.webp";

const BENEFIT_ICONS = {
  mindfulness:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663097022226/Qf2ybVS3fKbp69WuPYRytJ/desacelere_benefit_icon_1-c4nMwpXC4yP88mTnkwdJLi.webp",
  anxiety:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663097022226/Qf2ybVS3fKbp69WuPYRytJ/desacelere_benefit_icon_2-Ez34SeTdg6E7L2otg2pyf9.webp",
  relationships:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663097022226/Qf2ybVS3fKbp69WuPYRytJ/desacelere_benefit_icon_3-nkJ8ACnPKSdNqpfFcTUbAt.webp",
  purpose:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663097022226/Qf2ybVS3fKbp69WuPYRytJ/desacelere_benefit_icon_4-bubbJpqkXnm67MTdPZSEKF.webp",
};

const testimonials = [
  {
    name: "Marina Silva",
    role: "Executiva de Marketing",
    text: "Finalmente consegui desacelerar e recuperar meu equilíbrio. As técnicas do livro são práticas e realmente funcionam no dia a dia.",
    rating: 5,
  },
  {
    name: "Carlos Mendes",
    role: "Desenvolvedor de Software",
    text: "Como alguém que trabalha 12 horas por dia, este livro foi uma revelação. Aprendi a priorizar o que realmente importa.",
    rating: 5,
  },
  {
    name: "Juliana Costa",
    role: "Psicóloga",
    text: "Recomendo para todos os meus pacientes. O conteúdo é profundo, prático e transformador.",
    rating: 5,
  },
];

const problems = [
  {
    title: "Ansiedade Constante",
    description:
      "Você se sente sempre acelerado, sem conseguir desligar do trabalho e das preocupações?",
  },
  {
    title: "Relacionamentos Superficiais",
    description:
      "Dificuldade em construir conexões profundas e significativas com as pessoas ao seu redor.",
  },
  {
    title: "Falta de Propósito",
    description:
      "Vive no piloto automático, sem saber realmente qual é o seu verdadeiro propósito de vida.",
  },
  {
    title: "Esgotamento Emocional",
    description:
      "Cansaço mental constante, dificuldade em relaxar e recuperar a energia.",
  },
];

const benefits = [
  {
    title: "Mindfulness & Meditação",
    description:
      "Técnicas comprovadas de meditação adaptadas para a vida moderna e acelerada.",
    icon: BENEFIT_ICONS.mindfulness,
  },
  {
    title: "Controle da Ansiedade",
    description:
      "Estratégias práticas para identificar e controlar os gatilhos de ansiedade.",
    icon: BENEFIT_ICONS.anxiety,
  },
  {
    title: "Relacionamentos Profundos",
    description:
      "Como construir conexões mais autênticas e significativas com as pessoas.",
    icon: BENEFIT_ICONS.relationships,
  },
  {
    title: "Encontre seu Propósito",
    description:
      "Descubra o que realmente importa e viva com intenção e significado.",
    icon: BENEFIT_ICONS.purpose,
  },
];

const learnings = [
  "Técnicas de mindfulness e meditação adaptadas",
  "Como identificar suas prioridades reais",
  "Estratégias para controlar a ansiedade",
  "Como construir relacionamentos mais profundos",
  "Rotinas diárias para manter o equilíbrio",
  "Ferramentas para encontrar seu propósito",
];

export default function Desacelere() {
  const [, navigate] = useLocation();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleCheckout = () => {
    navigate("/checkout/desacelere");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />

      <main className="flex-1 w-full overflow-hidden">
        {/* Hero — always dark overlay for photo contrast */}
        <section
          className="relative min-h-[85vh] flex items-center justify-center py-20 px-4 md:px-8"
          style={{
            backgroundImage: `url('${HERO_BG}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/35" />

          <div className="relative z-10 container max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 text-white">
                <Badge className="w-fit bg-orange-500 hover:bg-orange-600 text-white border-0">
                  E-book de Desenvolvimento Pessoal
                </Badge>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white">
                  Desacelere.{" "}
                  <span className="text-orange-300">Respire.</span> Viva com
                  Propósito
                </h1>

                <p className="text-lg md:text-2xl text-white/90 leading-relaxed">
                  Um guia completo para encontrar paz interior e equilíbrio
                  emocional em um mundo acelerado
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    size="lg"
                    onClick={handleCheckout}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-6"
                  >
                    Começar Agora
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/40 bg-black/20 text-white hover:bg-white/15 text-lg px-8 py-6"
                    onClick={() =>
                      document
                        .getElementById("solucao")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Saber Mais
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-300" />
                    <span className="text-sm">Garantia de 30 dias</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-300" />
                    <span className="text-sm">Acesso imediato</span>
                  </div>
                </div>
              </div>

              <div className="hidden lg:flex justify-center">
                <img
                  src={MOCKUP_IMG}
                  alt="Mockup do e-book Desacelere"
                  className="w-full max-w-md drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/*
          Conteúdo da LP em superfície clara fixa.
          Evita texto claro-sobre-claro / cinza-sobre-escuro quando o site está em dark mode.
        */}
        <div className="bg-[#f8fafc] text-slate-900">
          {/* Problems */}
          <section className="py-20 px-4 md:px-8 bg-slate-100">
            <div className="container max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">
                  Você se sente constantemente acelerado?
                </h2>
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                  Muitas pessoas vivem em um estado de ansiedade permanente, sem
                  conseguir desligar ou encontrar equilíbrio.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {problems.map((problem) => (
                  <Card
                    key={problem.title}
                    className="border border-slate-200 border-l-4 border-l-orange-500 bg-white text-slate-900 shadow-sm"
                  >
                    <CardHeader>
                      <CardTitle className="text-xl text-slate-900">
                        {problem.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 leading-relaxed">
                        {problem.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Solution */}
          <section id="solucao" className="py-20 px-4 md:px-8 bg-white">
            <div className="container max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
                    A Solução: Um Guia Prático para Desacelerar
                  </h2>

                  <p className="text-lg text-slate-600 leading-relaxed">
                    O DESACELE! é mais do que um e-book — é um mapa completo
                    para recuperar seu equilíbrio emocional e viver com
                    propósito. Com 219 páginas de conteúdo profundo e prático,
                    você vai aprender técnicas que realmente funcionam.
                  </p>

                  <p className="text-lg text-slate-600 leading-relaxed">
                    Romário Oliveira, autor e especialista em desenvolvimento
                    pessoal, conduz você por uma jornada de autoconhecimento,
                    técnicas para controle da ansiedade e estratégias para viver
                    com mais leveza e propósito.
                  </p>

                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-slate-900">
                      O que você vai aprender:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {learnings.map((learning) => (
                        <div key={learning} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                          <span className="text-slate-700">{learning}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <img
                    src={MOCKUP_IMG}
                    alt="E-book Desacelere"
                    className="w-full max-w-sm drop-shadow-2xl rounded-xl"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-orange-50 to-white">
            <div className="container max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">
                  Benefícios Transformadores
                </h2>
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                  Descubra como cada seção do DESACELE! pode transformar sua
                  vida
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {benefits.map((benefit) => (
                  <Card
                    key={benefit.title}
                    className="text-center bg-white text-slate-900 border border-slate-200 shadow-sm"
                  >
                    <CardHeader>
                      <div className="flex justify-center mb-4">
                        <img
                          src={benefit.icon}
                          alt=""
                          className="w-20 h-20"
                        />
                      </div>
                      <CardTitle className="text-lg text-slate-900">
                        {benefit.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 leading-relaxed">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-20 px-4 md:px-8 bg-white">
            <div className="container max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">
                  O que Dizem os Leitores
                </h2>
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                  Histórias reais de transformação
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {testimonials.map((testimonial) => (
                  <Card
                    key={testimonial.name}
                    className="bg-white text-slate-900 border border-slate-200 shadow-sm"
                  >
                    <CardHeader>
                      <div className="mb-4">
                        <CardTitle className="text-lg text-slate-900">
                          {testimonial.name}
                        </CardTitle>
                        <p className="text-sm text-slate-600">
                          {testimonial.role}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: testimonial.rating }).map(
                          (_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-orange-400 text-orange-400"
                            />
                          )
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 italic leading-relaxed">
                        "{testimonial.text}"
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Offer */}
          <section className="py-20 px-4 md:px-8 bg-slate-100">
            <div className="container max-w-4xl mx-auto">
              <Card className="border-2 border-orange-500 shadow-2xl bg-white text-slate-900">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-3xl md:text-4xl mb-4 text-slate-900">
                    Oferta Especial
                  </CardTitle>
                  <div className="space-y-4">
                    <div>
                      <p className="text-slate-600 text-lg mb-2">
                        Preço do E-book
                      </p>
                      <p className="text-5xl font-bold text-orange-600">
                        R$ 97,00
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-700">
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-orange-500" />
                        <span>Acesso Imediato</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-orange-500" />
                        <span>Garantia 30 dias</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-8">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-slate-900">
                      Incluso no Pacote:
                    </h3>
                    <ul className="space-y-2 text-slate-700">
                      {[
                        "E-book completo em PDF (219 páginas)",
                        "Acesso vitalício ao conteúdo",
                        "Atualizações futuras gratuitas",
                        "Parcelamento em até 12x sem juros",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <p className="text-sm text-slate-700">
                      <strong className="text-slate-900">
                        Garantia de Satisfação:
                      </strong>{" "}
                      Se não ficar satisfeito nos primeiros 30 dias, devolvemos
                      100% do seu dinheiro. Sem perguntas.
                    </p>
                  </div>

                  <Button
                    size="lg"
                    onClick={handleCheckout}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg py-6"
                  >
                    Comprar Agora - R$ 97,00
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>

                  <p className="text-center text-sm text-slate-500">
                    Pagamento 100% seguro com Stripe
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-20 px-4 md:px-8 bg-white">
            <div className="container max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">
                  Perguntas Frequentes
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q: "Para quem é este livro?",
                    a: "O DESACELE! é ideal para profissionais acelerados, pessoas com ansiedade, qualquer um que busque equilíbrio emocional e propósito de vida.",
                  },
                  {
                    q: "Qual é o formato?",
                    a: "O livro é entregue em formato PDF, acessível em qualquer dispositivo (computador, tablet, smartphone).",
                  },
                  {
                    q: "Posso acessar em qualquer dispositivo?",
                    a: "Sim! Após a compra, você recebe um link para download. Pode ler no seu computador, tablet ou smartphone.",
                  },
                  {
                    q: "Há garantia de satisfação?",
                    a: "Sim! Oferecemos garantia de 30 dias. Se não ficar satisfeito, devolvemos 100% do seu dinheiro.",
                  },
                  {
                    q: "Como faço para acessar após a compra?",
                    a: "Você receberá um e-mail com o link de download imediatamente após a confirmação do pagamento.",
                  },
                ].map((faq, idx) => (
                  <Card
                    key={faq.q}
                    className="cursor-pointer bg-white text-slate-900 border border-slate-200 shadow-sm"
                    onClick={() =>
                      setExpandedFaq(expandedFaq === idx ? null : idx)
                    }
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-3">
                        <CardTitle className="text-lg text-slate-900">
                          {faq.q}
                        </CardTitle>
                        <span className="text-2xl text-orange-500 shrink-0">
                          {expandedFaq === idx ? "−" : "+"}
                        </span>
                      </div>
                    </CardHeader>
                    {expandedFaq === idx && (
                      <CardContent className="pt-0">
                        <p className="text-slate-600 leading-relaxed">
                          {faq.a}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Final CTA */}
        <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="container max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Pronto para Desacelerar?
            </h2>
            <p className="text-xl md:text-2xl text-white/90">
              Comece sua jornada para paz interior e equilíbrio emocional hoje
              mesmo
            </p>
            <Button
              size="lg"
              onClick={handleCheckout}
              className="bg-white text-orange-600 hover:bg-white/95 text-lg px-8 py-6"
            >
              Comprar Agora - R$ 97,00
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="text-sm text-white/80">
              Acesso imediato • Garantia de 30 dias • Pagamento seguro
            </p>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
