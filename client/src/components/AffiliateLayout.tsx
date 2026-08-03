import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Link as LinkIcon,
  DollarSign,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { ContentFyLogo } from "@/components/branding";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface AffiliateLayoutProps {
  children: ReactNode;
}

export default function AffiliateLayout({ children }: AffiliateLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Logout realizado com sucesso!");
      window.location.href = "/";
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/affiliate",
    },
    {
      icon: LinkIcon,
      label: "Meus Links",
      path: "/affiliate/links",
    },
    {
      icon: BarChart3,
      label: "Vendas",
      path: "/affiliate/sales",
    },
    {
      icon: DollarSign,
      label: "Saques",
      path: "/affiliate/withdrawals",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b">
        <Link href="/">
          <div className="flex items-center gap-2">
            <ContentFyLogo
              variant="horizontal"
              theme="dark"
              symbol="compact"
              size={32}
              className="!h-8 !max-h-8 !w-auto"
              wrapClassName="!h-8"
            />
          </div>
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
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 border-r bg-card p-6 md:sticky md:top-0 md:h-screen`}
      >
        {/* Logo */}
        <Link href="/">
          <div className="hidden md:flex items-center gap-2 mb-8">
            <ContentFyLogo
              variant="horizontal"
              theme="dark"
              symbol="compact"
              size={32}
              className="!h-8 !max-h-8 !w-auto"
              wrapClassName="!h-8"
            />
          </div>
        </Link>

        {/* Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;

            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mt-auto pt-6">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
