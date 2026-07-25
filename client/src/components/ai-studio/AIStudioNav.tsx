import { Link, useLocation } from "wouter";
import {
  Sparkles,
  PenLine,
  GraduationCap,
  HelpCircle,
  Award,
  Mail,
  LayoutTemplate,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tools = [
  { label: "Dashboard", path: "/creator/ai", icon: Sparkles, exact: true },
  { label: "AI Writer", path: "/creator/ai/writer", icon: PenLine },
  { label: "Course Builder", path: "/creator/ai/course", icon: GraduationCap },
  { label: "Quiz Builder", path: "/creator/ai/quiz", icon: HelpCircle },
  { label: "Certificate", path: "/creator/ai/certificate", icon: Award },
  { label: "Emails", path: "/creator/ai/emails", icon: Mail },
  { label: "Sales Page", path: "/creator/ai/sales-page", icon: LayoutTemplate },
];

export default function AIStudioNav() {
  const [location] = useLocation();

  return (
    <div className="flex flex-wrap gap-2">
      {tools.map((tool) => {
        const active = tool.exact
          ? location === tool.path
          : location === tool.path || location.startsWith(`${tool.path}/`);
        const Icon = tool.icon;
        return (
          <Link key={tool.path} href={tool.path}>
            <a
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors",
                active
                  ? "border-primary/40 bg-primary/10 text-foreground"
                  : "border-white/[0.08] bg-[#0c1220]/80 text-muted-foreground hover:text-foreground hover:border-white/15"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tool.label}
            </a>
          </Link>
        );
      })}
    </div>
  );
}
