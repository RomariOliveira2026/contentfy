import { AIHistory } from "./AIHistory";
import { getAIProvider, ACTIVE_AI_PROVIDER, listAIProviders } from "./providers";
import type {
  AIGenerateRequest,
  AIGenerateResult,
  AIHistoryEntry,
  AIProviderId,
  AIStudioStats,
  AIToolId,
} from "./types";

export const AIService = {
  getActiveProviderId(): AIProviderId {
    return ACTIVE_AI_PROVIDER;
  },

  listProviders() {
    return listAIProviders().map((p) => ({
      id: p.id,
      label: p.label,
      ready: p.ready,
    }));
  },

  async generate(
    request: AIGenerateRequest,
    options?: { title?: string; saveHistory?: boolean }
  ): Promise<{ result: AIGenerateResult; history?: AIHistoryEntry }> {
    const provider = getAIProvider();
    const result = await provider.generate(request);

    let history: AIHistoryEntry | undefined;
    if (options?.saveHistory !== false) {
      history = AIHistory.add({
        tool: request.tool,
        title: options?.title || titleFor(request.tool, request.prompt),
        prompt: request.prompt,
        result: result.content,
        provider: result.provider,
        meta: {
          ...request.context,
          structured: result.structured,
          latencyMs: result.latencyMs,
          demo: result.demo,
        },
      });
    }

    return { result, history };
  },

  history(tool?: AIToolId) {
    return tool ? AIHistory.listByTool(tool) : AIHistory.list();
  },

  clearHistory(tool?: AIToolId) {
    AIHistory.clear(tool);
  },

  stats(): AIStudioStats {
    return AIHistory.stats();
  },
};

function titleFor(tool: AIToolId, prompt: string) {
  const snippet = prompt.trim().slice(0, 48) || "Geração";
  const labels: Record<AIToolId, string> = {
    writer: "Writer",
    course: "Course Builder",
    quiz: "Quiz",
    certificate: "Certificado",
    emails: "Email",
    "sales-page": "Sales Page",
  };
  return `${labels[tool]} · ${snippet}`;
}
