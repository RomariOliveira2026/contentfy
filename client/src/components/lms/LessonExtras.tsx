import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LessonMaterials from "./LessonMaterials";
import type { LmsLesson } from "./types";
import { ExternalLink, Lightbulb, NotebookPen } from "lucide-react";

interface LessonExtrasProps {
  lesson: LmsLesson;
}

const DEMO_TRANSCRIPT = `Nesta aula, vamos explorar os princípios fundamentais do tema com uma abordagem prática.

0:00 — Introdução e objetivos
1:20 — Conceito central
4:45 — Exemplos do dia a dia
8:10 — Exercício guiado
11:00 — Resumo e próximos passos

Lembre-se: consistência importa mais do que intensidade. Aplique um único hábito desta aula antes de avançar.`;

const DEMO_EXERCISES = [
  "Liste 3 situações da sua semana em que o foco falhou.",
  "Defina um bloco de 25 minutos para amanhã.",
  "Escreva um gatilho ambiental que você vai mudar hoje.",
];

const DEMO_LINKS = [
  { label: "Artigo complementar", href: "#" },
  { label: "Template Notion", href: "#" },
  { label: "Comunidade ContentFy", href: "#" },
];

export default function LessonExtras({ lesson }: LessonExtrasProps) {
  return (
    <div className="rounded-[1.25rem] border border-white/[0.08] bg-[#111827]/70 backdrop-blur-xl p-4 lg:p-6">
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="mb-5 w-full h-auto flex flex-wrap justify-start gap-1 bg-[#0c1220] p-1 rounded-2xl border border-white/[0.06]">
          <TabsTrigger value="summary" className="rounded-xl">Resumo</TabsTrigger>
          <TabsTrigger value="transcript" className="rounded-xl">Transcrição</TabsTrigger>
          <TabsTrigger value="downloads" className="rounded-xl">Downloads</TabsTrigger>
          <TabsTrigger value="links" className="rounded-xl">Links</TabsTrigger>
          <TabsTrigger value="exercises" className="rounded-xl">Exercícios</TabsTrigger>
          <TabsTrigger value="notes-tab" className="rounded-xl">Observações</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-0">
          <div className="flex gap-3">
            <div className="cf-kpi-icon !h-10 !w-10 !rounded-xl shrink-0">
              <Lightbulb className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Resumo da aula</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {lesson.description ||
                  "Nesta aula você aprenderá conceitos essenciais com aplicação imediata. Foque no exercício prático e avance apenas quando sentir clareza."}
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transcript" className="mt-0">
          <pre className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed font-sans">
            {DEMO_TRANSCRIPT}
          </pre>
        </TabsContent>

        <TabsContent value="downloads" className="mt-0">
          <h3 className="font-semibold mb-1">Materiais da Aula</h3>
          <LessonMaterials />
        </TabsContent>

        <TabsContent value="links" className="mt-0 space-y-2">
          {DEMO_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-[#0c1220]/70 px-4 py-3 text-sm hover:border-primary/30 transition-colors"
            >
              {link.label}
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          ))}
        </TabsContent>

        <TabsContent value="exercises" className="mt-0 space-y-3">
          {DEMO_EXERCISES.map((item, i) => (
            <div
              key={item}
              className="flex gap-3 rounded-2xl border border-white/[0.08] bg-[#0c1220]/70 px-4 py-3.5"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-primary">
                {i + 1}
              </span>
              <p className="text-sm text-foreground/90">{item}</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="notes-tab" className="mt-0">
          <div className="flex gap-3">
            <div className="cf-kpi-icon !h-10 !w-10 !rounded-xl shrink-0">
              <NotebookPen className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Observações do mentor</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Não tente aplicar tudo de uma vez. Escolha uma micro-ação e
                revise esta aula em 48h. Use o painel de anotações para registrar
                o que funcionou.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
