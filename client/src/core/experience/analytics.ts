import { trpc } from "@/lib/trpc";
import type { ExperienceAnalyticsEvent } from "@shared/contentfy";

export function useExperienceAnalytics() {
  const track = trpc.experience.track.useMutation();
  return {
    track(event: ExperienceAnalyticsEvent, meta?: Record<string, unknown>) {
      track.mutate({ event, meta });
    },
  };
}
