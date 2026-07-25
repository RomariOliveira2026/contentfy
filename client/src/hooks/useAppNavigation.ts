import { useEffect } from "react";
import { useLocation } from "wouter";

const STORAGE_KEY = "contentfy-nav-stack";
const MAX = 40;

function readStack(): string[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeStack(stack: string[]) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stack.slice(-MAX)));
}

/** Fallback when there is no in-app history. */
export function getFallbackPath(path: string): string {
  if (path.startsWith("/admin")) return "/admin";
  if (
    path.startsWith("/my-account") ||
    path.startsWith("/dashboard") ||
    path.startsWith("/affiliate")
  ) {
    return "/my-account/products";
  }
  return "/";
}

/**
 * Tracks in-app navigation so "Voltar" works even when history.back()
 * would leave the site or is unreliable.
 */
export function useTrackNavigation() {
  const [location] = useLocation();

  useEffect(() => {
    const stack = readStack();
    const last = stack[stack.length - 1];
    if (last !== location) {
      stack.push(location);
      writeStack(stack);
    }
  }, [location]);
}

export function popPreviousPath(current: string): string | null {
  const stack = readStack();
  // Drop current (and any trailing duplicates)
  while (stack.length && stack[stack.length - 1] === current) {
    stack.pop();
  }
  const prev = stack.pop() || null;
  writeStack(stack);
  return prev;
}
