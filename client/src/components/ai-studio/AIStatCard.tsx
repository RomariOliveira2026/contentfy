import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AIStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  accent?: string;
}

export default function AIStatCard({
  title,
  value,
  icon: Icon,
  hint,
  accent,
}: AIStatCardProps) {
  return (
    <Card className="border-white/[0.08] bg-[#0f1522] overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
      <CardContent className="pt-5 pb-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{title}</p>
            <p className={cn("text-2xl font-bold tracking-tight", accent)}>
              {value}
            </p>
            {hint && (
              <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>
            )}
          </div>
          <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
