import {
  brandMetadata,
  logoDefaultHeight,
  logoDimensions,
  resolveBrandSize,
  resolveLogoSrc,
  type BrandLogoVariant,
  type BrandSize,
  type BrandTheme,
} from "@/brand";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export interface ContentFyLogoProps {
  variant?: BrandLogoVariant;
  /** Symbol level hint for documentation / future lockups; lockup uses full logo assets */
  symbol?: "master" | "compact" | "micro";
  theme?: BrandTheme;
  size?: BrandSize;
  className?: string;
  wrapClassName?: string;
  priority?: boolean;
  "aria-label"?: string;
  title?: string;
  role?: string;
  "data-testid"?: string;
  decorative?: boolean;
}

export function ContentFyLogo({
  variant = "horizontal",
  theme = "auto",
  size,
  className,
  wrapClassName,
  priority = false,
  "aria-label": ariaLabel,
  title,
  role,
  "data-testid": testId,
  decorative = false,
}: ContentFyLogoProps) {
  const { theme: appTheme } = useTheme();
  const effectiveTheme: BrandTheme =
    theme === "auto" ? appTheme : theme;

  const height = resolveBrandSize(size, logoDefaultHeight);
  const { width } = logoDimensions(variant, height);
  const src = resolveLogoSrc(variant, effectiveTheme);
  const label = ariaLabel ?? brandMetadata.accessibleLabel;

  return (
    <span
      className={cn("cf-brand-logo-wrap inline-flex items-center leading-none", wrapClassName)}
      data-testid={testId}
    >
      <img
        src={src}
        alt={decorative ? "" : label}
        title={title}
        width={width}
        height={height}
        role={decorative ? "presentation" : role}
        aria-hidden={decorative || undefined}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        draggable={false}
        className={cn(
          "cf-brand-logo block h-auto max-w-full object-contain object-left",
          className
        )}
      />
    </span>
  );
}

export default ContentFyLogo;
