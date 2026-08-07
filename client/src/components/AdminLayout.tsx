import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Link as LinkIcon,
  Sparkles,
  ShieldCheck,
  Compass,
  LineChart,
  Brain,
  Network,
} from "lucide-react";
import { Button } from "./ui/button";
import BrandLogo from "@/components/BrandLogo";
import { ContentFySymbol } from "@/components/branding";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Visão Geral", path: "/admin" },
  { icon: Package, label: "Produtos", path: "/admin/products" },
  { icon: ShoppingCart, label: "Vendas", path: "/admin/sales" },
  { icon: ShieldCheck, label: "Protect", path: "/admin/refunds" },
  { icon: Compass, label: "Discovery", path: "/admin/discovery" },
  { icon: LineChart, label: "Success", path: "/admin/success" },
  { icon: Brain, label: "Intelligence", path: "/admin/intelligence" },
  { icon: Network, label: "Orchestrator", path: "/admin/orchestrator" },
  { icon: Users, label: "Clientes", path: "/admin/customers" },
  { icon: LinkIcon, label: "Afiliados", path: "/admin/affiliates" },
  { icon: BookOpen, label: "Cursos", path: "/admin/courses" },
  { icon: Settings, label: "Configurações", path: "/admin/settings" },
  { icon: Sparkles, label: "Área do Criador", path: "/creator/dashboard" },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { data: user } = trpc.auth.me.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Logout realizado com sucesso");
      navigate("/");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  // Verificar se usuário é admin
  if (user && user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-muted-foreground mb-6">
            Você não tem permissão para acessar o painel administrativo.
          </p>
          <Button onClick={() => navigate("/")}>
            Voltar para Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-[#0c1220]/95 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between px-4 z-50">
        <Link href="/admin">
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

      {/* Sidebar */}
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
          {/* Logo & Toggle */}
          <div
            className={`h-20 flex items-center border-b border-white/[0.08] ${
              sidebarCollapsed ? "justify-center px-2" : "justify-between gap-1 px-3"
            }`}
          >
            {sidebarCollapsed ? (
              <Link href="/admin">
                <a
                  className="cf-brand-logo-link inline-flex items-center py-0"
                  title="ContentFy"
                  onClick={() => setSidebarOpen(false)}
                >
                  <ContentFySymbol level="micro" size={28} theme="dark" />
                </a>
              </Link>
            ) : (
              <Link href="/admin">
                <a
                  className="cf-brand-logo-link inline-flex min-w-0 flex-1 items-center py-0"
                  title="ContentFy"
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

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path || 
                (item.path !== "/admin" && location.startsWith(item.path));

              return (
                <Link key={item.path} href={item.path}>
                  <a
                    className={`
                      group relative flex items-center gap-3 py-2.5 text-sm font-medium
                      transition-[color,background-color,transform,box-shadow] duration-[220ms] ease-out
                      ${
                        sidebarCollapsed
                          ? "justify-center px-0 mx-1 rounded-lg"
                          : "px-3 mx-2 rounded-xl"
                      }
                      ${
                        isActive
                          ? "cf-admin-nav-active text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/[0.035] motion-safe:hover:translate-x-px"
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    {isActive ? (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-gradient-owl shadow-[0_0_8px_rgba(249,115,22,0.24)]"
                        aria-hidden
                      />
                    ) : null}
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-colors duration-200 ${
                        isActive
                          ? "text-orange-400"
                          : "group-hover:text-orange-300/85"
                      }`}
                    />
                    {!sidebarCollapsed && (
                      <span className="flex-1 truncate leading-none">{item.label}</span>
                    )}
                  </a>
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="border-t border-border p-4">
            {user && !sidebarCollapsed && (
              <div className="mb-3">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            )}
            <Button
              variant="outline"
              className={`w-full ${sidebarCollapsed ? "justify-center" : "justify-start"}`}
              onClick={handleLogout}
              title={sidebarCollapsed ? "Sair" : undefined}
            >
              <LogOut className="w-4 h-4" />
              {!sidebarCollapsed && <span className="ml-2">Sair</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className={`min-h-screen transition-all duration-300 ${
        sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
      }`}>
        <div className="pt-20 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}
