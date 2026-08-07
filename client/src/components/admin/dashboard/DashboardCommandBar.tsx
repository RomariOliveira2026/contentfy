import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  Bell,
  Plus,
  Search,
  User,
  Package,
  ShoppingCart,
  Users,
  Link as LinkIcon,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const shortcuts = [
  { label: "Visão Geral", href: "/admin", icon: LayoutDashboard },
  { label: "Produtos", href: "/admin/products", icon: Package },
  { label: "Vendas", href: "/admin/sales", icon: ShoppingCart },
  { label: "Clientes", href: "/admin/customers", icon: Users },
  { label: "Afiliados", href: "/admin/affiliates", icon: LinkIcon },
  { label: "Criar produto", href: "/admin/products/new", icon: Plus },
];

interface DashboardCommandBarProps {
  userName?: string | null;
}

export default function DashboardCommandBar({
  userName,
}: DashboardCommandBarProps) {
  const [, navigate] = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="cf-admin-commandbar">
        <button
          type="button"
          className="cf-admin-commandbar-search"
          onClick={() => setOpen(true)}
        >
          <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
          <span className="truncate cf-admin-commandbar-placeholder">
            Buscar produtos, clientes ou pedidos...
          </span>
          <kbd className="cf-admin-kbd">⌘K</kbd>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "relative rounded-xl h-10 w-10",
              "transition-[background-color,transform,box-shadow] duration-[220ms] ease-out",
              "motion-safe:hover:-translate-y-px",
              "focus-visible:ring-2 focus-visible:ring-primary/60"
            )}
            aria-label="Notificações"
          >
            <Bell className="h-4 w-4" />
            <span className="cf-admin-notify-badge">3</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="sm"
                className={cn(
                  "rounded-xl gap-2 h-10 px-4 font-bold",
                  "shadow-[0_8px_20px_rgba(249,115,22,0.22)]",
                  "transition-[transform,box-shadow] duration-[220ms] ease-out",
                  "motion-safe:hover:-translate-y-px motion-safe:hover:scale-[1.015]",
                  "hover:shadow-[0_10px_28px_rgba(249,115,22,0.32)]",
                  "focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
              >
                <Plus className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">Novo Produto</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {shortcuts
                .filter((s) => s.href.includes("new") || s.label.startsWith("Criar"))
                .concat([
                  { label: "Novo curso", href: "/admin/courses", icon: Package },
                  {
                    label: "Cadastrar afiliado",
                    href: "/admin/affiliates",
                    icon: LinkIcon,
                  },
                ])
                .map((item) => (
                  <DropdownMenuItem
                    key={item.href + item.label}
                    onClick={() => navigate(item.href)}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="cf-admin-profile-chip hidden sm:flex">
            <div className="h-7 w-7 rounded-full bg-gradient-owl flex items-center justify-center text-white text-xs font-bold shrink-0">
              {(userName || "A").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <p className="text-xs font-semibold truncate max-w-[7rem] leading-none">
                {userName || "Admin"}
              </p>
              <p className="text-[10px] font-normal text-slate-400 leading-none mt-1">
                Administrador
              </p>
            </div>
            <User className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden />
          </div>
        </div>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar produtos, clientes ou pedidos..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Navegação rápida">
            {shortcuts.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => {
                  setOpen(false);
                  navigate(item.href);
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
