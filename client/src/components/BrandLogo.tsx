import { APP_LOGO, APP_LOGO_2X, APP_LOGO_HEIGHT, APP_LOGO_WIDTH, APP_TITLE } from "@/const";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  wrapClassName?: string;
}

export default function BrandLogo({ className, wrapClassName }: BrandLogoProps) {
  const isSvg = APP_LOGO.endsWith(".svg");

  return (
    <span className={cn("cf-brand-logo-wrap", wrapClassName)}>
      <img
        src={APP_LOGO}
        srcSet={isSvg ? undefined : `${APP_LOGO} 1x, ${APP_LOGO_2X} 2x`}
        alt={APP_TITLE}
        width={APP_LOGO_WIDTH}
        height={APP_LOGO_HEIGHT}
        decoding="async"
        fetchPriority="high"
        draggable={false}
        className={cn("cf-brand-logo", className)}
      />
    </span>
  );
}
