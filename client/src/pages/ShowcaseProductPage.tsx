import { Link, useParams } from "wouter";
import { Shield, Zap, MonitorSmartphone, RefreshCw } from "lucide-react";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import ShowcaseSeo from "@/components/showcase/ShowcaseSeo";
import { badgesForProduct, ShowcaseBadgePill } from "@/components/showcase/ShowcaseBadge";
import ProductShowcaseCard from "@/components/showcase/ProductShowcaseCard";
import {
  checkoutHref,
  formatShowcasePrice,
  isComingSoonCommerce,
  resolveProductImage,
  useShowcaseCatalog,
} from "@/lib/showcase";
import ProductCoverMedia from "@/components/showcase/ProductCoverMedia";
import ProductGallery from "@/components/showcase/ProductGallery";
import { DesacelereProductGallery } from "@/components/showcase/DesacelereProductGallery";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, type ReactNode } from "react";
import { trpc } from "@/lib/trpc";
import { DiscoveryRail } from "@/components/discovery";
import { ProductDnaPanel, SkillMap } from "@/components/phoenix";
import {
  formatDnaDuration,
  resolveContentfyDna,
} from "@shared/contentfy";
import { cn } from "@/lib/utils";

export default function ShowcaseProductPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const { getBySlug, visible, isLoading } = useShowcaseCatalog();
  const product = getBySlug(slug);
  const image = product ? resolveProductImage(product) : null;
  const track = trpc.discovery.track.useMutation();
  const { data: discoveryRelated } = trpc.discovery.related.useQuery(
    { slug },
    { enabled: Boolean(slug) }
  );

  useEffect(() => {
    if (!slug) return;
    track.mutate({
      eventType: "view",
      productSlug: slug,
      category: product?.category,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (!product || !image) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = image;
    if (product.imageSrcSet) {
      link.setAttribute("imagesrcset", product.imageSrcSet);
    }
    if (product.imageSizes) {
      link.setAttribute("imagesizes", product.imageSizes);
    }
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, [product, image]);

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

  const isDesacelere = product.slug === "desacelere";
  const comingSoon = isComingSoonCommerce(product);
  const price = formatShowcasePrice(
    product.isPublished ? product.priceCents : null
  );
  const dbCheckoutReady =
    !comingSoon &&
    product.isPublished &&
    product.priceCents != null &&
    product.source === "database";

  /**
   * Desacelere (provisional): CTA principal abre a página de vendas existente
   * — checkout Stripe exige produto ativo no banco + login.
   */
  const primaryCtaHref = dbCheckoutReady
    ? checkoutHref(product)
    : product.salesPageUrl || null;
  const canPurchase = Boolean(primaryCtaHref) && !comingSoon;
  const secondarySalesHref =
    product.salesPageUrl && product.salesPageUrl !== primaryCtaHref
      ? product.salesPageUrl
      : isDesacelere
        ? null
        : product.salesPageUrl && !canPurchase
          ? product.salesPageUrl
          : null;
  /** Quando o primary já é a sales page, oferecer CTA secundário útil. */
  const secondaryHref =
    secondarySalesHref ||
    (isDesacelere && primaryCtaHref === product.salesPageUrl
      ? "#galeria"
      : null);
  const secondaryLabel =
    secondarySalesHref || (!isDesacelere && product.salesPageUrl)
      ? "Ver página de vendas"
      : secondaryHref === "#galeria"
        ? "Ver amostra"
        : null;

  const dna = resolveContentfyDna(product.slug, {
    category: product.category,
    name: product.name,
    typeLabel: product.typeLabel,
  });
  const dnaDuration = formatDnaDuration(dna.estimatedHours);
  const gallery = product.galleryImages?.length
    ? product.galleryImages
    : image
      ? [
          {
            src: image,
            alt: product.name,
            fit: product.imageFit || ("cover" as const),
          },
        ]
      : [];

  const related = visible
    .filter((p) => p.slug !== product.slug)
    .filter(
      (p) =>
        p.category === product.category ||
        p.collections.some((c) => product.collections.includes(c))
    )
    .slice(0, 6);

  const displayPrice =
    price ||
    (isDesacelere && product.priceCents != null
      ? formatShowcasePrice(product.priceCents)
      : null);
  const guaranteeDays = product.guaranteeDays ?? (isDesacelere ? 30 : null);

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
        image={image ?? undefined}
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
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/55" />
          <div
            className={cn(
              "container relative z-10",
              "py-10 sm:py-12 lg:py-14",
              "grid gap-8 lg:gap-10",
              isDesacelere
                ? "lg:grid-cols-[minmax(340px,420px)_1fr] lg:items-center"
                : "lg:grid-cols-[minmax(280px,340px)_1fr] lg:items-center"
            )}
          >
            <div
              className={cn(
                "cf-pdp-mockup mx-auto w-full lg:max-w-none",
                "rounded-2xl overflow-hidden border border-white/10 bg-[#070b12]",
                "aspect-[3/4]",
                "shadow-[0_28px_64px_rgba(0,0,0,0.55)]",
                "transition-transform duration-200 ease-out",
                "motion-safe:hover:-translate-y-1",
                isDesacelere
                  ? "max-w-[360px] sm:max-w-[390px] shadow-[0_32px_72px_rgba(0,0,0,0.58)] motion-safe:hover:-translate-y-1.5"
                  : "max-w-[300px] sm:max-w-[320px]"
              )}
            >
              <ProductCoverMedia
                product={product}
                priority
                prefer="cover"
                fit="contain"
              />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {badgesForProduct(product, 2).map((id) => (
                  <ShowcaseBadgePill key={id} id={id} />
                ))}
                {!comingSoon && (
                  <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300/95">
                    Disponível agora
                  </span>
                )}
              </div>

              <p className="text-sm text-orange-300/90 mb-2">
                {isDesacelere
                  ? "E-book • Bem-estar e desenvolvimento pessoal"
                  : `${product.typeLabel} · ${product.category}`}
              </p>

              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-tight mb-3 text-balance leading-[1.12]">
                {product.name}
              </h1>

              {(product.slogan || (!isDesacelere && dna.transformation)) && (
                <p className="text-lg sm:text-xl text-foreground/90 mb-3 max-w-2xl leading-snug">
                  {product.slogan || dna.transformation}
                </p>
              )}

              <p className="text-muted-foreground leading-relaxed max-w-2xl mb-5">
                {product.description || product.shortDescription}
              </p>

              {!isDesacelere && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {dna.competencies
                    .filter((c) => c.phase === "acquired")
                    .slice(0, 5)
                    .map((c) => (
                      <span
                        key={c.id}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-foreground/85"
                      >
                        {c.name}
                      </span>
                    ))}
                  {dna.levelLabel ? (
                    <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-muted-foreground">
                      {dna.levelLabel}
                    </span>
                  ) : null}
                  {dnaDuration ? (
                    <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-muted-foreground">
                      {dnaDuration}
                    </span>
                  ) : null}
                </div>
              )}

              {/* Oferta comercial */}
              <div
                className={cn(
                  "rounded-2xl border border-white/10 bg-background/45 backdrop-blur-sm mb-5 max-w-xl",
                  isDesacelere
                    ? "px-5 py-6 sm:px-7 sm:py-7 border-white/[0.12] bg-gradient-to-br from-background/70 via-background/50 to-primary/[0.04]"
                    : "px-4 py-4 sm:px-5 sm:py-5"
                )}
              >
                {comingSoon ? (
                  <p className="text-sm text-muted-foreground">
                    Em preparação editorial — acompanhe em Explorar.
                  </p>
                ) : displayPrice ? (
                  <div
                    className={cn(
                      "flex flex-wrap items-end",
                      isDesacelere ? "gap-x-6 gap-y-3" : "gap-x-4 gap-y-2"
                    )}
                  >
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
                        Investimento
                      </p>
                      <p
                        className={cn(
                          "font-semibold tracking-tight tabular-nums",
                          isDesacelere
                            ? "text-4xl sm:text-[2.75rem] leading-none text-foreground"
                            : "text-3xl sm:text-[2rem] text-foreground"
                        )}
                      >
                        {displayPrice}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "pb-0.5 space-y-1 text-sm text-muted-foreground",
                        isDesacelere && "leading-relaxed"
                      )}
                    >
                      <p>Pagamento único</p>
                      <p>Acesso imediato</p>
                      {guaranteeDays != null ? (
                        <p>Garantia de {guaranteeDays} dias</p>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Consulte disponibilidade na página de vendas.
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center">
                {canPurchase && primaryCtaHref ? (
                  <Button
                    asChild
                    size="lg"
                    className={cn(
                      "h-12 min-h-[48px] px-6 text-base font-semibold",
                      "bg-gradient-owl text-white border-0",
                      "transition-[transform,opacity] duration-200 ease-out",
                      "motion-safe:hover:-translate-y-0.5 hover:opacity-95",
                      "focus-visible:ring-2 focus-visible:ring-primary/70"
                    )}
                  >
                    <Link href={primaryCtaHref}>Comprar agora</Link>
                  </Button>
                ) : comingSoon && !isDesacelere ? (
                  <Button size="lg" disabled className="h-12 min-h-[48px] px-6">
                    Em breve
                  </Button>
                ) : null}

                {secondaryHref && secondaryLabel ? (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className={cn(
                      "h-12 min-h-[48px] px-6",
                      "transition-[transform,opacity,background-color,border-color,color] duration-200 ease-out",
                      "motion-safe:hover:-translate-y-0.5",
                      isDesacelere &&
                        "border-white/25 bg-white/[0.04] text-foreground hover:bg-white/[0.08] hover:border-primary/45 hover:text-foreground"
                    )}
                  >
                    {secondaryHref.startsWith("#") ? (
                      <a href={secondaryHref}>{secondaryLabel}</a>
                    ) : (
                      <Link href={secondaryHref}>{secondaryLabel}</Link>
                    )}
                  </Button>
                ) : product.salesPageUrl &&
                  comingSoon &&
                  !isDesacelere ? (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-12 min-h-[48px] px-6"
                  >
                    <Link href={product.salesPageUrl}>Ver página de vendas</Link>
                  </Button>
                ) : null}
              </div>

              {!comingSoon && (
                <ul
                  className={cn(
                    "mt-6 text-xs sm:text-sm text-muted-foreground",
                    isDesacelere
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5"
                      : "flex flex-wrap gap-x-5 gap-y-2.5"
                  )}
                  aria-label="Benefícios de confiança"
                >
                  <TrustItem
                    icon={Shield}
                    label="Garantia de 30 dias"
                    premium={isDesacelere}
                  />
                  <TrustItem
                    icon={Zap}
                    label="Acesso imediato"
                    premium={isDesacelere}
                  />
                  <TrustItem
                    icon={MonitorSmartphone}
                    label="Leitura em qualquer dispositivo"
                    premium={isDesacelere}
                  />
                  {isDesacelere ? (
                    <TrustItem
                      icon={RefreshCw}
                      label="Atualizações incluídas"
                      premium
                    />
                  ) : null}
                </ul>
              )}
            </div>
          </div>
        </section>

        <div className="container py-10 sm:py-12 space-y-12 max-w-5xl">
          {(isDesacelere || gallery.length > 0) && (
            <section id="galeria" aria-labelledby="galeria-title">
              <h2 id="galeria-title" className="text-xl font-semibold mb-4">
                Galeria do produto
              </h2>
              {isDesacelere && product.coverImage ? (
                <DesacelereProductGallery
                  mockupSrc={product.coverImage}
                  coverSrc={
                    product.heroImage ||
                    product.landscapeImage ||
                    product.coverImage
                  }
                />
              ) : (
                <ProductGallery
                  images={gallery}
                  productName={product.name}
                />
              )}
            </section>
          )}

          <ProductDnaPanel
            productSlug={product.slug}
            category={product.category}
            name={product.name}
            typeLabel={product.typeLabel}
            dna={dna}
          />

          <SkillMap
            productSlug={product.slug}
            category={product.category}
            name={product.name}
            typeLabel={product.typeLabel}
            dna={dna}
          />

          {dna.journeys.length > 0 ? (
            <Section title="Roadmap da jornada">
              <ol className="space-y-3">
                {dna.journeys.map((step, i) => (
                  <li
                    key={step}
                    className="flex gap-3 rounded-xl border border-white/10 bg-[#0f1522]/70 px-4 py-3"
                  >
                    <span className="text-xs tabular-nums text-muted-foreground pt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-medium">{step}</span>
                  </li>
                ))}
              </ol>
            </Section>
          ) : null}

          {product.benefits?.length ? (
            <Section title="O que será desenvolvido">
              <ul className="grid gap-2 sm:grid-cols-2">
                {product.benefits.map((b) => (
                  <li
                    key={b}
                    className="rounded-xl border border-white/10 bg-[#0f1522]/50 px-4 py-3 text-sm text-muted-foreground"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {product.audience?.length ? (
            <Section title="Para quem é esta transformação">
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {product.audience.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </Section>
          ) : null}

          {product.included?.length ? (
            <Section title="O que está incluso">
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {product.included.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </Section>
          ) : null}

          {product.author ? (
            <Section title="Autor">
              <p className="text-muted-foreground text-lg">{product.author}</p>
            </Section>
          ) : null}

          {guaranteeDays != null && !comingSoon ? (
            <Section title="Garantia">
              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                Garantia de {guaranteeDays} dias — confiança para experimentar a
                jornada com tranquilidade, conforme a política do produto.
              </p>
            </Section>
          ) : null}

          <Section title="Perguntas frequentes">
            <div className="space-y-3 text-sm">
              {isDesacelere ? (
                <>
                  <Faq
                    q="Como recebo o acesso?"
                    a="Após a confirmação do pagamento, o e-book fica disponível imediatamente na sua biblioteca ContentFy e pode ser lido em qualquer dispositivo."
                  />
                  <Faq
                    q="A garantia cobre o quê?"
                    a="Você tem 30 dias para avaliar o conteúdo. Se não fizer sentido para o seu momento, fale com o suporte conforme a política do produto."
                  />
                </>
              ) : (
                <>
                  <Faq
                    q="Quando o produto fica disponível para compra?"
                    a="Assim que preço, conteúdo e arquivos forem confirmados e o status de publicação for ativado no painel."
                  />
                  <Faq
                    q="Onde acesso após a compra?"
                    a="No Centro de Evolução e em Minha Biblioteca, após a confirmação do pagamento."
                  />
                </>
              )}
            </div>
          </Section>
        </div>

        {discoveryRelated && discoveryRelated.length > 0 ? (
          <DiscoveryRail
            title="Recomendações nesta jornada"
            subtitle="Relacionamentos do ContentFy Discovery"
            items={discoveryRelated}
          />
        ) : related.length > 0 ? (
          <section className="container pb-8">
            <h2 className="text-xl font-semibold mb-4">
              Recomendações nesta jornada
            </h2>
            <div className="flex flex-wrap gap-4">
              {related.map((p) => (
                <ProductShowcaseCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <PublicFooter />
    </div>
  );
}

function TrustItem({
  icon: Icon,
  label,
  premium = false,
}: {
  icon: typeof Shield;
  label: string;
  premium?: boolean;
}) {
  return (
    <li
      className={cn(
        "inline-flex items-center gap-2",
        premium &&
          "rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 sm:px-3.5"
      )}
    >
      <Icon
        className={cn(
          "shrink-0 text-primary/80",
          premium ? "h-4 w-4" : "h-3.5 w-3.5"
        )}
        aria-hidden
      />
      <span className={cn(premium && "text-foreground/85 leading-snug")}>
        {label}
      </span>
    </li>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
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
    <div className="rounded-xl border border-white/15 bg-[#0f1522] p-4 text-slate-100">
      <p className="font-medium mb-1 text-white">{q}</p>
      <p className="text-slate-200 leading-relaxed">{a}</p>
    </div>
  );
}
