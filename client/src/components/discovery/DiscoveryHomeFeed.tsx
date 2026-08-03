import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  ContinueLearning,
  DiscoveryHero,
  DiscoveryRail,
  DiscoverySeo,
} from "@/components/discovery";

/**
 * Personalized Discovery feed — rule/behavior engine via trpc.discovery.home.
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
  const { data: favData } = trpc.discovery.myList.useQuery(undefined, {
    enabled: Boolean(user),
    staleTime: 15_000,
  });

  const addFav = trpc.discovery.addFavorite.useMutation({
    onSuccess: () => {
      void utils.discovery.myList.invalidate();
      void utils.discovery.home.invalidate();
      toast.success("Adicionado à Minha Lista");
    },
    onError: () => toast.error("Faça login para salvar na lista"),
  });
  const removeFav = trpc.discovery.removeFavorite.useMutation({
    onSuccess: () => {
      void utils.discovery.myList.invalidate();
      void utils.discovery.home.invalidate();
      toast.success("Removido da Minha Lista");
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

  if (isLoading || !data) return null;

  // Prefer rails that have items; skip empty
  const rails = data.rails.filter((r) => r.items.length > 0);

  return (
    <div className="space-y-10 lg:space-y-12">
      {showSeo && (
        <DiscoverySeo
          title="Explorar | ContentFy Discovery"
          description="Trilhos personalizados, tendências e recomendações proprietárias — sem IA generativa."
          canonicalPath="/explorar"
          image={data.hero?.coverImage || data.hero?.heroImage}
        />
      )}
      {showHero && <DiscoveryHero product={data.hero} />}
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
