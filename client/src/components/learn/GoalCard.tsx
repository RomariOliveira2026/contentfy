import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface GoalCardProps {
  name: string;
  description: string;
  progress: number;
  isActive?: boolean;
  onSelect?: () => void;
  className?: string;
}

export function GoalCard({
  name,
  description,
  progress,
  isActive,
  onSelect,
  className,
}: GoalCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-colors",
        isActive
          ? "border-foreground/30 bg-foreground/[0.04]"
          : "border-border/40 bg-background/40",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {description}
          </p>
        </div>
        {onSelect && (
          <Button
            type="button"
            size="sm"
            variant={isActive ? "secondary" : "outline"}
            className="shrink-0 h-8 text-xs"
            onClick={onSelect}
          >
            {isActive ? "Atual" : "Definir"}
          </Button>
        )}
      </div>
      <div className="h-1 rounded-full bg-muted overflow-hidden mt-3">
        <div
          className="h-full bg-foreground/70"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
