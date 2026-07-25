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
  buildQuizPrompt,
  type AIHistoryEntry,
  type QuizDraft,
} from "@/lib/ai-studio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function AIQuizBuilderPage() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState("5");
  const [level, setLevel] = useState("Intermediário");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [quiz, setQuiz] = useState<QuizDraft | null>(null);
  const [tick, setTick] = useState(0);
  const history = useMemo(() => AIService.history("quiz"), [tick, preview]);

  const generate = async () => {
    if (!topic.trim()) {
      toast.error("Informe o tema do quiz");
      return;
    }
    setLoading(true);
    try {
      const n = Math.min(20, Math.max(3, Number(count) || 5));
      const prompt = buildQuizPrompt(topic, n, level);
      const { result } = await AIService.generate(
        {
          tool: "quiz",
          prompt,
          context: { topic, count: n, level },
        },
        { title: `Quiz · ${topic}` }
      );
      setPreview(result.content);
      setQuiz((result.structured as QuizDraft) || null);
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
          title="AI Quiz Builder"
          subtitle="Gere questões, alternativas, respostas corretas e explicações — prontas para aplicar ao LMS."
        />

        <div className="grid gap-4 xl:grid-cols-[320px_1fr_280px]">
          <Card className="border-white/[0.08] bg-[#0f1522] h-fit">
            <CardHeader>
              <CardTitle className="text-base">Configuração</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Tema</Label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ex.: Módulo 2 — Funis"
                  className="bg-[#0c1220] border-white/10"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Questões</Label>
                  <Input
                    type="number"
                    min={3}
                    max={20}
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
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
                Gerar quiz
              </Button>
            </CardContent>
          </Card>

          <Card className="border-white/[0.08] bg-[#0f1522]">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle className="text-base">
                {quiz?.title || "Preview do quiz"}
              </CardTitle>
              <CopyApplyActions
                content={preview}
                applyLabel="Aplicar ao LMS"
                onApply={() => undefined}
              />
            </CardHeader>
            <CardContent className="space-y-3">
              {quiz?.questions.map((q, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/[0.08] bg-[#0c1220]/70 p-4"
                >
                  <p className="font-medium text-sm mb-2">
                    {i + 1}. {q.question}
                  </p>
                  <ul className="space-y-1.5 mb-2">
                    {q.options.map((opt, oi) => (
                      <li
                        key={opt}
                        className={`text-sm px-2.5 py-1.5 rounded-lg border ${
                          oi === q.correctIndex
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                            : "border-white/[0.05] text-muted-foreground"
                        }`}
                      >
                        {String.fromCharCode(65 + oi)}. {opt}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground">
                    {q.explanation}
                  </p>
                </div>
              ))}
              {!quiz && (
                <p className="text-sm text-muted-foreground">
                  As questões geradas aparecem aqui.
                </p>
              )}
              {preview && (
                <Textarea
                  value={preview}
                  onChange={(e) => setPreview(e.target.value)}
                  className="min-h-[120px] bg-[#0c1220] border-white/10 font-mono text-xs"
                />
              )}
            </CardContent>
          </Card>

          <AIHistoryList
            items={history}
            onSelect={(item: AIHistoryEntry) => {
              setPreview(item.result);
              setQuiz((item.meta?.structured as QuizDraft | undefined) || null);
            }}
            onClear={() => {
              AIService.clearHistory("quiz");
              setTick((t) => t + 1);
            }}
          />
        </div>
      </div>
    </CreatorLayout>
  );
}
