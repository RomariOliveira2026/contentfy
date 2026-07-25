import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation, useParams } from "wouter";
import CreatorLayout from "@/components/CreatorLayout";
import DemoFileUpload from "@/components/creator/DemoFileUpload";
import ImageUpload from "@/components/ImageUpload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Save } from "lucide-react";

const STEPS = [
  "Informações",
  "Visual",
  "Preço",
  "Publicação",
] as const;

type ProductType = "course" | "ebook" | "audiobook" | "app";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildDescription(shortDesc: string, fullDesc: string) {
  const short = shortDesc.trim();
  const full = fullDesc.trim();
  if (short && full) return `${short}\n\n${full}`;
  return full || short;
}

function splitDescription(description?: string | null) {
  if (!description) return { shortDesc: "", fullDesc: "" };
  const parts = description.split(/\n\n+/);
  if (parts.length >= 2) {
    return { shortDesc: parts[0], fullDesc: parts.slice(1).join("\n\n") };
  }
  return { shortDesc: "", fullDesc: description };
}

export default function CreatorProductWizard() {
  const params = useParams();
  const [, navigate] = useLocation();
  const isEdit = Boolean(params.id);
  const productId = params.id ? Number(params.id) : undefined;
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    shortDesc: "",
    fullDesc: "",
    categoryId: "",
    type: "course" as ProductType,
    coverImage: "",
    thumbnailImage: "",
    price: "",
    isFree: false,
    allowInstallments: true,
    maxInstallments: "12",
    guaranteeDays: "30",
    isActive: false,
    salesPageUrl: "",
  });
  const [slugTouched, setSlugTouched] = useState(false);

  const { data: product, isLoading } = trpc.products.getById.useQuery(
    { id: productId! },
    { enabled: isEdit && !!productId }
  );
  const { data: categories = [] } = trpc.products.listCategories.useQuery();

  const createMutation = trpc.products.create.useMutation({
    onSuccess: (res) => {
      toast.success("Produto criado com sucesso");
      if (form.type === "course" && res.id) {
        navigate(`/creator/courses/${res.id}/builder`);
        return;
      }
      navigate("/creator/products");
    },
    onError: (err) => toast.error(err.message || "Erro ao criar produto"),
  });

  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      toast.success("Alterações salvas");
      navigate("/creator/products");
    },
    onError: (err) => toast.error(err.message || "Erro ao salvar"),
  });

  useEffect(() => {
    if (!product) return;
    const { shortDesc, fullDesc } = splitDescription(product.description);
    setForm({
      name: product.name,
      slug: product.slug,
      shortDesc,
      fullDesc,
      categoryId: product.categoryId?.toString() || "",
      type: product.type,
      coverImage: product.coverImage || "",
      thumbnailImage: product.thumbnailImage || "",
      price: (product.price / 100).toFixed(2).replace(".", ","),
      isFree: product.price === 0,
      allowInstallments: product.allowInstallments,
      maxInstallments: String(product.maxInstallments ?? 12),
      guaranteeDays: String(product.guaranteeDays ?? 30),
      isActive: product.isActive,
      salesPageUrl: product.salesPageUrl || "",
    });
    setSlugTouched(true);
  }, [product]);

  const salesPreviewUrl = useMemo(() => {
    if (form.salesPageUrl.trim()) return form.salesPageUrl.trim();
    if (form.slug) return `/products/${form.slug}`;
    return "";
  }, [form.salesPageUrl, form.slug]);

  const validateStep = (index: number) => {
    if (index === 0) {
      if (!form.name.trim()) return "Informe o nome do produto";
      if (!form.slug.trim()) return "Informe o slug";
      if (!form.type) return "Selecione o tipo";
    }
    if (index === 2 && !form.isFree) {
      const cents = parsePriceToCents(form.price);
      if (cents === null || cents < 0) return "Informe um preço válido";
    }
    return null;
  };

  const goNext = () => {
    const err = validateStep(step);
    if (err) {
      toast.error(err);
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleSubmit = () => {
    for (let i = 0; i < STEPS.length; i++) {
      const err = validateStep(i);
      if (err) {
        setStep(i);
        toast.error(err);
        return;
      }
    }

    const priceCents = form.isFree ? 0 : parsePriceToCents(form.price) ?? 0;
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: buildDescription(form.shortDesc, form.fullDesc),
      type: form.type,
      categoryId: form.categoryId ? Number(form.categoryId) : undefined,
      price: priceCents,
      allowInstallments: form.isFree ? false : form.allowInstallments,
      maxInstallments: Number(form.maxInstallments) || 12,
      coverImage: form.coverImage || undefined,
      thumbnailImage: form.thumbnailImage || undefined,
      salesPageUrl: form.salesPageUrl || undefined,
      guaranteeDays: Number(form.guaranteeDays) || 30,
      isActive: form.isActive,
    };

    if (isEdit && productId) {
      updateMutation.mutate({ id: productId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <CreatorLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/creator/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              {isEdit ? "Editar produto" : "Criar produto"}
            </h1>
            <p className="text-muted-foreground text-sm">
              Formulário em etapas — sem alterar checkout ou Stripe.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                i === step
                  ? "border-primary/50 bg-primary/15 text-foreground"
                  : i < step
                    ? "border-emerald-500/30 text-emerald-400"
                    : "border-white/10 text-muted-foreground"
              }`}
            >
              {i < step ? <Check className="inline h-3 w-3 mr-1" /> : `${i + 1}. `}
              {label}
            </button>
          ))}
        </div>

        {isEdit && isLoading ? (
          <div className="h-64 rounded-xl bg-muted/30 animate-pulse" />
        ) : (
          <Card className="border-white/[0.08] bg-[#0f1522]">
            <CardHeader>
              <CardTitle>{STEPS[step]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {step === 0 && (
                <>
                  <Field label="Nome">
                    <Input
                      value={form.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setForm((f) => ({
                          ...f,
                          name,
                          slug: slugTouched ? f.slug : slugify(name),
                        }));
                      }}
                      placeholder="Ex: Mentoria ContentFy Pro"
                    />
                  </Field>
                  <Field label="Slug">
                    <Input
                      value={form.slug}
                      onChange={(e) => {
                        setSlugTouched(true);
                        setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
                      }}
                      placeholder="mentoria-contentfy-pro"
                    />
                  </Field>
                  <Field label="Descrição curta">
                    <Input
                      value={form.shortDesc}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, shortDesc: e.target.value }))
                      }
                      placeholder="Uma linha para listagens"
                      maxLength={160}
                    />
                  </Field>
                  <Field label="Descrição completa">
                    <Textarea
                      value={form.fullDesc}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, fullDesc: e.target.value }))
                      }
                      rows={6}
                      placeholder="Detalhes do produto..."
                    />
                  </Field>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Categoria">
                      <Select
                        value={form.categoryId || "none"}
                        onValueChange={(v) =>
                          setForm((f) => ({
                            ...f,
                            categoryId: v === "none" ? "" : v,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sem categoria</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Tipo">
                      <Select
                        value={form.type}
                        onValueChange={(v) =>
                          setForm((f) => ({ ...f, type: v as ProductType }))
                        }
                        disabled={isEdit}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="course">Curso</SelectItem>
                          <SelectItem value="ebook">E-book</SelectItem>
                          <SelectItem value="audiobook">Audiobook</SelectItem>
                          <SelectItem value="app">App</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <ImageUpload
                    label="Capa"
                    value={form.coverImage}
                    onChange={(url) => setForm((f) => ({ ...f, coverImage: url }))}
                    aspectRatio="16/9"
                  />
                  <ImageUpload
                    label="Thumbnail"
                    value={form.thumbnailImage}
                    onChange={(url) =>
                      setForm((f) => ({ ...f, thumbnailImage: url }))
                    }
                    aspectRatio="1/1"
                  />
                  {(form.coverImage || form.thumbnailImage) && (
                    <div className="rounded-xl border border-white/[0.08] p-4 space-y-3">
                      <p className="text-sm font-medium">Preview</p>
                      <div className="flex gap-4 items-start">
                        {form.coverImage && (
                          <img
                            src={form.coverImage}
                            alt="Capa"
                            className="h-28 w-auto rounded-lg object-cover"
                          />
                        )}
                        {form.thumbnailImage && (
                          <img
                            src={form.thumbnailImage}
                            alt="Thumbnail"
                            className="h-20 w-20 rounded-lg object-cover"
                          />
                        )}
                      </div>
                    </div>
                  )}
                  <DemoFileUpload
                    label="Material complementar (PDF/áudio/vídeo)"
                    accept="any"
                    value=""
                    onChange={() => undefined}
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <div className="flex items-center justify-between rounded-xl border border-white/[0.08] px-4 py-3">
                    <div>
                      <p className="font-medium">Produto gratuito</p>
                      <p className="text-xs text-muted-foreground">
                        Preço será zero se ativado
                      </p>
                    </div>
                    <Switch
                      checked={form.isFree}
                      onCheckedChange={(v) =>
                        setForm((f) => ({ ...f, isFree: v, price: v ? "0" : f.price }))
                      }
                    />
                  </div>
                  {!form.isFree && (
                    <Field label="Preço (R$)">
                      <Input
                        value={form.price}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, price: e.target.value }))
                        }
                        placeholder="197,00"
                      />
                    </Field>
                  )}
                  <div className="flex items-center justify-between rounded-xl border border-white/[0.08] px-4 py-3">
                    <div>
                      <p className="font-medium">Permitir parcelamento</p>
                      <p className="text-xs text-muted-foreground">
                        Configuração do produto (checkout existente inalterado)
                      </p>
                    </div>
                    <Switch
                      checked={form.allowInstallments}
                      disabled={form.isFree}
                      onCheckedChange={(v) =>
                        setForm((f) => ({ ...f, allowInstallments: v }))
                      }
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Máximo de parcelas">
                      <Input
                        type="number"
                        min={1}
                        max={12}
                        disabled={!form.allowInstallments || form.isFree}
                        value={form.maxInstallments}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, maxInstallments: e.target.value }))
                        }
                      />
                    </Field>
                    <Field label="Garantia (dias)">
                      <Input
                        type="number"
                        min={0}
                        value={form.guaranteeDays}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, guaranteeDays: e.target.value }))
                        }
                      />
                    </Field>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, isActive: false }))}
                      className={`rounded-xl border p-4 text-left transition-colors ${
                        !form.isActive
                          ? "border-primary/50 bg-primary/10"
                          : "border-white/[0.08]"
                      }`}
                    >
                      <p className="font-medium">Rascunho</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Não aparece como publicado na loja
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, isActive: true }))}
                      className={`rounded-xl border p-4 text-left transition-colors ${
                        form.isActive
                          ? "border-emerald-500/50 bg-emerald-500/10"
                          : "border-white/[0.08]"
                      }`}
                    >
                      <p className="font-medium">Publicado</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Visível para compradores
                      </p>
                    </button>
                  </div>
                  <Field label="URL da página de vendas">
                    <Input
                      value={form.salesPageUrl}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, salesPageUrl: e.target.value }))
                      }
                      placeholder="https://... ou deixe vazio para /products/slug"
                    />
                  </Field>
                  <div className="rounded-xl border border-white/[0.08] p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">Preview final</p>
                      <Badge variant={form.isActive ? "default" : "secondary"}>
                        {form.isActive ? "Publicado" : "Rascunho"}
                      </Badge>
                    </div>
                    <p className="font-semibold text-lg">{form.name || "Sem nome"}</p>
                    <p className="text-sm text-muted-foreground">
                      {form.shortDesc || "Sem descrição curta"}
                    </p>
                    <p className="text-sm">
                      {form.isFree
                        ? "Gratuito"
                        : form.price
                          ? `R$ ${form.price}`
                          : "Preço não definido"}
                    </p>
                    {salesPreviewUrl && (
                      <p className="text-xs text-muted-foreground break-all">
                        Página: {salesPreviewUrl}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={step === 0}
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                {step < STEPS.length - 1 ? (
                  <Button type="button" onClick={goNext}>
                    Próximo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="button" onClick={handleSubmit} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar produto"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </CreatorLayout>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function parsePriceToCents(value: string): number | null {
  const normalized = value.trim().replace(/\./g, "").replace(",", ".");
  if (!normalized) return null;
  const num = Number(normalized);
  if (Number.isNaN(num)) return null;
  return Math.round(num * 100);
}
