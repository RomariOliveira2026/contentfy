import { useLocation } from "wouter";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProtectionBadge } from "@/components/commerce";
import { CheckCircle2, Library, ShoppingBag, Sparkles } from "lucide-react";

export default function CheckoutSuccess() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="cf-page-main flex items-center justify-center">
        <div className="container max-w-lg w-full">
          <Card className="cf-card-premium overflow-hidden border-primary/15 shadow-xl">
            <div className="cf-gradient-bar" />

            <CardContent className="p-10 sm:p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FFD43B]/15 to-[#FF8C42]/15 border border-primary/20 mb-6">
                <CheckCircle2 className="w-11 h-11 text-primary" />
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary mb-4 bg-primary/10 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                Pagamento aprovado
              </div>

              <h1 className="cf-page-title mb-3">Compra confirmada!</h1>

              <p className="text-muted-foreground mb-4 leading-relaxed">
                Seu pagamento foi processado com sucesso pela infraestrutura
                integrada da ContentFy.
              </p>

              <div className="mb-8 flex justify-center">
                <ProtectionBadge />
              </div>
              <p className="text-xs text-muted-foreground mb-10">
                Você poderá solicitar o reembolso dentro do prazo informado,
                conforme a Política de Garantia ContentFy.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  className="w-full sm:w-auto cf-btn-gradient rounded-lg"
                  onClick={() => setLocation("/my-account/products")}
                >
                  <Library className="mr-2 w-4 h-4" />
                  Ir para minha biblioteca
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto rounded-lg"
                  onClick={() => setLocation("/my-account/purchases")}
                >
                  Minhas compras / Protect
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto rounded-lg"
                  onClick={() => setLocation("/products")}
                >
                  <ShoppingBag className="mr-2 w-4 h-4" />
                  Voltar aos produtos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
