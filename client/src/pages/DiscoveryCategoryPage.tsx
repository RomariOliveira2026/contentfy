import { useRoute, Link } from "wouter";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import {
  CategoryShelf,
  DiscoverySeo,
} from "@/components/discovery";
import { trpc } from "@/lib/trpc";
import { DISCOVERY_RAIL_DEFS } from "@shared/contentfy";

const SLUG_ALIASES: Record<string, string> = {
  ia: "ai",
  negocios: "business",
  "representacao-comercial": "sales_rep",
  "desenvolvimento-pessoal": "personal_dev",
  produtividade: "productivity",
  buildertudo: "buildertudo",
  lancamentos: "launches",
  destaque: "featured",
};

export default function DiscoveryCategoryPage() {
  const [, params] = useRoute("/explorar/categoria/:slug");
  const slug = (params?.slug || "").toLowerCase();
  const railId = SLUG_ALIASES[slug] || slug;

  const { data } = trpc.discovery.home.useQuery();
  const def = DISCOVERY_RAIL_DEFS.find((r) => r.id === railId);
  const rail = data?.rails.find((r) => r.id === railId);

  const title = def?.title || rail?.title || "Categoria";
  const description =
    def?.subtitle ||
    rail?.subtitle ||
    `Explore a categoria ${title} no ContentFy Discovery.`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DiscoverySeo
        title={`${title} | ContentFy Discovery`}
        description={description}
        canonicalPath={`/explorar/categoria/${slug}`}
      />
      <PublicHeader />
      <main className="flex-1 py-10 space-y-8">
        <div className="container">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            <Link href="/explorar">
              <a className="hover:underline">Explorar</a>
            </Link>
            {" / "}
            {title}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">{description}</p>
        </div>
        {rail?.items?.length ? (
          <CategoryShelf title={title} items={rail.items} />
        ) : (
          <p className="container text-muted-foreground">
            Nenhum produto nesta categoria ainda. Volte em breve.
          </p>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}
