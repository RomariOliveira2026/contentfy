function resolveOAuthServerUrl() {
  const configured = (process.env.OAUTH_SERVER_URL || "").trim();
  const isPlaceholder =
    !configured ||
    /seu[_-]?oauth|sou[_-]?oauth|SEU_OAUTH|YOUR[_-]?OAUTH|example\.com/i.test(
      configured
    );
  // :3010 mock is optional; token exchange must hit the same app's /api/dev-oauth.
  const isOrphanLocalMock = /localhost:3010|127\.0\.0\.1:3010/i.test(
    configured
  );

  if (isPlaceholder || isOrphanLocalMock) {
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}/api/dev-oauth/`;
    }
    const port = process.env.PORT || "3000";
    return `http://localhost:${port}/api/dev-oauth/`;
  }

  return configured.endsWith("/") ? configured : `${configured}/`;
}

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: resolveOAuthServerUrl(),
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};
