import { Link } from "wouter";
import BrandLogo from "@/components/BrandLogo";
import { APP_TITLE } from "@/const";

const productLinks = [
  { label: "Explorar", href: "/explorar" },
  { label: "Catálogo", href: "/products" },
  { label: "Desacelere", href: "/produto/desacelere" },
  {
    label: "Manual do Representante Comercial",
    href: "/produto/manual-do-representante-comercial",
  },
];

const creatorLinks = [
  { label: "Área do Criador", href: "/creator/dashboard" },
  { label: "AI Studio", href: "/creator/ai" },
];

const helpLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Contato", href: "/contact" },
];

const legalLinks = [
  { label: "Termos", href: "/terms" },
  { label: "Privacidade", href: "/privacy" },
];

export default function PublicFooter() {
  return (
    <footer className="dark relative cf-surface-footer">
      <div className="cf-gradient-bar opacity-70" />
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href="/">
              <a className="cf-brand-logo-link inline-flex items-center mb-5 py-0">
                <BrandLogo
                  wrapClassName="!h-14 lg:!h-16"
                  className="!h-14 !max-h-14 lg:!h-16 lg:!max-h-16 !w-auto"
                />
              </a>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-4 max-w-sm">
              Plataforma premium de infoprodutos. Cursos, e-books, manuais,
              audiobooks e apps — com a identidade{" "}
              <span className="text-gradient-owl font-semibold">ContentFy</span>.
            </p>
            <p className="text-xs text-slate-500">
              Tecnologia{" "}
              <span className="text-slate-300">BuilderTudo Technologies</span>
            </p>
          </div>

          <FooterCol title="Produtos" links={productLinks} />
          <FooterCol title="Para Criadores" links={creatorLinks} />
          <FooterCol title="Ajuda" links={helpLinks} span="lg:col-span-2" />
          <FooterCol title="Legal" links={legalLinks} span="lg:col-span-2" />
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} {APP_TITLE}. Grupo O Especialista — CNPJ
            46.709.692/0001-42.
          </p>
          <p className="text-center sm:text-right">
            contentfy.com.br · Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
  span = "lg:col-span-2",
}: {
  title: string;
  links: { label: string; href: string }[];
  span?: string;
}) {
  return (
    <div className={span}>
      <h4 className="font-semibold text-white mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link href={link.href}>
              <a className="text-sm text-slate-400 hover:text-primary transition-colors">
                {link.label}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
