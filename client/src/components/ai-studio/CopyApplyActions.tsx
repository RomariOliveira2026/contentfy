import { Button } from "@/components/ui/button";
import { Check, Copy, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CopyApplyActionsProps {
  content: string;
  applyLabel?: string;
  onApply?: (content: string) => void;
  disabled?: boolean;
}

export default function CopyApplyActions({
  content,
  applyLabel = "Aplicar ao produto",
  onApply,
  disabled,
}: CopyApplyActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Copiado para a área de transferência");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || !content}
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-4 w-4 mr-1.5" />
        ) : (
          <Copy className="h-4 w-4 mr-1.5" />
        )}
        Copiar
      </Button>
      {onApply && (
        <Button
          type="button"
          size="sm"
          disabled={disabled || !content}
          onClick={() => {
            onApply(content);
            toast.success("Pronto para aplicar (demo)", {
              description:
                "Nesta versão a aplicação é simulada — a integração com produto/LMS virá na próxima etapa.",
            });
          }}
        >
          <Sparkles className="h-4 w-4 mr-1.5" />
          {applyLabel}
        </Button>
      )}
    </div>
  );
}
