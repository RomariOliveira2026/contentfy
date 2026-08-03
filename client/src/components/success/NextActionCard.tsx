import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NextActionCardProps {
  title: string;
  reason: string;
  href?: string;
  className?: string;
}

export function NextActionCard({
  title,
  reason,
  href,
  className,
}: NextActionCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/50 bg-gradient-to-br from-foreground/[0.04] to-transparent p-5 sm:p-6",
        className
      )}
    >
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
        Próxima ação
      </p>
      <h3 className="text-lg font-medium tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-xl">{reason}</p>
      {href && (
        <Button asChild size="sm" className="mt-5">
          <Link href={href}>
            Continuar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}
