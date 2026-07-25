import { Award, Clock, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CertificateCardProps {
  courseTitle: string;
  workloadHours?: number;
  progressPercentage: number;
  className?: string;
}

export default function CertificateCard({
  courseTitle,
  workloadHours = 12,
  progressPercentage,
  className,
}: CertificateCardProps) {
  const ready = progressPercentage >= 100;

  return (
    <div
      className={cn(
        "rounded-[1.25rem] border border-white/[0.08] bg-[#111827]/80 p-5 backdrop-blur-xl",
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="cf-caption mb-1">Certificado</p>
          <h3 className="text-base font-semibold">Seu Certificado</h3>
        </div>
        <div className="cf-kpi-icon !h-10 !w-10 !rounded-xl">
          <Award className="h-4 w-4" />
        </div>
      </div>

      <div className="space-y-3 mb-5 text-sm">
        <div className="flex justify-between gap-3">
          <span className="text-muted-foreground">Curso</span>
          <span className="font-medium text-right line-clamp-2 max-w-[60%]">
            {courseTitle}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Carga horária
          </span>
          <span className="font-medium">{workloadHours}h</span>
        </div>
        <div className="flex justify-between gap-3 items-center">
          <span className="text-muted-foreground">Status</span>
          <Badge
            className={
              ready
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                : "bg-white/5 text-muted-foreground border-white/10"
            }
          >
            <BadgeCheck className="h-3 w-3 mr-1" />
            {ready ? "Pronto para emitir" : "Em andamento"}
          </Badge>
        </div>
      </div>

      <Button
        className="w-full"
        variant={ready ? "default" : "outline"}
        disabled={!ready}
        onClick={() =>
          toast.success("Certificado mockado", {
            description: "Emissão simulada — integração futura.",
          })
        }
      >
        Emitir Certificado
      </Button>
    </div>
  );
}
