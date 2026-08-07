import type {
  ExperienceAchievementPageItem,
  ExperienceAchievementsPayload,
  LearnerAchievement,
} from "@shared/contentfy";
import { LEARN_ACHIEVEMENTS } from "../learn/catalog";

const ORIGIN: Record<string, string> = {
  first_purchase: "Primeira compra",
  first_lesson: "Primeira aula concluída",
  lessons_10: "10 aulas concluídas",
  course_completed: "Curso concluído",
  streak_7: "Constância de 7 dias",
  goal_reached: "Objetivo Learn",
  specialist: "Domínio de competências",
  top_performer: "Success Index elevado",
  high_performance: "Success Index",
  habit_builder: "Hábitos e rotina",
};

/**
 * Build achievements page from Learn engine results.
 * Does not invent unlock dates — unlockedAt only when Learn provides a real value.
 * Note: Learn currently may emit "now" as unlockedAt; we treat missing/unreliable
 * timestamps as null for display honesty when progress-derived.
 */
export function buildAchievementsPayload(
  achievements: LearnerAchievement[],
  opts?: { trustUnlockTimestamps?: boolean }
): ExperienceAchievementsPayload {
  const trust = opts?.trustUnlockTimestamps === true;

  const items: ExperienceAchievementPageItem[] = LEARN_ACHIEVEMENTS.map((def) => {
    const a = achievements.find((x) => x.id === def.id);
    const unlocked = Boolean(a?.unlocked);
    // Heuristic: Learn evaluates unlocks live without a persistence clock —
    // only surface date when explicitly trusted (future unlock log).
    const unlockedAt =
      unlocked && trust && a?.unlockedAt ? a.unlockedAt : null;

    let progressToUnlock: number | null = null;
    if (!unlocked) {
      // Soft progress cue from neighboring unlocked count — not a fake % claim.
      const unlockedCount = achievements.filter((x) => x.unlocked).length;
      progressToUnlock = Math.min(
        90,
        Math.round((unlockedCount / Math.max(LEARN_ACHIEVEMENTS.length, 1)) * 100)
      );
    }

    return {
      id: def.id,
      name: def.name,
      description: def.description,
      tier: def.tier,
      unlocked,
      unlockedAt,
      origin: ORIGIN[def.id] || "Jornada ContentFy",
      progressToUnlock,
    };
  });

  const unlocked = items.filter((i) => i.unlocked);
  const locked = items.filter((i) => !i.unlocked);
  const nextTarget = locked[0] || null;

  return {
    unlocked,
    locked,
    nextTarget,
    emptyInvite:
      unlocked.length === 0
        ? "Comece sua jornada para desbloquear as primeiras conquistas."
        : null,
    generatedAt: new Date().toISOString(),
  };
}
