import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import { DiscoverySeo, MyList } from "@/components/discovery";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function MyListPage() {
  const { data: user, isLoading: authLoading } = trpc.auth.me.useQuery();
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.discovery.myList.useQuery(undefined, {
    enabled: Boolean(user),
  });

  const removeFav = trpc.discovery.removeFavorite.useMutation({
    onSuccess: () => {
      void utils.discovery.myList.invalidate();
      void utils.discovery.home.invalidate();
      toast.success("Removido da Minha Lista");
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DiscoverySeo
        title="Minha Lista | ContentFy"
        description="Seus produtos salvos no ContentFy Discovery."
        canonicalPath="/minha-lista"
      />
      <PublicHeader />
      <main className="flex-1 py-10">
        {authLoading || (user && isLoading) ? (
          <p className="container text-muted-foreground">Carregando…</p>
        ) : !user ? (
          <div className="container max-w-lg text-center space-y-4">
            <h1 className="text-2xl font-semibold">Minha Lista</h1>
            <p className="text-muted-foreground">
              Entre na sua conta para salvar e ver seus favoritos.
            </p>
            <Button asChild>
              <Link href="/">Entrar</Link>
            </Button>
          </div>
        ) : (
          <MyList
            items={(data?.items || []).filter(
              (item): item is NonNullable<typeof item> => Boolean(item)
            )}
            favorites={data?.slugs}
            onFavoriteToggle={(slug) =>
              removeFav.mutate({ productSlug: slug })
            }
          />
        )}
      </main>
      <PublicFooter />
    </div>
  );
}
