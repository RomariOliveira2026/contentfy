import {
  DEFAULT_INACTIVE_RETURN_DAYS,
  type NextBestActionPriorityConfig,
  DEFAULT_NBA_PRIORITIES,
} from "@shared/contentfy";

export function resolveNbaPriorities(
  override?: Partial<NextBestActionPriorityConfig>
): NextBestActionPriorityConfig {
  let fromEnv: Partial<NextBestActionPriorityConfig> = {};
  const raw = process.env.EXPERIENCE_NBA_PRIORITIES_JSON;
  if (raw) {
    try {
      fromEnv = JSON.parse(raw) as Partial<NextBestActionPriorityConfig>;
    } catch {
      console.warn(
        "[ContentFy Experience] EXPERIENCE_NBA_PRIORITIES_JSON inválido — defaults."
      );
    }
  }
  return { ...DEFAULT_NBA_PRIORITIES, ...fromEnv, ...override };
}

/** Days of inactivity before inactive_return (configurable). */
export function resolveInactiveReturnDays(): number {
  const raw = process.env.EXPERIENCE_INACTIVE_RETURN_DAYS;
  if (!raw) return DEFAULT_INACTIVE_RETURN_DAYS;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1 || n > 365) {
    console.warn(
      "[ContentFy Experience] EXPERIENCE_INACTIVE_RETURN_DAYS inválido — default",
      DEFAULT_INACTIVE_RETURN_DAYS
    );
    return DEFAULT_INACTIVE_RETURN_DAYS;
  }
  return Math.floor(n);
}

export function isDevMemoryFallbackAllowed(): boolean {
  return process.env.NODE_ENV !== "production";
}
