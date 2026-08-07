import { cn } from "@/lib/utils";
import type { ExperienceGreeting } from "@shared/contentfy";

interface ExperienceGreetingProps {
  greeting: ExperienceGreeting;
  className?: string;
}

export function ExperienceGreeting({
  greeting,
  className,
}: ExperienceGreetingProps) {
  return (
    <header className={cn("space-y-2", className)}>
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        Centro de Evolução
      </p>
      <p className="text-sm text-muted-foreground">{greeting.salutation}</p>
      <h1 className="text-2xl sm:text-3xl font-medium tracking-tight">
        {greeting.headline}
      </h1>
      {greeting.support ? (
        <p className="text-sm text-muted-foreground max-w-2xl">
          {greeting.support}
        </p>
      ) : null}
    </header>
  );
}
