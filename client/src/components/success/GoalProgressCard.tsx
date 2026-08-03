import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface GoalProgressCardProps {
  goalName: string;
  progress: number;
  nextStep: string | null;
  nextStepHref?: string | null;
  className?: string;
}

export function GoalProgressCard({
  goalName,
  progress,
  nextStep,
  nextStepHref,
  className,
}: GoalProgressCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/40 bg-background/40 p-4",
        className
      )}
    >
      <div className="flex justify-between gap-3 mb-2">
        <p className="text-sm font-medium">{goalName}</p>
        <span className="text-sm tabular-nums text-muted-foreground">
          {progress}%
        </span>
      </div>
      <div className="h-1 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-foreground/70"
          style={{ width: `${progress}%` }}
        />
      </div>
      {nextStep && (
        <p className="text-[11px] text-muted-foreground mt-2">
          {nextStepHref ? (
            <Link href={nextStepHref}>
              <a className="hover:underline">{nextStep}</a>
            </Link>
          ) : (
            nextStep
          )}
        </p>
      )}
    </div>
  );
}
