import { FileText, Presentation, File, ListChecks, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LmsMaterial } from "./types";
import { toast } from "sonner";

const DEFAULT_MATERIALS: LmsMaterial[] = [
  { id: "1", title: "Apostila da aula (PDF)", type: "pdf", size: "2.4 MB" },
  { id: "2", title: "Slides da apresentação", type: "slides", size: "5.1 MB" },
  { id: "3", title: "Planilha de exercícios", type: "file", size: "180 KB" },
  { id: "4", title: "Checklist de aplicação", type: "checklist", size: "92 KB" },
];

const iconMap = {
  pdf: FileText,
  slides: Presentation,
  file: File,
  checklist: ListChecks,
};

interface LessonMaterialsProps {
  materials?: LmsMaterial[];
}

export default function LessonMaterials({
  materials = DEFAULT_MATERIALS,
}: LessonMaterialsProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground mb-4">
        Materiais complementares desta aula
      </p>
      {materials.map((item) => {
        const Icon = iconMap[item.type];
        return (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#0c1220]/70 px-4 py-3.5 transition-colors hover:border-primary/30"
          >
            <div className="cf-kpi-icon !h-10 !w-10 !rounded-xl">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{item.title}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {item.type} · {item.size}
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => toast.message("Download mockado", { description: item.title })}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
