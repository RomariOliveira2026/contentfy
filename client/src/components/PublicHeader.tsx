import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import BrandLogo from "@/components/BrandLogo";
import { getLoginUrl } from "@/const";
import LanguageSelector from "@/components/LanguageSelector";
import { trpc } from "@/lib/trpc";
import { Menu, X, User, LogOut, LayoutDashboard, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import SearchBar from "@/components/SearchBar";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
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
  const [scrolled, setScrolled] = useState(false);
  const { data: user } = trpc.auth.me.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    { label: "Explorar", path: "/explorar" },
    { label: "Categorias", path: "/explorar#filtros" },
    { label: "Para Criadores", path: "/creator/dashboard" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location === path || location.startsWith(`${path}/`);
  };

  return (
    <header
      className={cn(
        "dark cf-header-shell cf-surface-header transition-[height,background-color] duration-300",
        scrolled && "cf-header-scrolled"
      )}
    >
      <div
        className={cn(
          "container flex items-center gap-3 lg:gap-6 transition-[height] duration-300",
          scrolled ? "h-[4.25rem] lg:h-[4.5rem]" : "h-[5rem] lg:h-[5.5rem]"
        )}
      >
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
                <DropdownMenuContent align="end" className="dark w-48 rounded-xl border-white/10 bg-[#111827] text-slate-100">
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
            <>
              <Button asChild size="sm" variant="outline" className="px-4">
                <a href={getLoginUrl()}>Entrar</a>
              </Button>
              <Button asChild size="sm" className="px-5">
                <a href={getLoginUrl()}>Criar conta</a>
              </Button>
            </>
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
            className="dark md:hidden overflow-hidden border-t border-white/10 cf-surface-header"
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
              <div className="pt-4 mt-4 border-t border-border flex flex-col gap-2">
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
