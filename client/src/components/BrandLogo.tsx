import { ContentFyLogo } from "@/components/branding";

interface BrandLogoProps {
  className?: string;
  wrapClassName?: string;
}

/**
 * Backward-compatible logo wrapper.
 * Prefer ContentFyLogo / ContentFySymbol from @/components/branding for new code.
 */
export default function BrandLogo({ className, wrapClassName }: BrandLogoProps) {
  return (
    <ContentFyLogo
      variant="horizontal"
      theme="dark"
      symbol="compact"
      size={52}
      priority
      className={className}
      wrapClassName={wrapClassName}
    />
  );
}
