import type { DomainStatus } from "@shared/contentfy";

/**
 * ContentFy Core registry — maturity map for Evolution X.
 * Existing live systems remain the source of truth until domains are wired.
 */
export const CONTENTFY_CORE_STATUS: DomainStatus[] = [
  { domain: "auth", maturity: "implemented", notes: "OAuth + session (unchanged)" },
  { domain: "permissions", maturity: "implemented", notes: "Role checks in routers" },
  { domain: "products", maturity: "implemented", notes: "Ecosystem model scaffolded" },
  { domain: "orders", maturity: "implemented", notes: "Existing orders router" },
  { domain: "payments", maturity: "in_development", notes: "ContentFy Pay abstraction over Stripe" },
  { domain: "certificates", maturity: "implemented" },
  { domain: "progress", maturity: "implemented", notes: "LMS progress" },
  { domain: "media", maturity: "planned", notes: "Media engine scaffolded" },
  { domain: "analytics", maturity: "planned", notes: "Insight engine scaffolded" },
  { domain: "recommendations", maturity: "in_development", notes: "Discovery RecommendationService (rules/behavior/graph)" },
  { domain: "ai", maturity: "in_development", notes: "AI engine + existing ai-studio/llm" },
  { domain: "notifications", maturity: "planned" },
  { domain: "achievements", maturity: "planned" },
  { domain: "protect", maturity: "in_development", notes: "ContentFy Protect v1 — requests + admin review; Stripe refund on explicit admin action" },
  { domain: "learn", maturity: "in_development", notes: "ContentFy Learn v1 — goals, competencies, journey, achievements, Success Index" },
  { domain: "insight", maturity: "planned" },
  { domain: "discovery", maturity: "in_development", notes: "ContentFy Discovery v1 — rails, trending, favorites, search, continue learning" },
  { domain: "successScore", maturity: "in_development", notes: "Success Engine v1 — Score/Habit/Consistency/Evolution + Learn integration" },
  { domain: "experience", maturity: "in_development", notes: "Experience Layer XIII — orchestration over Learn/Success/Discovery/Protect/LMS" },
  { domain: "intelligence", maturity: "in_development", notes: "Intelligence Engine XIV — statistical marketplace brain; no generative AI" },
  { domain: "orchestrator", maturity: "in_development", notes: "Orchestrator XV — event bus + workflows between engines; no motor business rules" },
  { domain: "community", maturity: "planned" },
];
