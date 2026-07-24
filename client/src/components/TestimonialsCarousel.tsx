import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  initials: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Maria Silva",
    role: "Empreendedora Digital",
    content: "A Contentfy mudou completamente meu negócio! Consegui lançar meu curso online em menos de uma semana e já faturei mais de R$ 50 mil no primeiro mês. A plataforma é intuitiva e o suporte é excepcional.",
    initials: "MS",
    rating: 5
  },
  {
    name: "João Santos",
    role: "Coach de Finanças",
    content: "Migrei do Hotmart para a Contentfy e economizei mais de 60% em taxas. Além disso, tenho total controle sobre minha plataforma e meus dados. Melhor decisão que tomei para meu negócio!",
    initials: "JS",
    rating: 5
  },
  {
    name: "Ana Paula Costa",
    role: "Professora de Yoga",
    content: "Vendo meus cursos de yoga online através da Contentfy há 6 meses. A área de membros é linda, os certificados automáticos são perfeitos e meus alunos adoram a experiência!",
    initials: "AC",
    rating: 5
  },
  {
    name: "Carlos Mendes",
    role: "Desenvolvedor",
    content: "Como programador, aprecio a qualidade técnica da plataforma. É rápida, segura e tem todas as funcionalidades que preciso. O sistema de afiliados me ajudou a escalar as vendas exponencialmente.",
    initials: "CM",
    rating: 5
  },
  {
    name: "Juliana Oliveira",
    role: "Nutricionista",
    content: "Publiquei meu e-book de receitas fit e já vendi mais de 2 mil cópias! A plataforma entrega automaticamente e os clientes recebem na hora. Processo totalmente automatizado e profissional.",
    initials: "JO",
    rating: 5
  },
  {
    name: "Roberto Alves",
    role: "Trader",
    content: "Uso a Contentfy para vender meu curso de day trade. A qualidade do player de vídeo é excelente e o dashboard me dá insights valiosos sobre o comportamento dos alunos. Recomendo!",
    initials: "RA",
    rating: 5
  }
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Determinar quantos cards mostrar por vez baseado no tamanho da tela
  const getItemsPerView = () => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth < 768) return 1; // mobile
    if (window.innerWidth < 1024) return 2; // tablet
    return 3; // desktop
  };

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <div className="relative">
      {/* Carrossel */}
      <div className="overflow-hidden" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 px-4"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              <Card className="card-owl-border hover-glow-owl transition-all duration-300 shadow-lg bg-[var(--owl-graphite)] border-[var(--owl-gray)]">
                <CardContent className="p-8">
                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-owl flex items-center justify-center text-white font-bold text-xl glow-orange">
                      {testimonial.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-foreground">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <p className="text-gray-300 italic leading-relaxed text-lg">
                    "{testimonial.content}"
                  </p>

                  {/* Estrelas */}
                  <div className="flex gap-1 mt-6">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[var(--owl-yellow)] text-[var(--owl-yellow)]" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Botões de Navegação */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 rounded-full shadow-lg hover:bg-primary hover:text-primary-foreground transition-all"
        onClick={prevSlide}
        aria-label="Depoimento anterior"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full shadow-lg hover:bg-primary hover:text-primary-foreground transition-all"
        onClick={nextSlide}
        aria-label="Próximo depoimento"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Indicadores */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-8 bg-primary"
                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
