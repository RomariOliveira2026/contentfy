import { Link } from "wouter";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AIToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export default function AIToolCard({
  title,
  description,
  href,
  icon: Icon,
  badge,
}: AIToolCardProps) {
  return (
    <Link href={href}>
      <a className="block h-full group">
        <Card className="h-full border-white/[0.08] bg-[#0f1522] transition-all duration-200 group-hover:border-primary/35 group-hover:-translate-y-0.5">
          <CardContent className="p-5 flex flex-col h-full">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-white/[0.06] flex items-center justify-center text-orange-300">
                <Icon className="h-5 w-5" />
              </div>
              {badge && (
                <span className="text-[10px] uppercase tracking-wider text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
                  {badge}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-lg mb-1.5 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              {description}
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary">
              Abrir ferramenta
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}
