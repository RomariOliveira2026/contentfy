/**
 * Sanitise metadata before persistence / logs — strip secrets and truncate.
 */

const BLOCKED =
  /secret|token|password|authorization|api[_-]?key|sk_live|sk_test|cookie|session/i;

export function sanitizeExperienceMeta(
  meta?: Record<string, unknown> | null,
  maxKeys = 12
): Record<string, string | number | boolean | null> {
  if (!meta) return {};
  const out: Record<string, string | number | boolean | null> = {};
  let count = 0;
  for (const [k, v] of Object.entries(meta)) {
    if (count >= maxKeys) break;
    if (BLOCKED.test(k)) continue;
    if (v == null) {
      out[k] = null;
      count += 1;
      continue;
    }
    if (typeof v === "boolean" || typeof v === "number") {
      if (typeof v === "number" && !Number.isFinite(v)) continue;
      out[k] = v;
      count += 1;
      continue;
    }
    if (typeof v === "string") {
      if (BLOCKED.test(v)) continue;
      out[k] = v.slice(0, 200);
      count += 1;
    }
  }
  return out;
}

export function dayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function daysBetween(fromDay: string, toDay: string): number {
  const a = Date.parse(`${fromDay}T00:00:00.000Z`);
  const b = Date.parse(`${toDay}T00:00:00.000Z`);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 0;
  return Math.max(0, Math.round((b - a) / 86_400_000));
}
