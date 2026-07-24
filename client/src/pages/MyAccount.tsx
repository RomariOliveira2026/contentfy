import { useLocation } from "wouter";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Settings, CreditCard, Package, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function MyAccount() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  const { data: user } = trpc.auth.me.useQuery();
  const { data: subscriptions } = trpc.checkout.myOrders.useQuery(); // TODO: Criar endpoint específico para assinaturas

  const createPortalSessionMutation = trpc.checkout.createCustomerPortalSession.useMutation({
    onSuccess: (data) => {
      // Redirecionar para Stripe Customer Portal
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao abrir portal de gerenciamento");
      setLoading(false);
    },
  });

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      await createPortalSessionMutation.mutateAsync();
    } catch (error) {
      // Erro já tratado no onError
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
            <p className="text-muted-foreground mb-6">Você precisa estar logado para acessar esta página.</p>
            <Button onClick={() => setLocation("/")}>Voltar para Home</Button>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      
      <main className="flex-1 py-12 bg-muted/30">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Minha Conta</h1>
            <p className="text-muted-foreground">
              Gerencie suas informações, assinaturas e preferências
            </p>
          </div>

          {/* Account Info */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Informações da Conta</CardTitle>
                  <CardDescription>Seus dados pessoais</CardDescription>
                </div>
                <Settings className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{user.name || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Conta</p>
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                  {user.role === "admin" ? "Administrador" : "Usuário"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Management */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gerenciar Assinatura</CardTitle>
                  <CardDescription>
                    Altere seu plano, método de pagamento ou cancele sua assinatura
                  </CardDescription>
                </div>
                <CreditCard className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {user.stripeCustomerId ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Você possui uma assinatura ativa. Clique no botão abaixo para gerenciar:
                  </p>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Trocar de plano (Mensal ↔ Anual)</li>
                    <li>• Atualizar método de pagamento</li>
                    <li>• Visualizar histórico de faturas</li>
                    <li>• Baixar recibos</li>
                    <li>• Cancelar assinatura</li>
                  </ul>
                  <Button 
                    onClick={handleManageSubscription}
                    disabled={loading}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Abrindo portal...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Gerenciar Assinatura
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    Você ainda não possui uma assinatura ativa.
                  </p>
                  <Button onClick={() => setLocation("/products")}>
                    Ver Planos Disponíveis
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Products/Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Meus Pedidos</CardTitle>
                  <CardDescription>Histórico de compras e assinaturas</CardDescription>
                </div>
                <Package className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {subscriptions && subscriptions.length > 0 ? (
                <div className="space-y-3">
                  {subscriptions.slice(0, 5).map((order: any) => (
                    <div 
                      key={order.id} 
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">Pedido #{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">R$ {(order.amount / 100).toFixed(2)}</p>
                        <Badge 
                          variant={
                            order.status === "completed" ? "default" : 
                            order.status === "pending" ? "secondary" : 
                            "destructive"
                          }
                        >
                          {order.status === "completed" ? "Concluído" : 
                           order.status === "pending" ? "Pendente" : 
                           order.status === "failed" ? "Falhou" : "Reembolsado"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Você ainda não realizou nenhuma compra.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
