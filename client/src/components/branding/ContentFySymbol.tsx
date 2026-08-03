import {
  brandMetadata,
  resolveSymbolSrc,
  symbolDimensions,
  type BrandSize,
  type BrandSymbolLevel,
  type BrandTheme,
} from "@/brand";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export interface ContentFySymbolProps {
  level?: BrandSymbolLevel | "auto";
  theme?: BrandTheme;
  size?: BrandSize;
  className?: string;
  priority?: boolean;
  "aria-label"?: string;
  title?: string;
  role?: string;
  "data-testid"?: string;
  decorative?: boolean;
}

export function ContentFySymbol({
  level = "auto",
  theme = "auto",
  size = "md",
  className,
  priority = false,
  "aria-label": ariaLabel,
  title,
  role,
  "data-testid": testId,
  decorative = false,
}: ContentFySymbolProps) {
  const { theme: appTheme } = useTheme();
  const effectiveTheme: BrandTheme =
    theme === "auto" ? appTheme : theme;

  const { src, pixelSize, level: resolvedLevel } = resolveSymbolSrc(
    level,
    effectiveTheme,
    size
  );
  const { width, height } = symbolDimensions(pixelSize);
  const label = ariaLabel ?? brandMetadata.accessibleLabel;

  return (
    <img
      src={src}
      alt={decorative ? "" : label}
      title={title}
      width={width}
      height={height}
      role={decorative ? "presentation" : role}
      aria-hidden={decorative || undefined}
      data-symbol-level={resolvedLevel}
      data-testid={testId}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      draggable={false}
      loading={priority ? "eager" : "lazy"}
      className={cn("block object-contain", className)}
    />
  );
}

export default ContentFySymbol;
