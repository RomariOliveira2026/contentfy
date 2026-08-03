import { REFUND_REASON_LABELS, type RefundReasonCode } from "@shared/contentfy";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export interface RefundRequestFormProps {
  productName: string;
  amountCents: number;
  onSubmit: (data: {
    reason: RefundReasonCode;
    details?: string;
    acknowledge: true;
  }) => Promise<void> | void;
  loading?: boolean;
}

export function RefundRequestForm({
  productName,
  amountCents,
  onSubmit,
  loading,
}: RefundRequestFormProps) {
  const [reason, setReason] = useState<RefundReasonCode | "">("");
  const [details, setDetails] = useState("");
  const [acknowledge, setAcknowledge] = useState(false);

  const amount = (amountCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <form
      className="space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!reason || !acknowledge) return;
        await onSubmit({
          reason,
          details: details.trim() || undefined,
          acknowledge: true,
        });
      }}
    >
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
        <p className="font-medium">{productName}</p>
        <p className="text-muted-foreground">Valor: {amount}</p>
        <p className="mt-2 text-muted-foreground">
          Prazo estimado de análise: até 5 dias úteis.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Motivo principal</Label>
        <Select
          value={reason}
          onValueChange={(v) => setReason(v as RefundReasonCode)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um motivo" />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(REFUND_REASON_LABELS) as RefundReasonCode[]).map(
              (code) => (
                <SelectItem key={code} value={code}>
                  {REFUND_REASON_LABELS[code]}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="details">Detalhes (opcional)</Label>
        <Textarea
          id="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          maxLength={2000}
          placeholder="Se quiser, conte o que aconteceu — sem obrigação de se justificar demais."
          rows={4}
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <Checkbox
          checked={acknowledge}
          onCheckedChange={(v) => setAcknowledge(v === true)}
          className="mt-0.5"
        />
        <span>
          Estou ciente de que a solicitação será analisada pela equipe ContentFy
          Protect conforme a Política de Garantia, e que o acesso ao produto
          só será encerrado se o reembolso for concluído.
        </span>
      </label>

      <Button
        type="submit"
        disabled={!reason || !acknowledge || loading}
        className="w-full"
      >
        {loading ? "Enviando…" : "Solicitar reembolso"}
      </Button>
    </form>
  );
}
