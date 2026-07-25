import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  getFallbackPath,
  popPreviousPath,
  useTrackNavigation,
} from "@/hooks/useAppNavigation";
import { cn } from "@/lib/utils";

/**
 * Always-available "Voltar" for visitors, students and admins.
 * Hidden only on the public home page.
 */
export default function GlobalBackButton() {
  const [location, navigate] = useLocation();
  useTrackNavigation();

  const isHome = location === "/" || location === "";

  if (isHome) return null;

  const handleBack = () => {
    const prev = popPreviousPath(location);
    if (prev && prev !== location) {
      navigate(prev);
      return;
    }
    navigate(getFallbackPath(location));
  };

  return (
    <div
      className={cn(
        "fixed z-[60] pointer-events-none",
        "bottom-5 left-5",
        "sm:bottom-6 sm:left-6"
      )}
    >
      <Button
        type="button"
        onClick={handleBack}
        size="sm"
        variant="outline"
        aria-label="Voltar para a tela anterior"
        className={cn(
          "pointer-events-auto shadow-[var(--cf-shadow)]",
          "rounded-full h-11 px-4 gap-2",
          "border-border bg-card/95 text-foreground backdrop-blur-xl",
          "hover:border-primary/40 hover:bg-accent"
        )}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="font-semibold">Voltar</span>
      </Button>
    </div>
  );
}
