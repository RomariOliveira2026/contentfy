import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NextBestAction } from "@shared/contentfy";

interface NextBestActionCardProps {
  action: NextBestAction;
  className?: string;
  onClick?: () => void;
}

export function NextBestActionCard({
  action,
  className,
  onClick,
}: NextBestActionCardProps) {
  return (
    <section
      aria-label="Próxima melhor ação"
      className={cn(
        "rounded-2xl border border-border/50 bg-background/60 p-5 sm:p-6",
        className
      )}
    >
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
        Próxima melhor ação
      </p>
      <h2 className="text-lg font-medium tracking-tight">{action.title}</h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-xl">{action.reason}</p>
      {action.href ? (
        <Button asChild size="sm" className="mt-5" onClick={onClick}>
          <Link href={action.href}>
            {action.ctaLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      ) : null}
    </section>
  );
}
