import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, User } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminAffiliates() {
  const utils = trpc.useUtils();
  const { data: affiliates, isLoading } = trpc.affiliates.listAll.useQuery();

  const approveMutation = trpc.affiliates.approve.useMutation({
    onSuccess: () => {
      toast.success("Afiliado aprovado com sucesso!");
      utils.affiliates.listAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const rejectMutation = trpc.affiliates.reject.useMutation({
    onSuccess: () => {
      toast.success("Afiliado rejeitado");
      utils.affiliates.listAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleApprove = (affiliateId: number) => {
    if (confirm("Tem certeza que deseja aprovar este afiliado?")) {
      approveMutation.mutate({ affiliateId });
    }
  };

  const handleReject = (affiliateId: number) => {
    if (confirm("Tem certeza que deseja rejeitar este afiliado?")) {
      rejectMutation.mutate({ affiliateId });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AdminLayout>
    );
  }

  const pendingAffiliates = affiliates?.filter((a) => !a.isActive) || [];
  const activeAffiliates = affiliates?.filter((a) => a.isActive) || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestão de Afiliados</h1>
          <p className="text-muted-foreground">
            Gerencie afiliados e suas comissões
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Afiliados
              </CardTitle>
              <User className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{affiliates?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ativos
              </CardTitle>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {activeAffiliates.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pendentes
              </CardTitle>
              <XCircle className="w-4 h-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {pendingAffiliates.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Afiliados Pendentes */}
        {pendingAffiliates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Solicitações Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingAffiliates.map((affiliate) => (
                  <div
                    key={affiliate.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold">{affiliate.userName}</p>
                          <p className="text-sm text-muted-foreground">
                            Código: {affiliate.affiliateCode}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Taxa: {affiliate.commissionRate}%
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(affiliate.id)}
                        disabled={approveMutation.isPending}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(affiliate.id)}
                        disabled={rejectMutation.isPending}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Rejeitar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Afiliados Ativos */}
        <Card>
          <CardHeader>
            <CardTitle>Afiliados Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            {activeAffiliates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum afiliado ativo no momento.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Nome</th>
                      <th className="text-left p-4 font-medium">Código</th>
                      <th className="text-left p-4 font-medium">Taxa</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeAffiliates.map((affiliate) => (
                      <tr key={affiliate.id} className="border-b hover:bg-muted/50">
                        <td className="p-4 font-medium">{affiliate.userName}</td>
                        <td className="p-4 font-mono text-sm">
                          {affiliate.affiliateCode}
                        </td>
                        <td className="p-4">{affiliate.commissionRate}%</td>
                        <td className="p-4">
                          <Badge variant="default">Ativo</Badge>
                        </td>
                        <td className="p-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(affiliate.id)}
                          >
                            Desativar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
