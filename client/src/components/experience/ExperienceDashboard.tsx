import { useEffect } from "react";
import type { ExperienceHomePayload } from "@shared/contentfy";
import { shouldShowSection, useExperienceAnalytics } from "@/core/experience";
import { ExperienceGreeting } from "./ExperienceGreeting";
import { EvolutionHero } from "./EvolutionHero";
import { NextBestActionCard } from "./NextBestActionCard";
import { JourneySummary } from "./JourneySummary";
import { ContinueLearningPanel } from "./ContinueLearningPanel";
import { SuccessSnapshot } from "./SuccessSnapshot";
import { CompetencyJourney } from "./CompetencyJourney";
import { AchievementShelf } from "./AchievementShelf";
import { RecommendationShelf } from "./RecommendationShelf";
import { ProtectionSummary } from "./ProtectionSummary";
import { ExperienceOnboarding } from "./ExperienceOnboarding";
import { ExperienceErrorBoundary } from "./ExperienceErrorBoundary";
import { EvolutionGraph } from "@/components/phoenix";
import { trpc } from "@/lib/trpc";

interface ExperienceDashboardProps {
  data: ExperienceHomePayload;
}

export function ExperienceDashboard({ data }: ExperienceDashboardProps) {
  const { track } = useExperienceAnalytics();
  const utils = trpc.useUtils();
  const dismiss = trpc.experience.dismissRecommendation.useMutation({
    onSuccess: () => void utils.experience.home.invalidate(),
  });
  const markSeen = trpc.experience.markActionSeen.useMutation();

  useEffect(() => {
    track("experience.home_viewed", { state: data.studentState });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once per payload
  }, [data.generatedAt]);

  const hasCompetencies =
    data.competencies.acquired.length +
      data.competencies.inProgress.length +
      data.competencies.stagnant.length >
    0;

  return (
    <div className="space-y-8 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-500">
      {data.fallbackMode ? (
        <p
          className="text-xs text-muted-foreground rounded-lg border border-border/30 px-3 py-2"
          role="status"
        >
          Alguns insights podem aparecer em breve — sua área do aluno continua
          disponível.
        </p>
      ) : null}

      <ExperienceGreeting greeting={data.greeting} />

      {shouldShowSection("onboarding", {
        onboardingNeeded: data.onboardingNeeded,
      }) ? (
        <ExperienceErrorBoundary>
          <ExperienceOnboarding />
        </ExperienceErrorBoundary>
      ) : null}

      <ExperienceErrorBoundary>
        <EvolutionHero
          primaryGoalName={data.primaryGoal.name}
          evolutionPercent={data.journeySummary.evolutionPercent}
          successScore={data.successSnapshot?.score ?? null}
          productName={data.journeySummary.productInProgress}
          message={data.journeySummary.message}
          nextAction={data.nextBestAction}
          onCta={() => {
            if (data.nextBestAction) {
              markSeen.mutate({ actionKind: data.nextBestAction.kind });
              track("experience.next_action_clicked", {
                kind: data.nextBestAction.kind,
              });
            }
          }}
        />
      </ExperienceErrorBoundary>

      {shouldShowSection("next_action", {
        hasNextAction: Boolean(data.nextBestAction),
      }) && data.nextBestAction ? (
        <ExperienceErrorBoundary>
          <NextBestActionCard
            action={data.nextBestAction}
            onClick={() => {
              markSeen.mutate({ actionKind: data.nextBestAction!.kind });
              track("experience.next_action_clicked", {
                kind: data.nextBestAction!.kind,
              });
            }}
          />
        </ExperienceErrorBoundary>
      ) : null}

      <ExperienceErrorBoundary>
        <JourneySummary summary={data.journeySummary} />
      </ExperienceErrorBoundary>

      {shouldShowSection("continue", {
        hasContinue:
          data.continueLearning.length > 0 ||
          data.studentState === "purchased_no_progress" ||
          data.studentState === "active_learning" ||
          data.studentState === "inactive_return",
      }) ? (
        <ExperienceErrorBoundary>
          <ContinueLearningPanel
            items={data.continueLearning}
            onContinue={() => track("experience.continue_learning_clicked")}
          />
        </ExperienceErrorBoundary>
      ) : null}

      {shouldShowSection("success", {
        hasSuccess: Boolean(data.successSnapshot),
      }) && data.successSnapshot ? (
        <ExperienceErrorBoundary>
          <SuccessSnapshot snapshot={data.successSnapshot} />
        </ExperienceErrorBoundary>
      ) : null}

      {shouldShowSection("competencies", { hasCompetencies }) ? (
        <ExperienceErrorBoundary>
          <div className="space-y-6">
            <EvolutionGraph
              acquired={data.competencies.acquired}
              inProgress={data.competencies.inProgress}
              stagnant={data.competencies.stagnant}
              primaryGoalName={data.primaryGoal.name}
            />
            <CompetencyJourney
              acquired={data.competencies.acquired}
              inProgress={data.competencies.inProgress}
              stagnant={data.competencies.stagnant}
            />
          </div>
        </ExperienceErrorBoundary>
      ) : (
        <ExperienceErrorBoundary>
          <EvolutionGraph
            acquired={data.competencies.acquired}
            inProgress={data.competencies.inProgress}
            stagnant={data.competencies.stagnant}
            primaryGoalName={data.primaryGoal.name}
          />
        </ExperienceErrorBoundary>
      )}

      {data.achievements.length > 0 ||
      data.studentState === "purchased_no_progress" ||
      data.studentState === "active_learning" ||
      data.studentState === "course_completed" ? (
        <ExperienceErrorBoundary>
          <AchievementShelf items={data.achievements} />
        </ExperienceErrorBoundary>
      ) : null}

      {shouldShowSection("recommendations", {
        hasRecommendations: data.recommendations.length > 0,
      }) ? (
        <ExperienceErrorBoundary>
          <RecommendationShelf
            items={data.recommendations}
            onSelect={(item) =>
              track("experience.recommendation_clicked", { id: item.id })
            }
            onDismiss={(id) => dismiss.mutate({ recommendationId: id })}
          />
        </ExperienceErrorBoundary>
      ) : null}

      {shouldShowSection("protection", {
        hasProtection: data.protectionSummary.length > 0,
      }) ? (
        <ExperienceErrorBoundary>
          <ProtectionSummary items={data.protectionSummary} />
        </ExperienceErrorBoundary>
      ) : null}

      {shouldShowSection("notifications", {
        hasNotifications: data.notifications.length > 0,
      }) ? (
        <section aria-label="Atualizações recentes" className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Atualizações recentes
          </p>
          <ul className="space-y-2">
            {data.notifications.map((n) => (
              <li
                key={n.id}
                className="rounded-lg border border-border/30 px-3 py-2.5"
              >
                <p className="text-sm font-medium">{n.title}</p>
                {n.body ? (
                  <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
