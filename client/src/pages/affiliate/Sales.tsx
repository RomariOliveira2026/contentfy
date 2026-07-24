import AffiliateLayout from "@/components/AffiliateLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AffiliateSales() {
  const { data: sales, isLoading } = trpc.affiliates.getMySales.useQuery();

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "Pendente", variant: "secondary" },
      approved: { label: "Aprovado", variant: "default" },
      paid: { label: "Pago", variant: "outline" },
    };

    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <AffiliateLayout>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AffiliateLayout>
    );
  }

  return (
    <AffiliateLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Minhas Vendas</h1>
          <p className="text-muted-foreground">
            Acompanhe todas as vendas realizadas através dos seus links
          </p>
        </div>

        {/* Tabela de Vendas */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            {!sales || sales.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Você ainda não possui vendas registradas.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Compartilhe seus links de afiliado para começar a ganhar
                  comissões!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Data</th>
                      <th className="text-left p-4 font-medium">Pedido #</th>
                      <th className="text-left p-4 font-medium">Comissão</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Pago em</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale) => (
                      <tr key={sale.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          {format(new Date(sale.createdAt), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </td>
                        <td className="p-4 font-mono text-sm">
                          #{sale.orderId}
                        </td>
                        <td className="p-4 font-semibold text-green-600">
                          {formatCurrency(sale.commissionAmount)}
                        </td>
                        <td className="p-4">{getStatusBadge(sale.status)}</td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {sale.paidAt
                            ? format(new Date(sale.paidAt), "dd/MM/yyyy", {
                                locale: ptBR,
                              })
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legenda de Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status das Comissões</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant="secondary">Pendente</Badge>
              <span className="text-sm text-muted-foreground">
                Aguardando confirmação do pagamento
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="default">Aprovado</Badge>
              <span className="text-sm text-muted-foreground">
                Disponível para saque
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline">Pago</Badge>
              <span className="text-sm text-muted-foreground">
                Comissão já foi paga
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AffiliateLayout>
  );
}
