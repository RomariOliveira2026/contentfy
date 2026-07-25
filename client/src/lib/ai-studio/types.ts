export type AIProviderId = "mock" | "openai" | "anthropic" | "gemini";

export type AIToolId =
  | "writer"
  | "course"
  | "quiz"
  | "certificate"
  | "emails"
  | "sales-page";

export type WriterContentType =
  | "headline"
  | "subtitle"
  | "promise"
  | "short_description"
  | "long_description"
  | "bullets"
  | "faq"
  | "cta"
  | "sales_page";

export type EmailKind =
  | "launch"
  | "cart_open"
  | "cart_closing"
  | "welcome"
  | "recovery"
  | "post_sale";

export interface AIMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
  meta?: Record<string, unknown>;
}

export interface AIHistoryEntry {
  id: string;
  tool: AIToolId;
  title: string;
  prompt: string;
  result: string;
  provider: AIProviderId;
  createdAt: string;
  meta?: Record<string, unknown>;
}

export interface AIGenerateRequest {
  tool: AIToolId;
  prompt: string;
  context?: Record<string, unknown>;
}

export interface AIGenerateResult {
  id: string;
  content: string;
  structured?: unknown;
  provider: AIProviderId;
  latencyMs: number;
  demo: boolean;
}

export interface CourseOutline {
  title: string;
  audience: string;
  objective: string;
  workloadHours: number;
  level: string;
  modules: Array<{
    title: string;
    objective: string;
    lessons: Array<{
      title: string;
      objective: string;
      exercise: string;
      materials: string[];
    }>;
  }>;
}

export interface QuizDraft {
  title: string;
  questions: Array<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
}

export interface CertificateDraft {
  courseName: string;
  studentNamePlaceholder: string;
  workloadHours: number;
  issuerName: string;
  signatureName: string;
  logoLabel: string;
  qrReserved: boolean;
}

export interface SalesPageDraft {
  hero: { headline: string; subtitle: string; cta: string };
  benefits: string[];
  testimonials: Array<{ name: string; role: string; quote: string }>;
  offer: { title: string; priceHint: string; bullets: string[] };
  guarantee: string;
  cta: { primary: string; secondary: string };
  faq: Array<{ q: string; a: string }>;
}

export interface AIStudioStats {
  productsGenerated: number;
  contentsGenerated: number;
  pagesGenerated: number;
  quizzesGenerated: number;
  certificatesGenerated: number;
  hoursSaved: number;
}
