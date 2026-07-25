import type { ShowcaseProduct } from "@/lib/showcase";
import ProductShowcaseCard from "./ProductShowcaseCard";

interface FirstLaunchesSectionProps {
  products: ShowcaseProduct[];
  onDetails?: (product: ShowcaseProduct) => void;
}

/**
 * Seção do modo catálogo inicial — cards grandes, largura limitada, sem trilhos vazios.
 */
export default function FirstLaunchesSection({
  products,
  onDetails,
}: FirstLaunchesSectionProps) {
  if (!products.length) return null;

  const cols =
    products.length === 1
      ? "grid-cols-1 max-w-2xl mx-auto"
      : "grid-cols-1 md:grid-cols-2";

  return (
    <section
      className="container max-w-6xl"
      aria-labelledby="primeiros-lancamentos-title"
    >
      <div className="mb-6 sm:mb-8 max-w-2xl">
        <h2
          id="primeiros-lancamentos-title"
          className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground"
        >
          Primeiros lançamentos
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">
          Conheça os primeiros conteúdos selecionados para inaugurar a
          experiência ContentFy.
        </p>
      </div>

      <div className={`grid gap-6 lg:gap-8 ${cols}`}>
        {products.map((product, index) => (
          <ProductShowcaseCard
            key={product.slug}
            product={product}
            onDetails={onDetails}
            priority={index < 2}
            variant={products.length <= 2 ? "featured" : "large"}
          />
        ))}
      </div>
    </section>
  );
}
