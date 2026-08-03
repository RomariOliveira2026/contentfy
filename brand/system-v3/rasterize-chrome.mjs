/**
 * PNG export via Chrome headless — embeds SVG inline (no file:// image quirks).
 * node brand/system-v3/rasterize-chrome.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pngDir = join(__dirname, "png");
const svgDir = join(__dirname, "svg");
mkdirSync(pngDir, { recursive: true });

const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);

const chrome = chromeCandidates.find((p) => existsSync(p));
if (!chrome) {
  console.error("Chrome/Edge not found.");
  process.exit(1);
}

const JOBS = [
  { svg: "app-icon.svg", width: 1024, height: 1024, out: "app-icon-1024.png" },
  { svg: "app-icon.svg", width: 512, height: 512, out: "app-icon-512.png" },
  { svg: "favicon.svg", width: 48, height: 48, out: "favicon-48.png" },
  { svg: "favicon.svg", width: 32, height: 32, out: "favicon-32.png" },
  { svg: "avatar.svg", width: 256, height: 256, out: "avatar-256.png" },
  { svg: "symbol-mono-dark.svg", width: 512, height: 512, out: "symbol-mono-dark-512.png" },
  { svg: "symbol-mono-light.svg", width: 512, height: 512, out: "symbol-mono-light-512.png", bg: "#070B12" },
  { svg: "micro-mark.svg", width: 64, height: 64, out: "micro-mark-64.png", bg: "#070B12", invert: true },
  { svg: "logo-horizontal.svg", width: 800, height: 144, out: "logo-horizontal-840.png", bg: "#070B12" },
  { svg: "logo-horizontal-on-light.svg", width: 800, height: 144, out: "logo-horizontal-on-light-840.png", bg: "#F8FAFC" },
  { svg: "logo-vertical.svg", width: 600, height: 420, out: "logo-vertical-560.png", bg: "#070B12" },
  { svg: "wordmark.svg", width: 624, height: 120, out: "wordmark-624.png", bg: "#070B12" },
  { svg: "wordmark-on-light.svg", width: 624, height: 120, out: "wordmark-on-light-624.png", bg: "#F8FAFC" },
];

const tmp = join(tmpdir(), "cf-brand-raster");
mkdirSync(tmp, { recursive: true });

function toFileUrl(p) {
  return "file:///" + p.replace(/\\/g, "/");
}

for (const job of JOBS) {
  let svg = readFileSync(join(svgDir, job.svg), "utf8");
  if (job.invert) {
    svg = svg.replace(/currentColor/g, "#F8FAFC");
  }
  const bg = job.bg || "transparent";
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;width:${job.width}px;height:${job.height}px;background:${bg};overflow:hidden;}
    .box{width:${job.width}px;height:${job.height}px;display:flex;align-items:center;justify-content:center;}
    svg{width:92%;height:92%;display:block;}
  </style></head><body><div class="box">${svg}</div></body></html>`;
  const htmlPath = join(tmp, `${job.out}.html`);
  writeFileSync(htmlPath, html);
  const outPath = join(pngDir, job.out);
  const r = spawnSync(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      `--window-size=${job.width},${job.height}`,
      `--screenshot=${outPath}`,
      "--default-background-color=00000000",
      toFileUrl(htmlPath),
    ],
    { encoding: "utf8" },
  );
  if (r.status !== 0) console.error("FAIL", job.out, r.stderr || r.stdout);
  else console.log("wrote", outPath);
}

console.log("Done.");
