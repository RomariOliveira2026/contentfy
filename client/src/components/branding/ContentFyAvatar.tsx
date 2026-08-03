import { brandAssets, brandMetadata } from "@/brand";
import { cn } from "@/lib/utils";

export interface ContentFyAvatarProps {
  size?: number;
  className?: string;
  "aria-label"?: string;
  title?: string;
  "data-testid"?: string;
  /** Institutional / AI / system avatar only — never user avatars */
  alt?: string;
}

/**
 * Institutional brand avatar for system, AI, admin empty-states, etc.
 * Do not use as a replacement for real user profile photos.
 */
export function ContentFyAvatar({
  size = 40,
  className,
  "aria-label": ariaLabel,
  title,
  "data-testid": testId,
  alt,
}: ContentFyAvatarProps) {
  const label = alt ?? ariaLabel ?? brandMetadata.accessibleLabel;

  return (
    <img
      src={brandAssets.svg.avatar}
      alt={label}
      title={title}
      width={size}
      height={size}
      data-testid={testId}
      decoding="async"
      draggable={false}
      className={cn("block rounded-full object-cover", className)}
      style={{ width: size, height: size }}
    />
  );
}

export default ContentFyAvatar;
