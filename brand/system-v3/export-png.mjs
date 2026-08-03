/**
 * Rasterize brand SVGs → PNG (transparent where applicable).
 * Usage: node brand/system-v3/export-png.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgDir = join(__dirname, "svg");
const pngDir = join(__dirname, "png");
mkdirSync(pngDir, { recursive: true });

const require = createRequire(import.meta.url);

async function loadResvg() {
  try {
    return require("@resvg/resvg-js");
  } catch {
    console.error("Installing @resvg/resvg-js locally for export...");
    const { execSync } = await import("node:child_process");
    execSync("npm install --no-save @resvg/resvg-js", {
      cwd: join(__dirname, "../.."),
      stdio: "inherit",
    });
    return require("@resvg/resvg-js");
  }
}

const SIZES = {
  "symbol-filled.svg": [64, 128, 256, 512],
  "symbol-mono-dark.svg": [64, 128, 256, 512],
  "symbol-mono-light.svg": [64, 128, 256, 512],
  "micro-mark.svg": [16, 32, 64],
  "favicon.svg": [16, 32, 48],
  "app-icon.svg": [180, 512, 1024],
  "avatar.svg": [128, 256, 512],
  "logo-horizontal.svg": [420, 840],
  "logo-horizontal-on-light.svg": [420, 840],
  "logo-vertical.svg": [280, 560],
  "wordmark.svg": [312, 624],
  "wordmark-on-light.svg": [312, 624],
};

const { Resvg } = await loadResvg();

for (const file of readdirSync(svgDir)) {
  if (!file.endsWith(".svg") || file.startsWith("_")) continue;
  const sizes = SIZES[file] || [256];
  const svg = readFileSync(join(svgDir, file));
  for (const width of sizes) {
    const resvg = new Resvg(svg, {
      fitTo: { mode: "width", value: width },
      background: "rgba(0,0,0,0)",
    });
    const png = resvg.render().asPng();
    const base = file.replace(/\.svg$/, "");
    const out = join(pngDir, `${base}-${width}.png`);
    writeFileSync(out, png);
    console.log("wrote", out);
  }
}

console.log("Done.");
