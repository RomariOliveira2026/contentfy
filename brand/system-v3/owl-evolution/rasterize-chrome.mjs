import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pngDir = join(__dirname, "png");
const svgDir = join(__dirname, "svg");
mkdirSync(pngDir, { recursive: true });

const chrome = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean).find((p) => existsSync(p));

if (!chrome) {
  console.error("Chrome/Edge not found");
  process.exit(1);
}

const JOBS = [
  { svg: "symbol-master.svg", width: 512, height: 512, out: "symbol-master-512.png", bg: "#F8FAFC" },
  { svg: "symbol-master.svg", width: 512, height: 512, out: "symbol-master-dark-512.png", bg: "#070B12" },
  { svg: "symbol-mono-dark.svg", width: 512, height: 512, out: "symbol-mono-dark-512.png", bg: "#F8FAFC" },
  { svg: "symbol-mono-light.svg", width: 512, height: 512, out: "symbol-mono-light-512.png", bg: "#070B12" },
  { svg: "micro-mark.svg", width: 64, height: 64, out: "micro-mark-64.png", bg: "#070B12", color: "#F8FAFC" },
  { svg: "micro-mark.svg", width: 32, height: 32, out: "micro-mark-32.png", bg: "#070B12", color: "#F8FAFC" },
  { svg: "micro-mark.svg", width: 16, height: 16, out: "micro-mark-16.png", bg: "#070B12", color: "#F8FAFC" },
  { svg: "app-icon.svg", width: 1024, height: 1024, out: "app-icon-1024.png" },
  { svg: "app-icon.svg", width: 512, height: 512, out: "app-icon-512.png" },
  { svg: "favicon.svg", width: 48, height: 48, out: "favicon-48.png" },
  { svg: "favicon.svg", width: 32, height: 32, out: "favicon-32.png" },
  { svg: "avatar.svg", width: 256, height: 256, out: "avatar-256.png" },
  { svg: "construction-grid.svg", width: 512, height: 512, out: "construction-grid-512.png" },
  { svg: "logo-horizontal.svg", width: 800, height: 144, out: "logo-horizontal-840.png", bg: "#070B12" },
  { svg: "logo-horizontal-on-light.svg", width: 800, height: 144, out: "logo-horizontal-on-light-840.png", bg: "#F8FAFC" },
  { svg: "logo-vertical.svg", width: 600, height: 420, out: "logo-vertical-560.png", bg: "#070B12" },
  { svg: "symbol-outline.svg", width: 512, height: 512, out: "symbol-outline-512.png", bg: "#F8FAFC", color: "#070B12" },
];

const tmp = join(tmpdir(), "cf-owl-evo");
mkdirSync(tmp, { recursive: true });
const toFileUrl = (p) => "file:///" + p.replace(/\\/g, "/");

for (const job of JOBS) {
  let svg = readFileSync(join(svgDir, job.svg), "utf8");
  if (job.color) svg = svg.replace(/currentColor/g, job.color);
  const bg = job.bg || "transparent";
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;width:${job.width}px;height:${job.height}px;background:${bg};overflow:hidden}
    .box{width:${job.width}px;height:${job.height}px;display:flex;align-items:center;justify-content:center}
    svg{width:90%;height:90%;display:block}
  </style></head><body><div class="box">${svg}</div></body></html>`;
  const htmlPath = join(tmp, job.out + ".html");
  writeFileSync(htmlPath, html);
  const outPath = join(pngDir, job.out);
  const r = spawnSync(chrome, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars",
    `--window-size=${job.width},${job.height}`,
    `--screenshot=${outPath}`,
    "--default-background-color=00000000",
    toFileUrl(htmlPath),
  ], { encoding: "utf8" });
  if (r.status !== 0) console.error("FAIL", job.out, r.stderr || r.stdout);
  else console.log("wrote", outPath);
}
console.log("Done.");
