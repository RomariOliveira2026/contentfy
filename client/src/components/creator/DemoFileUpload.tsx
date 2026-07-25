import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileUp, X } from "lucide-react";
import { toast } from "sonner";

type AcceptKind = "image" | "pdf" | "audio" | "video" | "any";

interface DemoFileUploadProps {
  label: string;
  accept: AcceptKind;
  value?: string;
  onChange: (url: string) => void;
  /** When true, uses real /api/upload for images only */
  persistImages?: boolean;
}

const ACCEPT_MAP: Record<AcceptKind, string> = {
  image: "image/*",
  pdf: "application/pdf",
  audio: "audio/*",
  video: "video/*",
  any: "*/*",
};

/**
 * Upload helper for Creator Area.
 * Images can persist via /api/upload when persistImages is true.
 * Other types stay demonstrative (object URL) and are clearly labeled.
 */
export default function DemoFileUpload({
  label,
  accept,
  value,
  onChange,
  persistImages = false,
}: DemoFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const isDemo = !(persistImages && accept === "image");

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (persistImages && accept === "image") {
      setBusy(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        if (!response.ok) throw new Error("upload failed");
        const data = await response.json();
        onChange(data.url);
        toast.success("Imagem enviada");
      } catch {
        toast.error("Falha no upload da imagem");
      } finally {
        setBusy(false);
      }
      return;
    }

    const localUrl = URL.createObjectURL(file);
    onChange(localUrl);
    toast.message("Modo demonstrativo", {
      description: "Este arquivo não será persistido no servidor nesta versão.",
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">{label}</p>
        {isDemo && (
          <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-400">
            Demo — sem persistência
          </Badge>
        )}
      </div>
      {value ? (
        <div className="rounded-xl border border-white/[0.08] bg-[#111827] p-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            {accept === "image" && !value.startsWith("blob:") ? (
              <img src={value} alt={label} className="h-20 w-auto rounded-lg object-cover" />
            ) : (
              <p className="text-xs text-muted-foreground truncate">{value}</p>
            )}
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => {
              onChange("");
              if (inputRef.current) inputRef.current.value = "";
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-xl border border-dashed border-white/15 bg-[#0f1522] hover:border-primary/40 px-4 py-8 text-center transition-colors"
        >
          <FileUp className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            {busy ? "Enviando..." : "Clique para selecionar arquivo"}
          </p>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_MAP[accept]}
        className="hidden"
        onChange={handleSelect}
      />
    </div>
  );
}
