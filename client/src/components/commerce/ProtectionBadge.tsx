import { PROTECT_BRAND } from "@shared/contentfy";
import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";
import { Link } from "wouter";

export interface ProtectionBadgeProps {
  days?: number;
  className?: string;
  showLink?: boolean;
}

export function ProtectionBadge({
  days = 30,
  className,
  showLink = true,
}: ProtectionBadgeProps) {
  const label =
    days === 30 ? PROTECT_BRAND.guaranteeLabel : `Garantia de ${days} dias`;

  const body = (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300",
        className
      )}
    >
      <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
      <span>
        {PROTECT_BRAND.name} · {label}
      </span>
    </span>
  );

  if (!showLink) return body;

  return (
    <Link href="/garantia">
      <a className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 rounded-full">
        {body}
      </a>
    </Link>
  );
}
