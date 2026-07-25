import CreatorLayout from "@/components/CreatorLayout";
import AIStudioHeader from "@/components/ai-studio/AIStudioHeader";
import AIStatCard from "@/components/ai-studio/AIStatCard";
import AIToolCard from "@/components/ai-studio/AIToolCard";
import { AIService } from "@/lib/ai-studio";
import {
  Award,
  Clock,
  FileText,
  GraduationCap,
  HelpCircle,
  LayoutTemplate,
  Mail,
  Package,
  PenLine,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AIStudioDashboard() {
  const stats = AIService.stats();

  return (
    <CreatorLayout>
      <div className="space-y-8">
        <AIStudioHeader
          title="AI Studio"
          subtitle="Acelere criação e venda de produtos digitais com ferramentas de IA desacopladas — prontas para OpenAI, Anthropic e Gemini."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AIStatCard
            title="Produtos gerados com IA"
            value={stats.productsGenerated}
            icon={Package}
            hint="Writer + Course Builder"
          />
          <AIStatCard
            title="Conteúdos gerados"
            value={stats.contentsGenerated}
            icon={FileText}
            hint="Total de gerações no Studio"
          />
          <AIStatCard
            title="Páginas geradas"
            value={stats.pagesGenerated}
            icon={LayoutTemplate}
            hint="Sales Page + copy de vendas"
          />
          <AIStatCard
            title="Quizzes gerados"
            value={stats.quizzesGenerated}
            icon={HelpCircle}
            accent="text-sky-300"
          />
          <AIStatCard
            title="Certificados gerados"
            value={stats.certificatesGenerated}
            icon={Award}
            accent="text-amber-300"
          />
          <AIStatCard
            title="Economia estimada de tempo"
            value={`${stats.hoursSaved}h`}
            icon={Clock}
            accent="text-emerald-300"
            hint="Estimativa demo (~25 min/geração)"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-semibold">Ferramentas</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <AIToolCard
              title="AI Writer"
              description="Headlines, descrições, bullets, FAQ, CTAs e copy de vendas com histórico."
              href="/creator/ai/writer"
              icon={PenLine}
              badge="Chat"
            />
            <AIToolCard
              title="AI Course Builder"
              description="Gere módulos, aulas, objetivos, exercícios e materiais — com preview."
              href="/creator/ai/course"
              icon={GraduationCap}
              badge="Estrutura"
            />
            <AIToolCard
              title="AI Quiz Builder"
              description="Questões, alternativas, respostas e explicações prontas para o LMS."
              href="/creator/ai/quiz"
              icon={HelpCircle}
            />
            <AIToolCard
              title="AI Certificate"
              description="Certificado com logo, assinatura, carga horária e QR reservado."
              href="/creator/ai/certificate"
              icon={Award}
            />
            <AIToolCard
              title="AI Emails"
              description="Lançamento, carrinho, boas-vindas, recuperação e pós-venda."
              href="/creator/ai/emails"
              icon={Mail}
            />
            <AIToolCard
              title="AI Sales Page"
              description="Hero, benefícios, depoimentos, oferta, garantia, CTA e FAQ."
              href="/creator/ai/sales-page"
              icon={LayoutTemplate}
              badge="Landing"
            />
          </div>
        </div>

        <Card className="border-white/[0.08] bg-[#0f1522]">
          <CardContent className="py-5 text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Arquitetura v1:</strong>{" "}
            <code className="text-orange-300/90">AIService</code>,{" "}
            <code className="text-orange-300/90">AIPrompts</code>,{" "}
            <code className="text-orange-300/90">AIHistory</code> e{" "}
            <code className="text-orange-300/90">AITemplates</code> com provider{" "}
            <code className="text-orange-300/90">mock</code>. Troque o adapter
            ativo para OpenAI, Anthropic ou Gemini sem reescrever as telas.
          </CardContent>
        </Card>
      </div>
    </CreatorLayout>
  );
}
