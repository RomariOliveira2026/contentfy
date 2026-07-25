import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AIQuizQuestion } from "./types";
import { CheckCircle2, XCircle } from "lucide-react";

interface AIQuizPanelProps {
  questions: AIQuizQuestion[];
  onClose: () => void;
}

export default function AIQuizPanel({ questions, onClose }: AIQuizPanelProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    if (!submitted) return 0;
    return questions.reduce((sum, q) => {
      return sum + (answers[q.id] === q.correctIndex ? 1 : 0);
    }, 0);
  }, [answers, questions, submitted]);

  return (
    <div className="rounded-[1.25rem] border border-white/[0.08] bg-[#0c1220]/90 p-4 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="cf-caption mb-0.5">Quiz IA</p>
          <h3 className="text-sm font-semibold">5 perguntas · mock</h3>
        </div>
        <Button size="sm" variant="ghost" onClick={onClose}>
          Fechar
        </Button>
      </div>

      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
        {questions.map((q, qi) => {
          const selected = answers[q.id];
          return (
            <div
              key={q.id}
              className="rounded-2xl border border-white/[0.06] bg-[#111827]/70 p-3"
            >
              <p className="text-sm font-medium mb-3">
                {qi + 1}. {q.question}
              </p>
              <div className="space-y-1.5">
                {q.options.map((opt, oi) => {
                  const isSelected = selected === oi;
                  const isCorrect = submitted && oi === q.correctIndex;
                  const isWrong = submitted && isSelected && oi !== q.correctIndex;
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={submitted}
                      onClick={() =>
                        setAnswers((prev) => ({ ...prev, [q.id]: oi }))
                      }
                      className={cn(
                        "flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs transition-colors",
                        isCorrect && "border-emerald-500/40 bg-emerald-500/10",
                        isWrong && "border-red-500/40 bg-red-500/10",
                        !submitted && isSelected && "border-primary/40 bg-primary/10",
                        !submitted && !isSelected && "border-white/[0.06] hover:bg-white/[0.03]"
                      )}
                    >
                      {submitted && isCorrect && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      )}
                      {isWrong && (
                        <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                      )}
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {submitted ? (
        <div className="rounded-2xl border border-primary/25 bg-primary/10 px-4 py-3 text-center">
          <p className="text-sm font-semibold">
            Resultado: {score}/{questions.length}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {score >= 4
              ? "Excelente! Você dominou os pontos-chave."
              : "Bom começo — revise os flashcards e tente de novo."}
          </p>
          <Button
            size="sm"
            className="mt-3"
            variant="outline"
            onClick={() => {
              setSubmitted(false);
              setAnswers({});
            }}
          >
            Refazer quiz
          </Button>
        </div>
      ) : (
        <Button
          className="w-full"
          disabled={Object.keys(answers).length < questions.length}
          onClick={() => setSubmitted(true)}
        >
          Ver resultado
        </Button>
      )}
    </div>
  );
}
