import { APP_LOGO, APP_LOGO_2X, APP_LOGO_HEIGHT, APP_LOGO_WIDTH, APP_TITLE } from "@/const";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
}

export default function BrandLogo({ className }: BrandLogoProps) {
  return (
    <span className="cf-brand-logo-wrap">
      <img
        src={APP_LOGO}
        srcSet={`${APP_LOGO} 1x, ${APP_LOGO_2X} 2x`}
        alt={APP_TITLE}
        width={APP_LOGO_WIDTH}
        height={APP_LOGO_HEIGHT}
        decoding="sync"
        fetchPriority="high"
        draggable={false}
        className={cn("cf-brand-logo", className)}
      />
    </span>
  );
}
