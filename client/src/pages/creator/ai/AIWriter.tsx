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
  AIService,
  WRITER_LABELS,
  buildWriterPrompt,
  type AIHistoryEntry,
  type AIMessage,
  type WriterContentType,
} from "@/lib/ai-studio";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

const TYPES = Object.keys(WRITER_LABELS) as WriterContentType[];

export default function AIWriter() {
  const [contentType, setContentType] =
    useState<WriterContentType>("headline");
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Sou o AI Writer. Escolha o tipo de copy, descreva o produto e eu gero um texto pronto para usar.",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [historyTick, setHistoryTick] = useState(0);
  const history = useMemo(
    () => AIService.history("writer"),
    [historyTick, output]
  );

  const generate = async () => {
    if (!topic.trim()) {
      toast.error("Informe o tema ou nome do produto");
      return;
    }
    const prompt = buildWriterPrompt(contentType, topic, audience);
    const userMsg: AIMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: `Gerar ${WRITER_LABELS[contentType]} para “${topic}”`,
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    try {
      const { result } = await AIService.generate(
        {
          tool: "writer",
          prompt,
          context: { contentType, topic, audience },
        },
        { title: `${WRITER_LABELS[contentType]} · ${topic}` }
      );
      setOutput(result.content);
      setMessages((m) => [
        ...m,
        {
          id: result.id,
          role: "assistant",
          content: result.content,
          createdAt: new Date().toISOString(),
          meta: { demo: result.demo, latencyMs: result.latencyMs },
        },
      ]);
      setHistoryTick((t) => t + 1);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha na geração");
    } finally {
      setLoading(false);
    }
  };

  const onSelectHistory = (item: AIHistoryEntry) => {
    setOutput(item.result);
    setTopic(String(item.meta?.topic || topic));
  };

  return (
    <CreatorLayout>
      <div className="space-y-6">
        <AIStudioHeader
          title="AI Writer"
          subtitle="Interface tipo ChatGPT para gerar headlines, descrições, FAQ, CTAs e mais — com histórico e ações Copiar / Aplicar."
        />

        <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0f1522] overflow-hidden flex flex-col min-h-[560px]">
            <div className="px-4 py-3 border-b border-white/[0.06] flex flex-wrap gap-2">
              {TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setContentType(type)}
                  className={`rounded-full px-3 py-1 text-xs border transition-colors ${
                    contentType === type
                      ? "border-primary/40 bg-primary/15 text-foreground"
                      : "border-white/10 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {WRITER_LABELS[type]}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "ml-auto bg-primary/20 border border-primary/25"
                      : "mr-auto bg-[#111827] border border-white/[0.08] text-foreground/90"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
            </div>

            <div className="border-t border-white/[0.06] p-4 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Produto / tema</Label>
                  <Input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex.: Curso de Funis de Alta Conversão"
                    className="bg-[#0c1220] border-white/10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Público (opcional)</Label>
                  <Input
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="Ex.: infoprodutores iniciantes"
                    className="bg-[#0c1220] border-white/10"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CopyApplyActions
                  content={output}
                  onApply={() => undefined}
                  applyLabel="Aplicar ao produto"
                />
                <Button onClick={generate} disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Gerar
                </Button>
              </div>
              {output && (
                <Textarea
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                  className="min-h-[140px] bg-[#0c1220] border-white/10 font-mono text-sm"
                />
              )}
            </div>
          </div>

          <AIHistoryList
            items={history}
            onSelect={onSelectHistory}
            onClear={() => {
              AIService.clearHistory("writer");
              setHistoryTick((t) => t + 1);
            }}
          />
        </div>
      </div>
    </CreatorLayout>
  );
}
