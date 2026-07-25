import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import BrandLogo from "@/components/BrandLogo";
import { getLoginUrl } from "@/const";
import LanguageSelector from "@/components/LanguageSelector";
import { trpc } from "@/lib/trpc";
import { Menu, X, User, LogOut, LayoutDashboard, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicHeader() {
  const [location, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: user } = trpc.auth.me.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Logout realizado com sucesso");
      navigate("/");
    } catch {
      toast.error("Erro ao fazer logout");
    }
  };

  const navItems = [
    { label: "Início", path: "/" },
    { label: "Produtos", path: "/products" },
    { label: "Preços", path: "/pricing" },
    { label: "Sobre", path: "/about" },
    { label: "Contato", path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location === path || location.startsWith(`${path}/`);
  };

  return (
    <header className="cf-header-shell cf-surface-header">
      <div className="container flex h-[5rem] lg:h-[5.5rem] items-center gap-3 lg:gap-6">
        <Link href="/">
          <a className="cf-brand-logo-link flex items-center shrink-0 py-0">
            <BrandLogo
              wrapClassName="!h-14 lg:!h-[3.75rem]"
              className="!h-14 !max-h-14 lg:!h-[3.75rem] lg:!max-h-[3.75rem] !w-auto"
            />
          </a>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a
                className={`cf-nav-link ${
                  isActive(item.path) ? "cf-nav-link-active" : ""
                }`}
              >
                {item.label}
              </a>
            </Link>
          ))}
        </nav>

        <div className="hidden xl:flex w-full max-w-xs cf-header-search shrink-0">
          <SearchBar />
        </div>

        <div className="hidden md:flex items-center gap-2 shrink-0 ml-auto lg:ml-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Alternar tema"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <LanguageSelector />
          {user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="max-w-[160px]">
                    <User className="w-4 h-4 mr-2 shrink-0" />
                    <span className="truncate">{user.name || "Minha Conta"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl border-white/10 bg-card">
                  <DropdownMenuItem onClick={() => navigate("/my-account/products")}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Minha Biblioteca
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild size="sm" className="px-6">
              <a href={getLoginUrl()}>Entrar</a>
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden ml-auto"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-white/[0.06] cf-surface-header"
          >
            <div className="container py-5 cf-header-search">
              <SearchBar />
              <nav className="flex flex-col gap-1 mt-4">
                {navItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <a
                      className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive(item.path)
                          ? "text-foreground bg-primary/10"
                          : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  </Link>
                ))}
              </nav>
              <div className="pt-4 mt-4 border-t border-white/[0.06] flex flex-col gap-2">
                <Button variant="outline" className="w-full" onClick={toggleTheme}>
                  {theme === "dark" ? (
                    <>
                      <Sun className="h-4 w-4 mr-2" />
                      Modo Claro
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 mr-2" />
                      Modo Escuro
                    </>
                  )}
                </Button>
                {user ? (
                  <>
                    {user.role === "admin" && (
                      <Link href="/admin">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Admin
                        </Button>
                      </Link>
                    )}
                    <Link href="/my-account/products">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Minha Biblioteca
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <Button asChild className="w-full">
                    <a href={getLoginUrl()}>Entrar</a>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
