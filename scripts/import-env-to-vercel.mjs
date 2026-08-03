/**
 * Import local .env keys into a linked Vercel project.
 *
 * Usage:
 *   1) npx vercel login
 *   2) npx vercel link
 *   3) node scripts/import-env-to-vercel.mjs
 *   4) Optional: node scripts/import-env-to-vercel.mjs --yes
 *
 * Skips NODE_ENV. Warns when values look like localhost (still imports unless --skip-local).
 */
import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import readline from "node:readline";

const root = resolve(process.cwd());
const envPath = resolve(root, ".env");
const args = new Set(process.argv.slice(2));
const autoYes = args.has("--yes");
const skipLocal = args.has("--skip-local");
const targets = ["production", "preview", "development"];

const SKIP_KEYS = new Set(["NODE_ENV"]);

function parseEnv(content) {
  const out = [];
  for (const raw of content.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!key || SKIP_KEYS.has(key)) continue;
    out.push({ key, value });
  }
  return out;
}

function looksLocal(value) {
  return /localhost|127\.0\.0\.1|::1/i.test(value);
}

function ask(question) {
  if (autoYes) return Promise.resolve(true);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolveAsk) => {
    rl.question(question, (answer) => {
      rl.close();
      resolveAsk(/^y(es)?$/i.test(answer.trim()));
    });
  });
}

function addEnv(key, value, target) {
  const result = spawnSync(
    "npx",
    ["vercel", "env", "add", key, target, "--force"],
    {
      input: `${value}\n`,
      encoding: "utf8",
      shell: true,
      cwd: root,
    }
  );
  if (result.status !== 0) {
    const err = (result.stderr || result.stdout || "").trim();
    throw new Error(err || `Failed to add ${key} (${target})`);
  }
}

if (!existsSync(envPath)) {
  console.error("Missing .env in project root.");
  process.exit(1);
}

if (!existsSync(resolve(root, ".vercel/project.json"))) {
  console.error("Project not linked. Run: npx vercel link");
  process.exit(1);
}

const entries = parseEnv(readFileSync(envPath, "utf8"));
const localOnes = entries.filter((e) => looksLocal(e.value));

console.log(`Found ${entries.length} variables in .env (NODE_ENV skipped).`);
if (localOnes.length) {
  console.log("\nThese look like localhost (won't work in Production as-is):");
  for (const e of localOnes) console.log(`  - ${e.key}`);
}

const proceed = await ask("\nImport into Vercel (production/preview/development)? [y/N] ");
if (!proceed) {
  console.log("Cancelled.");
  process.exit(0);
}

let imported = 0;
let skipped = 0;

for (const { key, value } of entries) {
  if (skipLocal && looksLocal(value)) {
    console.log(`skip (local): ${key}`);
    skipped++;
    continue;
  }
  for (const target of targets) {
    process.stdout.write(`→ ${key} [${target}] ... `);
    try {
      addEnv(key, value, target);
      console.log("ok");
      imported++;
    } catch (err) {
      console.log("fail");
      console.error(`  ${err.message}`);
    }
  }
}

console.log(`\nDone. Writes attempted: ${imported}. Skipped: ${skipped}.`);
console.log("Open Vercel → Project → Settings → Environment Variables to review.");
console.log(
  "Tip: replace localhost URLs, DATABASE_URL, OAuth portal and Stripe keys for Production."
);
