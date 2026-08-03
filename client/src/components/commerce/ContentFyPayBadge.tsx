import { CONTENTFY_IDENTITY } from "@/core";
import { cn } from "@/lib/utils";

/** Always show ContentFy Pay — never expose provider brand in UI. */
export function ContentFyPayBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-300",
        className
      )}
    >
      {CONTENTFY_IDENTITY.paymentLabel}
    </span>
  );
}
