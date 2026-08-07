import type {
  OrchestratorEventDefinition,
  OrchestratorEventName,
} from "@shared/contentfy";

const DEFS: OrchestratorEventDefinition[] = [
  {
    name: "PRODUCT_PURCHASED",
    description: "Compra confirmada",
    origin: "commerce",
    consumers: ["experience", "intelligence", "discovery", "learn"],
    defaultPriority: 1,
    defaultRetry: 1,
    defaultTimeoutMs: 2000,
    payloadKeys: ["userId", "productId", "productSlug", "orderId"],
  },
  {
    name: "COURSE_STARTED",
    description: "Aluno iniciou curso",
    origin: "edge",
    consumers: ["learn", "experience", "success"],
    defaultPriority: 30,
    defaultRetry: 1,
    defaultTimeoutMs: 2000,
    payloadKeys: ["userId", "productId", "productSlug"],
  },
  {
    name: "COURSE_COMPLETED",
    description: "Curso concluído",
    origin: "edge",
    consumers: ["success", "learn", "experience", "discovery", "intelligence"],
    defaultPriority: 5,
    defaultRetry: 1,
    defaultTimeoutMs: 2500,
    payloadKeys: ["userId", "productId", "productSlug"],
  },
  {
    name: "LESSON_COMPLETED",
    description: "Aula concluída",
    origin: "edge",
    consumers: ["experience", "learn", "success", "intelligence"],
    defaultPriority: 10,
    defaultRetry: 1,
    defaultTimeoutMs: 2000,
    payloadKeys: ["userId", "lessonId", "productId", "productSlug"],
  },
  {
    name: "PRODUCT_REFUNDED",
    description: "Reembolso concluído",
    origin: "protect",
    consumers: ["experience", "intelligence", "discovery"],
    defaultPriority: 2,
    defaultRetry: 1,
    defaultTimeoutMs: 2000,
    payloadKeys: ["userId", "orderId", "productId"],
  },
  {
    name: "REFUND_APPROVED",
    description: "Reembolso aprovado (pré-processamento)",
    origin: "protect",
    consumers: ["intelligence", "experience"],
    defaultPriority: 8,
    defaultRetry: 1,
    defaultTimeoutMs: 2000,
    payloadKeys: ["userId", "orderId"],
  },
  {
    name: "DISCOVERY_CLICKED",
    description: "Clique Discovery",
    origin: "discovery",
    consumers: ["discovery", "intelligence"],
    defaultPriority: 55,
    defaultRetry: 0,
    defaultTimeoutMs: 1500,
    payloadKeys: ["userId", "productSlug"],
  },
  {
    name: "GOAL_UPDATED",
    description: "Objetivo Learn atualizado",
    origin: "learn",
    consumers: ["learn", "experience", "success"],
    defaultPriority: 20,
    defaultRetry: 1,
    defaultTimeoutMs: 2000,
    payloadKeys: ["userId", "goalId"],
  },
  {
    name: "ACHIEVEMENT_UNLOCKED",
    description: "Conquista desbloqueada",
    origin: "learn",
    consumers: ["experience", "success"],
    defaultPriority: 25,
    defaultRetry: 0,
    defaultTimeoutMs: 1500,
    payloadKeys: ["userId"],
  },
  {
    name: "PRODUCT_FAVORITED",
    description: "Produto favoritado",
    origin: "discovery",
    consumers: ["discovery", "intelligence"],
    defaultPriority: 40,
    defaultRetry: 0,
    defaultTimeoutMs: 1500,
    payloadKeys: ["userId", "productSlug"],
  },
  {
    name: "RECOMMENDATION_CLICKED",
    description: "Recomendação clicada",
    origin: "experience",
    consumers: ["intelligence", "orchestrator"],
    defaultPriority: 50,
    defaultRetry: 0,
    defaultTimeoutMs: 1500,
    payloadKeys: ["userId", "productSlug"],
  },
  {
    name: "CREATOR_PRODUCT_CREATED",
    description: "Produto criado na área creator",
    origin: "edge",
    consumers: ["intelligence", "discovery"],
    defaultPriority: 35,
    defaultRetry: 0,
    defaultTimeoutMs: 2000,
    payloadKeys: ["productId", "productSlug"],
  },
  {
    name: "PRODUCT_PUBLISHED",
    description: "Produto publicado",
    origin: "edge",
    consumers: ["discovery", "intelligence"],
    defaultPriority: 15,
    defaultRetry: 1,
    defaultTimeoutMs: 2000,
    payloadKeys: ["productId", "productSlug"],
  },
  {
    name: "CATEGORY_GROWING",
    description: "Sinal Intelligence de categoria aquecendo",
    origin: "intelligence",
    consumers: ["discovery", "experience"],
    defaultPriority: 45,
    defaultRetry: 0,
    defaultTimeoutMs: 1500,
    payloadKeys: ["category"],
  },
  {
    name: "PRODUCT_TRENDING",
    description: "Produto em tendência",
    origin: "intelligence",
    consumers: ["discovery", "experience"],
    defaultPriority: 45,
    defaultRetry: 0,
    defaultTimeoutMs: 1500,
    payloadKeys: ["productSlug"],
  },
  {
    name: "SUCCESS_SCORE_CHANGED",
    description: "Success score materialmente alterado",
    origin: "success",
    consumers: ["experience"],
    defaultPriority: 28,
    defaultRetry: 0,
    defaultTimeoutMs: 1500,
    payloadKeys: ["userId"],
  },
];

export class EventRegistry {
  private byName = new Map<OrchestratorEventName, OrchestratorEventDefinition>(
    DEFS.map((d) => [d.name, d])
  );

  list(): OrchestratorEventDefinition[] {
    return Array.from(this.byName.values());
  }

  get(name: OrchestratorEventName): OrchestratorEventDefinition | null {
    return this.byName.get(name) || null;
  }

  has(name: string): name is OrchestratorEventName {
    return this.byName.has(name as OrchestratorEventName);
  }
}

export const eventRegistry = new EventRegistry();
