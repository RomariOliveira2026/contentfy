import type {
  AIAction,
  AIContext,
  AIMessage,
  AIProvider,
  AIProviderId,
  AITemplate,
  ProductAISlug,
} from "@shared/contentfy";

/**
 * ContentFy AI Engine — structure only.
 * Existing llm.ts / ai-studio remain the live paths until providers are wired.
 */
export class AIEngine {
  private providers = new Map<AIProviderId, AIProvider>();
  private templates = new Map<string, AITemplate>();
  private history = new Map<string, AIMessage[]>();
  private memory = new Map<string, string>();

  registerProvider(provider: AIProvider) {
    this.providers.set(provider.id, provider);
  }

  registerTemplate(template: AITemplate) {
    this.templates.set(template.id, template);
  }

  getTemplate(id: string) {
    return this.templates.get(id);
  }

  appendHistory(sessionId: string, message: AIMessage) {
    const list = this.history.get(sessionId) ?? [];
    list.push(message);
    this.history.set(sessionId, list);
    return list;
  }

  getHistory(sessionId: string) {
    return this.history.get(sessionId) ?? [];
  }

  remember(key: string, value: string) {
    this.memory.set(key, value);
  }

  recall(key: string) {
    return this.memory.get(key);
  }

  productAISlug(productSlug: string): ProductAISlug {
    return `${productSlug}-ai`;
  }

  planAction(action: AIAction, context?: AIContext) {
    return {
      status: "planned" as const,
      action,
      context: context ?? null,
    };
  }
}

export const aiEngine = new AIEngine();
