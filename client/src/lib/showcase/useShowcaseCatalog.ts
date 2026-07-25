import { trpc } from "@/lib/trpc";
import { useMemo } from "react";
import {
  filterShowcaseProducts,
  getRailProducts,
  getShowcaseProductBySlug,
  getVisibleShowcaseProducts,
  mergeShowcaseCatalog,
  type DbCategoryLike,
  type DbProductLike,
} from "./catalog";
import type { ShowcaseFilters } from "./types";

const defaultFilters: ShowcaseFilters = {
  query: "",
  types: [],
  category: "",
  price: "all",
  level: "",
  sort: "launch",
};

export function useShowcaseCatalog(filters?: Partial<ShowcaseFilters>) {
  const productsQuery = trpc.products.list.useQuery();
  const categoriesQuery = trpc.products.listCategories.useQuery();

  const merged = useMemo(() => {
    const dbProducts = (productsQuery.data || []) as unknown as DbProductLike[];
    const categories = (categoriesQuery.data || []) as unknown as DbCategoryLike[];
    return mergeShowcaseCatalog(dbProducts, categories);
  }, [productsQuery.data, categoriesQuery.data]);

  const activeFilters: ShowcaseFilters = {
    ...defaultFilters,
    ...filters,
  };

  const visible = useMemo(
    () => getVisibleShowcaseProducts(merged),
    [merged]
  );

  const filtered = useMemo(
    () => filterShowcaseProducts(merged, activeFilters),
    [merged, activeFilters]
  );

  const categories = useMemo(() => {
    const set = new Set(visible.map((p) => p.category).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [visible]);

  const levels = useMemo(() => {
    const set = new Set(
      visible.map((p) => p.level).filter((v): v is string => Boolean(v))
    );
    return Array.from(set);
  }, [visible]);

  return {
    all: merged,
    visible,
    filtered,
    categories,
    levels,
    isLoading: productsQuery.isLoading || categoriesQuery.isLoading,
    isError: productsQuery.isError || categoriesQuery.isError,
    getBySlug: (slug: string) => getShowcaseProductBySlug(merged, slug),
    rail: (id: Parameters<typeof getRailProducts>[1]) =>
      getRailProducts(merged, id),
  };
}
