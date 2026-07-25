import { useMemo, useState } from "react";
import CreatorLayout from "@/components/CreatorLayout";
import AIStudioHeader from "@/components/ai-studio/AIStudioHeader";
import AIHistoryList from "@/components/ai-studio/AIHistoryList";
import CopyApplyActions from "@/components/ai-studio/CopyApplyActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AIService,
  buildCoursePrompt,
  type AIHistoryEntry,
  type CourseOutline,
} from "@/lib/ai-studio";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AICourseBuilderPage() {
  const [title, setTitle] = useState("");
  const [audience, setAudience] = useState("");
  const [objective, setObjective] = useState("");
  const [workloadHours, setWorkloadHours] = useState("8");
  const [level, setLevel] = useState("Iniciante");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [outline, setOutline] = useState<CourseOutline | null>(null);
  const [tick, setTick] = useState(0);
  const history = useMemo(() => AIService.history("course"), [tick, preview]);

  const generate = async () => {
    if (!title.trim()) {
      toast.error("Informe o título do curso");
      return;
    }
    setLoading(true);
    try {
      const hours = Number(workloadHours) || 8;
      const prompt = buildCoursePrompt({
        title,
        audience,
        objective,
        workloadHours: hours,
        level,
      });
      const { result } = await AIService.generate(
        {
          tool: "course",
          prompt,
          context: { title, audience, objective, workloadHours: hours, level },
        },
        { title: `Curso · ${title}` }
      );
      setPreview(result.content);
      setOutline((result.structured as CourseOutline) || null);
      setTick((t) => t + 1);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha na geração");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CreatorLayout>
      <div className="space-y-6">
        <AIStudioHeader
          title="AI Course Builder"
          subtitle="Informe título, público, objetivo, carga e nível. A IA monta módulos, aulas, exercícios e materiais — com preview antes de aplicar."
        />

        <div className="grid gap-4 xl:grid-cols-[360px_1fr_280px]">
          <Card className="border-white/[0.08] bg-[#0f1522] h-fit">
            <CardHeader>
              <CardTitle className="text-base">Briefing do curso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Título</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex.: Funis que Convertem"
                  className="bg-[#0c1220] border-white/10"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Público</Label>
                <Input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="Ex.: criadores iniciantes"
                  className="bg-[#0c1220] border-white/10"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Objetivo</Label>
                <Textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="O que o aluno deve conseguir fazer ao final?"
                  className="bg-[#0c1220] border-white/10 min-h-[90px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Carga (h)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={workloadHours}
                    onChange={(e) => setWorkloadHours(e.target.value)}
                    className="bg-[#0c1220] border-white/10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Nível</Label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger className="bg-[#0c1220] border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Iniciante">Iniciante</SelectItem>
                      <SelectItem value="Intermediário">Intermediário</SelectItem>
                      <SelectItem value="Avançado">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full" onClick={generate} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Gerar estrutura
              </Button>
            </CardContent>
          </Card>

          <Card className="border-white/[0.08] bg-[#0f1522]">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle className="text-base">Preview</CardTitle>
              <CopyApplyActions
                content={preview}
                applyLabel="Aplicar ao curso"
                onApply={() => undefined}
              />
            </CardHeader>
            <CardContent>
              {!outline && !preview && (
                <p className="text-sm text-muted-foreground">
                  A estrutura gerada aparece aqui antes de aplicar ao Course
                  Builder.
                </p>
              )}
              {outline && (
                <div className="space-y-4">
                  {outline.modules.map((mod) => (
                    <div
                      key={mod.title}
                      className="rounded-xl border border-white/[0.08] bg-[#0c1220]/70 p-4"
                    >
                      <h3 className="font-semibold mb-1">{mod.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        {mod.objective}
                      </p>
                      <ul className="space-y-2">
                        {mod.lessons.map((lesson) => (
                          <li
                            key={lesson.title}
                            className="text-sm rounded-lg border border-white/[0.05] px-3 py-2"
                          >
                            <p className="font-medium">{lesson.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {lesson.objective} · Exercício: {lesson.exercise}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              {preview && (
                <Textarea
                  className="mt-4 min-h-[180px] bg-[#0c1220] border-white/10 font-mono text-xs"
                  value={preview}
                  onChange={(e) => setPreview(e.target.value)}
                />
              )}
            </CardContent>
          </Card>

          <AIHistoryList
            items={history}
            onSelect={(item: AIHistoryEntry) => {
              setPreview(item.result);
              setOutline(
                (item.meta?.structured as CourseOutline | undefined) || null
              );
            }}
            onClear={() => {
              AIService.clearHistory("course");
              setTick((t) => t + 1);
            }}
          />
        </div>
      </div>
    </CreatorLayout>
  );
}
