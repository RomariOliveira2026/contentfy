import express, { type Express } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./_core/oauth";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import { serveStatic } from "./_core/static";
import { setupStripeWebhook } from "./routers/stripe-webhook";
import { setupUploadRoute } from "./routes/upload";
import { registerDevOAuthPortal } from "./routes/devOAuthPortal";

export type CreateAppOptions = {
  /** Local production: serve dist/public via Express. On Vercel, CDN serves /public. */
  serveClient?: boolean;
};

/**
 * Shared Express app for local Node and Vercel serverless.
 */
export function createApp(options: CreateAppOptions = {}): Express {
  const { serveClient = process.env.VERCEL !== "1" } = options;
  const app = express();

  // Stripe webhook MUST be registered before express.json()
  setupStripeWebhook(app);

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerDevOAuthPortal(app);
  registerOAuthRoutes(app);
  setupUploadRoute(app);

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  if (serveClient) {
    serveStatic(app);
  }

  return app;
}
