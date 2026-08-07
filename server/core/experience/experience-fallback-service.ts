import type {
  ExperienceGreeting,
  ExperienceHomePayload,
  ExperienceStudentState,
  JourneySummaryView,
  RecommendationViewItem,
  StudentContext,
} from "@shared/contentfy";

/** Explicit editorial / UX fallbacks — never look like tech errors. */
export class ExperienceFallbackService {
  editorialRecommendations(): RecommendationViewItem[] {
    return [
      {
        id: "editorial:explorar",
        title: "Explorar catálogo ContentFy",
        reason: "Seleção editorial para começar com clareza",
        href: "/explorar",
      },
    ];
  }

  greetingForState(
    state: ExperienceStudentState,
    firstName: string | null,
    hour: number
  ): ExperienceGreeting {
    const name = firstName || "olá";
    const salutation =
      hour < 12 ? `Bom dia, ${name}.` : hour < 18 ? `Boa tarde, ${name}.` : `Boa noite, ${name}.`;

    switch (state) {
      case "no_products":
      case "new_user":
        return {
          salutation,
          headline: "Sua jornada começa aqui.",
          support: "Escolha um conteúdo e avance no seu ritmo.",
          tone: "welcome",
        };
      case "purchased_no_progress":
        return {
          salutation,
          headline: "Seu primeiro passo está pronto.",
          support: "Abra o produto adquirido e comece a evoluir.",
          tone: "guide",
        };
      case "inactive_return":
        return {
          salutation,
          headline: "Que bom ter você de volta.",
          support: "Vamos continuar de onde você parou?",
          tone: "return",
        };
      case "goal_near_completion":
        return {
          salutation,
          headline: "Você está perto do seu objetivo.",
          support: "Um passo a mais pode fechar esta etapa.",
          tone: "celebrate",
        };
      case "course_completed":
        return {
          salutation,
          headline: "Ciclo concluído com excelência.",
          support: "Celebre a conquista e escolha o próximo avanço.",
          tone: "celebrate",
        };
      case "active_learning":
        return {
          salutation,
          headline: "Seu próximo passo está pronto.",
          support: "Continue de onde parou para manter o ritmo.",
          tone: "continue",
        };
      case "service_degraded":
      case "partial_data":
        return {
          salutation,
          headline: "Sua área do aluno está disponível.",
          support: "Alguns insights podem aparecer em breve.",
          tone: "guide",
        };
      default:
        return {
          salutation,
          headline: "Bem-vindo à sua evolução.",
          tone: "welcome",
        };
    }
  }

  journeySummary(ctx: StudentContext): JourneySummaryView {
    if (!ctx.activeGoalName && ctx.ownedProductCount === 0) {
      return {
        primaryGoalName: null,
        evolutionPercent: null,
        productInProgress: null,
        lastLessonTitle: null,
        message: "Explore conteúdos selecionados para começar.",
      };
    }
    if (!ctx.activeGoalName) {
      return {
        primaryGoalName: null,
        evolutionPercent: ctx.averageProgress,
        productInProgress: ctx.productInProgress?.productName ?? null,
        lastLessonTitle: ctx.lastLessonTitle,
        message: "Escolha um objetivo para personalizarmos sua jornada.",
      };
    }
    if (!ctx.productInProgress && ctx.ownedProductCount > 0) {
      return {
        primaryGoalName: ctx.activeGoalName,
        evolutionPercent: ctx.activeGoalProgress,
        productInProgress: null,
        lastLessonTitle: null,
        message: "Seu primeiro passo está pronto.",
      };
    }
    return {
      primaryGoalName: ctx.activeGoalName,
      evolutionPercent: ctx.activeGoalProgress,
      productInProgress: ctx.productInProgress?.productName ?? null,
      lastLessonTitle: ctx.lastLessonTitle,
      message: ctx.lastLessonTitle
        ? "Retome a última aula e mantenha sua constância."
        : "Avance na jornada no seu ritmo.",
    };
  }

  emptyHomePatch(
    state: ExperienceStudentState
  ): Partial<ExperienceHomePayload> {
    if (state === "no_products" || state === "new_user") {
      return {
        recommendations: this.editorialRecommendations(),
        onboardingNeeded: true,
      };
    }
    return {};
  }
}

export const experienceFallbackService = new ExperienceFallbackService();
