import { useMemo, useState } from "react";
import CreatorLayout from "@/components/CreatorLayout";
import AIStudioHeader from "@/components/ai-studio/AIStudioHeader";
import AIHistoryList from "@/components/ai-studio/AIHistoryList";
import CopyApplyActions from "@/components/ai-studio/CopyApplyActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AIService,
  buildCertificatePrompt,
  type AIHistoryEntry,
  type CertificateDraft,
} from "@/lib/ai-studio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, QrCode, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function AICertificatePage() {
  const [courseName, setCourseName] = useState("");
  const [issuerName, setIssuerName] = useState("ContentFy");
  const [signatureName, setSignatureName] = useState("Direção Acadêmica");
  const [workloadHours, setWorkloadHours] = useState("8");
  const [logoLabel, setLogoLabel] = useState("Logo do produtor");
  const [loading, setLoading] = useState(false);
  const [cert, setCert] = useState<CertificateDraft | null>(null);
  const [preview, setPreview] = useState("");
  const [tick, setTick] = useState(0);
  const history = useMemo(
    () => AIService.history("certificate"),
    [tick, preview]
  );

  const generate = async () => {
    if (!courseName.trim()) {
      toast.error("Informe o nome do curso");
      return;
    }
    setLoading(true);
    try {
      const hours = Number(workloadHours) || 8;
      const prompt = buildCertificatePrompt({
        courseName,
        issuerName,
        workloadHours: hours,
        signatureName,
      });
      const { result } = await AIService.generate(
        {
          tool: "certificate",
          prompt,
          context: {
            courseName,
            issuerName,
            workloadHours: hours,
            signatureName,
            logoLabel,
          },
        },
        { title: `Certificado · ${courseName}` }
      );
      const structured = result.structured as CertificateDraft;
      setCert({ ...structured, logoLabel });
      setPreview(result.content);
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
          title="AI Certificate"
          subtitle="Monte certificados com logo, assinatura, carga horária e espaço reservado para QR de validação futura."
        />

        <div className="grid gap-4 xl:grid-cols-[320px_1fr_280px]">
          <Card className="border-white/[0.08] bg-[#0f1522] h-fit">
            <CardHeader>
              <CardTitle className="text-base">Personalização</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Nome do curso</Label>
                <Input
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="bg-[#0c1220] border-white/10"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Emissor</Label>
                <Input
                  value={issuerName}
                  onChange={(e) => setIssuerName(e.target.value)}
                  className="bg-[#0c1220] border-white/10"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Assinatura</Label>
                <Input
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  className="bg-[#0c1220] border-white/10"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Logo (rótulo)</Label>
                <Input
                  value={logoLabel}
                  onChange={(e) => setLogoLabel(e.target.value)}
                  className="bg-[#0c1220] border-white/10"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Carga horária</Label>
                <Input
                  type="number"
                  min={1}
                  value={workloadHours}
                  onChange={(e) => setWorkloadHours(e.target.value)}
                  className="bg-[#0c1220] border-white/10"
                />
              </div>
              <Button className="w-full" onClick={generate} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Gerar certificado
              </Button>
            </CardContent>
          </Card>

          <Card className="border-white/[0.08] bg-[#0f1522]">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle className="text-base">Preview</CardTitle>
              <CopyApplyActions
                content={preview}
                applyLabel="Salvar modelo"
                onApply={() => undefined}
              />
            </CardHeader>
            <CardContent>
              <div className="relative aspect-[1.414/1] max-w-3xl mx-auto rounded-2xl border border-amber-500/20 bg-gradient-to-br from-[#111827] via-[#0c1220] to-[#070b12] p-8 flex flex-col items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.25),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(245,158,11,0.2),transparent_35%)]" />
                <div className="relative z-10 space-y-4 w-full max-w-lg">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-amber-300/80">
                    {cert?.logoLabel || logoLabel}
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Certificado de Conclusão
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Certificamos que
                  </p>
                  <p className="text-xl font-semibold text-orange-200">
                    {cert?.studentNamePlaceholder || "[Nome do Aluno]"}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    concluiu com êxito o curso{" "}
                    <span className="text-foreground font-medium">
                      “{cert?.courseName || courseName || "Seu curso"}”
                    </span>{" "}
                    com carga horária de{" "}
                    {cert?.workloadHours || workloadHours || "8"} horas.
                  </p>
                  <div className="pt-4 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                    <div>
                      <p className="text-foreground/80 font-medium border-b border-white/10 pb-1 mb-1">
                        {cert?.signatureName || signatureName}
                      </p>
                      Assinatura
                    </div>
                    <div>
                      <p className="text-foreground/80 font-medium border-b border-white/10 pb-1 mb-1">
                        {cert?.issuerName || issuerName}
                      </p>
                      Emissor
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-slate-500">
                    <QrCode className="h-8 w-8 opacity-50" />
                    QR reservado para validação futura
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <AIHistoryList
            items={history}
            onSelect={(item: AIHistoryEntry) => {
              setPreview(item.result);
              setCert(
                (item.meta?.structured as CertificateDraft | undefined) || null
              );
            }}
            onClear={() => {
              AIService.clearHistory("certificate");
              setTick((t) => t + 1);
            }}
          />
        </div>
      </div>
    </CreatorLayout>
  );
}
