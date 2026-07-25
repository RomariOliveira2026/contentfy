export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "Contentfy";

export const APP_LOGO = "/logo-contentfy.svg";
export const APP_LOGO_2X = "/logo-contentfy@2x.png";
export const APP_LOGO_WIDTH = 228;
export const APP_LOGO_HEIGHT = 60;
export const APP_FAVICON = "/favicon-48.png";
export const APP_FAVICON_APPLE = "/apple-touch-icon.png";

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
