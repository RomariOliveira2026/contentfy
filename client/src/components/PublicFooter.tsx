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
    <footer className="relative cf-surface-header cf-footer-lines">
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-5">
            <Link href="/">
              <a className="cf-brand-logo-link inline-flex items-center mb-5">
                <BrandLogo />
              </a>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-6 max-w-sm">
              Sua plataforma completa de infoprodutos. Cursos online, e-books,
              audiobooks e apps em um só lugar — com a identidade{" "}
              <span className="text-gradient-owl font-semibold">ContentFy</span>.
            </p>
            <div className="flex gap-2">
              {socialLinks.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="h-9 w-9 rounded-lg bg-muted/60 border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
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
                    <a className="text-sm text-white/60 hover:text-primary transition-colors">
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
                    <a className="text-sm text-white/60 hover:text-primary transition-colors">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-semibold text-white mb-4">Suporte</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
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

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/50">
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
