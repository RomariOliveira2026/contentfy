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
  { domain: "recommendations", maturity: "planned", notes: "Discovery engine scaffolded" },
  { domain: "ai", maturity: "in_development", notes: "AI engine + existing ai-studio/llm" },
  { domain: "notifications", maturity: "planned" },
  { domain: "achievements", maturity: "planned" },
  { domain: "protect", maturity: "in_development", notes: "30-day guarantee policy" },
  { domain: "learn", maturity: "in_development", notes: "Adaptive seams over LMS" },
  { domain: "insight", maturity: "planned" },
  { domain: "discovery", maturity: "planned" },
  { domain: "successScore", maturity: "in_development", notes: "Formula ready" },
  { domain: "community", maturity: "planned" },
];
