import { REFUND_REASON_LABELS, type RefundReasonCode } from "@shared/contentfy";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RefundTimeline } from "./RefundTimeline";
import { GuaranteeCountdown } from "./GuaranteeCountdown";
import { useState } from "react";

export function AdminRefundDrawer({
  open,
  onOpenChange,
  data,
  loading,
  onTransition,
  onProcessRefund,
  onSaveNotes,
  onRepairAccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: {
    request: {
      id: number;
      status: string;
      reason: string;
      details: string | null;
      adminNotes: string | null;
      providerRefundId: string | null;
      refundAmount: number | null;
      reconciliationNeeded?: boolean;
      accessRevocationStatus?: string;
    };
    product: { name: string; guaranteeDays: number };
    order: {
      id: number;
      amount: number;
      status: string;
      createdAt: string | Date;
    };
    user: { name: string | null; email: string | null };
    eligibility: {
      remainingDays: number;
      deadline: string | null;
      humanMessage: string;
    };
    access: { isActive: boolean } | null;
  } | null;
  loading?: boolean;
  onTransition: (status: string, adminNotes?: string) => Promise<void>;
  onProcessRefund: () => Promise<void>;
  onSaveNotes: (notes: string) => Promise<void>;
  onRepairAccess?: () => Promise<void>;
}) {
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const request = data?.request;

  async function run(action: () => Promise<void>) {
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>ContentFy Protect #{request?.id ?? "—"}</SheetTitle>
          <SheetDescription>
            Análise administrativa de garantia e reembolso
          </SheetDescription>
        </SheetHeader>

        {loading || !data || !request ? (
          <p className="mt-8 text-sm text-muted-foreground">Carregando…</p>
        ) : (
          <div className="mt-6 space-y-5">
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Aluno:</span>{" "}
                {data.user.name} ({data.user.email})
              </p>
              <p>
                <span className="text-muted-foreground">Produto:</span>{" "}
                {data.product.name}
              </p>
              <p>
                <span className="text-muted-foreground">Pedido:</span> #
                {data.order.id} · {data.order.status}
              </p>
              <p>
                <span className="text-muted-foreground">Motivo:</span>{" "}
                {REFUND_REASON_LABELS[request.reason as RefundReasonCode] ||
                  request.reason}
              </p>
              {request.details ? (
                <p className="text-muted-foreground">{request.details}</p>
              ) : null}
              <p>
                <span className="text-muted-foreground">Acesso atual:</span>{" "}
                {data.access?.isActive ? "Ativo" : "Revogado / inexistente"}
              </p>
              {request.providerRefundId ? (
                <p className="text-xs text-muted-foreground">
                  Stripe refund: {request.providerRefundId}
                </p>
              ) : null}
            </div>

            <GuaranteeCountdown
              remainingDays={data.eligibility.remainingDays}
              deadline={data.eligibility.deadline}
            />
            <p className="text-xs text-muted-foreground">
              {data.eligibility.humanMessage}
            </p>

            <RefundTimeline status={request.status as any} />

            <div className="space-y-2">
              <p className="text-sm font-medium">Observações administrativas</p>
              <Textarea
                value={notes || request.adminNotes || ""}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
              <Button
                size="sm"
                variant="secondary"
                disabled={busy}
                onClick={() =>
                  run(() => onSaveNotes(notes || request.adminNotes || ""))
                }
              >
                Salvar observação
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {request.status === "requested" && (
                <Button
                  size="sm"
                  disabled={busy}
                  onClick={() => run(() => onTransition("under_review", notes))}
                >
                  Colocar em análise
                </Button>
              )}
              {request.status === "under_review" && (
                <>
                  <Button
                    size="sm"
                    disabled={busy}
                    onClick={() => run(() => onTransition("approved", notes))}
                  >
                    Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={busy}
                    onClick={() => run(() => onTransition("rejected", notes))}
                  >
                    Rejeitar
                  </Button>
                </>
              )}
              {(request.status === "approved" ||
                request.status === "failed") && (
                <Button
                  size="sm"
                  variant="default"
                  disabled={busy}
                  onClick={() => {
                    if (
                      !window.confirm(
                        "Processar reembolso via Stripe Test Mode agora? Confirme que STRIPE_SECRET_KEY é sk_test_. Esta ação é irreversível no pedido e revogará o acesso ao produto."
                      )
                    ) {
                      return;
                    }
                    return run(() => onProcessRefund());
                  }}
                >
                  Processar reembolso
                </Button>
              )}
              {request.status === "refunded" &&
                request.reconciliationNeeded &&
                onRepairAccess && (
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={busy}
                    onClick={() => run(() => onRepairAccess())}
                  >
                    Reparar revogação de acesso
                  </Button>
                )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
