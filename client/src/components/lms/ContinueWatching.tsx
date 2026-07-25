import { Link } from "wouter";
import { Play, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/design-system/ProgressBar";
import { cn } from "@/lib/utils";

interface ContinueWatchingProps {
  courseTitle: string;
  lessonTitle: string;
  href: string;
  progressPercentage?: number;
  className?: string;
}

export default function ContinueWatching({
  courseTitle,
  lessonTitle,
  href,
  progressPercentage = 35,
  className,
}: ContinueWatchingProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-[#111827]",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.2),transparent_50%)]" />
      <div className="relative flex flex-col sm:flex-row gap-5 p-5 lg:p-6">
        <div className="relative aspect-video sm:w-48 lg:w-56 shrink-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-owl/30">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/20">
              <Play className="h-5 w-5 text-white fill-white ml-0.5" />
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center min-w-0">
          <p className="cf-caption mb-1">Continuar assistindo</p>
          <h3 className="text-lg font-semibold mb-1 truncate">{courseTitle}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {lessonTitle}
          </p>
          <ProgressBar value={progressPercentage} className="mb-4 max-w-md" />
          <Link href={href}>
            <Button className="w-full sm:w-auto">
              Continuar de onde parei
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
