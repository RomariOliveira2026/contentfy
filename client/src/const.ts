export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { brandAssets, brandMetadata } from "@/brand";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || brandMetadata.name;

/** Canonical horizontal lockup (runtime copy). Prefer ContentFyLogo. */
export const APP_LOGO = brandAssets.svg.logoHorizontal;
export const APP_LOGO_2X = brandAssets.png.symbol512;
export const APP_LOGO_WIDTH = 228;
export const APP_LOGO_HEIGHT = 60;
export const APP_FAVICON = brandAssets.distributed.favicon48;
export const APP_FAVICON_APPLE = brandAssets.distributed.appleTouchIcon;
export const APP_SYMBOL = brandAssets.svg.compact;
export const APP_AVATAR = brandAssets.svg.avatar;

function resolveOAuthPortalUrl() {
  const configured = (import.meta.env.VITE_OAUTH_PORTAL_URL || "").trim();
  const isPlaceholder =
    !configured ||
    /seu[_-]?oauth|sou[_-]?oauth|SEU_OAUTH|YOUR[_-]?OAUTH|example\.com/i.test(
      configured
    );

  // Always fall back to the built-in mock portal on this same origin.
  if (isPlaceholder && typeof window !== "undefined") {
    return `${window.location.origin}/api/dev-oauth`;
  }

  return configured.replace(/\/$/, "");
}

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = resolveOAuthPortalUrl();
  const appId = import.meta.env.VITE_APP_ID || "contentfy-prod";
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
