/** ContentFy AI — multi-provider engine contracts (no model binding yet). */

export type AIProviderId = "openai" | "anthropic" | "google" | "local" | "mock";

export type ProductAISlug =
  | "representante-ai"
  | "desacelere-ai"
  | "jurismind-ai"
  | "petmind-ai"
  | string;

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
  createdAt?: string;
}

export interface AIContext {
  productSlug?: ProductAISlug;
  userId?: number;
  lessonId?: number;
  memoryKeys?: string[];
}

export interface AIAction {
  type: string;
  payload?: Record<string, unknown>;
}

export interface AITemplate {
  id: string;
  name: string;
  systemPrompt: string;
  productSlug?: ProductAISlug;
}

export interface AIProvider {
  readonly id: AIProviderId;
  complete(input: {
    messages: AIMessage[];
    context?: AIContext;
  }): Promise<AIMessage>;
}
