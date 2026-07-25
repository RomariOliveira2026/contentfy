import type { AIHistoryEntry } from "@/lib/ai-studio";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AIHistoryListProps {
  items: AIHistoryEntry[];
  onSelect: (item: AIHistoryEntry) => void;
  onClear?: () => void;
}

export default function AIHistoryList({
  items,
  onSelect,
  onClear,
}: AIHistoryListProps) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0c1220]/80 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <p className="text-sm font-medium">Histórico</p>
        {onClear && items.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Limpar
          </Button>
        )}
      </div>
      <div className="max-h-[420px] overflow-y-auto divide-y divide-white/[0.05]">
        {items.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground">
            Nenhuma geração ainda. Seu histórico aparece aqui.
          </p>
        )}
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            className="w-full text-left px-4 py-3 hover:bg-white/[0.03] transition-colors"
          >
            <p className="text-sm font-medium truncate">{item.title}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {format(new Date(item.createdAt), "dd MMM · HH:mm", {
                locale: ptBR,
              })}{" "}
              · {item.provider}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
