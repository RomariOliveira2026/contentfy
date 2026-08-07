import type {
  ExperienceStudentState,
  NextBestAction,
  StudentContext,
} from "@shared/contentfy";
import { resolveInactiveReturnDays, resolveNbaPriorities } from "./config";

export class NextBestActionEngine {
  decide(ctx: StudentContext): NextBestAction | null {
    const p = resolveNbaPriorities();
    const candidates: NextBestAction[] = [];

    if (ctx.studentState === "new_user" || ctx.studentState === "no_products") {
      candidates.push({
        kind: "explore_catalog",
        title: "Explorar conteúdos para começar",
        reason: "Ainda não há produtos na sua biblioteca.",
        href: "/explorar",
        ctaLabel: "Explorar",
        priority: p.explore_catalog,
      });
      candidates.push({
        kind: "complete_onboarding",
        title: "Definir seu objetivo principal",
        reason: "Com um objetivo claro, personalizamos sua jornada.",
        href: "/dashboard#onboarding",
        ctaLabel: "Começar",
        priority: p.complete_onboarding,
      });
    }

    if (ctx.studentState === "purchased_no_progress" && ctx.ownedProductSlugs[0]) {
      const slug = ctx.ownedProductSlugs[0];
      candidates.push({
        kind: "start_first_product",
        title: "Iniciar seu primeiro produto",
        reason: "Você já tem acesso — o próximo passo é começar.",
        href: `/produto/${slug}`,
        ctaLabel: "Começar agora",
        priority: p.start_first_product,
        meta: { productSlug: slug },
      });
    }

    if (ctx.productInProgress) {
      candidates.push({
        kind: "continue_lesson",
        title: ctx.productInProgress.lastLessonTitle
          ? `Continuar: ${ctx.productInProgress.lastLessonTitle}`
          : `Continuar ${ctx.productInProgress.productName}`,
        reason: "Retome de onde parou para manter constância.",
        href: ctx.productInProgress.href,
        ctaLabel: "Continuar jornada",
        priority: p.continue_lesson,
        meta: { productSlug: ctx.productInProgress.productSlug },
      });
    }

    if (ctx.studentState === "inactive_return" && ctx.productInProgress) {
      candidates.push({
        kind: "resume_journey",
        title: "Retomar sua jornada",
        reason: "Há progresso pendente esperando por você.",
        href: ctx.productInProgress.href,
        ctaLabel: "Retomar",
        priority: p.resume_journey,
      });
    }

    if (
      !ctx.activeGoalId &&
      ctx.ownedProductCount > 0 &&
      ctx.studentState !== "purchased_no_progress"
    ) {
      candidates.push({
        kind: "choose_goal",
        title: "Escolher um objetivo",
        reason: "Sem objetivo ativo, a personalização fica limitada.",
        href: "/my-account/evolucao",
        ctaLabel: "Definir objetivo",
        priority: p.choose_goal,
      });
    }

    if (ctx.competenciesStagnant[0]) {
      const c = ctx.competenciesStagnant[0];
      candidates.push({
        kind: "review_stagnant_competency",
        title: `Desbloquear: ${c.name}`,
        reason: "Esta competência está em evolução lenta.",
        href: "/my-account/sucesso",
        ctaLabel: "Ver evolução",
        priority: p.review_stagnant_competency,
        meta: { competencyId: c.id },
      });
    }

    if (ctx.recommendations[0]?.href) {
      const r = ctx.recommendations[0];
      candidates.push({
        kind: "related_product",
        title: r.title,
        reason: r.reason,
        href: r.href,
        ctaLabel: "Conhecer",
        priority: p.related_product,
        meta: { productSlug: r.productSlug ?? null },
      });
    }

    if (
      ctx.achievementsUnlocked.length > 0 &&
      ctx.studentState === "course_completed"
    ) {
      const a = ctx.achievementsUnlocked[0];
      candidates.push({
        kind: "view_achievement",
        title: `Conquista: ${a.name}`,
        reason: "Celebre o marco e planeje o próximo ciclo.",
        href: "/my-account/achievements",
        ctaLabel: "Ver conquistas",
        priority: p.view_achievement,
      });
    }

    if (candidates.length === 0) {
      return {
        kind: "explore_catalog",
        title: "Continuar explorando",
        reason: "Há conteúdos selecionados para o seu momento.",
        href: "/explorar",
        ctaLabel: "Explorar",
        priority: p.explore_catalog,
      };
    }

    return candidates.sort((a, b) => a.priority - b.priority)[0] ?? null;
  }
}

export const nextBestActionEngine = new NextBestActionEngine();

export function deriveStudentState(input: {
  ownedProductCount: number;
  hasProgress: boolean;
  coursesCompleted: number;
  activeGoalProgress: number | null;
  inactiveDays: number | null;
  /** True only when learner had prior durable activity (not brand-new). */
  hasPriorActivity: boolean;
  productInProgress: boolean;
  enginesDegraded: boolean;
  learnUnavailable?: boolean;
  partialData: boolean;
  inactiveReturnDays?: number;
}): ExperienceStudentState {
  if (input.enginesDegraded) return "service_degraded";
  if (input.learnUnavailable) return "partial_data";

  if (input.ownedProductCount === 0) return "no_products";

  const threshold = input.inactiveReturnDays ?? resolveInactiveReturnDays();

  // Never classify brand-new learners as inactive.
  const canBeInactiveReturn =
    input.hasPriorActivity &&
    input.hasProgress &&
    input.productInProgress &&
    input.inactiveDays != null &&
    input.inactiveDays >= threshold;

  if (canBeInactiveReturn) {
    return "inactive_return";
  }

  if (
    input.activeGoalProgress != null &&
    input.activeGoalProgress >= 70 &&
    input.activeGoalProgress < 100
  ) {
    return "goal_near_completion";
  }

  if (input.coursesCompleted > 0 && !input.hasProgress) {
    return "course_completed";
  }
  if (!input.hasProgress) return "purchased_no_progress";
  if (input.hasProgress) return "active_learning";
  if (input.partialData) return "partial_data";
  return "new_user";
}
