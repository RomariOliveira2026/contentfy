/** Canonical ContentFy Core domains (Evolution X). */

export const CONTENTFY_DOMAINS = [
  "auth",
  "permissions",
  "products",
  "orders",
  "media",
  "analytics",
  "recommendations",
  "ai",
  "notifications",
  "certificates",
  "payments",
  "progress",
  "achievements",
  "protect",
  "learn",
  "insight",
  "discovery",
  "successScore",
  "community",
] as const;

export type ContentFyDomain = (typeof CONTENTFY_DOMAINS)[number];

export type DomainMaturity = "implemented" | "in_development" | "planned" | "vision";

export interface DomainStatus {
  domain: ContentFyDomain;
  maturity: DomainMaturity;
  notes?: string;
}
