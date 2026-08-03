import type { RefundRequestStatus } from "@shared/contentfy";
import { cn } from "@/lib/utils";

const STEPS: RefundRequestStatus[] = [
  "requested",
  "under_review",
  "approved",
  "processing",
  "refunded",
];

const LABELS: Record<string, string> = {
  requested: "Solicitação",
  under_review: "Análise",
  approved: "Aprovação",
  processing: "Processamento",
  refunded: "Conclusão",
  rejected: "Recusado",
  failed: "Falha",
  cancelled: "Cancelado",
};

export function RefundTimeline({
  status,
  className,
}: {
  status: RefundRequestStatus;
  className?: string;
}) {
  if (status === "rejected" || status === "cancelled" || status === "failed") {
    return (
      <div className={cn("text-sm text-muted-foreground", className)}>
        Status final: {LABELS[status]}
      </div>
    );
  }

  const currentIdx = Math.max(0, STEPS.indexOf(status));

  return (
    <ol className={cn("grid gap-2 sm:grid-cols-5", className)}>
      {STEPS.map((step, idx) => {
        const done = idx <= currentIdx;
        return (
          <li
            key={step}
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              done
                ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                : "border-white/10 text-muted-foreground"
            )}
          >
            {LABELS[step]}
          </li>
        );
      })}
    </ol>
  );
}
