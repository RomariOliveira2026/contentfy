import { Link } from "wouter";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProtectionSummaryItem } from "@shared/contentfy";

interface ProtectionSummaryProps {
  items: ProtectionSummaryItem[];
  className?: string;
}

export function ProtectionSummary({ items, className }: ProtectionSummaryProps) {
  if (!items.length) return null;

  return (
    <section
      aria-label="Compras protegidas"
      className={cn(
        "rounded-xl border border-border/30 bg-background/30 p-4 sm:p-5",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <Shield className="h-4 w-4 text-muted-foreground" aria-hidden />
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Compras protegidas
        </p>
      </div>
      <ul className="space-y-2">
        {items.slice(0, 3).map((item) => (
          <li
            key={item.orderId}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{item.productName}</p>
              <p className="text-xs text-muted-foreground">
                {item.remainingDays != null && item.remainingDays >= 0
                  ? `${item.remainingDays} dias restantes`
                  : item.status}
              </p>
            </div>
            <Link
              href={item.href}
              className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              Detalhes
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/my-account/purchases"
        className="inline-block mt-3 text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
      >
        Ver compras
      </Link>
    </section>
  );
}
