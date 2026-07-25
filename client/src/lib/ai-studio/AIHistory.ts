import type { AIHistoryEntry, AIStudioStats, AIToolId } from "./types";

const STORAGE_KEY = "contentfy.ai-studio.history.v1";

function safeParse(raw: string | null): AIHistoryEntry[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as AIHistoryEntry[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export const AIHistory = {
  list(): AIHistoryEntry[] {
    if (typeof window === "undefined") return [];
    return safeParse(localStorage.getItem(STORAGE_KEY)).sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
    );
  },

  listByTool(tool: AIToolId): AIHistoryEntry[] {
    return this.list().filter((e) => e.tool === tool);
  },

  add(
    entry: Omit<AIHistoryEntry, "id" | "createdAt"> & {
      id?: string;
      createdAt?: string;
    }
  ): AIHistoryEntry {
    const full: AIHistoryEntry = {
      id: entry.id ?? crypto.randomUUID(),
      createdAt: entry.createdAt ?? new Date().toISOString(),
      tool: entry.tool,
      title: entry.title,
      prompt: entry.prompt,
      result: entry.result,
      provider: entry.provider,
      meta: entry.meta,
    };
    const next = [full, ...this.list()].slice(0, 100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return full;
  },

  clear(tool?: AIToolId) {
    if (!tool) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    const next = this.list().filter((e) => e.tool !== tool);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  },

  stats(): AIStudioStats {
    const all = this.list();
    const count = (tool: AIToolId) => all.filter((e) => e.tool === tool).length;
    const contentsGenerated = all.length;
    const productsGenerated = count("course") + count("writer");
    const pagesGenerated = count("sales-page") + count("writer");
    const quizzesGenerated = count("quiz");
    const certificatesGenerated = count("certificate");
    // Demo heuristic: ~25 min saved per generation
    const hoursSaved = Math.round((contentsGenerated * 25) / 60);

    return {
      productsGenerated,
      contentsGenerated,
      pagesGenerated,
      quizzesGenerated,
      certificatesGenerated,
      hoursSaved,
    };
  },
};
