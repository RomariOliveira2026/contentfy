import { Sparkles } from "lucide-react";
import { MOCK_SUMMARY_TOPICS } from "./mockAI";
import { cn } from "@/lib/utils";

interface AISummaryCardProps {
  lessonTitle: string;
  className?: string;
}

export default function AISummaryCard({
  lessonTitle,
  className,
}: AISummaryCardProps) {
  return (
    <div
      className={cn(
        "rounded-[1.25rem] border border-white/[0.08] bg-[#111827]/80 p-4 backdrop-blur-xl",
        className
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="cf-kpi-icon !h-9 !w-9 !rounded-xl">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <p className="cf-caption">Resumo Inteligente</p>
          <p className="text-sm font-semibold line-clamp-1">{lessonTitle}</p>
        </div>
      </div>
      <ol className="space-y-2">
        {MOCK_SUMMARY_TOPICS.map((topic, i) => (
          <li
            key={topic}
            className="flex gap-2.5 text-xs text-muted-foreground leading-relaxed"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/15 text-[10px] font-bold text-primary">
              {i + 1}
            </span>
            <span className="text-foreground/85">{topic}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
