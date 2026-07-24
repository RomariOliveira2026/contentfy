import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import AdminLayout from "@/components/AdminLayout";
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
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "wouter";
import ImageUpload from "@/components/ImageUpload";
import { PRODUCT_CATEGORIES } from "@/../../shared/const";
import { Upload, FileText, Music, X, CheckCircle } from "lucide-react";

export default function ProductForm() {
  const params = useParams();
  const [, navigate] = useLocation();
  const isEdit = !!params.id;
  const productId = params.id ? parseInt(params.id) : undefined;

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    categoryId: "" as string,
    type: "course" as "ebook" | "audiobook" | "course" | "app",
    price: "",
    isRecurring: false,
    recurringInterval: "month" as "month" | "year",
    allowInstallments: true,
    maxInstallments: "12",
    coverImage: "",
    thumbnailImage: "",
    contentUrl: "",
    salesPageUrl: "",
    guaranteeDays: "30",
    affiliateCommission: "60",
  });

  const { data: product, isLoading } = trpc.products.getById.useQuery(
    { id: productId! },
    { enabled: isEdit && !!productId }
  );

  const { data: categories = [] } = trpc.products.listCategories.useQuery();

  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      toast.success("Produto criado com sucesso!");
      navigate("/admin/products");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar produto");
    },
  });

  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      toast.success("Produto atualizado com sucesso!");
      navigate("/admin/products");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar produto");
    },
  });

  // Carregar dados do produto ao editar
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || "",
        categoryId: product.categoryId?.toString() || "",
        type: product.type,
        price: (product.price / 100).toFixed(2),
        isRecurring: product.isRecurring,
        recurringInterval: product.recurringInterval || "month",
        allowInstallments: product.allowInstallments,
        maxInstallments: product.maxInstallments?.toString() || "12",
        coverImage: product.coverImage || "",
        thumbnailImage: product.thumbnailImage || "",
        contentUrl: product.contentUrl || "",
        salesPageUrl: product.salesPageUrl || "",
        guaranteeDays: product.guaranteeDays?.toString() || "30",
        affiliateCommission: product.affiliateCommission?.toString() || "60",
      });
    }
  }, [product]);

  // Auto-gerar slug a partir do nome
  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: isEdit ? prev.slug : name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const priceInCents = Math.round(parseFloat(formData.price) * 100);

    if (isNaN(priceInCents) || priceInCents < 0) {
      toast.error("Preço inválido");
      return;
    }

    const data = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description || undefined,
      categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
      type: formData.type,
      price: priceInCents,
      isRecurring: formData.isRecurring,
      recurringInterval: formData.isRecurring ? formData.recurringInterval : undefined,
      allowInstallments: formData.allowInstallments,
      maxInstallments: parseInt(formData.maxInstallments),
      coverImage: formData.coverImage || undefined,
      thumbnailImage: formData.thumbnailImage || undefined,
      contentUrl: formData.contentUrl || undefined,
      salesPageUrl: formData.salesPageUrl || undefined,
      guaranteeDays: parseInt(formData.guaranteeDays) || 30,
      affiliateCommission: parseInt(formData.affiliateCommission) || 60,
    };

    if (isEdit && productId) {
      await updateMutation.mutateAsync({ id: productId, ...data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  if (isEdit && isLoading) {
    return (
      <AdminLayout>
        <div className="p-6 lg:p-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-muted rounded mb-4" />
            <div className="h-4 w-64 bg-muted rounded mb-8" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/products">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">
            {isEdit ? "Editar Produto" : "Novo Produto"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit
              ? "Atualize as informações do produto"
              : "Preencha os dados para criar um novo produto"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome do Produto *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Ex: Curso Completo de React"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug">Slug (URL) *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, slug: e.target.value }))
                      }
                      placeholder="curso-completo-react"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      URL amigável para o produto
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Descreva o produto..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Categoria (opcional)</Label>
                    <select
                      id="category"
                      value={formData.categoryId}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Sem categoria</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="type">Tipo de Produto *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: any) =>
                        setFormData((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="course">Curso Online</SelectItem>
                        <SelectItem value="ebook">E-book</SelectItem>
                        <SelectItem value="audiobook">Audiobook</SelectItem>
                        <SelectItem value="app">App</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Imagens</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ImageUpload
                    label="Imagem de Capa (1200x630px)"
                    value={formData.coverImage}
                    onChange={(url) =>
                      setFormData((prev) => ({ ...prev, coverImage: url }))
                    }
                    aspectRatio="16/9"
                  />

                  <ImageUpload
                    label="Thumbnail (400x400px)"
                    value={formData.thumbnailImage}
                    onChange={(url) =>
                      setFormData((prev) => ({ ...prev, thumbnailImage: url }))
                    }
                    aspectRatio="1/1"
                  />
                </CardContent>
              </Card>

              {/* Arquivo do Produto */}
              <Card>
                <CardHeader>
                  <CardTitle>Arquivo do Produto</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formData.type === "ebook" ? "PDF do e-book" : formData.type === "audiobook" ? "Arquivo de áudio (MP3, WAV)" : "Arquivo do produto (PDF, MP3, ZIP)"}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.contentUrl ? (
                    <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">Arquivo carregado</p>
                        <p className="text-xs text-muted-foreground truncate">{formData.contentUrl}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData((prev) => ({ ...prev, contentUrl: "" }))}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                      onClick={() => document.getElementById('product-file-input')?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file) {
                          const input = document.getElementById('product-file-input') as HTMLInputElement;
                          const dt = new DataTransfer();
                          dt.items.add(file);
                          input.files = dt.files;
                          input.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                      }}
                    >
                      {formData.type === "audiobook" ? (
                        <Music className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                      ) : (
                        <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                      )}
                      <p className="text-sm font-medium mb-1">Clique ou arraste o arquivo aqui</p>
                      <p className="text-xs text-muted-foreground">
                        {formData.type === "audiobook" ? "MP3, WAV, OGG (máx. 100MB)" : "PDF (máx. 100MB)"}
                      </p>
                    </div>
                  )}
                  <input
                    id="product-file-input"
                    type="file"
                    className="hidden"
                    accept={formData.type === "audiobook" ? "audio/*" : ".pdf,application/pdf"}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const toastId = toast.loading(`Enviando ${file.name}...`);
                      try {
                        const fd = new FormData();
                        fd.append("file", file);
                        const res = await fetch("/api/upload/product-file", {
                          method: "POST",
                          credentials: "include",
                          body: fd,
                        });
                        if (!res.ok) {
                          const err = await res.json();
                          throw new Error(err.error || "Erro no upload");
                        }
                        const data = await res.json();
                        setFormData((prev) => ({ ...prev, contentUrl: data.url }));
                        toast.success("Arquivo enviado com sucesso!", { id: toastId });
                      } catch (err: any) {
                        toast.error(err.message || "Erro ao enviar arquivo", { id: toastId });
                      }
                    }}
                  />
                  {formData.contentUrl && (
                    <div>
                      <Label>Ou cole a URL diretamente</Label>
                      <Input
                        value={formData.contentUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, contentUrl: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                  )}
                  {!formData.contentUrl && (
                    <div>
                      <Label>Ou cole a URL do arquivo</Label>
                      <Input
                        value={formData.contentUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, contentUrl: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Pricing & Settings */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preço</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="price">Preço (R$) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, price: e.target.value }))
                      }
                      placeholder="99.90"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="isRecurring">Assinatura Recorrente</Label>
                    <Switch
                      id="isRecurring"
                      checked={formData.isRecurring}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, isRecurring: checked }))
                      }
                    />
                  </div>

                  {formData.isRecurring && (
                    <div>
                      <Label htmlFor="recurringInterval">Intervalo</Label>
                      <Select
                        value={formData.recurringInterval}
                        onValueChange={(value: any) =>
                          setFormData((prev) => ({
                            ...prev,
                            recurringInterval: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="month">Mensal</SelectItem>
                          <SelectItem value="year">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {!formData.isRecurring && (
                    <>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="allowInstallments">
                          Permitir Parcelamento
                        </Label>
                        <Switch
                          id="allowInstallments"
                          checked={formData.allowInstallments}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              allowInstallments: checked,
                            }))
                          }
                        />
                      </div>

                      {formData.allowInstallments && (
                        <div>
                          <Label htmlFor="maxInstallments">
                            Máximo de Parcelas
                          </Label>
                          <Input
                            id="maxInstallments"
                            type="number"
                            min="1"
                            max="12"
                            value={formData.maxInstallments}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                maxInstallments: e.target.value,
                              }))
                            }
                          />
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configurações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="guaranteeDays">Garantia (dias)</Label>
                    <Input
                      id="guaranteeDays"
                      type="number"
                      min="0"
                      value={formData.guaranteeDays}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          guaranteeDays: e.target.value,
                        }))
                      }
                      placeholder="30"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Período de garantia de satisfação ou devolução
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="affiliateCommission">Comissão de Afiliados (%)</Label>
                    <Input
                      id="affiliateCommission"
                      type="number"
                      min="50"
                      max="70"
                      value={formData.affiliateCommission}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          affiliateCommission: e.target.value,
                        }))
                      }
                      placeholder="30"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Percentual de comissão pago aos afiliados por venda (50-70%)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="salesPageUrl">Página de Vendas (URL)</Label>
                    <Input
                      id="salesPageUrl"
                      type="url"
                      value={formData.salesPageUrl}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          salesPageUrl: e.target.value,
                        }))
                      }
                      placeholder="https://exemplo.com/produto"
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                className="w-full"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? "Atualizar Produto" : "Criar Produto"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
