import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NextStepCardProps {
  title: string;
  reason: string;
  href?: string;
  className?: string;
}

export function NextStepCard({
  title,
  reason,
  href,
  className,
}: NextStepCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/50 bg-gradient-to-br from-foreground/[0.04] to-transparent p-5 sm:p-6",
        className
      )}
    >
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
        Próximo passo
      </p>
      <h3 className="text-lg font-medium tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-xl">{reason}</p>
      {href && (
        <Button asChild className="mt-5" size="sm">
          <Link href={href}>
            Continuar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}
