import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Clock
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success("Mensagem enviada com sucesso!", {
      description: "Entraremos em contato em breve."
    });

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "contato@contentfy.com.br",
      link: "mailto:contato@contentfy.com.br"
    },
    {
      icon: Phone,
      title: "Telefone",
      content: "+55 (11) 99999-9999",
      link: "tel:+5511999999999"
    },
    {
      icon: MapPin,
      title: "Endereço",
      content: "São Paulo, SP - Brasil",
      link: null
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
                <MessageCircle size={16} />
                <span>Fale Conosco</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold">
                Entre em Contato
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Tem dúvidas, sugestões ou precisa de ajuda? Estamos aqui para você! 
                Envie sua mensagem e responderemos o mais rápido possível.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info Section */}
        <section className="py-20">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="pt-8">
                    <h2 className="text-2xl font-bold mb-6">
                      Envie Sua Mensagem
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome Completo *</Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Seu nome"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Assunto *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="Sobre o que você quer falar?"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Mensagem *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Escreva sua mensagem aqui..."
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>Enviando...</>
                        ) : (
                          <>
                            <Send className="mr-2 w-4 h-4" />
                            Enviar Mensagem
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    Informações de Contato
                  </h2>
                  <div className="space-y-4">
                    {contactInfo.map((info, index) => {
                      const Icon = info.icon;
                      const content = info.link ? (
                        <a 
                          href={info.link} 
                          className="text-primary hover:underline"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">{info.content}</span>
                      );

                      return (
                        <Card key={index} className="hover:shadow-md transition-shadow">
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold mb-1">{info.title}</h3>
                                {content}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Business Hours */}
                <Card className="bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Horário de Atendimento</h3>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>Segunda a Sexta: 9h às 18h</p>
                          <p>Sábado: 9h às 13h</p>
                          <p>Domingo: Fechado</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* FAQ Link */}
                <Card className="bg-accent/5">
                  <CardContent className="pt-6 text-center">
                    <h3 className="font-semibold mb-2">Perguntas Frequentes</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Antes de entrar em contato, confira se sua dúvida já foi respondida!
                    </p>
                    <Button variant="outline" asChild className="w-full">
                      <a href="/faq">Ver FAQ</a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section (Optional) */}
        <section className="py-20 bg-card">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nossa Localização
              </h2>
              <p className="text-lg text-muted-foreground">
                Estamos localizados no coração de São Paulo
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">
                    Mapa interativo em breve
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <div className="container text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <MessageCircle className="w-16 h-16 mx-auto opacity-90" />
              <h2 className="text-3xl md:text-5xl font-bold">
                Estamos Aqui Para Ajudar!
              </h2>
              <p className="text-lg md:text-xl opacity-90 leading-relaxed">
                Nossa equipe está pronta para responder suas dúvidas e ajudar você 
                a ter a melhor experiência com a Contentfy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-lg px-8 bg-background text-foreground hover:bg-background/90"
                  asChild
                >
                  <a href="mailto:contato@contentfy.com.br">
                    <Mail className="mr-2" size={20} />
                    Enviar Email
                  </a>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg px-8 border-2 border-background text-background hover:bg-background/10"
                  asChild
                >
                  <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
                    <Phone className="mr-2" size={20} />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
