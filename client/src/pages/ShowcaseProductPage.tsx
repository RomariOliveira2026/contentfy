import { Link, useParams } from "wouter";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import ShowcaseSeo from "@/components/showcase/ShowcaseSeo";
import { badgesForProduct, ShowcaseBadgePill } from "@/components/showcase/ShowcaseBadge";
import ProductShowcaseCard from "@/components/showcase/ProductShowcaseCard";
import {
  checkoutHref,
  formatShowcasePrice,
  useShowcaseCatalog,
} from "@/lib/showcase";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";

export default function ShowcaseProductPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const { getBySlug, visible, isLoading } = useShowcaseCatalog();
  const product = getBySlug(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <div className="container py-10 space-y-4">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
        <PublicFooter />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-1 container py-20 text-center">
          <h1 className="text-2xl font-bold mb-3">Produto não encontrado</h1>
          <p className="text-muted-foreground mb-6">
            Este conteúdo pode estar indisponível ou ainda em preparação.
          </p>
          <Button asChild>
            <Link href="/explorar">Voltar para Explorar</Link>
          </Button>
        </main>
        <PublicFooter />
      </div>
    );
  }

  const price = formatShowcasePrice(
    product.isPublished ? product.priceCents : null
  );
  const canBuy = product.isPublished && product.priceCents != null;
  const image =
    product.heroImage || product.landscapeImage || product.coverImage;
  const related = visible
    .filter((p) => p.slug !== product.slug)
    .filter(
      (p) =>
        p.category === product.category ||
        p.collections.some((c) => product.collections.includes(c))
    )
    .slice(0, 6);

  const jsonLd =
    product.isPublished && product.priceCents != null
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.shortDescription || product.description,
          image: image ? [image] : undefined,
          brand: { "@type": "Brand", name: "ContentFy" },
          offers: {
            "@type": "Offer",
            url: `https://contentfy.com.br/produto/${product.slug}`,
            priceCurrency: "BRL",
            price: (product.priceCents / 100).toFixed(2),
            availability: "https://schema.org/InStock",
          },
        }
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ShowcaseSeo
        title={product.seoTitle || `${product.name} | ContentFy`}
        description={
          product.seoDescription ||
          product.shortDescription ||
          `Conheça ${product.name} na ContentFy.`
        }
        path={`/produto/${product.slug}`}
        image={image}
        noIndex={!product.isPublished}
        productJsonLd={jsonLd}
      />
      <PublicHeader />

      <main className="flex-1 pb-16">
        <section className="relative overflow-hidden border-b border-white/[0.06]">
          {image && (
            <img
              src={image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-35"
              fetchPriority="high"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
          <div className="container relative z-10 py-12 lg:py-16 grid lg:grid-cols-[280px_1fr] gap-8 items-start">
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#111827] aspect-[3/4] max-w-[280px]">
              {product.coverImage || image ? (
                <img
                  src={product.coverImage || image}
                  alt={`Capa de ${product.name}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-white/20" />
                </div>
              )}
            </div>
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {badgesForProduct(product).map((id) => (
                  <ShowcaseBadgePill key={id} id={id} />
                ))}
              </div>
              <p className="text-sm text-orange-300/90 mb-2">
                {product.typeLabel} · {product.category}
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">
                {product.name}
              </h1>
              {product.slogan && (
                <p className="text-xl text-foreground/90 mb-3">{product.slogan}</p>
              )}
              <p className="text-muted-foreground leading-relaxed max-w-2xl mb-6">
                {product.description || product.shortDescription}
              </p>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {price ? (
                  <p className="text-2xl font-bold text-primary">{price}</p>
                ) : (
                  <p className="text-sm text-amber-200/90">
                    Preço será definido na publicação oficial
                  </p>
                )}
                {product.guaranteeDays != null && product.isPublished && (
                  <p className="text-sm text-muted-foreground">
                    Garantia de {product.guaranteeDays} dias
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5">
                {canBuy ? (
                  <Button asChild size="lg">
                    <Link href={checkoutHref(product)}>Comprar agora</Link>
                  </Button>
                ) : (
                  <Button size="lg" disabled>
                    Compra disponível após publicação
                  </Button>
                )}
                {product.salesPageUrl && (
                  <Button asChild size="lg" variant="outline">
                    <Link href={product.salesPageUrl}>Ver página de vendas</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="container py-12 space-y-10 max-w-4xl">
          {product.benefits?.length ? (
            <Section title="Proposta de valor / Benefícios">
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {product.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </Section>
          ) : null}

          {product.audience?.length ? (
            <Section title="Para quem é">
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {product.audience.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </Section>
          ) : null}

          {product.included?.length ? (
            <Section title="Conteúdo">
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {product.included.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </Section>
          ) : null}

          {product.author ? (
            <Section title="Autor">
              <p className="text-muted-foreground">{product.author}</p>
            </Section>
          ) : null}

          {/* Depoimentos: ocultos sem dados reais */}
          {product.guaranteeDays != null && product.isPublished ? (
            <Section title="Garantia">
              <p className="text-muted-foreground">
                Garantia de {product.guaranteeDays} dias conforme a política do
                produto.
              </p>
            </Section>
          ) : null}

          <Section title="FAQ">
            <div className="space-y-3 text-sm">
              <Faq
                q="Quando o produto fica disponível para compra?"
                a="Assim que preço, conteúdo e arquivos forem confirmados e o status de publicação for ativado no painel."
              />
              <Faq
                q="Onde acesso após a compra?"
                a="Na área do aluno, em Minha Biblioteca, após a confirmação do pagamento."
              />
            </div>
          </Section>
        </div>

        {related.length > 0 && (
          <section className="container pb-8">
            <h2 className="text-xl font-semibold mb-4">Produtos relacionados</h2>
            <div className="flex flex-wrap gap-4">
              {related.map((p) => (
                <ProductShowcaseCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      {children}
    </section>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0f1522] p-4">
      <p className="font-medium mb-1">{q}</p>
      <p className="text-muted-foreground">{a}</p>
    </div>
  );
}
