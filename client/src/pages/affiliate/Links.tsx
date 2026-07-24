import AffiliateLayout from "@/components/AffiliateLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Copy, ExternalLink, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function AffiliateLinks() {
  const [productSlug, setProductSlug] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  const { data: products, isLoading: loadingProducts } =
    trpc.products.list.useQuery();

  const generateLinkMutation = trpc.affiliates.generateLink.useMutation({
    onSuccess: (data) => {
      setGeneratedLink(data.link);
      toast.success("Link gerado com sucesso!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleGenerateLink = () => {
    if (!productSlug) {
      toast.error("Selecione um produto");
      return;
    }

    generateLinkMutation.mutate({ productSlug });
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      toast.success("Link copiado!");
    }
  };

  if (loadingProducts) {
    return (
      <AffiliateLayout>
        <Skeleton className="h-96 w-full" />
      </AffiliateLayout>
    );
  }

  return (
    <AffiliateLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Gerador de Links</h1>
          <p className="text-muted-foreground">
            Crie links de afiliado para promover produtos
          </p>
        </div>

        {/* Gerador de Links */}
        <Card>
          <CardHeader>
            <CardTitle>Gerar Novo Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product">Selecione o Produto</Label>
              <select
                id="product"
                className="w-full p-2 border rounded-md"
                value={productSlug}
                onChange={(e) => setProductSlug(e.target.value)}
              >
                <option value="">Escolha um produto...</option>
                {products?.map((product) => (
                  <option key={product.id} value={product.slug}>
                    {product.name} - {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(product.price / 100)}
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={handleGenerateLink}
              disabled={!productSlug || generateLinkMutation.isPending}
              className="w-full"
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              {generateLinkMutation.isPending ? "Gerando..." : "Gerar Link"}
            </Button>

            {generatedLink && (
              <div className="space-y-2 pt-4 border-t">
                <Label>Seu Link de Afiliado</Label>
                <div className="flex gap-2">
                  <Input
                    value={generatedLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyLink}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(generatedLink, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Compartilhe este link para ganhar comissões nas vendas!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dicas */}
        <Card>
          <CardHeader>
            <CardTitle>Dicas para Promover</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>
                  Compartilhe seus links nas redes sociais (Instagram, Facebook,
                  Twitter)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>
                  Crie conteúdo relevante em blogs ou YouTube sobre os produtos
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>
                  Envie para sua lista de e-mails ou grupos do WhatsApp
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>
                  Seja transparente sobre ser um afiliado para construir
                  confiança
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AffiliateLayout>
  );
}
