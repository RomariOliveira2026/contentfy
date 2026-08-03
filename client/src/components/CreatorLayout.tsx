import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Package,
  BookOpen,
  ShoppingCart,
  Users,
  Link as LinkIcon,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  LineChart,
} from "lucide-react";
import { Button } from "./ui/button";
import BrandLogo from "@/components/BrandLogo";
import { ContentFySymbol } from "@/components/branding";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface CreatorLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Visão Geral", path: "/creator/dashboard" },
  { icon: Sparkles, label: "AI Studio", path: "/creator/ai" },
  { icon: Package, label: "Produtos", path: "/creator/products" },
  { icon: BookOpen, label: "Cursos", path: "/creator/courses" },
  { icon: ShoppingCart, label: "Vendas", path: "/creator/sales" },
  { icon: Users, label: "Alunos", path: "/creator/students" },
  { icon: LineChart, label: "Success", path: "/creator/success" },
  { icon: LinkIcon, label: "Afiliados", path: "/creator/affiliates" },
  { icon: Settings, label: "Configurações", path: "/creator/settings" },
];

export default function CreatorLayout({ children }: CreatorLayoutProps) {
  const [location, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { data: user, isLoading } = trpc.auth.me.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Logout realizado com sucesso");
      navigate("/");
    } catch {
      toast.error("Erro ao fazer logout");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-3">Faça login</h1>
          <p className="text-muted-foreground mb-6">
            A Área do Criador exige autenticação.
          </p>
          <Button onClick={() => navigate("/")}>Voltar para Home</Button>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-3">Acesso Negado</h1>
          <p className="text-muted-foreground mb-6">
            A Área do Criador está disponível para administradores nesta versão.
            Um papel de criador dedicado virá em breve.
          </p>
          <Button onClick={() => navigate("/")}>Voltar para Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-[#0c1220]/95 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between px-4 z-50">
        <Link href="/creator/dashboard">
          <a className="cf-brand-logo-link inline-flex items-center py-0">
            <BrandLogo
              wrapClassName="!h-12"
              className="!h-12 !max-h-12 !w-auto !max-w-[200px] object-contain object-left"
            />
          </a>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>

      <aside
        className={`
          fixed top-0 left-0 h-full cf-admin-sidebar z-40
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${sidebarCollapsed ? "w-16" : "w-64"}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          <div
            className={`h-20 flex items-center border-b border-white/[0.08] ${
              sidebarCollapsed ? "justify-center px-2" : "justify-between gap-1 px-3"
            }`}
          >
            {sidebarCollapsed ? (
              <Link href="/creator/dashboard">
                <a
                  className="cf-brand-logo-link inline-flex items-center py-0"
                  title="ContentFy"
                  onClick={() => setSidebarOpen(false)}
                >
                  <ContentFySymbol level="micro" size={28} theme="dark" />
                </a>
              </Link>
            ) : (
              <Link href="/creator/dashboard">
                <a
                  className="cf-brand-logo-link inline-flex min-w-0 flex-1 items-center py-0"
                  onClick={() => setSidebarOpen(false)}
                >
                  <BrandLogo
                    wrapClassName="!h-14"
                    className="!h-14 !max-h-14 !w-auto !max-w-[190px] object-contain object-left"
                  />
                </a>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex shrink-0"
              title={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          <div className={`px-4 pt-4 ${sidebarCollapsed ? "hidden" : "block"}`}>
            <p className="text-[10px] uppercase tracking-[0.18em] text-orange-400/80 font-semibold">
              Área do Criador
            </p>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location === item.path ||
                (item.path !== "/creator/dashboard" &&
                  location.startsWith(item.path));

              return (
                <Link key={item.path} href={item.path}>
                  <a
                    className={`
                      flex items-center gap-3 py-3 text-sm font-medium
                      transition-all duration-200
                      ${
                        sidebarCollapsed
                          ? "justify-center px-0"
                          : "px-4 mx-2 rounded-lg"
                      }
                      ${
                        isActive
                          ? "cf-admin-nav-active"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                      }
                    `}
                    title={sidebarCollapsed ? item.label : undefined}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </a>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/[0.08] p-4 space-y-3">
            {user && !sidebarCollapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            )}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={`w-full ${sidebarCollapsed ? "justify-center" : "justify-start"}`}
              title={sidebarCollapsed ? "Sair" : undefined}
            >
              <LogOut className="w-4 h-4" />
              {!sidebarCollapsed && <span className="ml-2">Sair</span>}
            </Button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        <div className="pt-20 lg:pt-0">
          <div className="p-6 lg:p-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
