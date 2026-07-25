import type { Express, Request, Response } from "express";

/**
 * Built-in mock OAuth portal for local/Vercel when the real Manus portal is unavailable.
 * Mounted at /api/dev-oauth so Vercel rewrites send traffic to the Express function.
 *
 * Set on Vercel:
 *   VITE_OAUTH_PORTAL_URL=https://contentfy-pi.vercel.app/api/dev-oauth
 *   OAUTH_SERVER_URL=https://contentfy-pi.vercel.app/api/dev-oauth/
 */
export function registerDevOAuthPortal(app: Express) {
  const enabled = process.env.ENABLE_DEV_OAUTH !== "0";
  if (!enabled) return;

  app.get("/api/dev-oauth/health", (_req, res) => {
    res.json({
      ok: true,
      service: "contentfy-dev-oauth",
      hint: "Use Entrar → /api/dev-oauth/app-auth → /api/oauth/callback",
    });
  });

  app.get("/api/dev-oauth/app-auth", (req: Request, res: Response) => {
    const redirectUri = typeof req.query.redirectUri === "string" ? req.query.redirectUri : "";
    const state = typeof req.query.state === "string" ? req.query.state : "";
    if (!redirectUri) {
      res.status(400).json({ error: "redirectUri is required" });
      return;
    }
    try {
      const dest = new URL(redirectUri);
      dest.searchParams.set("code", "contentfy-dev-code");
      dest.searchParams.set("state", state);
      console.log(`[dev-oauth] redirect → ${dest.toString()}`);
      res.redirect(302, dest.toString());
    } catch {
      res.status(400).json({ error: "invalid redirectUri" });
    }
  });

  app.post(
    "/api/dev-oauth/webdev.v1.WebDevAuthPublicService/ExchangeToken",
    (req, res) => {
      console.log("[dev-oauth] ExchangeToken ok", req.body?.clientId || "");
      res.json({
        accessToken: "dev-access-token",
        tokenType: "Bearer",
        expiresIn: 3600,
        scope: "openid profile email",
        idToken: "dev-id-token",
        refreshToken: "dev-refresh-token",
      });
    }
  );

  app.post(
    [
      "/api/dev-oauth/webdev.v1.WebDevAuthPublicService/GetUserInfo",
      "/api/dev-oauth/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt",
    ],
    (req, res) => {
      console.log("[dev-oauth] GetUserInfo ok");
      res.json({
        openId: "contentfy-dev-user",
        projectId: req.body?.projectId || "contentfy-prod",
        name: "Aluno ContentFy",
        email: "aluno@contentfy.local",
        platform: "REGISTERED_PLATFORM_EMAIL",
        loginMethod: "email",
      });
    }
  );

  console.log("[dev-oauth] mounted at /api/dev-oauth");
}
