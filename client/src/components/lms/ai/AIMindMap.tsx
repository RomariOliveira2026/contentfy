import type { AIMindMapNode } from "./types";
import { cn } from "@/lib/utils";

interface AIMindMapProps {
  root: AIMindMapNode;
  className?: string;
}

export default function AIMindMap({ root, className }: AIMindMapProps) {
  const branches = root.children || [];

  return (
    <div
      className={cn(
        "rounded-[1.25rem] border border-white/[0.08] bg-[#0c1220]/80 p-5",
        className
      )}
    >
      <p className="cf-caption mb-4">Mapa mental</p>
      <div className="relative flex flex-col items-center gap-6 py-2">
        <div className="relative z-10 rounded-2xl bg-gradient-owl px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_28px_rgba(249,115,22,0.35)]">
          {root.label}
        </div>

        <div className="grid w-full grid-cols-1 sm:grid-cols-3 gap-3">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="rounded-2xl border border-white/[0.08] bg-[#111827] p-3"
            >
              <p className="text-sm font-semibold text-primary mb-2 text-center">
                {branch.label}
              </p>
              <div className="space-y-1.5">
                {(branch.children || []).map((leaf) => (
                  <div
                    key={leaf.id}
                    className="rounded-xl bg-white/[0.03] border border-white/[0.05] px-2.5 py-1.5 text-xs text-muted-foreground text-center"
                  >
                    {leaf.label}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
