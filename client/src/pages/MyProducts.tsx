import type { ReactNode } from "react";
import { Link } from "wouter";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedSection from "@/components/AnimatedSection";
import { TdahCover } from "@/pages/library/TdahCover";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BookOpen,
  Check,
  Circle,
  Clock3,
  Compass,
  Flame,
  History,
  Library,
  Play,
  RotateCcw,
  Star,
  Trophy,
} from "lucide-react";

const DESACELERE_COVER = "/products/desacelere/mockup-kit.webp";

type LibraryProduct = {
  id: number;
  name: string;
  type: "course" | "ebook";
  description: string;
  actionLabel: string;
  href: string;
  progress: number;
  progressDetail: string;
  lastAccess: string;
  cover: "tdah" | "desacelere";
  /** Curso */
  currentModule?: string;
  timeRemaining?: string;
  /** E-book */
  currentPage?: string;
};

const libraryProducts: LibraryProduct[] = [
  {
    id: 1,
    name: "Dominando o TDAH",
    type: "course",
    description:
      "Técnicas práticas para foco, organização e produtividade no dia a dia.",
    actionLabel: "Continuar",
    href: "/my-account/course/1",
    progress: 42,
    progressDetail: "3 de 7 módulos",
    lastAccess: "Há 2 dias",
    currentModule: "Módulo 3 · Foco e rotina",
    timeRemaining: "~2h 40min",
    cover: "tdah",
  },
  {
    id: 2,
    name: "Desacelere",
    type: "ebook",
    description:
      "Guia para recuperar presença, reduzir o ritmo e construir uma rotina mais equilibrada.",
    actionLabel: "Continuar leitura",
    href: "/my-account/product/2",
    progress: 18,
    progressDetail: "Leitura iniciada",
    lastAccess: "Hoje",
    currentPage: "Página 32 de 168",
    cover: "desacelere",
  },
];

const continueRail = [
  {
    id: "last",
    title: "Último conteúdo aberto",
    subtitle: "Dominando o TDAH · Módulo 3",
    href: "/my-account/course/1",
    icon: History,
  },
  {
    id: "rec",
    title: "Recomendado para você",
    subtitle: "Desacelere · Cap. 2",
    href: "/my-account/product/2",
    icon: Compass,
  },
  {
    id: "resume",
    title: "Continue de onde parou",
    subtitle: "Retome com um clique",
    href: "/my-account/course/1",
    icon: RotateCcw,
  },
];

const recentActivity = [
  {
    day: "Hoje",
    items: [
      {
        id: "a1",
        product: "Desacelere",
        detail: "Capítulo 2",
        when: "há 15 minutos",
      },
    ],
  },
  {
    day: "Ontem",
    items: [
      {
        id: "a2",
        product: "Dominando o TDAH",
        detail: "Módulo 3",
        when: "há 2 dias",
      },
    ],
  },
];

const comingSoon = [
  "Manual do Representante 4.0",
  "Arquitetura da Prosperidade",
  "Código da Comunicação",
];

const achievements = [
  { icon: Trophy, label: "Primeira leitura concluída" },
  { icon: Flame, label: "18% da biblioteca concluída" },
  { icon: BookOpen, label: "2 conteúdos adquiridos" },
];

function typeLabel(type: LibraryProduct["type"]) {
  return type === "course" ? "Curso" : "E-book";
}

function overallProgress(products: LibraryProduct[]) {
  if (!products.length) return 0;
  return Math.round(
    products.reduce((sum, p) => sum + p.progress, 0) / products.length
  );
}

export default function MyProducts() {
  const hasProducts = libraryProducts.length > 0;
  const overall = overallProgress(libraryProducts);

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="cf-page-main">
        <div className="container max-w-6xl space-y-8 lg:space-y-10">
          <PageHeader
            title="Minha Biblioteca"
            subtitle="Seu conteúdo adquirido, pronto para continuar"
            icon={<Library className="w-6 h-6 text-primary" />}
          />

          {hasProducts ? (
            <>
              {/* 1. Hero Premium */}
              <AnimatedSection>
                <section
                  aria-label="Continue sua jornada"
                  className={cn(
                    "relative overflow-hidden rounded-[1.4rem]",
                    "border border-white/[0.09]",
                    "bg-gradient-to-br from-white/[0.05] via-background/30 to-transparent",
                    "backdrop-blur-2xl",
                    "shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_28px_64px_rgba(0,0,0,0.3)]",
                    "px-5 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-9",
                    "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-500"
                  )}
                >
                  {/* Glow oficial — quase imperceptível */}
                  <div
                    className="pointer-events-none absolute -top-28 left-[10%] h-72 w-72 rounded-full bg-[#f97316]/[0.11] blur-[90px]"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute top-1/3 -right-16 h-64 w-64 rounded-full bg-[#ef4444]/[0.08] blur-[100px]"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute -bottom-24 left-1/3 h-60 w-60 rounded-full bg-[#3b82f6]/[0.09] blur-[95px]"
                    aria-hidden
                  />
                  {/* Grain / noise */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                    }}
                    aria-hidden
                  />

                  <div className="relative flex flex-col lg:flex-row lg:items-end gap-7 lg:gap-12">
                    <div className="flex-1 min-w-0 max-w-xl">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        ContentFy · Biblioteca
                      </p>
                      <h2 className="text-2xl sm:text-3xl lg:text-[2.1rem] font-semibold tracking-tight mt-2.5 text-balance">
                        Bem-vindo de volta.
                      </h2>
                      <p className="text-sm sm:text-[0.95rem] text-muted-foreground mt-3 leading-relaxed max-w-md">
                        Você já iniciou sua jornada. Continue exatamente de onde
                        parou.
                      </p>
                    </div>

                    <dl className="grid grid-cols-3 gap-3 sm:gap-3.5 w-full lg:w-auto lg:min-w-[26rem]">
                      <MetricWidget
                        label="Progresso"
                        value={`${overall}%`}
                        hint="geral"
                        emphasize
                      />
                      <MetricWidget
                        label="Conteúdos"
                        value={String(libraryProducts.length)}
                        hint="adquiridos"
                      />
                      <MetricWidget
                        label="Status"
                        value="Ativo"
                        hint="em evolução"
                      />
                    </dl>
                  </div>
                </section>
              </AnimatedSection>

              {/* Continue aprendendo */}
              <section aria-label="Continue aprendendo">
                <SectionHeading eyebrow="Ecossistema" title="Continue aprendendo" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {continueRail.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <AnimatedSection key={item.id} delay={0.04 + index * 0.04}>
                        <Link href={item.href}>
                          <a
                            className={cn(
                              "group flex items-center gap-3 rounded-2xl border border-border/45",
                              "bg-card/35 backdrop-blur-sm px-4 py-4 h-full cursor-pointer",
                              "shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
                              "transition-[transform,box-shadow,border-color,background-color] duration-[220ms] ease-out",
                              "motion-safe:hover:-translate-y-0.5",
                              "hover:border-primary/35 hover:bg-card/60",
                              "hover:shadow-[0_0_0_1px_rgba(249,115,22,0.12),0_16px_36px_rgba(0,0,0,0.18)]",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/55"
                            )}
                          >
                            <div className="h-10 w-10 rounded-xl border border-primary/20 bg-primary/[0.08] flex items-center justify-center shrink-0">
                              <Icon className="h-4 w-4 text-primary" aria-hidden />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium leading-snug truncate">
                                {item.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                {item.subtitle}
                              </p>
                            </div>
                            <ArrowRight
                              className="h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-[220ms] motion-safe:group-hover:translate-x-0.5 group-hover:text-primary"
                              aria-hidden
                            />
                          </a>
                        </Link>
                      </AnimatedSection>
                    );
                  })}
                </div>
              </section>

              {/* Produtos */}
              <section aria-label="Conteúdos adquiridos">
                <SectionHeading eyebrow="Biblioteca" title="Seus conteúdos" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
                  {libraryProducts.map((product, index) => (
                    <AnimatedSection key={product.id} delay={index * 0.05}>
                      <LibraryCard product={product} />
                    </AnimatedSection>
                  ))}
                </div>
              </section>

              {/* Atividade recente */}
              <section aria-label="Atividade recente">
                <SectionHeading eyebrow="Histórico" title="Atividade recente" />
                <div
                  className={cn(
                    "rounded-2xl border border-border/45 bg-card/30 backdrop-blur-sm",
                    "px-5 py-5 sm:px-6 sm:py-6",
                    "shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
                    "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-500"
                  )}
                >
                  <ol className="space-y-6">
                    {recentActivity.map((group) => (
                      <li key={group.day}>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
                          {group.day}
                        </p>
                        <ul className="space-y-3 border-l border-border/50 pl-4 ml-1">
                          {group.items.map((item) => (
                            <li key={item.id} className="relative">
                              <span
                                className="absolute -left-[1.3rem] top-1.5 h-2 w-2 rounded-full bg-gradient-owl shadow-[0_0_10px_rgba(249,115,22,0.35)]"
                                aria-hidden
                              />
                              <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <div>
                                  <p className="text-sm font-medium">
                                    {item.product}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {item.detail}
                                  </p>
                                </div>
                                <p className="text-[11px] text-muted-foreground tabular-nums">
                                  {item.when}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>

              {/* Em breve + Conquistas */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-6 pb-2">
                <section
                  aria-label="Em breve"
                  className="lg:col-span-3 space-y-3.5"
                >
                  <SectionHeading eyebrow="Próximos" title="Em breve" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {comingSoon.map((title, i) => (
                      <AnimatedSection key={title} delay={0.03 * i}>
                        <div
                          className={cn(
                            "rounded-2xl border border-dashed border-border/55",
                            "bg-card/25 px-4 py-4 h-full",
                            "transition-[border-color,background-color,transform] duration-[220ms] ease-out",
                            "motion-safe:hover:-translate-y-0.5 hover:border-primary/25 hover:bg-card/40"
                          )}
                        >
                          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-2">
                            Em breve
                          </p>
                          <p className="text-sm font-medium leading-snug">
                            {title}
                          </p>
                        </div>
                      </AnimatedSection>
                    ))}
                  </div>
                </section>

                <section
                  aria-label="Conquistas"
                  className="lg:col-span-2 space-y-3.5"
                >
                  <SectionHeading eyebrow="Marcos" title="Conquistas" />
                  <div
                    className={cn(
                      "rounded-2xl border border-border/45",
                      "bg-gradient-to-br from-primary/[0.06] via-card/40 to-transparent",
                      "backdrop-blur-sm px-5 py-5 h-full",
                      "shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
                      "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-500"
                    )}
                  >
                    <ul className="space-y-3">
                      {achievements.map((a) => {
                        const Icon = a.icon;
                        return (
                          <li
                            key={a.label}
                            className="flex items-center gap-2.5 text-sm"
                          >
                            <span className="h-8 w-8 rounded-xl border border-primary/20 bg-background/40 flex items-center justify-center shrink-0">
                              <Icon
                                className="h-3.5 w-3.5 text-primary"
                                aria-hidden
                              />
                            </span>
                            <span className="text-foreground/90 leading-snug">
                              {a.label}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    <p className="mt-4 pt-3 border-t border-border/40 text-xs text-muted-foreground flex items-start gap-2">
                      <Star className="h-3.5 w-3.5 text-primary/80 shrink-0 mt-0.5" />
                      Continue estudando para desbloquear novas conquistas.
                    </p>
                  </div>
                </section>
              </div>
            </>
          ) : (
            <Card className="cf-card-premium py-0">
              <CardContent className="py-16 px-6 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary border border-border mb-6">
                  <Library className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Você ainda não possui produtos.
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Explore nosso catálogo e comece sua jornada de aprendizado.
                </p>
                <Link href="/explorar">
                  <Button size="lg">
                    Explorar Produtos
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-3.5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="text-lg font-medium tracking-tight mt-0.5">{title}</h2>
    </div>
  );
}

function MetricWidget({
  label,
  value,
  hint,
  emphasize,
}: {
  label: string;
  value: string;
  hint: string;
  emphasize?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.09]",
        "bg-background/40 backdrop-blur-md",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_32px_rgba(0,0,0,0.2)]",
        emphasize ? "px-3.5 py-4 sm:px-4 sm:py-5" : "px-3.5 py-3.5 sm:px-4 sm:py-4"
      )}
    >
      <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </dt>
      <dd
        className={cn(
          "font-semibold tracking-tight mt-1.5 tabular-nums leading-none",
          emphasize
            ? "text-2xl sm:text-[1.85rem] text-foreground"
            : "text-xl sm:text-2xl"
        )}
      >
        {value}
      </dd>
      <p className="text-[11px] text-muted-foreground mt-1.5">{hint}</p>
    </div>
  );
}

function LibraryCard({ product }: { product: LibraryProduct }) {
  return (
    <article
      className={cn(
        "group relative h-full overflow-hidden rounded-[1.25rem]",
        "border border-border/45 bg-card/85",
        "shadow-[0_12px_36px_rgba(0,0,0,0.16)]",
        "transition-[transform,box-shadow,border-color] duration-[220ms] ease-out",
        "motion-safe:hover:-translate-y-1",
        "hover:border-primary/30",
        "hover:shadow-[0_0_0_1px_rgba(249,115,22,0.1),0_24px_52px_rgba(0,0,0,0.26)]",
        "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-500"
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-[#070b12]">
        {product.cover === "tdah" ? (
          <TdahCover className="absolute inset-0 h-full w-full object-cover transition-transform duration-[220ms] ease-out motion-safe:group-hover:scale-[1.03]" />
        ) : (
          <img
            src={DESACELERE_COVER}
            alt={`Capa de ${product.name}`}
            width={640}
            height={360}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[center_40%] transition-transform duration-[220ms] ease-out motion-safe:group-hover:scale-[1.03]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b12]/95 via-[#070b12]/20 to-transparent" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <BadgePill>
            <Circle
              className="h-2.5 w-2.5 fill-primary text-primary"
              aria-hidden
            />
            {typeLabel(product.type)}
          </BadgePill>
          <BadgePill tone="success">
            <Check className="h-3.5 w-3.5" aria-hidden />
            Em progresso
          </BadgePill>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <h2 className="text-base sm:text-lg font-semibold tracking-tight line-clamp-2">
          {product.name}
        </h2>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Infos discretas por tipo */}
        <dl className="mt-3 grid grid-cols-1 gap-1 text-[11px] text-muted-foreground">
          <InfoRow label="Último acesso" value={product.lastAccess} />
          {product.type === "course" ? (
            <>
              <InfoRow label="Módulo atual" value={product.currentModule!} />
              <InfoRow label="Tempo restante" value={product.timeRemaining!} />
            </>
          ) : (
            <>
              <InfoRow label="Página atual" value={product.currentPage!} />
              <InfoRow label="Progresso" value={`${product.progress}%`} />
              <InfoRow label="Última leitura" value={product.lastAccess} />
            </>
          )}
        </dl>

        <div className="mt-4 space-y-2">
          <div className="flex items-end justify-between gap-3">
            <p className="text-xl font-semibold tracking-tight tabular-nums leading-none">
              {product.progress}
              <span className="text-sm font-medium text-muted-foreground">%</span>
            </p>
            <p className="text-xs text-muted-foreground text-right">
              {product.progressDetail}
            </p>
          </div>
          <div
            className="h-1.5 rounded-full bg-muted/70 overflow-hidden"
            role="progressbar"
            aria-valuenow={product.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progresso ${product.progress}%`}
          >
            <div
              className="h-full rounded-full bg-gradient-owl transition-[width] duration-500 ease-out motion-safe:animate-in motion-safe:fade-in-0"
              style={{ width: `${product.progress}%` }}
            />
          </div>
        </div>

        <Link href={product.href}>
          <Button
            className={cn(
              "w-full mt-4 h-11",
              "bg-gradient-owl text-white border-0",
              "shadow-[0_8px_22px_rgba(249,115,22,0.22)]",
              "transition-[transform,box-shadow,opacity] duration-[220ms] ease-out",
              "motion-safe:hover:scale-[1.02]",
              "hover:shadow-[0_12px_28px_rgba(249,115,22,0.36)]",
              "focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            )}
          >
            <Play className="mr-2 w-4 h-4 fill-current" />
            {product.actionLabel}
          </Button>
        </Link>
      </div>
    </article>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="inline-flex items-center gap-1">
        <Clock3 className="h-3 w-3 opacity-50" aria-hidden />
        {label}
      </dt>
      <dd className="text-foreground/80 text-right truncate">{value}</dd>
    </div>
  );
}

function BadgePill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
        "text-[11px] font-medium backdrop-blur-md",
        "border shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
        tone === "success"
          ? "border-emerald-400/30 bg-emerald-400/12 text-emerald-100"
          : "border-white/15 bg-black/45 text-white/92"
      )}
    >
      {children}
    </span>
  );
}
