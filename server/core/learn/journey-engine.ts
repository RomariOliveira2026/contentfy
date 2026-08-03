import type {
  JourneySnapshot,
  JourneyStep,
  LearnerAchievement,
  LearnerCompetencyState,
  LearnerGoalState,
  LearnLearnerSignals,
  NextStepRecommendation,
} from "@shared/contentfy";
import { LEARN_PRODUCT_LINKS } from "./catalog";
import { goalEngine } from "./goal-engine";

export class JourneyEngine {
  build(input: {
    goals: LearnerGoalState[];
    competencies: LearnerCompetencyState[];
    achievements: LearnerAchievement[];
    signals: LearnLearnerSignals;
    productNames?: Record<string, string>;
  }): JourneySnapshot {
    const active =
      input.goals.find((g) => g.isActive) || input.goals[0] || null;
    const steps: JourneyStep[] = [];

    if (active) {
      steps.push({
        id: `goal:${active.goalId}`,
        kind: "goal",
        title: active.name,
        subtitle: active.description,
        status: active.progress >= 70 ? "done" : "current",
        progress: active.progress,
      });

      const relevant = input.competencies.filter((c) =>
        active.competencyIds.includes(c.competencyId)
      );
      for (const c of relevant.slice(0, 5)) {
        steps.push({
          id: `comp:${c.competencyId}`,
          kind: "competency",
          title: c.name,
          subtitle: c.category,
          status:
            c.status === "acquired"
              ? "done"
              : c.status === "in_progress"
                ? "current"
                : "upcoming",
          progress: c.progress,
        });
      }
    }

    for (const slug of input.signals.ownedProductSlugs.slice(0, 4)) {
      const progress = input.signals.progressBySlug[slug] ?? 0;
      steps.push({
        id: `course:${slug}`,
        kind: "course",
        title: input.productNames?.[slug] || slug,
        href: `/produto/${slug}`,
        status:
          progress >= 100 ? "done" : progress > 0 ? "current" : "upcoming",
        progress,
      });
    }

    const unlocked = input.achievements.filter((a) => a.unlocked).slice(-2);
    for (const a of unlocked) {
      steps.push({
        id: `ach:${a.id}`,
        kind: "achievement",
        title: a.name,
        subtitle: a.description,
        status: "done",
      });
    }

    const next = this.nextStep({
      active,
      competencies: input.competencies,
      signals: input.signals,
      productNames: input.productNames,
    });

    if (next) {
      steps.push({
        id: "next",
        kind: "next",
        title: next.title,
        subtitle: next.reason,
        href: next.href,
        status: "current",
      });
    }

    const evolutionPercent = active
      ? active.progress
      : Math.round(
          input.competencies.reduce((s, c) => s + c.progress, 0) /
            Math.max(1, input.competencies.length)
        );

    return {
      goalId: active?.goalId ?? null,
      goalName: active?.name ?? null,
      steps,
      evolutionPercent,
      nextStep: next,
    };
  }

  nextStep(input: {
    active: LearnerGoalState | null;
    competencies: LearnerCompetencyState[];
    signals: LearnLearnerSignals;
    productNames?: Record<string, string>;
  }): NextStepRecommendation | null {
    const { signals, active } = input;

    if (signals.lastLesson && (signals.progressBySlug[signals.lastLesson.productSlug] ?? 0) < 100) {
      return {
        kind: "lesson",
        title: signals.lastLesson.lessonTitle
          ? `Continuar: ${signals.lastLesson.lessonTitle}`
          : `Continuar ${signals.lastLesson.productName}`,
        reason: "Retome a última aula para manter constância.",
        href: signals.lastLesson.href,
        productSlug: signals.lastLesson.productSlug,
      };
    }

    if (active) {
      const missing = input.competencies.filter(
        (c) =>
          active.missingCompetencyIds.includes(c.competencyId) ||
          (active.competencyIds.includes(c.competencyId) &&
            c.status !== "acquired")
      );
      const stagnant = missing.sort((a, b) => a.progress - b.progress)[0];
      if (stagnant) {
        const accelerator = goalEngine
          .productsThatAccelerate(active.goalId)
          .find((slug) => !signals.ownedProductSlugs.includes(slug));
        if (accelerator) {
          return {
            kind: "product",
            title: `Acelere com ${input.productNames?.[accelerator] || accelerator}`,
            reason: `Desenvolve a competência ${stagnant.name}.`,
            href: `/produto/${accelerator}`,
            productSlug: accelerator,
            competencyId: stagnant.competencyId,
            goalId: active.goalId,
          };
        }
        return {
          kind: "competency",
          title: `Desenvolver: ${stagnant.name}`,
          reason: "Competência crítica para o seu objetivo atual.",
          competencyId: stagnant.competencyId,
          goalId: active.goalId,
        };
      }
    }

    const catalog = LEARN_PRODUCT_LINKS.map((l) => l.productSlug).find(
      (slug) => !signals.ownedProductSlugs.includes(slug)
    );
    if (catalog) {
      return {
        kind: "course",
        title: `Explorar ${input.productNames?.[catalog] || catalog}`,
        reason: "Próximo produto alinhado ao catálogo Learn.",
        href: `/produto/${catalog}`,
        productSlug: catalog,
      };
    }

    return null;
  }
}

export const journeyEngine = new JourneyEngine();
