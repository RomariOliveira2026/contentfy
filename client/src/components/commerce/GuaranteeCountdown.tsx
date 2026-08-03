import { cn } from "@/lib/utils";

export interface GuaranteeCountdownProps {
  remainingDays: number;
  deadline: string | null;
  className?: string;
}

export function GuaranteeCountdown({
  remainingDays,
  deadline,
  className,
}: GuaranteeCountdownProps) {
  const deadlineLabel = deadline
    ? new Date(deadline).toLocaleDateString("pt-BR", { timeZone: "UTC" })
    : "—";

  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3",
        className
      )}
    >
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
        Prazo da garantia
      </p>
      <p className="mt-1 text-lg font-semibold">
        {remainingDays === 0
          ? "Último dia"
          : `${remainingDays} dia${remainingDays === 1 ? "" : "s"} restantes`}
      </p>
      <p className="text-sm text-muted-foreground">Válida até {deadlineLabel}</p>
    </div>
  );
}
