import { Clock3, MessageCircle, Layers, Brain, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIProgressStatsProps {
  studiedMinutes?: number;
  questionsHelped?: number;
  className?: string;
  summaryGenerated?: boolean;
  flashcardsReady?: boolean;
  quizDone?: boolean;
}

export default function AIProgressStats({
  studiedMinutes = 32,
  questionsHelped = 12,
  summaryGenerated = true,
  flashcardsReady = true,
  quizDone = true,
  className,
}: AIProgressStatsProps) {
  return (
    <div
      className={cn(
        "rounded-[1.25rem] border border-white/[0.08] bg-[#111827]/80 p-4 backdrop-blur-xl",
        className
      )}
    >
      <p className="cf-caption mb-3">Progresso IA</p>
      <div className="space-y-2.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Clock3 className="h-4 w-4 text-primary" />
            Hoje você estudou
          </span>
          <span className="font-semibold tabular-nums">{studiedMinutes} min</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-muted-foreground">
            <MessageCircle className="h-4 w-4 text-primary" />
            IA ajudou em
          </span>
          <span className="font-semibold tabular-nums">
            {questionsHelped} perguntas
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-2">
          <StatChip
            icon={Layers}
            label="Resumo"
            active={summaryGenerated}
          />
          <StatChip
            icon={Brain}
            label="Flashcards"
            active={flashcardsReady}
          />
          <StatChip icon={CheckSquare} label="Quiz" active={quizDone} />
        </div>
      </div>
    </div>
  );
}

function StatChip({
  icon: Icon,
  label,
  active,
}: {
  icon: typeof Layers;
  label: string;
  active: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border px-2 py-2 text-center",
        active
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-white/[0.06] text-muted-foreground"
      )}
    >
      <Icon className="h-3.5 w-3.5 mx-auto mb-1" />
      <p className="text-[10px] font-medium">{label}</p>
    </div>
  );
}
