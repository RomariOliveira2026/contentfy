import type { LmsModule } from "./types";

/** Curriculum demo for empty/unavailable course structures (UI only). */
export const DEMO_COURSE_TITLE = "Curso Dominando o TDAH";

export const DEMO_MODULES: LmsModule[] = [
  {
    id: 101,
    title: "Módulo 1 · Fundamentos",
    lessons: [
      {
        id: 1001,
        title: "Boas-vindas e visão geral",
        description: "Entenda a jornada do curso e como extrair o máximo de cada aula.",
        duration: 8,
        type: "video",
        isCompleted: true,
        lastWatchedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 1002,
        title: "Como o cérebro com TDAH funciona",
        description: "Neurociência aplicada de forma simples e prática.",
        duration: 14,
        type: "video",
        isCompleted: true,
        lastWatchedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 1003,
        title: "Mitos vs realidade",
        description: "Desconstrua crenças que atrapalham o progresso.",
        duration: 11,
        type: "video",
        isCompleted: false,
      },
    ],
  },
  {
    id: 102,
    title: "Módulo 2 · Foco e Rotina",
    lessons: [
      {
        id: 1004,
        title: "Sistema de foco em blocos",
        description: "Monte um protocolo diário realista e sustentável.",
        duration: 16,
        type: "video",
        isCompleted: false,
      },
      {
        id: 1005,
        title: "Gestão de energia",
        description: "Organize tarefas pelo seu pico de atenção.",
        duration: 12,
        type: "video",
        isCompleted: false,
      },
      {
        id: 1006,
        title: "Checklist semanal",
        description: "Ferramenta prática para revisar a semana.",
        duration: 9,
        type: "video",
        isCompleted: false,
      },
    ],
  },
  {
    id: 103,
    title: "Módulo 3 · Produtividade Avançada",
    lessons: [
      {
        id: 1007,
        title: "Ambiente sem fricção",
        description: "Desenhe espaços físicos e digitais que ajudam o foco.",
        duration: 13,
        type: "video",
        isCompleted: false,
      },
      {
        id: 1008,
        title: "Projeto final",
        description: "Aplique tudo em um plano pessoal de 30 dias.",
        duration: 18,
        type: "video",
        isCompleted: false,
      },
    ],
  },
];

export function computeDemoStats(modules: LmsModule[]) {
  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);
  const completedLessons = modules.reduce(
    (s, m) => s + m.lessons.filter((l) => l.isCompleted).length,
    0
  );
  return {
    totalModules: modules.length,
    totalLessons,
    completedLessons,
    progressPercentage:
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
  };
}
