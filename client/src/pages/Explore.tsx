import { useMemo, useState } from "react";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import ShowcaseHero from "@/components/showcase/ShowcaseHero";
import ShowcaseRail from "@/components/showcase/ShowcaseRail";
import ShowcaseDiscoveryBar from "@/components/showcase/ShowcaseDiscoveryBar";
import FirstLaunchesSection from "@/components/showcase/FirstLaunchesSection";
import ProductDetailModal from "@/components/showcase/ProductDetailModal";
import ProductShowcaseCard from "@/components/showcase/ProductShowcaseCard";
import ShowcaseSeo from "@/components/showcase/ShowcaseSeo";
import {
  buildShowcasePresentation,
  type ShowcaseFilters,
  type ShowcaseProduct,
  useShowcaseCatalog,
} from "@/lib/showcase";
import { Skeleton } from "@/components/ui/skeleton";

const DEFAULT_FILTERS: ShowcaseFilters = {
  query: "",
  types: [],
  category: "",
  price: "all",
  level: "",
  sort: "launch",
};

/**
 * Simulação local de catálogo maior (?simCatalog=6).
 * Só ativa em DEV — nunca injeta produtos fictícios em produção.
 */
function useLocalCatalogSimulation(products: ShowcaseProduct[]) {
  return useMemo(() => {
    if (!import.meta.env.DEV) return products;
    if (typeof window === "undefined") return products;
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("simCatalog");
    if (!raw) return products;
    const target = Number(raw);
    if (!Number.isFinite(target) || target <= products.length) return products;

    const extras: ShowcaseProduct[] = [];
    let i = 0;
    while (products.length + extras.length < target) {
      const base = products[i % products.length];
      const n = extras.length + 1;
      extras.push({
        ...base,
        id: `sim:${base.slug}:${n}`,
        slug: `${base.slug}-sim-${n}`,
        name: `${base.name} (sim ${n})`,
        collections: [...base.collections],
        source: "provisional",
        seoTitle: undefined,
      });
      i += 1;
    }
    return [...products, ...extras];
  }, [products]);
}

export default function Explore() {
  const [filters, setFilters] = useState<ShowcaseFilters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<ShowcaseProduct | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { all, filtered, categories, levels, isLoading } =
    useShowcaseCatalog(filters);

  const catalog = useLocalCatalogSimulation(all);

  const presentation = useMemo(
    () => buildShowcasePresentation(catalog, { heroSlug: "desacelere" }),
    [catalog]
  );

  const hasActiveFilters =
    Boolean(filters.query.trim()) ||
    filters.types.length > 0 ||
    Boolean(filters.category) ||
    filters.price !== "all" ||
    Boolean(filters.level);

  const openDetails = (product: ShowcaseProduct) => {
    setSelected(product);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background cf-showcase-page">
      <ShowcaseSeo
        title="Explorar | ContentFy"
        description="Explore conteúdos cuidadosamente desenvolvidos para transformar conhecimento em ação."
        path="/explorar"
      />
      <PublicHeader />

      <main className="flex-1 space-y-10 lg:space-y-14 pb-16">
        {isLoading && (
          <div className="container pt-8 space-y-4">
            <Skeleton className="h-[50vh] w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </div>
        )}

        {!isLoading && presentation.heroProduct && (
          <ShowcaseHero
            product={presentation.heroProduct}
            onDetails={openDetails}
          />
        )}

        <section className="container text-center max-w-3xl mx-auto px-4 scroll-mt-[6.5rem]">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
            Conhecimento para cada momento da sua jornada.
          </h2>
          <p className="text-muted-foreground">
            Explore conteúdos cuidadosamente desenvolvidos para transformar
            conhecimento em ação.
          </p>
        </section>

        <ShowcaseDiscoveryBar
          filters={filters}
          onChange={setFilters}
          categories={categories}
          levels={levels}
        />

        {hasActiveFilters ? (
          <section className="container scroll-mt-[6.5rem]" aria-live="polite">
            <h2 className="text-xl font-semibold mb-4">Resultados</h2>
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.08] bg-[#0f1522] p-10 text-center">
                <p className="text-lg font-medium mb-1">
                  Nenhum produto encontrado para estes filtros.
                </p>
                <p className="text-sm text-muted-foreground">
                  Ajuste a busca ou limpe os filtros para continuar explorando.
                </p>
              </div>
            ) : (
              <div
                className={
                  filtered.length < 6
                    ? "grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
                    : "flex flex-wrap gap-4 justify-center sm:justify-start"
                }
              >
                {filtered.map((product) => (
                  <ProductShowcaseCard
                    key={product.slug}
                    product={product}
                    onDetails={openDetails}
                    variant={filtered.length < 6 ? "large" : "standard"}
                  />
                ))}
              </div>
            )}
          </section>
        ) : (
          <div className="space-y-10 lg:space-y-12">
            {presentation.mode === "initial" && (
              <FirstLaunchesSection
                products={presentation.firstLaunches}
                onDetails={openDetails}
              />
            )}

            {presentation.rails.map((r) => (
              <ShowcaseRail
                key={r.id}
                title={r.title}
                subtitle={r.subtitle}
                products={r.products}
                onDetails={openDetails}
                cardVariant={r.cardVariant}
              />
            ))}
          </div>
        )}
      </main>

      <ProductDetailModal
        product={selected}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
      <PublicFooter />
    </div>
  );
}
