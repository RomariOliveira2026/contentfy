import MembersLayout from "@/components/MembersLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { SuccessDashboard } from "@/components/success";
import { trpc } from "@/lib/trpc";

export default function MyEvolutionPage() {
  const { data, isLoading, error } = trpc.success.dashboard.useQuery(undefined, {
    staleTime: 30_000,
  });

  return (
    <MembersLayout>
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      ) : error || !data ? (
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar o Success Engine.
        </p>
      ) : (
        <SuccessDashboard data={data} />
      )}
    </MembersLayout>
  );
}
