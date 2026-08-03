import type { RefundRequestStatus } from "@shared/contentfy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type AdminRefundRow = {
  request: {
    id: number;
    status: RefundRequestStatus;
    reason: string;
    refundAmount: number | null;
    requestedAt: string | Date;
  };
  product: { id: number; name: string } | null;
  user: { id: number; name: string | null; email: string | null } | null;
  order: { id: number; amount: number; status: string } | null;
};

const STATUS_LABEL: Record<RefundRequestStatus, string> = {
  requested: "Pendente",
  under_review: "Em análise",
  approved: "Aprovada",
  rejected: "Recusada",
  processing: "Processando",
  refunded: "Concluída",
  failed: "Falha",
  cancelled: "Cancelada",
};

export function AdminRefundTable({
  rows,
  onOpen,
}: {
  rows: AdminRefundRow[];
  onOpen: (requestId: number) => void;
}) {
  if (!rows.length) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 p-10 text-center text-sm text-muted-foreground">
        Nenhuma solicitação encontrada para os filtros atuais.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Aluno</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.request.id}>
              <TableCell>#{row.request.id}</TableCell>
              <TableCell>
                <div className="text-sm">{row.user?.name || "—"}</div>
                <div className="text-xs text-muted-foreground">
                  {row.user?.email}
                </div>
              </TableCell>
              <TableCell>{row.product?.name || "—"}</TableCell>
              <TableCell>
                {(
                  (row.request.refundAmount ?? row.order?.amount ?? 0) / 100
                ).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {STATUS_LABEL[row.request.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {new Date(row.request.requestedAt).toLocaleString("pt-BR")}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onOpen(row.request.id)}
                >
                  Detalhes
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
