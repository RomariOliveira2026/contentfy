/**
 * Local mock for Manus/WebDev OAuth portal (port 3010).
 * Dev-only: makes "Entrar" work when the real portal is unavailable.
 *
 * Endpoints:
 *  GET  /app-auth
 *  POST /webdev.v1.WebDevAuthPublicService/ExchangeToken
 *  POST /webdev.v1.WebDevAuthPublicService/GetUserInfo
 *  POST /webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt
 */
import http from "node:http";
import { URL } from "node:url";

const PORT = Number(process.env.PORT || process.env.MOCK_OAUTH_PORT || 3010);
const HOST = process.env.HOST || "0.0.0.0";

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://localhost:${PORT}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    });
    res.end();
    return;
  }

  // Browser login entry
  if (req.method === "GET" && url.pathname === "/app-auth") {
    const redirectUri = url.searchParams.get("redirectUri");
    const state = url.searchParams.get("state") || "";
    if (!redirectUri) {
      sendJson(res, 400, { error: "redirectUri is required" });
      return;
    }
    try {
      const dest = new URL(redirectUri);
      dest.searchParams.set("code", "contentfy-dev-code");
      dest.searchParams.set("state", state);
      res.writeHead(302, { Location: dest.toString() });
      res.end();
      console.log(`[mock-oauth] redirect → ${dest.toString()}`);
    } catch {
      sendJson(res, 400, { error: "invalid redirectUri" });
    }
    return;
  }

  if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/health")) {
    sendJson(res, 200, {
      ok: true,
      service: "contentfy-mock-oauth",
      port: PORT,
      hint: "Use ContentFy Entrar → this portal → callback on :3001",
    });
    return;
  }

  const path = url.pathname;
  const body = req.method === "POST" ? await readBody(req) : {};

  if (
    req.method === "POST" &&
    path.includes("ExchangeToken")
  ) {
    sendJson(res, 200, {
      accessToken: "dev-access-token",
      tokenType: "Bearer",
      expiresIn: 3600,
      scope: "openid profile email",
      idToken: "dev-id-token",
      refreshToken: "dev-refresh-token",
    });
    console.log("[mock-oauth] ExchangeToken ok", body?.clientId || "");
    return;
  }

  if (
    req.method === "POST" &&
    (path.includes("GetUserInfoWithJwt") || path.includes("GetUserInfo"))
  ) {
    sendJson(res, 200, {
      openId: "contentfy-dev-user",
      projectId: body?.projectId || "contentfy-local",
      name: "Aluno ContentFy",
      email: "aluno@contentfy.local",
      platform: "REGISTERED_PLATFORM_EMAIL",
      loginMethod: "email",
    });
    console.log("[mock-oauth] GetUserInfo ok");
    return;
  }

  sendJson(res, 404, { error: "not found", path });
});

server.listen(PORT, HOST, () => {
  console.log(`[mock-oauth] listening on http://${HOST}:${PORT}`);
  console.log(`[mock-oauth] /app-auth ready for ContentFy login`);
});
