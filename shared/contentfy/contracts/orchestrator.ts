/**
 * ContentFy Orchestrator — contracts (Evolution XV).
 * Coordinates events between engines. Does NOT own business rules of motors.
 * No generative AI.
 */

export type OrchestratorEventName =
  | "PRODUCT_PURCHASED"
  | "COURSE_STARTED"
  | "COURSE_COMPLETED"
  | "LESSON_COMPLETED"
  | "PRODUCT_REFUNDED"
  | "REFUND_APPROVED"
  | "DISCOVERY_CLICKED"
  | "GOAL_UPDATED"
  | "ACHIEVEMENT_UNLOCKED"
  | "PRODUCT_FAVORITED"
  | "RECOMMENDATION_CLICKED"
  | "CREATOR_PRODUCT_CREATED"
  | "PRODUCT_PUBLISHED"
  | "CATEGORY_GROWING"
  | "PRODUCT_TRENDING"
  | "SUCCESS_SCORE_CHANGED";

export type OrchestratorMotor =
  | "discovery"
  | "learn"
  | "success"
  | "experience"
  | "intelligence"
  | "protect"
  | "commerce"
  | "community"
  | "orchestrator";

export type OrchestratorActionKind =
  | "experience_invalidate"
  | "learn_invalidate"
  | "success_invalidate"
  | "intelligence_invalidate"
  | "discovery_invalidate"
  | "log_metric"
  | "noop";

export interface OrchestratorEventPayload {
  userId?: number | null;
  productId?: number | null;
  productSlug?: string | null;
  lessonId?: number | null;
  orderId?: number | null;
  goalId?: string | null;
  category?: string | null;
  /** Minimal non-sensitive metadata */
  meta?: Record<string, string | number | boolean | null>;
}

export interface OrchestratorEventEnvelope {
  id: string;
  name: OrchestratorEventName;
  payload: OrchestratorEventPayload;
  source: OrchestratorMotor | "edge" | "admin" | "system";
  priority: number;
  createdAt: string;
  correlationId?: string;
}

export interface OrchestratorEventDefinition {
  name: OrchestratorEventName;
  description: string;
  origin: OrchestratorMotor | "edge" | "commerce" | "system";
  consumers: OrchestratorMotor[];
  defaultPriority: number;
  defaultRetry: number;
  defaultTimeoutMs: number;
  payloadKeys: Array<keyof OrchestratorEventPayload>;
}

export type ActionPhase = "before" | "main" | "after" | "onSuccess" | "onFailure" | "fallback";

export interface OrchestratorActionStep {
  id: string;
  kind: OrchestratorActionKind;
  motor: OrchestratorMotor;
  phase: ActionPhase;
  timeoutMs?: number;
  retry?: number;
  priority?: number;
}

export interface OrchestratorWorkflowDefinition {
  id: string;
  event: OrchestratorEventName;
  description: string;
  enabled: boolean;
  priority: number;
  steps: OrchestratorActionStep[];
}

export type ReactionOperator = "gte" | "lte" | "eq" | "gt" | "lt";

export interface OrchestratorReactionRule {
  id: string;
  enabled: boolean;
  description: string;
  /** Trigger event that evaluates the reaction */
  onEvent: OrchestratorEventName;
  /** Simple condition on payload.meta or known numeric fields */
  when: {
    field: string;
    op: ReactionOperator;
    value: number;
  };
  then: OrchestratorActionStep[];
  priority: number;
}

export interface OrchestratorRulesConfig {
  defaultTimeoutMs: number;
  defaultRetry: number;
  maxQueueSize: number;
  asyncDispatch: boolean;
  workflows: OrchestratorWorkflowDefinition[];
  reactions: OrchestratorReactionRule[];
  eventPriorityOverrides?: Partial<Record<OrchestratorEventName, number>>;
}

export type OrchestratorStepStatus =
  | "pending"
  | "running"
  | "success"
  | "failed"
  | "timeout"
  | "skipped"
  | "fallback";

export interface OrchestratorStepLog {
  stepId: string;
  kind: OrchestratorActionKind;
  motor: OrchestratorMotor;
  phase: ActionPhase;
  status: OrchestratorStepStatus;
  attempts: number;
  latencyMs: number;
  error?: string;
  startedAt: string;
  finishedAt: string;
}

export interface OrchestratorWorkflowRunLog {
  id: string;
  workflowId: string;
  eventId: string;
  eventName: OrchestratorEventName;
  status: "success" | "partial" | "failed";
  steps: OrchestratorStepLog[];
  motors: OrchestratorMotor[];
  startedAt: string;
  finishedAt: string;
  totalLatencyMs: number;
}

export interface OrchestratorDashboardSnapshot {
  queueDepth: number;
  processedTotal: number;
  failedTotal: number;
  retryTotal: number;
  avgLatencyMs: number;
  recentEvents: OrchestratorEventEnvelope[];
  recentRuns: OrchestratorWorkflowRunLog[];
  registry: OrchestratorEventDefinition[];
  workflows: Array<{ id: string; event: OrchestratorEventName; enabled: boolean; steps: number }>;
  reactions: Array<{ id: string; onEvent: OrchestratorEventName; enabled: boolean }>;
  generatedAt: string;
}

export const DEFAULT_ORCHESTRATOR_RULES: OrchestratorRulesConfig = {
  defaultTimeoutMs: 2_000,
  defaultRetry: 1,
  maxQueueSize: 500,
  asyncDispatch: true,
  workflows: [
    {
      id: "wf_lesson_completed",
      event: "LESSON_COMPLETED",
      description: "Invalidate learner surfaces after lesson progress",
      enabled: true,
      priority: 10,
      steps: [
        { id: "b1", kind: "log_metric", motor: "orchestrator", phase: "before" },
        { id: "m1", kind: "experience_invalidate", motor: "experience", phase: "main" },
        { id: "m2", kind: "learn_invalidate", motor: "learn", phase: "main" },
        { id: "m3", kind: "success_invalidate", motor: "success", phase: "main" },
        { id: "m4", kind: "intelligence_invalidate", motor: "intelligence", phase: "main" },
        { id: "a1", kind: "log_metric", motor: "orchestrator", phase: "after" },
      ],
    },
    {
      id: "wf_course_completed",
      event: "COURSE_COMPLETED",
      description: "Cascade completion across learner engines",
      enabled: true,
      priority: 5,
      steps: [
        { id: "m1", kind: "success_invalidate", motor: "success", phase: "main" },
        { id: "m2", kind: "learn_invalidate", motor: "learn", phase: "main" },
        { id: "m3", kind: "experience_invalidate", motor: "experience", phase: "main" },
        { id: "m4", kind: "discovery_invalidate", motor: "discovery", phase: "main" },
        { id: "m5", kind: "intelligence_invalidate", motor: "intelligence", phase: "main" },
      ],
    },
    {
      id: "wf_product_purchased",
      event: "PRODUCT_PURCHASED",
      description: "Purchase fan-out to experience/intelligence/discovery",
      enabled: true,
      priority: 1,
      steps: [
        { id: "m1", kind: "experience_invalidate", motor: "experience", phase: "main" },
        { id: "m2", kind: "intelligence_invalidate", motor: "intelligence", phase: "main" },
        { id: "m3", kind: "discovery_invalidate", motor: "discovery", phase: "main" },
        { id: "m4", kind: "learn_invalidate", motor: "learn", phase: "main" },
      ],
    },
    {
      id: "wf_product_refunded",
      event: "PRODUCT_REFUNDED",
      description: "Refund fan-out",
      enabled: true,
      priority: 2,
      steps: [
        { id: "m1", kind: "experience_invalidate", motor: "experience", phase: "main" },
        { id: "m2", kind: "intelligence_invalidate", motor: "intelligence", phase: "main" },
        { id: "fb", kind: "log_metric", motor: "orchestrator", phase: "fallback" },
      ],
    },
    {
      id: "wf_goal_updated",
      event: "GOAL_UPDATED",
      description: "Goal change refresh",
      enabled: true,
      priority: 20,
      steps: [
        { id: "m1", kind: "learn_invalidate", motor: "learn", phase: "main" },
        { id: "m2", kind: "experience_invalidate", motor: "experience", phase: "main" },
        { id: "m3", kind: "success_invalidate", motor: "success", phase: "main" },
      ],
    },
    {
      id: "wf_recommendation_clicked",
      event: "RECOMMENDATION_CLICKED",
      description: "Soft analytics refresh",
      enabled: true,
      priority: 50,
      steps: [
        { id: "m1", kind: "intelligence_invalidate", motor: "intelligence", phase: "main" },
        { id: "m2", kind: "log_metric", motor: "orchestrator", phase: "after" },
      ],
    },
    {
      id: "wf_discovery_clicked",
      event: "DISCOVERY_CLICKED",
      description: "Discovery engagement signal",
      enabled: true,
      priority: 55,
      steps: [
        { id: "m1", kind: "discovery_invalidate", motor: "discovery", phase: "main" },
        { id: "m2", kind: "intelligence_invalidate", motor: "intelligence", phase: "main" },
      ],
    },
    {
      id: "wf_product_favorited",
      event: "PRODUCT_FAVORITED",
      description: "Favorite signal",
      enabled: true,
      priority: 40,
      steps: [
        { id: "m1", kind: "discovery_invalidate", motor: "discovery", phase: "main" },
        { id: "m2", kind: "intelligence_invalidate", motor: "intelligence", phase: "main" },
      ],
    },
  ],
  reactions: [
    {
      id: "rx_high_sales_boost_discovery",
      enabled: true,
      description: "Many purchases → refresh Discovery/Intelligence ranking caches",
      onEvent: "PRODUCT_PURCHASED",
      when: { field: "meta.purchaseBurst", op: "gte", value: 5 },
      then: [
        { id: "r1", kind: "discovery_invalidate", motor: "discovery", phase: "main" },
        { id: "r2", kind: "intelligence_invalidate", motor: "intelligence", phase: "main" },
      ],
      priority: 15,
    },
    {
      id: "rx_refund_reduce_highlight",
      enabled: true,
      description: "Refund surge → invalidate Discovery highlight caches",
      onEvent: "PRODUCT_REFUNDED",
      when: { field: "meta.refundRateProxy", op: "gte", value: 8 },
      then: [
        { id: "r1", kind: "discovery_invalidate", motor: "discovery", phase: "main" },
        { id: "r2", kind: "intelligence_invalidate", motor: "intelligence", phase: "main" },
      ],
      priority: 12,
    },
    {
      id: "rx_retention_home",
      enabled: true,
      description: "Retention growth → refresh Experience home",
      onEvent: "SUCCESS_SCORE_CHANGED",
      when: { field: "meta.retentionDelta", op: "gte", value: 10 },
      then: [
        { id: "r1", kind: "experience_invalidate", motor: "experience", phase: "main" },
      ],
      priority: 25,
    },
  ],
};
