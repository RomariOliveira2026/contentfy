import type {
  AIChatMessage,
  AIFlashcard,
  AIMindMapNode,
  AIProvider,
  AIQuickActionId,
  AIQuizQuestion,
} from "./types";

/**
 * Mock AI layer — swap `getMockReply` with a real provider adapter later.
 * Prepared for: openai | claude | gemini | deepseek | llama
 */
export const ACTIVE_AI_PROVIDER: AIProvider = "mock";

export const INITIAL_CHAT: AIChatMessage[] = [
  {
    id: "m1",
    role: "assistant",
    content:
      "Olá! Estou acompanhando esta aula com você. Posso resumir, explicar, criar exercícios ou montar um quiz — é só pedir.",
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    id: "m2",
    role: "user",
    content: "Explique novamente.",
    createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
  },
  {
    id: "m3",
    role: "assistant",
    content:
      "Claro. O ponto central desta aula é transformar atenção dispersa em blocos de foco curtos e repetíveis. Em vez de forçar concentração longa, você cria ciclos: intenção → ação → pausa → revisão. Assim o cérebro com TDAH trabalha a favor, não contra.",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "m4",
    role: "user",
    content: "Resuma esta aula.",
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  },
  {
    id: "m5",
    role: "assistant",
    content:
      "Aqui está o resumo:\n\n1) Entenda seu ritmo natural de atenção\n2) Use blocos curtos (ex.: 25 min)\n3) Remova fricções do ambiente\n4) Registre 1 micro-vitória por dia\n5) Revise o plano a cada 48h",
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
];

export const QUICK_ACTIONS: {
  id: AIQuickActionId;
  label: string;
}[] = [
  { id: "summarize", label: "Resumir aula" },
  { id: "explain", label: "Explicar melhor" },
  { id: "exercises", label: "Criar exercícios" },
  { id: "flashcards", label: "Criar Flashcards" },
  { id: "mindmap", label: "Mapa Mental" },
  { id: "examples", label: "Exemplos Práticos" },
  { id: "quiz", label: "Quiz" },
  { id: "faq", label: "Perguntas Frequentes" },
  { id: "translate", label: "Traduzir" },
  { id: "simplify", label: "Simplificar" },
];

export const MOCK_SUMMARY_TOPICS = [
  "Atenção funciona em ondas — respeite o ciclo natural",
  "Blocos curtos superam sessões longas e frustrantes",
  "Ambiente sem fricção aumenta adesão ao hábito",
  "Uma micro-ação por dia gera progresso composto",
  "Revisão em 48h consolida o aprendizado",
];

export const MOCK_FLASHCARDS: AIFlashcard[] = [
  {
    id: "f1",
    front: "O que é um bloco de foco?",
    back: "Um período curto e intencional (ex.: 25 min) dedicado a uma única tarefa, seguido de pausa.",
  },
  {
    id: "f2",
    front: "Por que ambientes com fricção atrapalham?",
    back: "Cada obstáculo (notificação, bagunça, decisão extra) consome energia cognitiva e quebra o foco.",
  },
  {
    id: "f3",
    front: "O que é uma micro-vitória?",
    back: "Uma ação pequena e concluída que gera dopamina e reforça o hábito de continuar.",
  },
  {
    id: "f4",
    front: "Quando revisar o plano?",
    back: "A cada 48 horas: ajuste o que funcionou e remova o que gerou atrito.",
  },
];

export const MOCK_MIND_MAP: AIMindMapNode = {
  id: "root",
  label: "Foco com TDAH",
  children: [
    {
      id: "c1",
      label: "Ciclos de atenção",
      children: [
        { id: "c1a", label: "Blocos curtos" },
        { id: "c1b", label: "Pausas ativas" },
      ],
    },
    {
      id: "c2",
      label: "Ambiente",
      children: [
        { id: "c2a", label: "Menos estímulos" },
        { id: "c2b", label: "Ferramentas à mão" },
      ],
    },
    {
      id: "c3",
      label: "Hábitos",
      children: [
        { id: "c3a", label: "Micro-vitórias" },
        { id: "c3b", label: "Revisão 48h" },
      ],
    },
  ],
};

export const MOCK_QUIZ: AIQuizQuestion[] = [
  {
    id: "q1",
    question: "Qual estratégia é mais alinhada à aula?",
    options: [
      "Estudar 4 horas sem parar",
      "Blocos curtos com pausas",
      "Multitarefa constante",
      "Evitar qualquer rotina",
    ],
    correctIndex: 1,
  },
  {
    id: "q2",
    question: "O que é uma micro-vitória?",
    options: [
      "Terminar um projeto inteiro",
      "Uma ação pequena e concluída",
      "Ignorar o progresso",
      "Trocar de tarefa a cada minuto",
    ],
    correctIndex: 1,
  },
  {
    id: "q3",
    question: "Por que reduzir fricções do ambiente ajuda?",
    options: [
      "Aumenta distrações",
      "Diminui gasto cognitivo desnecessário",
      "Elimina a necessidade de foco",
      "Substitui o sono",
    ],
    correctIndex: 1,
  },
  {
    id: "q4",
    question: "Com que frequência a aula sugere revisar o plano?",
    options: ["A cada 48h", "Uma vez por ano", "Nunca", "A cada 10 minutos"],
    correctIndex: 0,
  },
  {
    id: "q5",
    question: "Qual é o papel da pausa no bloco de foco?",
    options: [
      "Quebrar o hábito",
      "Restaurar energia e consolidar",
      "Procrastinar sem propósito",
      "Trocar de curso",
    ],
    correctIndex: 1,
  },
];

export function getMockReply(
  input: string,
  lessonTitle: string,
  action?: AIQuickActionId
): string {
  const q = (action || input).toString().toLowerCase();

  if (q.includes("resum") || action === "summarize") {
    return `Resumo inteligente de “${lessonTitle}”:\n\n• ${MOCK_SUMMARY_TOPICS.join("\n• ")}`;
  }
  if (q.includes("explic") || action === "explain") {
    return `Vamos por partes. Em “${lessonTitle}”, a ideia é simples: você não precisa de mais força de vontade — precisa de um sistema. Defina um bloco, remova 1 distração e feche com uma micro-vitória. Quer que eu explique com um exemplo do seu dia a dia?`;
  }
  if (q.includes("exerc") || action === "exercises") {
    return `Exercícios práticos:\n1) Liste 3 distrações da sua mesa\n2) Programe 1 bloco de 25 min amanhã\n3) Escreva 1 micro-vitória de hoje\n4) Revise o que funcionou em 48h`;
  }
  if (action === "examples" || q.includes("exemplo")) {
    return `Exemplos práticos:\n• Antes de estudar, deixe o celular em outro cômodo\n• Use um timer visível\n• Comece pela tarefa mais clara (não a maior)\n• Premie-se com 5 min de pausa real`;
  }
  if (action === "faq" || q.includes("faq") || q.includes("frequente")) {
    return `Perguntas frequentes:\n• “E se eu falhar no bloco?” → Reduza para 10 min e recomece\n• “Posso mudar o horário?” → Sim, consistência > horário fixo\n• “Funciona sem medicação?” → A rotina ajuda com ou sem`;
  }
  if (action === "translate" || q.includes("traduz")) {
    return `English summary:\nThis lesson teaches short focus blocks, low-friction environments, daily micro-wins, and a 48-hour review loop for ADHD-friendly learning.`;
  }
  if (action === "simplify" || q.includes("simplif")) {
    return `Versão simples:\n1. Estude pouco tempo, mas com intenção\n2. Tire o que te distrai\n3. Faça uma coisa pequena e termine\n4. Olhe de novo depois de 2 dias`;
  }
  if (action === "flashcards") {
    return "Pronto! Abri os flashcards desta aula para você revisar.";
  }
  if (action === "mindmap") {
    return "Montei um mapa mental com o tema central e as ramificações principais.";
  }
  if (action === "quiz") {
    return "Quiz pronto: 5 perguntas para testar o que você absorveu. Bora?";
  }

  return `Boa pergunta sobre “${lessonTitle}”. Em modo demo, eu simulo a resposta do Professor IA. Em breve isso virá de ${ACTIVE_AI_PROVIDER === "mock" ? "OpenAI/Claude/Gemini" : ACTIVE_AI_PROVIDER}.\n\nEnquanto isso: foque em uma micro-ação da aula e me diga onde travou — eu te guio.`;
}
