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
  buildSalesPagePrompt,
  type AIHistoryEntry,
  type SalesPageDraft,
} from "@/lib/ai-studio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function AISalesPage() {
  const [productName, setProductName] = useState("");
  const [audience, setAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [page, setPage] = useState<SalesPageDraft | null>(null);
  const [tick, setTick] = useState(0);
  const history = useMemo(
    () => AIService.history("sales-page"),
    [tick, preview]
  );

  const generate = async () => {
    if (!productName.trim()) {
      toast.error("Informe o nome do produto");
      return;
    }
    setLoading(true);
    try {
      const prompt = buildSalesPagePrompt(productName, audience);
      const { result } = await AIService.generate(
        {
          tool: "sales-page",
          prompt,
          context: { productName, audience },
        },
        { title: `Sales Page · ${productName}` }
      );
      setPreview(result.content);
      setPage((result.structured as SalesPageDraft) || null);
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
          title="AI Sales Page"
          subtitle="Estrutura completa: Hero, Benefícios, Depoimentos, Oferta, Garantia, CTA e FAQ."
        />

        <div className="grid gap-4 xl:grid-cols-[320px_1fr_280px]">
          <Card className="border-white/[0.08] bg-[#0f1522] h-fit">
            <CardHeader>
              <CardTitle className="text-base">Briefing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Produto</Label>
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="bg-[#0c1220] border-white/10"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Público</Label>
                <Input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="Ex.: coaches e consultores"
                  className="bg-[#0c1220] border-white/10"
                />
              </div>
              <Button className="w-full" onClick={generate} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Gerar página
              </Button>
            </CardContent>
          </Card>

          <Card className="border-white/[0.08] bg-[#0f1522]">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle className="text-base">Estrutura gerada</CardTitle>
              <CopyApplyActions
                content={preview}
                applyLabel="Aplicar à landing"
                onApply={() => undefined}
              />
            </CardHeader>
            <CardContent className="space-y-4">
              {page ? (
                <div className="space-y-3">
                  <Section title="Hero">
                    <p className="font-semibold">{page.hero.headline}</p>
                    <p className="text-sm text-muted-foreground">
                      {page.hero.subtitle}
                    </p>
                    <p className="text-sm text-primary mt-1">{page.hero.cta}</p>
                  </Section>
                  <Section title="Benefícios">
                    <ul className="list-disc pl-4 text-sm space-y-1">
                      {page.benefits.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </Section>
                  <Section title="Depoimentos">
                    {page.testimonials.map((t) => (
                      <p key={t.name} className="text-sm mb-2">
                        <span className="font-medium">{t.name}</span>{" "}
                        <span className="text-muted-foreground">
                          ({t.role})
                        </span>
                        : “{t.quote}”
                      </p>
                    ))}
                  </Section>
                  <Section title="Oferta">
                    <p className="font-medium">{page.offer.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {page.offer.priceHint}
                    </p>
                  </Section>
                  <Section title="Garantia">
                    <p className="text-sm">{page.guarantee}</p>
                  </Section>
                  <Section title="CTA">
                    <p className="text-sm">
                      {page.cta.primary} · {page.cta.secondary}
                    </p>
                  </Section>
                  <Section title="FAQ">
                    {page.faq.map((f) => (
                      <div key={f.q} className="mb-2 text-sm">
                        <p className="font-medium">{f.q}</p>
                        <p className="text-muted-foreground">{f.a}</p>
                      </div>
                    ))}
                  </Section>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  A estrutura da sales page aparece aqui.
                </p>
              )}
              {preview && (
                <Textarea
                  value={preview}
                  onChange={(e) => setPreview(e.target.value)}
                  className="min-h-[160px] bg-[#0c1220] border-white/10 font-mono text-xs"
                />
              )}
            </CardContent>
          </Card>

          <AIHistoryList
            items={history}
            onSelect={(item: AIHistoryEntry) => {
              setPreview(item.result);
              setPage(
                (item.meta?.structured as SalesPageDraft | undefined) || null
              );
            }}
            onClear={() => {
              AIService.clearHistory("sales-page");
              setTick((t) => t + 1);
            }}
          />
        </div>
      </div>
    </CreatorLayout>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0c1220]/70 p-4">
      <p className="text-[11px] uppercase tracking-wider text-orange-300/80 mb-2">
        {title}
      </p>
      {children}
    </div>
  );
}
