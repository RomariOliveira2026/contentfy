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
} from "lucide-react";
import { Button } from "./ui/button";
import BrandLogo from "@/components/BrandLogo";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Package, label: "Produtos", path: "/admin/products" },
  { icon: ShoppingCart, label: "Vendas", path: "/admin/sales" },
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
            {!sidebarCollapsed && (
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
          <nav className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path || 
                (item.path !== "/admin" && location.startsWith(item.path));

              return (
                <Link key={item.path} href={item.path}>
                  <a
                    className={`
                      flex items-center gap-3 py-3 text-sm font-medium rounded-none
                      transition-all duration-200
                      ${
                        sidebarCollapsed
                          ? "px-4 justify-center"
                          : "px-6"
                      }
                      ${
                        isActive
                          ? "cf-admin-nav-active"
                          : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
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
