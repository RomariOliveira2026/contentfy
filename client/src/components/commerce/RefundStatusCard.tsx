import type { RefundRequestStatus } from "@shared/contentfy";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const LABELS: Record<RefundRequestStatus, string> = {
  requested: "Solicitado",
  under_review: "Em análise",
  approved: "Aprovado",
  rejected: "Recusado",
  processing: "Processando",
  refunded: "Reembolsado",
  failed: "Falha",
  cancelled: "Cancelado",
};

export function RefundStatusCard({
  status,
  requestedAt,
  className,
}: {
  status: RefundRequestStatus;
  requestedAt?: string | Date;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3",
        className
      )}
      data-cf-state={status}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">Status da solicitação</p>
        <Badge variant="outline">{LABELS[status]}</Badge>
      </div>
      {requestedAt ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Aberta em{" "}
          {new Date(requestedAt).toLocaleString("pt-BR")}
        </p>
      ) : null}
    </div>
  );
}
