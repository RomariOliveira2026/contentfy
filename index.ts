/**
 * Vercel entrypoint (Express serverless).
 * Local dev/production still use: pnpm dev / pnpm start → server/_core/index.ts
 */
import "dotenv/config";
import { createApp } from "./server/createApp";

// serveClient: SPA fallback via sendFile(public/index.html)
const app = createApp({ serveClient: true });

export default app;
