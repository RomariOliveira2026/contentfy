import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  ContinueLearning,
  DiscoveryRail,
  DiscoverySeo,
} from "@/components/discovery";
import { DiscoveryCenterHero } from "@/components/phoenix";

/**
 * Personalized Discovery feed — Centro de Descoberta.
 * Additive to showcase; does not replace existing Explore catalog.
 */
export function DiscoveryHomeFeed({
  showHero = false,
  showSeo = false,
}: {
  showHero?: boolean;
  showSeo?: boolean;
}) {
  const utils = trpc.useUtils();
  const { data: user } = trpc.auth.me.useQuery();
  const { data, isLoading } = trpc.discovery.home.useQuery(undefined, {
    staleTime: 30_000,
  });
  const { data: experience } = trpc.experience.home.useQuery(undefined, {
    enabled: Boolean(user),
    staleTime: 30_000,
    retry: false,
  });
  const { data: favData } = trpc.discovery.myList.useQuery(undefined, {
    enabled: Boolean(user),
    staleTime: 15_000,
  });

  const addFav = trpc.discovery.addFavorite.useMutation({
    onSuccess: () => {
      void utils.discovery.myList.invalidate();
      void utils.discovery.home.invalidate();
      toast.success("Adicionado à Sua Coleção");
    },
    onError: () => toast.error("Faça login para salvar na lista"),
  });
  const removeFav = trpc.discovery.removeFavorite.useMutation({
    onSuccess: () => {
      void utils.discovery.myList.invalidate();
      void utils.discovery.home.invalidate();
      toast.success("Removido da Sua Coleção");
    },
  });

  const favoriteSlugs = useMemo(
    () => new Set(favData?.slugs || []),
    [favData?.slugs]
  );

  const onFavoriteToggle = (slug: string) => {
    if (!user) {
      toast.message("Entre na sua conta para salvar favoritos");
      return;
    }
    if (favoriteSlugs.has(slug)) {
      removeFav.mutate({ productSlug: slug });
    } else {
      addFav.mutate({ productSlug: slug });
    }
  };

  if (isLoading || !data) {
    return (
      <div className="container py-12" aria-busy="true" aria-live="polite">
        <div className="cf-phoenix-skeleton h-48 rounded-2xl mb-8" />
        <div className="flex gap-4 overflow-hidden">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="cf-phoenix-skeleton h-64 w-52 shrink-0 rounded-2xl"
            />
          ))}
        </div>
      </div>
    );
  }

  const rails = data.rails.filter((r) => r.items.length > 0);
  const developed =
    experience?.competencies.inProgress
      .concat(experience.competencies.acquired)
      .map((c) => c.name)
      .slice(0, 4) || [];

  return (
    <div className="space-y-10 lg:space-y-12">
      {showSeo && (
        <DiscoverySeo
          title="Centro de Descoberta | ContentFy"
          description="Jornadas, competências e recomendações proprietárias — o Discovery da ContentFy."
          canonicalPath="/explorar"
          image={data.hero?.coverImage || data.hero?.heroImage}
        />
      )}
      {showHero && (
        <DiscoveryCenterHero
          featured={data.hero}
          primaryGoalName={experience?.primaryGoal.name}
          nextJourneyLabel={
            experience?.nextBestAction?.title ||
            experience?.journeySummary.message ||
            null
          }
          developedCompetencies={developed}
          ctaHref={
            experience?.nextBestAction?.href || data.hero?.href || "/explorar"
          }
          ctaLabel={
            experience?.nextBestAction?.ctaLabel || "Explorar jornada"
          }
        />
      )}

      {!showHero && (
        <div className="container">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Centro de Descoberta
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">
            O que evolui com você agora
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
            Trilhos com identidade ContentFy — não um catálogo genérico.
          </p>
        </div>
      )}

      <ContinueLearning items={data.continueLearning} />
      {rails.map((rail) => (
        <DiscoveryRail
          key={rail.id}
          title={rail.title}
          subtitle={rail.subtitle}
          items={rail.items}
          favorites={favoriteSlugs}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  );
}
