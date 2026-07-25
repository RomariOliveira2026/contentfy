import { Badge } from "@/components/ui/badge";
import AIStudioNav from "./AIStudioNav";
import { AIService } from "@/lib/ai-studio";

interface AIStudioHeaderProps {
  title: string;
  subtitle: string;
}

export default function AIStudioHeader({ title, subtitle }: AIStudioHeaderProps) {
  const provider = AIService.getActiveProviderId();

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-orange-400/80 font-semibold mb-2">
            AI Studio
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <Badge
              variant="outline"
              className="border-amber-500/30 text-amber-300 bg-amber-500/10"
            >
              Provider: {provider}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 max-w-2xl">{subtitle}</p>
        </div>
      </div>
      <AIStudioNav />
    </div>
  );
}
