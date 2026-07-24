import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  centered?: boolean;
}

export default function PageHeader({
  title,
  subtitle,
  icon,
  centered = false,
}: PageHeaderProps) {
  return (
    <div className={`cf-page-header ${centered ? "text-center" : ""}`}>
      <div
        className={`flex gap-4 ${centered ? "flex-col items-center" : "items-start"}`}
      >
        {icon && (
          <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFD43B]/15 to-[#FF8C42]/15 flex items-center justify-center border border-primary/15 shadow-sm">
            {icon}
          </div>
        )}
        <div className={centered ? "max-w-2xl" : ""}>
          <h1 className="cf-page-title">{title}</h1>
          {subtitle && (
            <p
              className={`cf-page-subtitle ${centered ? "mx-auto" : ""}`}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
