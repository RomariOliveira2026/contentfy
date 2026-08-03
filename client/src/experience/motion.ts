/** ContentFy Experience — motion tokens (premium, intentional, not noisy). */

export const experienceMotion = {
  duration: {
    fast: 160,
    base: 240,
    slow: 360,
  },
  ease: {
    standard: "cubic-bezier(0.22, 1, 0.36, 1)",
    entrance: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
  fadeUp: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
  },
} as const;
