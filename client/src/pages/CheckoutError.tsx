import { useLocation } from "wouter";
import PublicHeader from "@/components/PublicHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, HelpCircle } from "lucide-react";

export default function CheckoutError() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1 py-12 flex items-center">
        <div className="container max-w-2xl">
          <Card>
            <CardContent className="p-12 text-center">
              {/* Ícone de Erro */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>

              {/* Título */}
              <h1 className="text-3xl font-bold mb-4">
                Ops! Algo deu errado
              </h1>

              {/* Mensagem */}
              <p className="text-lg text-muted-foreground mb-8">
                Não foi possível processar seu pagamento. Seu cartão não foi cobrado.
              </p>

              {/* Informações */}
              <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Possíveis Causas
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                    <span>
                      Cartão recusado pela operadora (saldo insuficiente, limite excedido)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                    <span>
                      Dados do cartão incorretos (número, CVV, validade)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                    <span>
                      Problema temporário de conexão
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                    <span>
                      Cartão bloqueado para compras online
                    </span>
                  </li>
                </ul>
              </div>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => window.history.back()}>
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Tentar Novamente
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setLocation("/products")}
                >
                  Voltar para Produtos
                </Button>
              </div>

              {/* Suporte */}
              <div className="mt-8 pt-8 border-t">
                <p className="text-sm text-muted-foreground">
                  Precisa de ajuda?{" "}
                  <a href="/contact" className="text-primary hover:underline">
                    Entre em contato com o suporte
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
