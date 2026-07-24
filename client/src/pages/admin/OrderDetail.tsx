import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Package,
  User,
  CreditCard,
  Calendar,
  RefreshCcw,
  XCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export default function OrderDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: order, isLoading } = trpc.orders.getById.useQuery(
    { id: parseInt(id || "0") },
    { enabled: !!id }
  );

  const handleRefund = async () => {
    toast.info("Funcionalidade de reembolso será implementada em breve");
  };

  const handleCancel = async () => {
    toast.info("Funcionalidade de cancelamento será implementada em breve");
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      { variant: "default" | "secondary" | "destructive" | "outline"; label: string; icon: any }
    > = {
      pending: { variant: "secondary", label: "Pendente", icon: Clock },
      paid: { variant: "default", label: "Pago", icon: CheckCircle },
      completed: { variant: "default", label: "Concluído", icon: CheckCircle },
      cancelled: { variant: "destructive", label: "Cancelado", icon: XCircle },
      failed: { variant: "destructive", label: "Falhou", icon: XCircle },
      refunded: { variant: "outline", label: "Reembolsado", icon: RefreshCcw },
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">Pedido não encontrado</h3>
            <p className="text-muted-foreground mt-2">
              O pedido #{id} não existe ou foi removido
            </p>
            <Button
              onClick={() => setLocation("/admin/sales")}
              className="mt-4"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Vendas
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/admin/sales")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-owl bg-clip-text text-transparent">
              Pedido #{order.id}
            </h1>
            <p className="text-muted-foreground mt-1">
              Criado em {format(new Date(order.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {order.status === "completed" && (
            <Button variant="outline" onClick={handleRefund}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reembolsar
            </Button>
          )}
          {order.status === "pending" && (
            <Button variant="destructive" onClick={handleCancel}>
              <XCircle className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Coluna Principal */}
        <div className="md:col-span-2 space-y-6">
          {/* Status do Pedido */}
          <Card className="border-owl-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Status do Pedido
                {getStatusBadge(order.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Data de Criação</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                {order.updatedAt && order.updatedAt !== order.createdAt && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Última Atualização</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Produtos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Produtos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Produto #{order.productId}</p>
                    <p className="text-sm text-muted-foreground">
                      Informações detalhadas do produto
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(order.amount / 100)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-medium">Subtotal</span>
                  <span>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(order.amount / 100)}
                  </span>
                </div>

                {order.discountAmount && order.discountAmount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span className="font-medium">Desconto</span>
                    <span>
                      -{new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(order.discountAmount / 100)}
                    </span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-owl-primary">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format((order.amount - (order.discountAmount || 0)) / 100)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Informações de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Método de Pagamento</p>
                <p className="text-sm text-muted-foreground">Stripe Checkout</p>
              </div>
              {order.stripeCheckoutSessionId && (
                <div>
                  <p className="text-sm font-medium">Stripe Session ID</p>
                  <p className="text-xs font-mono text-muted-foreground break-all">
                    {order.stripeCheckoutSessionId}
                  </p>
                </div>
              )}
              {order.stripePaymentIntentId && (
                <div>
                  <p className="text-sm font-medium">Stripe Payment Intent ID</p>
                  <p className="text-xs font-mono text-muted-foreground break-all">
                    {order.stripePaymentIntentId}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cliente */}
          <Card className="border-owl-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Nome</p>
                <p className="text-sm text-muted-foreground">
                  {order.user?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">E-mail</p>
                <p className="text-sm text-muted-foreground break-all">
                  {order.user?.email || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">ID do Cliente</p>
                <p className="text-sm font-mono text-muted-foreground">
                  #{order.userId}
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setLocation(`/admin/customers`)}
              >
                Ver Perfil Completo
              </Button>
            </CardContent>
          </Card>

          {/* Resumo Financeiro */}
          <Card className="bg-gradient-to-br from-owl-primary/5 to-owl-secondary/5 border-owl-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Valor Bruto</span>
                <span className="text-sm font-medium">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(order.amount / 100)}
                </span>
              </div>
              {order.discountAmount && order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="text-sm">Desconto</span>
                  <span className="text-sm font-medium">
                    -{new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(order.discountAmount / 100)}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Valor Líquido</span>
                <span className="text-owl-primary">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format((order.amount - (order.discountAmount || 0)) / 100)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
