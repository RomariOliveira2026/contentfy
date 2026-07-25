import type { AIGenerateRequest, AIGenerateResult, AIProviderId } from "../types";

export interface AIProviderAdapter {
  id: AIProviderId;
  label: string;
  ready: boolean;
  generate(request: AIGenerateRequest): Promise<AIGenerateResult>;
}
