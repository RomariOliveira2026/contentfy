import { DiscoveryRail } from "./DiscoveryRail";
import type { DiscoveryCardData } from "./DiscoveryCard";

interface MyListProps {
  items: DiscoveryCardData[];
  onFavoriteToggle?: (slug: string) => void;
  favorites?: Set<string> | string[];
}

export function MyList({ items, onFavoriteToggle, favorites }: MyListProps) {
  if (!items.length) {
    return (
      <section className="container py-10 text-center" aria-label="Minha Lista">
        <h2 className="text-xl font-semibold">Minha Lista</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          Salve produtos com o coração para montar sua lista personalizada.
        </p>
      </section>
    );
  }

  return (
    <DiscoveryRail
      title="Minha Lista"
      subtitle="Salvos por você"
      items={items}
      onFavoriteToggle={onFavoriteToggle}
      favorites={favorites}
    />
  );
}
