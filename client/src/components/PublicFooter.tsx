import { Link } from "wouter";
import BrandLogo from "@/components/BrandLogo";
import { APP_TITLE } from "@/const";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const productLinks = [
  { label: "Cursos Online", href: "/products?type=course" },
  { label: "E-books", href: "/products?type=ebook" },
  { label: "Audiobooks", href: "/products?type=audiobook" },
  { label: "Apps", href: "/products?type=app" },
];

const companyLinks = [
  { label: "Sobre", href: "/about" },
  { label: "Contato", href: "/contact" },
  { label: "Termos de Uso", href: "/terms" },
  { label: "Privacidade", href: "/privacy" },
];

const socialLinks = [
  { icon: Facebook, label: "Facebook" },
  { icon: Instagram, label: "Instagram" },
  { icon: Twitter, label: "Twitter" },
  { icon: Youtube, label: "YouTube" },
];

export default function PublicFooter() {
  return (
    <footer className="dark relative cf-surface-footer">
      <div className="cf-gradient-bar opacity-70" />
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-5">
            <Link href="/">
              <a className="cf-brand-logo-link inline-flex items-center mb-5 py-0">
                <BrandLogo
                  wrapClassName="!h-14 lg:!h-16"
                  className="!h-14 !max-h-14 lg:!h-16 lg:!max-h-16 !w-auto"
                />
              </a>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-sm">
              Plataforma premium de infoprodutos. Cursos, e-books, audiobooks e
              apps — com a identidade{" "}
              <span className="text-gradient-owl font-semibold">ContentFy</span>.
            </p>
            <div className="flex gap-2">
              {socialLinks.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="h-10 w-10 rounded-xl bg-[#111827] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-primary/40 transition-all duration-200"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-semibold text-white mb-4">Produtos</h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-sm text-slate-400 hover:text-primary transition-colors">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-semibold text-white mb-4">Empresa</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-sm text-slate-400 hover:text-primary transition-colors">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-semibold text-white mb-4">Suporte</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/faq">
                  <a className="hover:text-primary transition-colors">FAQ</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="hover:text-primary transition-colors">Fale conosco</a>
                </Link>
              </li>
              <li>
                <Link href="/my-account/products">
                  <a className="hover:text-primary transition-colors">Minha Biblioteca</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} {APP_TITLE}. Grupo O Especialista — CNPJ
            46.709.692/0001-42.
          </p>
          <p className="text-center sm:text-right">Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
