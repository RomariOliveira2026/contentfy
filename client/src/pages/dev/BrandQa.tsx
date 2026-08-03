import {
  ContentFyAvatar,
  ContentFyLogo,
  ContentFySymbol,
} from "@/components/branding";
import { brandAssets, brandMetadata } from "@/brand";
import { Link } from "wouter";

/**
 * Temporary brand QA surface — Design Freeze v1.0 validation.
 * Dev-only route; do not promote to production navigation.
 */
export default function BrandQa() {
  if (!import.meta.env.DEV) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>Brand QA disponível apenas em desenvolvimento.</p>
      </div>
    );
  }

  const faviconSizes = [16, 20, 24, 32] as const;

  return (
    <div className="min-h-screen bg-[#070B12] text-slate-100">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-orange-400">
            Design Freeze v1.0
          </p>
          <h1 className="text-xl font-semibold">{brandMetadata.name} — Brand QA</h1>
        </div>
        <Link href="/">
          <a className="text-sm text-slate-400 hover:text-white">← Voltar</a>
        </Link>
      </header>

      <main className="mx-auto max-w-5xl space-y-12 px-6 py-10">
        <section className="space-y-4">
          <h2 className="text-lg font-medium">Logo horizontal</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-[#111827] p-6">
              <p className="mb-3 text-xs text-slate-400">Dark surface</p>
              <ContentFyLogo variant="horizontal" theme="dark" size={56} />
            </div>
            <div className="rounded-xl bg-slate-100 p-6 text-slate-900">
              <p className="mb-3 text-xs text-slate-500">Light surface</p>
              <ContentFyLogo variant="horizontal" theme="light" size={56} />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium">Logo vertical</h2>
          <div className="inline-block rounded-xl bg-[#111827] p-6">
            <ContentFyLogo variant="vertical" theme="dark" size={160} />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium">Símbolos</h2>
          <div className="flex flex-wrap items-end gap-8">
            <figure className="text-center space-y-2">
              <ContentFySymbol level="master" size={128} theme="dark" />
              <figcaption className="text-xs text-slate-400">Master 128</figcaption>
            </figure>
            <figure className="text-center space-y-2">
              <ContentFySymbol level="compact" size={64} theme="dark" />
              <figcaption className="text-xs text-slate-400">Compact 64</figcaption>
            </figure>
            <figure className="text-center space-y-2">
              <ContentFySymbol level="micro" size={24} theme="dark" />
              <figcaption className="text-xs text-slate-400">Micro 24</figcaption>
            </figure>
            <figure className="text-center space-y-2">
              <ContentFyAvatar size={48} />
              <figcaption className="text-xs text-slate-400">Avatar</figcaption>
            </figure>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium">Favicon (Micro) — 16 / 20 / 24 / 32</h2>
          <div className="flex items-end gap-6">
            {faviconSizes.map((px) => (
              <figure key={px} className="text-center space-y-2">
                <img
                  src={brandAssets.svg.favicon}
                  alt=""
                  width={px}
                  height={px}
                  className="mx-auto"
                />
                <figcaption className="text-xs text-slate-400">{px}px</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium">Contextos</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 p-4">
              <p className="mb-3 text-xs text-slate-400">Header</p>
              <ContentFyLogo variant="horizontal" theme="dark" size={48} symbol="compact" />
            </div>
            <div className="rounded-xl border border-white/10 p-4 flex items-center gap-3">
              <p className="text-xs text-slate-400 w-20">Sidebar</p>
              <ContentFySymbol level="micro" size={28} theme="dark" />
            </div>
            <div className="rounded-xl border border-white/10 p-4">
              <p className="mb-3 text-xs text-slate-400">Login / Dashboard</p>
              <ContentFyLogo variant="horizontal" theme="dark" size={40} symbol="compact" />
            </div>
            <div className="rounded-xl border border-white/10 p-4">
              <p className="mb-3 text-xs text-slate-400">Marketplace / Checkout</p>
              <ContentFyLogo variant="horizontal" theme="dark" size={36} symbol="compact" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
