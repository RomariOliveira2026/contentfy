/** Canonical UI state vocabulary for ContentFy Experience. */

export type ExperienceState =
  | "idle"
  | "loading"
  | "empty"
  | "error"
  | "success"
  | "skeleton";

export const experienceCopy = {
  loading: "Carregando sua experiência ContentFy…",
  empty: "Nada por aqui ainda. Quando houver conteúdo, ele aparece com elegância.",
  error: "Algo saiu do esperado. Tente novamente em instantes.",
} as const;
