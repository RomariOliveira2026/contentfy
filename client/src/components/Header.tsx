import { Button } from "@/components/ui/button";
import { APP_LOGO } from "@/const";
import { Menu, X, ChevronDown, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location === path;

  const institutionalPages = [
    { path: "/features", label: "Recursos" },
    { path: "/examples", label: "Exemplos" },
    { path: "/process", label: "Processo" },
    { path: "/faq", label: "FAQ" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border shadow-sm">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo - responsiva */}
          <Link href="/">
            <a className="flex items-center cursor-pointer hover:opacity-90 transition-opacity">
              <img 
                src={APP_LOGO} 
                alt="ContentFy" 
                className="!h-7 !w-auto object-contain" 
              />
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/">
              <a className={`text-sm font-medium transition-colors ${
                isActive("/") 
                  ? "text-primary" 
                  : "text-foreground hover:text-primary"
              }`}>
                {t("nav.home") || "Início"}
              </a>
            </Link>
            <Link href="/products">
              <a className={`text-sm font-medium transition-colors ${
                isActive("/products") 
                  ? "text-primary" 
                  : "text-foreground hover:text-primary"
              }`}>
                {t("nav.products") || "Produtos"}
              </a>
            </Link>
            
            {/* Institutional Pages Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors outline-none">
                Institucional
                <ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {institutionalPages.map((page) => (
                  <DropdownMenuItem key={page.path} asChild>
                    <Link href={page.path}>
                      <a className="w-full cursor-pointer">
                        {page.label}
                      </a>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/about">
              <a className={`text-sm font-medium transition-colors ${
                isActive("/about") 
                  ? "text-primary" 
                  : "text-foreground hover:text-primary"
              }`}>
                {t("nav.about") || "Sobre"}
              </a>
            </Link>
            <Link href="/blog">
              <a className={`text-sm font-medium transition-colors ${
                isActive("/blog") 
                  ? "text-primary" 
                  : "text-foreground hover:text-primary"
              }`}>
                Blog
              </a>
            </Link>
            <Link href="/contact">
              <a className={`text-sm font-medium transition-colors ${
                isActive("/contact") 
                  ? "text-primary" 
                  : "text-foreground hover:text-primary"
              }`}>
                {t("nav.contact") || "Contato"}
              </a>
            </Link>
            
            <LanguageSelector />
            
            {/* BOTÃO CLARO/ESCURO GRANDE E VISÍVEL */}
            <Button
              variant="outline"
              size="default"
              onClick={toggleTheme}
              className="rounded-lg px-4 py-2 border-2 hover:bg-accent"
              aria-label="Alternar tema"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <Link href="/admin">
              <Button
                size="default"
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              >
                {t("nav.admin") || "Admin"}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            {/* Botão tema mobile visível */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-lg border-2"
              aria-label="Alternar tema"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-foreground"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background">
            <div className="flex flex-col gap-4">
              <Link href="/">
                <a 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-left text-sm font-medium transition-colors py-2 ${
                    isActive("/") 
                      ? "text-primary" 
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {t("nav.home") || "Início"}
                </a>
              </Link>
              <Link href="/products">
                <a 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-left text-sm font-medium transition-colors py-2 ${
                    isActive("/products") 
                      ? "text-primary" 
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {t("nav.products") || "Produtos"}
                </a>
              </Link>
              
              {/* Institutional Pages in Mobile */}
              <div className="border-t border-border pt-2 mt-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Institucional
                </div>
                {institutionalPages.map((page) => (
                  <Link key={page.path} href={page.path}>
                    <a 
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-left text-sm font-medium transition-colors py-2 block ${
                        isActive(page.path) 
                          ? "text-primary" 
                          : "text-foreground hover:text-primary"
                      }`}
                    >
                      {page.label}
                    </a>
                  </Link>
                ))}
              </div>

              <Link href="/about">
                <a 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-left text-sm font-medium transition-colors py-2 ${
                    isActive("/about") 
                      ? "text-primary" 
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {t("nav.about") || "Sobre"}
                </a>
              </Link>
              <Link href="/blog">
                <a 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-left text-sm font-medium transition-colors py-2 ${
                    isActive("/blog") 
                      ? "text-primary" 
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  Blog
                </a>
              </Link>
              <Link href="/contact">
                <a 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-left text-sm font-medium transition-colors py-2 ${
                    isActive("/contact") 
                      ? "text-primary" 
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {t("nav.contact") || "Contato"}
                </a>
              </Link>
              
              <div className="py-2">
                <LanguageSelector />
              </div>
              
              <Link href="/admin">
                <Button
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity w-full"
                >
                  {t("nav.admin") || "Admin"}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
