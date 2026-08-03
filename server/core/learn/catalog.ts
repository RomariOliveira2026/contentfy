/**
 * ContentFy Learn catalog — data-driven definitions.
 * Extend via DB later; UI must never hardcode product→competency maps.
 */

import type {
  AchievementDef,
  CompetencyDef,
  GoalDef,
  ProductCompetencyLink,
} from "@shared/contentfy";

export const LEARN_COMPETENCIES: CompetencyDef[] = [
  {
    id: "crm",
    name: "CRM",
    description: "Organizar carteira e pipeline com disciplina comercial.",
    category: "Vendas",
  },
  {
    id: "spin-selling",
    name: "SPIN Selling",
    description: "Conduzir descoberta e qualificação com método.",
    category: "Vendas",
  },
  {
    id: "negotiation",
    name: "Negociação",
    description: "Fechar acordos com clareza e valor mútuo.",
    category: "Vendas",
  },
  {
    id: "prospecting",
    name: "Prospecção",
    description: "Abrir oportunidades com consistência.",
    category: "Vendas",
  },
  {
    id: "follow-up",
    name: "Follow-up",
    description: "Nutrir relacionamentos até a conversão.",
    category: "Vendas",
  },
  {
    id: "commercial-ai",
    name: "IA Comercial",
    description: "Aplicar IA no dia a dia de vendas e operação.",
    category: "IA",
  },
  {
    id: "portfolio-mgmt",
    name: "Gestão da Carteira",
    description: "Priorizar clientes e potencial de receita.",
    category: "Vendas",
  },
  {
    id: "emotional-balance",
    name: "Equilíbrio emocional",
    description: "Regular energia e presença sob pressão.",
    category: "Bem-estar",
  },
  {
    id: "anxiety",
    name: "Ansiedade",
    description: "Reduzir ruído mental e reatividade.",
    category: "Bem-estar",
  },
  {
    id: "focus",
    name: "Foco",
    description: "Concentrar atenção no que importa.",
    category: "Produtividade",
  },
  {
    id: "habits",
    name: "Hábitos",
    description: "Construir rotinas sustentáveis.",
    category: "Produtividade",
  },
  {
    id: "wellbeing",
    name: "Bem-estar",
    description: "Cuidar de corpo, mente e ritmo de vida.",
    category: "Bem-estar",
  },
  {
    id: "routine",
    name: "Rotina",
    description: "Estruturar o dia com intenção.",
    category: "Produtividade",
  },
  {
    id: "self-knowledge",
    name: "Autoconhecimento",
    description: "Compreender padrões e motivações pessoais.",
    category: "Desenvolvimento",
  },
];

export const LEARN_GOALS: GoalDef[] = [
  {
    id: "earn-more",
    name: "Ganhar mais dinheiro",
    description: "Aumentar renda com método comercial e execução.",
    competencyIds: [
      "crm",
      "prospecting",
      "negotiation",
      "follow-up",
      "portfolio-mgmt",
      "commercial-ai",
    ],
    iconKey: "earn",
  },
  {
    id: "productivity",
    name: "Melhorar produtividade",
    description: "Fazer mais com foco, hábitos e rotina.",
    competencyIds: ["focus", "habits", "routine", "emotional-balance"],
    iconKey: "productivity",
  },
  {
    id: "reduce-anxiety",
    name: "Reduzir ansiedade",
    description: "Recuperar equilíbrio e presença.",
    competencyIds: [
      "anxiety",
      "emotional-balance",
      "wellbeing",
      "self-knowledge",
      "routine",
    ],
    iconKey: "calm",
  },
  {
    id: "learn-ai",
    name: "Aprender IA",
    description: "Usar inteligência artificial com propósito comercial.",
    competencyIds: ["commercial-ai", "crm", "prospecting"],
    iconKey: "ai",
  },
  {
    id: "build-business",
    name: "Criar negócio",
    description: "Estruturar oferta, operação e crescimento.",
    competencyIds: ["crm", "portfolio-mgmt", "negotiation", "commercial-ai"],
    iconKey: "business",
  },
  {
    id: "organize-routine",
    name: "Organizar rotina",
    description: "Dar ritmo sustentável ao dia a dia.",
    competencyIds: ["routine", "habits", "focus", "wellbeing"],
    iconKey: "routine",
  },
  {
    id: "sell-more",
    name: "Vender mais",
    description: "Acelerar pipeline e conversão.",
    competencyIds: [
      "spin-selling",
      "prospecting",
      "follow-up",
      "negotiation",
      "crm",
    ],
    iconKey: "sales",
  },
  {
    id: "lead",
    name: "Ser líder",
    description: "Influenciar com clareza, método e presença.",
    competencyIds: [
      "self-knowledge",
      "emotional-balance",
      "negotiation",
      "portfolio-mgmt",
    ],
    iconKey: "lead",
  },
  {
    id: "entrepreneur",
    name: "Empreender",
    description: "Construir autonomia e tração.",
    competencyIds: [
      "commercial-ai",
      "crm",
      "habits",
      "focus",
      "portfolio-mgmt",
    ],
    iconKey: "entrepreneur",
  },
  {
    id: "career-change",
    name: "Mudar de carreira",
    description: "Transicionar com competências transferíveis.",
    competencyIds: [
      "self-knowledge",
      "habits",
      "commercial-ai",
      "prospecting",
      "focus",
    ],
    iconKey: "career",
  },
];

export const LEARN_PRODUCT_LINKS: ProductCompetencyLink[] = [
  {
    productSlug: "manual-do-representante-comercial",
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
  },
  {
    productSlug: "desacelere",
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
  },
];

export const LEARN_ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first_purchase",
    name: "Primeira compra",
    description: "Você deu o primeiro passo na ContentFy.",
    tier: "bronze",
  },
  {
    id: "first_lesson",
    name: "Primeira aula",
    description: "Início da jornada de evolução.",
    tier: "bronze",
  },
  {
    id: "lessons_10",
    name: "10 aulas",
    description: "Constância começa a aparecer.",
    tier: "silver",
  },
  {
    id: "course_completed",
    name: "Curso concluído",
    description: "Você fechou um ciclo completo de aprendizado.",
    tier: "gold",
  },
  {
    id: "streak_7",
    name: "7 dias consecutivos",
    description: "Ritmo sustentável por uma semana.",
    tier: "silver",
  },
  {
    id: "goal_reached",
    name: "Meta atingida",
    description: "Objetivo alcançado com competências alinhadas.",
    tier: "gold",
  },
  {
    id: "specialist",
    name: "Especialista",
    description: "Domínio avançado em um bloco de competências.",
    tier: "platinum",
  },
  {
    id: "top_performer",
    name: "Alta performance",
    description: "Índice de evolução consistentemente elevado.",
    tier: "platinum",
  },
  {
    id: "high_performance",
    name: "Top performance",
    description: "Execução acima da média no seu ritmo.",
    tier: "gold",
  },
  {
    id: "habit_builder",
    name: "Criador de hábitos",
    description: "Hábitos e rotina em progresso sólido.",
    tier: "silver",
  },
];

export function getCompetencyById(id: string): CompetencyDef | undefined {
  return LEARN_COMPETENCIES.find((c) => c.id === id);
}

export function getGoalById(id: string): GoalDef | undefined {
  return LEARN_GOALS.find((g) => g.id === id);
}

export function getProductLink(
  slug: string
): ProductCompetencyLink | undefined {
  return LEARN_PRODUCT_LINKS.find((p) => p.productSlug === slug);
}
