/**
 * ContentFy DNA™ — product identity layer for Discovery / Learn / Success /
 * Experience / Intelligence. Rule-based only; no generative AI.
 *
 * Perception layer: maps products to objectives, competencies, outcomes,
 * journeys, and related products. Does not alter commerce or LMS writers.
 */

export type DnaCompetencyPhase = "acquired" | "related" | "future";

export interface ContentfyDnaCompetency {
  id: string;
  name: string;
  category: string;
  phase: DnaCompetencyPhase;
  weight?: number;
}

export interface ContentfyDnaGoal {
  id: string;
  name: string;
  description: string;
}

export interface ContentfyProductDna {
  productSlug: string;
  /** Transformation promise — short, human. */
  transformation: string;
  objectives: ContentfyDnaGoal[];
  competencies: ContentfyDnaCompetency[];
  expectedOutcomes: string[];
  journeys: string[];
  relatedProductSlugs: string[];
  /** Soft estimates for discovery cards — omit when unknown. */
  estimatedHours?: number;
  levelLabel?: string;
  ecosystem?: string;
}

const COMPETENCY_NAMES: Record<
  string,
  { name: string; category: string }
> = {
  crm: { name: "CRM", category: "Vendas" },
  "spin-selling": { name: "SPIN Selling", category: "Vendas" },
  negotiation: { name: "Negociação", category: "Vendas" },
  prospecting: { name: "Prospecção", category: "Vendas" },
  "follow-up": { name: "Follow-up", category: "Vendas" },
  "commercial-ai": { name: "IA Comercial", category: "IA" },
  "portfolio-mgmt": { name: "Gestão da Carteira", category: "Vendas" },
  "emotional-balance": {
    name: "Equilíbrio emocional",
    category: "Bem-estar",
  },
  anxiety: { name: "Ansiedade", category: "Bem-estar" },
  focus: { name: "Foco", category: "Produtividade" },
  habits: { name: "Hábitos", category: "Produtividade" },
  wellbeing: { name: "Bem-estar", category: "Bem-estar" },
  routine: { name: "Rotina", category: "Produtividade" },
  "self-knowledge": {
    name: "Autoconhecimento",
    category: "Desenvolvimento",
  },
};

const GOAL_META: Record<string, { name: string; description: string }> = {
  "earn-more": {
    name: "Ganhar mais dinheiro",
    description: "Aumentar renda com método comercial e execução.",
  },
  productivity: {
    name: "Melhorar produtividade",
    description: "Fazer mais com foco, hábitos e rotina.",
  },
  "reduce-anxiety": {
    name: "Reduzir ansiedade",
    description: "Recuperar equilíbrio e presença.",
  },
  "learn-ai": {
    name: "Aprender IA",
    description: "Usar inteligência artificial com propósito comercial.",
  },
  "build-business": {
    name: "Criar negócio",
    description: "Estruturar oferta, operação e crescimento.",
  },
  "organize-routine": {
    name: "Organizar rotina",
    description: "Dar ritmo sustentável ao dia a dia.",
  },
  "sell-more": {
    name: "Vender mais",
    description: "Acelerar pipeline e conversão.",
  },
  lead: {
    name: "Ser líder",
    description: "Influenciar com clareza, método e presença.",
  },
  entrepreneur: {
    name: "Empreender",
    description: "Construir autonomia e tração.",
  },
  "career-change": {
    name: "Mudar de carreira",
    description: "Transicionar com competências transferíveis.",
  },
};

type DnaSeed = {
  productSlug: string;
  transformation: string;
  competencyIds: string[];
  weights?: Record<string, number>;
  goalIds: string[];
  expectedOutcomes: string[];
  journeys: string[];
  relatedProductSlugs: string[];
  futureCompetencyIds?: string[];
  estimatedHours?: number;
  levelLabel?: string;
  ecosystem?: string;
};

const DNA_SEEDS: DnaSeed[] = [
  {
    productSlug: "manual-do-representante-comercial",
    transformation:
      "De representante improvisado a profissional com método, pipeline e presença comercial.",
    competencyIds: [
      "crm",
      "spin-selling",
      "negotiation",
      "prospecting",
      "follow-up",
      "commercial-ai",
      "portfolio-mgmt",
    ],
    weights: {
      crm: 0.9,
      "spin-selling": 0.85,
      negotiation: 0.8,
      prospecting: 0.85,
      "follow-up": 0.75,
      "commercial-ai": 0.9,
      "portfolio-mgmt": 0.85,
    },
    goalIds: ["earn-more", "sell-more", "learn-ai", "build-business", "entrepreneur"],
    expectedOutcomes: [
      "Organizar carteira com disciplina de CRM",
      "Conduzir conversas com método de descoberta",
      "Aplicar IA no ciclo comercial sem perder o humano",
    ],
    journeys: [
      "Fundamentos comerciais",
      "Pipeline & follow-up",
      "IA na operação de vendas",
    ],
    relatedProductSlugs: ["desacelere"],
    futureCompetencyIds: ["focus", "habits"],
    estimatedHours: 18,
    levelLabel: "Intermediário",
    ecosystem: "BuilderTudo · Carreira Comercial",
  },
  {
    productSlug: "desacelere",
    transformation:
      "De mente acelerada a presença sustentável — rotina, foco e equilíbrio sem performance tóxica.",
    competencyIds: [
      "emotional-balance",
      "anxiety",
      "focus",
      "habits",
      "wellbeing",
      "routine",
      "self-knowledge",
    ],
    weights: {
      "emotional-balance": 0.9,
      anxiety: 0.85,
      focus: 0.7,
      habits: 0.8,
      wellbeing: 0.9,
      routine: 0.85,
      "self-knowledge": 0.8,
    },
    goalIds: [
      "reduce-anxiety",
      "productivity",
      "organize-routine",
      "career-change",
    ],
    expectedOutcomes: [
      "Reduzir ruído mental no dia a dia",
      "Construir rotinas que cabem na vida real",
      "Recuperar foco sem culpar o descanso",
    ],
    journeys: [
      "Presença imediata",
      "Hábitos sustentáveis",
      "Rotina com intenção",
    ],
    relatedProductSlugs: ["manual-do-representante-comercial"],
    futureCompetencyIds: ["negotiation", "commercial-ai"],
    estimatedHours: 6,
    levelLabel: "Iniciante",
    ecosystem: "BuilderTudo · Bem-estar Aplicado",
  },
];

function buildDna(seed: DnaSeed): ContentfyProductDna {
  const competencies: ContentfyDnaCompetency[] = seed.competencyIds.map(
    (id) => {
      const meta = COMPETENCY_NAMES[id] || {
        name: id,
        category: "Geral",
      };
      return {
        id,
        name: meta.name,
        category: meta.category,
        phase: "acquired" as const,
        weight: seed.weights?.[id],
      };
    }
  );

  for (const id of seed.futureCompetencyIds || []) {
    if (competencies.some((c) => c.id === id)) continue;
    const meta = COMPETENCY_NAMES[id] || { name: id, category: "Geral" };
    competencies.push({
      id,
      name: meta.name,
      category: meta.category,
      phase: "future",
    });
  }

  // Related competencies: same category, not already listed
  const cats = new Set(competencies.map((c) => c.category));
  for (const [id, meta] of Object.entries(COMPETENCY_NAMES)) {
    if (competencies.some((c) => c.id === id)) continue;
    if (!cats.has(meta.category)) continue;
    competencies.push({
      id,
      name: meta.name,
      category: meta.category,
      phase: "related",
    });
  }

  return {
    productSlug: seed.productSlug,
    transformation: seed.transformation,
    objectives: seed.goalIds.map((id) => {
      const g = GOAL_META[id] || {
        name: id,
        description: "",
      };
      return { id, name: g.name, description: g.description };
    }),
    competencies,
    expectedOutcomes: seed.expectedOutcomes,
    journeys: seed.journeys,
    relatedProductSlugs: seed.relatedProductSlugs,
    estimatedHours: seed.estimatedHours,
    levelLabel: seed.levelLabel,
    ecosystem: seed.ecosystem,
  };
}

const DNA_BY_SLUG: Record<string, ContentfyProductDna> = Object.fromEntries(
  DNA_SEEDS.map((s) => [s.productSlug, buildDna(s)])
);

/** Fallback DNA from category/type — never invents ratings or commerce. */
export function resolveContentfyDna(
  productSlug: string,
  hints?: { category?: string; name?: string; typeLabel?: string }
): ContentfyProductDna {
  const known = DNA_BY_SLUG[productSlug];
  if (known) return known;

  const category = hints?.category || "Evolução";
  return {
    productSlug,
    transformation: hints?.name
      ? `Evolua com ${hints.name} — competência aplicada, não conteúdo acumulado.`
      : "Evolua com método — competência aplicada, não conteúdo acumulado.",
    objectives: [
      {
        id: "evolve",
        name: "Evoluir com intenção",
        description: "Avançar um objetivo concreto com prática.",
      },
    ],
    competencies: [
      {
        id: "focus",
        name: "Foco",
        category: "Produtividade",
        phase: "related",
      },
      {
        id: "habits",
        name: "Hábitos",
        category: "Produtividade",
        phase: "future",
      },
    ],
    expectedOutcomes: [
      "Clareza sobre o próximo passo",
      "Prática aplicada ao seu contexto",
    ],
    journeys: ["Comece por aqui", `Trilha ${category}`],
    relatedProductSlugs: [],
    levelLabel: hints?.typeLabel ? undefined : "Sob medida",
    ecosystem: category ? `ContentFy · ${category}` : "ContentFy",
  };
}

export function dnaCompetencyLabels(
  dna: ContentfyProductDna,
  limit = 3
): string[] {
  return dna.competencies
    .filter((c) => c.phase === "acquired")
    .slice(0, limit)
    .map((c) => c.name);
}

export function formatDnaDuration(hours?: number): string | undefined {
  if (hours == null || hours <= 0) return undefined;
  if (hours < 2) return `${Math.round(hours * 60)} min`;
  return `~${hours}h`;
}
