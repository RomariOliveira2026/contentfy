import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ExperienceOnboardingProps {
  className?: string;
  onCompleted?: () => void;
}

export function ExperienceOnboarding({
  className,
  onCompleted,
}: ExperienceOnboardingProps) {
  const { data } = trpc.experience.onboarding.useQuery();
  const utils = trpc.useUtils();
  const save = trpc.experience.saveOnboarding.useMutation({
    onSuccess: () => {
      void utils.experience.home.invalidate();
      void utils.experience.onboarding.invalidate();
      toast.success("Preferências salvas nesta sessão");
      onCompleted?.();
    },
    onError: () => toast.error("Não foi possível salvar agora"),
  });

  const [goalId, setGoalId] = useState<string>("");
  const [improveFirst, setImproveFirst] = useState("");
  const [weeklyHours, setWeeklyHours] = useState(3);

  if (data?.state.completed) return null;

  const goals = data?.goals || [];

  return (
    <section
      id="onboarding"
      aria-label="Onboarding inteligente"
      className={cn(
        "rounded-2xl border border-border/50 bg-gradient-to-br from-foreground/[0.04] to-transparent p-5 sm:p-6",
        className
      )}
    >
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        Comece com clareza
      </p>
      <h2 className="text-lg font-medium tracking-tight mt-1">
        Três perguntas rápidas
      </h2>
      <p className="text-xs text-muted-foreground mt-2">
        {data?.note ||
          "Usamos suas respostas para personalizar a experiência."}
      </p>

      <div className="mt-5 space-y-4">
        <fieldset>
          <legend className="text-sm font-medium mb-2">
            Qual é seu principal objetivo?
          </legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {goals.slice(0, 6).map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGoalId(g.id)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  goalId === g.id
                    ? "border-foreground/40 bg-foreground/[0.06]"
                    : "border-border/40 hover:border-border"
                )}
              >
                {g.name}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="text-sm font-medium">
            O que você deseja melhorar primeiro?
          </span>
          <input
            value={improveFirst}
            onChange={(e) => setImproveFirst(e.target.value)}
            className="mt-2 w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Ex.: follow-up com clientes"
            maxLength={200}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">
            Quanto tempo pretende dedicar por semana?
          </span>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
              className="flex-1"
              aria-valuetext={`${weeklyHours} horas`}
            />
            <span className="text-sm tabular-nums w-16 text-right">
              {weeklyHours}h
            </span>
          </div>
        </label>

        <Button
          disabled={save.isPending || !goalId}
          onClick={() =>
            save.mutate({
              primaryGoalId: goalId || undefined,
              improveFirst: improveFirst || undefined,
              weeklyHours,
            })
          }
        >
          Salvar e personalizar
        </Button>
      </div>
    </section>
  );
}
