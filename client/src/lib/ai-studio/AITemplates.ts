import type {
  CertificateDraft,
  CourseOutline,
  EmailKind,
  QuizDraft,
  SalesPageDraft,
  WriterContentType,
} from "./types";

export function writerTemplate(
  type: WriterContentType,
  topic: string
): string {
  const name = topic.trim() || "seu produto digital";
  switch (type) {
    case "headline":
      return `Domine ${name} em semanas — sem enrolação, com método aplicável.`;
    case "subtitle":
      return `Um caminho claro para transformar conhecimento em resultado prático com ${name}.`;
    case "promise":
      return `Em 30 dias você terá um sistema simples para aplicar ${name} e medir progresso real.`;
    case "short_description":
      return `${name} é um produto digital premium para quem quer resultados consistentes, com conteúdo direto ao ponto e aplicação imediata.`;
    case "long_description":
      return [
        `${name} foi criado para quem já cansou de conteúdo genérico.`,
        "",
        "Você vai receber um método passo a passo, templates prontos e critérios claros de progresso — do zero à execução.",
        "",
        "Ideal para criadores, profissionais e empreendedores que querem acelerar resultados sem perder qualidade.",
      ].join("\n");
    case "bullets":
      return [
        "• Método prático, sem enrolação",
        "• Templates e checklists prontos",
        "• Progresso mensurável semana a semana",
        "• Suporte e comunidade (conforme plano)",
        "• Atualizações incluídas na versão atual",
      ].join("\n");
    case "faq":
      return [
        "P: Serve para iniciantes?",
        "R: Sim. O conteúdo começa do básico e escala até aplicações avançadas.",
        "",
        "P: Por quanto tempo tenho acesso?",
        "R: Acesso conforme o plano escolhido — com atualizações da versão vigente.",
        "",
        "P: Tem garantia?",
        "R: Sim. Garantia de satisfação conforme a política do produto.",
      ].join("\n");
    case "cta":
      return `Quero começar com ${name} agora`;
    case "sales_page":
      return [
        `# ${name}`,
        "",
        "## Hero",
        `Headline: Transforme sua operação com ${name}`,
        "Sub: Estrutura premium, clara e aplicável — feita para vender e entregar valor.",
        "CTA: Quero acesso agora",
        "",
        "## Benefícios",
        "- Clareza de posicionamento",
        "- Copy pronta para campanhas",
        "- Estrutura de entrega profissional",
      ].join("\n");
    default:
      return `Conteúdo gerado para ${name}.`;
  }
}

export function courseTemplate(input: {
  title: string;
  audience: string;
  objective: string;
  workloadHours: number;
  level: string;
}): CourseOutline {
  const title = input.title.trim() || "Curso Premium";
  return {
    title,
    audience: input.audience || "Iniciantes motivados",
    objective: input.objective || "Aplicar o método com confiança",
    workloadHours: input.workloadHours || 8,
    level: input.level || "Iniciante",
    modules: [
      {
        title: "Módulo 1 — Fundamentos",
        objective: "Alinhar conceitos e expectativas",
        lessons: [
          {
            title: "Boas-vindas e mapa do curso",
            objective: "Entender a jornada completa",
            exercise: "Escreva seu objetivo em 1 frase",
            materials: ["PDF de onboarding", "Checklist de setup"],
          },
          {
            title: "Mentalidade e ritmo de estudo",
            objective: "Criar rotina sustentável",
            exercise: "Defina 3 blocos de foco na semana",
            materials: ["Template de agenda"],
          },
        ],
      },
      {
        title: "Módulo 2 — Método na prática",
        objective: "Executar o núcleo do conteúdo",
        lessons: [
          {
            title: "Framework principal",
            objective: "Aplicar o método passo a passo",
            exercise: "Complete o canvas do módulo",
            materials: ["Canvas editável", "Exemplos comentados"],
          },
          {
            title: "Estudo de caso",
            objective: "Transferir o método para um caso real",
            exercise: "Adapte o caso ao seu nicho",
            materials: ["Case study PDF"],
          },
        ],
      },
      {
        title: "Módulo 3 — Aceleração e entrega",
        objective: "Consolidar e publicar resultado",
        lessons: [
          {
            title: "Checklist de qualidade",
            objective: "Validar entregáveis",
            exercise: "Revise com a lista de critérios",
            materials: ["Rubrica de avaliação"],
          },
          {
            title: "Próximos passos e certificação",
            objective: "Fechar o ciclo com clareza",
            exercise: "Planeje as próximas 2 semanas",
            materials: ["Plano de continuidade"],
          },
        ],
      },
    ],
  };
}

export function formatCourseOutline(outline: CourseOutline): string {
  const lines = [
    `# ${outline.title}`,
    `Público: ${outline.audience}`,
    `Objetivo: ${outline.objective}`,
    `Carga: ${outline.workloadHours}h · Nível: ${outline.level}`,
    "",
  ];
  outline.modules.forEach((mod, mi) => {
    lines.push(`## ${mod.title}`);
    lines.push(`Objetivo do módulo: ${mod.objective}`);
    mod.lessons.forEach((lesson, li) => {
      lines.push("");
      lines.push(`### Aula ${mi + 1}.${li + 1} — ${lesson.title}`);
      lines.push(`- Objetivo: ${lesson.objective}`);
      lines.push(`- Exercício: ${lesson.exercise}`);
      lines.push(`- Materiais: ${lesson.materials.join(", ")}`);
    });
    lines.push("");
  });
  return lines.join("\n");
}

export function quizTemplate(topic: string, count = 5): QuizDraft {
  const base = topic.trim() || "o conteúdo do curso";
  const questions = Array.from({ length: count }, (_, i) => ({
    question: `Questão ${i + 1}: Qual afirmação melhor descreve um bom uso de ${base}?`,
    options: [
      "Aplicar sem critério e esperar resultado",
      "Seguir um método, medir e ajustar",
      "Copiar concorrentes sem contexto",
      "Ignorar feedback dos alunos",
    ],
    correctIndex: 1,
    explanation:
      "Resultados consistentes vêm de método + medição + iteração — não de improvisação.",
  }));
  return { title: `Quiz — ${base}`, questions };
}

export function formatQuiz(quiz: QuizDraft): string {
  const lines = [`# ${quiz.title}`, ""];
  quiz.questions.forEach((q, i) => {
    lines.push(`${i + 1}. ${q.question}`);
    q.options.forEach((opt, oi) => {
      const mark = oi === q.correctIndex ? "✓" : " ";
      lines.push(`   ${String.fromCharCode(65 + oi)}) [${mark}] ${opt}`);
    });
    lines.push(`   Explicação: ${q.explanation}`);
    lines.push("");
  });
  return lines.join("\n");
}

export function certificateTemplate(input: {
  courseName: string;
  issuerName: string;
  workloadHours: number;
  signatureName: string;
}): CertificateDraft {
  return {
    courseName: input.courseName || "Curso ContentFy",
    studentNamePlaceholder: "[Nome do Aluno]",
    workloadHours: input.workloadHours || 8,
    issuerName: input.issuerName || "ContentFy",
    signatureName: input.signatureName || "Direção Acadêmica",
    logoLabel: "Logo do produtor",
    qrReserved: true,
  };
}

export function formatCertificate(cert: CertificateDraft): string {
  return [
    "CERTIFICADO DE CONCLUSÃO",
    "",
    `Certificamos que ${cert.studentNamePlaceholder}`,
    `concluiu com êxito o curso "${cert.courseName}"`,
    `com carga horária de ${cert.workloadHours} horas.`,
    "",
    `Emitido por: ${cert.issuerName}`,
    `Assinatura: ${cert.signatureName}`,
    `Logo: ${cert.logoLabel}`,
    "QR Code: reservado para validação futura",
  ].join("\n");
}

export function emailTemplate(kind: EmailKind, productName: string): string {
  const name = productName.trim() || "seu produto";
  const map: Record<EmailKind, { subject: string; body: string }> = {
    launch: {
      subject: `🚀 ${name} está no ar`,
      body: `Oi!\n\nChegou a hora: ${name} está disponível.\n\nSe você queria um caminho claro e aplicável, este é o momento.\n\nCTA: Garantir meu acesso`,
    },
    cart_open: {
      subject: `Seu acesso a ${name} está quase pronto`,
      body: `Oi!\n\nVocê deixou o carrinho aberto — falta só um passo para entrar.\n\nCTA: Finalizar inscrição`,
    },
    cart_closing: {
      subject: `Últimas horas: ${name}`,
      body: `Oi!\n\nAs condições atuais de ${name} encerram em breve.\n\nSe faz sentido pra você, finalize agora.\n\nCTA: Quero garantir`,
    },
    welcome: {
      subject: `Bem-vindo(a) a ${name}`,
      body: `Olá!\n\nSeja bem-vindo(a). Seu acesso já está liberado.\n\nComece pela aula 1 e siga o ritmo sugerido.\n\nCTA: Abrir minha área`,
    },
    recovery: {
      subject: `Ainda pensando em ${name}?`,
      body: `Oi!\n\nVi que você olhou ${name}. Se ficou alguma dúvida, responda este email — eu te ajudo.\n\nCTA: Tirar dúvidas / Voltar ao checkout`,
    },
    post_sale: {
      subject: `Obrigado — próximos passos em ${name}`,
      body: `Oi!\n\nObrigado pela confiança. Aqui vai o caminho recomendado nos primeiros 7 dias.\n\nCTA: Começar agora`,
    },
  };
  const item = map[kind];
  return `Assunto: ${item.subject}\n\n${item.body}`;
}

export function salesPageTemplate(
  productName: string,
  audience: string
): SalesPageDraft {
  const name = productName.trim() || "Produto Premium";
  return {
    hero: {
      headline: `${name}: do método à execução`,
      subtitle: `Feito para ${audience || "profissionais ambiciosos"} que querem clareza e resultado.`,
      cta: "Quero meu acesso",
    },
    benefits: [
      "Estrutura clara do zero ao avançado",
      "Templates prontos para aplicar",
      "Critérios de progresso mensuráveis",
      "Experiência de consumo premium",
    ],
    testimonials: [
      {
        name: "Ana Ribeiro",
        role: "Criadora de conteúdo",
        quote: "Organizei minha oferta em dias — a clareza mudou minha conversão.",
      },
      {
        name: "Carlos Mendes",
        role: "Consultor",
        quote: "Objetivo, premium e aplicável. Sem enrolação.",
      },
    ],
    offer: {
      title: `Oferta ${name}`,
      priceHint: "A partir do plano escolhido",
      bullets: ["Acesso imediato", "Atualizações da versão", "Certificado ao concluir"],
    },
    guarantee: "Garantia de satisfação conforme a política do produto.",
    cta: {
      primary: "Começar agora",
      secondary: "Ver conteúdo do curso",
    },
    faq: [
      {
        q: "Serve para o meu nível?",
        a: "Sim — o conteúdo é progressivo e pode ser consumido no seu ritmo.",
      },
      {
        q: "Quando recebo o acesso?",
        a: "Imediatamente após a confirmação do pagamento.",
      },
    ],
  };
}

export function formatSalesPage(page: SalesPageDraft): string {
  return [
    `# ${page.hero.headline}`,
    page.hero.subtitle,
    `CTA: ${page.hero.cta}`,
    "",
    "## Benefícios",
    ...page.benefits.map((b) => `- ${b}`),
    "",
    "## Depoimentos",
    ...page.testimonials.map(
      (t) => `- ${t.name} (${t.role}): “${t.quote}”`
    ),
    "",
    `## Oferta — ${page.offer.title}`,
    page.offer.priceHint,
    ...page.offer.bullets.map((b) => `- ${b}`),
    "",
    `## Garantia\n${page.guarantee}`,
    "",
    `## CTAs\nPrimário: ${page.cta.primary}\nSecundário: ${page.cta.secondary}`,
    "",
    "## FAQ",
    ...page.faq.flatMap((f) => [`P: ${f.q}`, `R: ${f.a}`, ""]),
  ].join("\n");
}
