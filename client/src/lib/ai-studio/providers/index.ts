import type { AIProviderId } from "../types";
import { mockProvider } from "./mock";
import type { AIProviderAdapter } from "./types";

/**
 * Future adapters (OpenAI / Anthropic / Gemini) plug in here.
 * Keep the same AIProviderAdapter contract.
 */
const stubs: Record<Exclude<AIProviderId, "mock">, AIProviderAdapter> = {
  openai: {
    id: "openai",
    label: "OpenAI",
    ready: false,
    async generate() {
      throw new Error("OpenAI provider not configured yet.");
    },
  },
  anthropic: {
    id: "anthropic",
    label: "Anthropic",
    ready: false,
    async generate() {
      throw new Error("Anthropic provider not configured yet.");
    },
  },
  gemini: {
    id: "gemini",
    label: "Google Gemini",
    ready: false,
    async generate() {
      throw new Error("Gemini provider not configured yet.");
    },
  },
};

const providers: Record<AIProviderId, AIProviderAdapter> = {
  mock: mockProvider,
  ...stubs,
};

/** Active provider for AI Studio v1 — swap when real keys are wired. */
export const ACTIVE_AI_PROVIDER: AIProviderId = "mock";

export function getAIProvider(id: AIProviderId = ACTIVE_AI_PROVIDER) {
  return providers[id] ?? mockProvider;
}

export function listAIProviders() {
  return Object.values(providers);
}
