import { cn } from "@/lib/utils";
import { Link } from "wouter";

export interface JourneyTimelineStep {
  id: string;
  kind: string;
  title: string;
  subtitle?: string;
  href?: string;
  status: "done" | "current" | "upcoming";
  progress?: number;
}

interface JourneyTimelineProps {
  steps: JourneyTimelineStep[];
  className?: string;
}

export function JourneyTimeline({ steps, className }: JourneyTimelineProps) {
  if (!steps.length) return null;

  return (
    <ol className={cn("space-y-0", className)}>
      {steps.map((step, i) => {
        const content = (
          <div className="flex gap-4 pb-6 last:pb-0">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full border",
                  step.status === "done" && "bg-foreground border-foreground",
                  step.status === "current" &&
                    "bg-background border-foreground",
                  step.status === "upcoming" &&
                    "bg-transparent border-muted-foreground/40"
                )}
              />
              {i < steps.length - 1 && (
                <span className="w-px flex-1 bg-border/60 mt-1" />
              )}
            </div>
            <div className="min-w-0 pb-1">
              <p className="text-sm font-medium leading-snug">{step.title}</p>
              {step.subtitle && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {step.subtitle}
                </p>
              )}
            </div>
          </div>
        );

        return (
          <li key={step.id}>
            {step.href ? (
              <Link href={step.href}>
                <a className="block hover:opacity-80 transition-opacity">
                  {content}
                </a>
              </Link>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ol>
  );
}
