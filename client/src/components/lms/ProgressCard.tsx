import { Clock3, BookOpenCheck, Activity, Sparkles } from "lucide-react";
import { ProgressBar } from "@/components/design-system/ProgressBar";
import { cn } from "@/lib/utils";

interface ProgressCardProps {
  courseTitle: string;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
  studiedMinutes?: number;
  lastActivityLabel?: string;
  className?: string;
}

export default function ProgressCard({
  courseTitle,
  completedLessons,
  totalLessons,
  progressPercentage,
  studiedMinutes = 47,
  lastActivityLabel = "Hoje",
  className,
}: ProgressCardProps) {
  return (
    <div
      className={cn(
        "rounded-[1.25rem] border border-white/[0.08] bg-[#111827]/80 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)]",
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="cf-caption mb-1">Progresso</p>
          <h3 className="text-base font-semibold leading-snug line-clamp-2">
            {courseTitle}
          </h3>
        </div>
        <div className="cf-kpi-icon !h-10 !w-10 !rounded-xl shrink-0">
          <Sparkles className="h-4 w-4" />
        </div>
      </div>

      <ProgressBar
        value={progressPercentage}
        label="Conclusão"
        className="mb-5"
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <BookOpenCheck className="h-4 w-4 text-primary" />
            Aulas concluídas
          </span>
          <span className="font-medium tabular-nums">
            {completedLessons}/{totalLessons}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Clock3 className="h-4 w-4 text-primary" />
            Tempo estudado
          </span>
          <span className="font-medium tabular-nums">{studiedMinutes} min</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Activity className="h-4 w-4 text-primary" />
            Última atividade
          </span>
          <span className="font-medium">{lastActivityLabel}</span>
        </div>
      </div>
    </div>
  );
}
