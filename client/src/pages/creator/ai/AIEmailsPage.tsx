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
  EMAIL_LABELS,
  buildEmailPrompt,
  type AIHistoryEntry,
  type EmailKind,
} from "@/lib/ai-studio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

const KINDS = Object.keys(EMAIL_LABELS) as EmailKind[];

export default function AIEmailsPage() {
  const [kind, setKind] = useState<EmailKind>("launch");
  const [productName, setProductName] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [tick, setTick] = useState(0);
  const history = useMemo(() => AIService.history("emails"), [tick, output]);

  const generate = async () => {
    if (!productName.trim()) {
      toast.error("Informe o nome do produto");
      return;
    }
    setLoading(true);
    try {
      const prompt = buildEmailPrompt(kind, productName);
      const { result } = await AIService.generate(
        {
          tool: "emails",
          prompt,
          context: { kind, productName },
        },
        { title: `${EMAIL_LABELS[kind]} · ${productName}` }
      );
      setOutput(result.content);
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
          title="AI Emails"
          subtitle="Gere sequências de lançamento, carrinho, boas-vindas, recuperação e pós-venda."
        />

        <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
          <Card className="border-white/[0.08] bg-[#0f1522]">
            <CardHeader>
              <CardTitle className="text-base">Gerador de emails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {KINDS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKind(k)}
                    className={`rounded-full px-3 py-1.5 text-xs border transition-colors ${
                      kind === k
                        ? "border-primary/40 bg-primary/15 text-foreground"
                        : "border-white/10 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {EMAIL_LABELS[k]}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5 max-w-xl">
                <Label>Produto</Label>
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Ex.: Mentoria Escala ContentFy"
                  className="bg-[#0c1220] border-white/10"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={generate} disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Gerar email
                </Button>
                <CopyApplyActions
                  content={output}
                  applyLabel="Usar na campanha"
                  onApply={() => undefined}
                />
              </div>

              <Textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                placeholder="O email gerado aparece aqui (assunto + corpo + CTA)."
                className="min-h-[280px] bg-[#0c1220] border-white/10 font-mono text-sm"
              />
            </CardContent>
          </Card>

          <AIHistoryList
            items={history}
            onSelect={(item: AIHistoryEntry) => setOutput(item.result)}
            onClear={() => {
              AIService.clearHistory("emails");
              setTick((t) => t + 1);
            }}
          />
        </div>
      </div>
    </CreatorLayout>
  );
}
