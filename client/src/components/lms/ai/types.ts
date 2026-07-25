/** Future providers — UI only for now (no API calls). */
export type AIProvider = "openai" | "claude" | "gemini" | "deepseek" | "llama" | "mock";

export type AIChatRole = "user" | "assistant" | "system";

export type AIChatMessage = {
  id: string;
  role: AIChatRole;
  content: string;
  createdAt: string;
};

export type AIQuickActionId =
  | "summarize"
  | "explain"
  | "exercises"
  | "flashcards"
  | "mindmap"
  | "examples"
  | "quiz"
  | "faq"
  | "translate"
  | "simplify";

export type AIFlashcard = {
  id: string;
  front: string;
  back: string;
};

export type AIQuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
};

export type AIMindMapNode = {
  id: string;
  label: string;
  children?: AIMindMapNode[];
};
