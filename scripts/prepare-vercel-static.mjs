/**
 * Copy Vite build output to /public so Vercel CDN can serve the SPA.
 * (Express static() is ignored on Vercel.)
 */
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const from = resolve(root, "dist/public");
const to = resolve(root, "public");

if (!existsSync(from)) {
  console.error(`[prepare-vercel-static] Missing ${from}. Run vite build first.`);
  process.exit(1);
}

rmSync(to, { recursive: true, force: true });
mkdirSync(to, { recursive: true });
cpSync(from, to, { recursive: true });
console.log(`[prepare-vercel-static] Copied dist/public → public`);
