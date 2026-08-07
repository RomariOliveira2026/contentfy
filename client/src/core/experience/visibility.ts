export type ExperienceSectionId =
  | "greeting"
  | "hero"
  | "next_action"
  | "continue"
  | "success"
  | "competencies"
  | "achievements"
  | "recommendations"
  | "protection"
  | "notifications"
  | "onboarding";

export function shouldShowSection(
  section: ExperienceSectionId,
  flags: {
    hasGoal?: boolean;
    hasContinue?: boolean;
    hasSuccess?: boolean;
    hasCompetencies?: boolean;
    hasAchievements?: boolean;
    hasRecommendations?: boolean;
    hasProtection?: boolean;
    hasNotifications?: boolean;
    onboardingNeeded?: boolean;
    hasNextAction?: boolean;
  }
): boolean {
  switch (section) {
    case "greeting":
    case "hero":
      return true;
    case "next_action":
      return Boolean(flags.hasNextAction);
    case "continue":
      return Boolean(flags.hasContinue);
    case "success":
      return Boolean(flags.hasSuccess);
    case "competencies":
      return Boolean(flags.hasCompetencies);
    case "achievements":
      return true; // empty state handled in component
    case "recommendations":
      return Boolean(flags.hasRecommendations);
    case "protection":
      return Boolean(flags.hasProtection);
    case "notifications":
      return Boolean(flags.hasNotifications);
    case "onboarding":
      return Boolean(flags.onboardingNeeded);
    default:
      return false;
  }
}
