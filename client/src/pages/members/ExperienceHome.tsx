import MembersLayout from "@/components/MembersLayout";
import {
  ExperienceDashboard,
  ExperienceErrorBoundary,
  ExperienceSkeleton,
} from "@/components/experience";
import { trpc } from "@/lib/trpc";

/** Centro de Evolução — ContentFy Experience Layer (Evolution XIII). */
export default function ExperienceHomePage() {
  const { data, isLoading, error } = trpc.experience.home.useQuery(undefined, {
    staleTime: 30_000,
  });

  return (
    <MembersLayout>
      {isLoading ? (
        <ExperienceSkeleton />
      ) : error || !data ? (
        <div className="rounded-2xl border border-border/40 p-6">
          <p className="text-sm font-medium">
            Não foi possível carregar seu Centro de Evolução.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Tente novamente em instantes. Suas outras áreas continuam
            disponíveis no menu.
          </p>
        </div>
      ) : (
        <ExperienceErrorBoundary>
          <ExperienceDashboard data={data} />
        </ExperienceErrorBoundary>
      )}
    </MembersLayout>
  );
}
