import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { LmsNote } from "./types";
import { toast } from "sonner";

interface LessonNotesProps {
  lessonId: number;
  storageKey?: string;
}

function loadNotes(key: string): LmsNote[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as LmsNote[]) : [];
  } catch {
    return [];
  }
}

export default function LessonNotes({
  lessonId,
  storageKey = "contentfy-lms-notes",
}: LessonNotesProps) {
  const [notes, setNotes] = useState<LmsNote[]>([]);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setNotes(loadNotes(storageKey).filter((n) => n.lessonId === lessonId));
    setDraft("");
    setEditingId(null);
  }, [lessonId, storageKey]);

  const persist = (next: LmsNote[]) => {
    const others = loadNotes(storageKey).filter((n) => n.lessonId !== lessonId);
    localStorage.setItem(storageKey, JSON.stringify([...others, ...next]));
    setNotes(next);
  };

  const handleSave = () => {
    if (!draft.trim()) return;
    if (editingId) {
      persist(
        notes.map((n) =>
          n.id === editingId
            ? { ...n, content: draft.trim(), updatedAt: new Date().toISOString() }
            : n
        )
      );
      toast.success("Anotação atualizada");
    } else {
      persist([
        {
          id: crypto.randomUUID(),
          lessonId,
          content: draft.trim(),
          updatedAt: new Date().toISOString(),
        },
        ...notes,
      ]);
      toast.success("Anotação salva");
    }
    setDraft("");
    setEditingId(null);
  };

  const handleEdit = (note: LmsNote) => {
    setEditingId(note.id);
    setDraft(note.content);
  };

  const handleDelete = (id: string) => {
    persist(notes.filter((n) => n.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setDraft("");
    }
    toast.success("Anotação removida");
  };

  return (
    <div className="rounded-[1.25rem] border border-white/[0.08] bg-[#111827]/80 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="cf-caption mb-1">Anotações</p>
          <h3 className="text-base font-semibold">Minhas Anotações</h3>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setEditingId(null);
            setDraft("");
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Escreva insights, dúvidas ou ações desta aula..."
        className="min-h-[120px] mb-3 rounded-2xl border-white/[0.08] bg-[#0c1220] resize-none"
      />
      <Button className="w-full mb-5" onClick={handleSave} disabled={!draft.trim()}>
        <Save className="h-4 w-4 mr-2" />
        {editingId ? "Atualizar anotação" : "Salvar anotação"}
      </Button>

      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma anotação nesta aula ainda.
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="rounded-2xl border border-white/[0.06] bg-[#0c1220]/80 p-3"
            >
              <p className="text-sm whitespace-pre-wrap mb-3">{note.content}</p>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-muted-foreground">
                  {new Date(note.updatedAt).toLocaleString("pt-BR")}
                </span>
                <div className="flex gap-1">
                  <Button size="icon-sm" variant="ghost" onClick={() => handleEdit(note)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => handleDelete(note.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
