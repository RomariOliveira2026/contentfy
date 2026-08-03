import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgDir = join(__dirname, "svg");
const pngDir = join(__dirname, "png");
mkdirSync(pngDir, { recursive: true });

const chrome = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
].filter(Boolean).find((p) => existsSync(p));

const JOBS = [
  { svg: "symbol-master.svg", w: 512, h: 512, out: "symbol-master-512.png", bg: "#F8FAFC" },
  { svg: "symbol-master.svg", w: 512, h: 512, out: "symbol-master-dark-512.png", bg: "#070B12" },
  { svg: "symbol-mono-dark.svg", w: 512, h: 512, out: "symbol-mono-dark-512.png", bg: "#F8FAFC" },
  { svg: "symbol-mono-light.svg", w: 512, h: 512, out: "symbol-mono-light-512.png", bg: "#070B12" },
  { svg: "symbol-silhouette.svg", w: 512, h: 512, out: "symbol-silhouette-512.png", bg: "#F8FAFC" },
  { svg: "symbol-outline.svg", w: 512, h: 512, out: "symbol-outline-512.png", bg: "#F8FAFC", color: "#070B12" },
  { svg: "micro-mark.svg", w: 64, h: 64, out: "micro-64.png", bg: "#070B12", color: "#F8FAFC" },
  { svg: "micro-mark.svg", w: 32, h: 32, out: "micro-32.png", bg: "#070B12", color: "#F8FAFC" },
  { svg: "micro-mark.svg", w: 24, h: 24, out: "micro-24.png", bg: "#070B12", color: "#F8FAFC" },
  { svg: "micro-mark.svg", w: 20, h: 20, out: "micro-20.png", bg: "#070B12", color: "#F8FAFC" },
  { svg: "micro-mark.svg", w: 16, h: 16, out: "micro-16.png", bg: "#070B12", color: "#F8FAFC" },
  { svg: "app-icon.svg", w: 1024, h: 1024, out: "app-icon-1024.png" },
  { svg: "app-icon.svg", w: 512, h: 512, out: "app-icon-512.png" },
  { svg: "favicon.svg", w: 48, h: 48, out: "favicon-48.png" },
  { svg: "favicon.svg", w: 32, h: 32, out: "favicon-32.png" },
  { svg: "avatar.svg", w: 256, h: 256, out: "avatar-256.png" },
  { svg: "construction-grid.svg", w: 512, h: 512, out: "construction-grid-512.png" },
  { svg: "logo-horizontal.svg", w: 840, h: 160, out: "logo-horizontal-840.png", bg: "#070B12" },
  { svg: "logo-horizontal-on-light.svg", w: 840, h: 160, out: "logo-horizontal-on-light-840.png", bg: "#F8FAFC" },
  { svg: "logo-vertical.svg", w: 560, h: 480, out: "logo-vertical-560.png", bg: "#070B12" },
];

const tmp = join(tmpdir(), "cf-v7");
mkdirSync(tmp, { recursive: true });
const toFileUrl = (p) => "file:///" + p.replace(/\\/g, "/");

for (const job of JOBS) {
  let svg = readFileSync(join(svgDir, job.svg), "utf8");
  if (job.color) svg = svg.replace(/currentColor/g, job.color);
  const bg = job.bg || "transparent";
  const html = `<!doctype html><html><head><style>
    html,body{margin:0;width:${job.w}px;height:${job.h}px;background:${bg};overflow:hidden}
    .b{width:${job.w}px;height:${job.h}px;display:flex;align-items:center;justify-content:center}
    svg{width:88%;height:88%;display:block}
  </style></head><body><div class="b">${svg}</div></body></html>`;
  writeFileSync(join(tmp, job.out + ".html"), html);
  const outPath = join(pngDir, job.out);
  const r = spawnSync(chrome, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars",
    `--window-size=${job.w},${job.h}`, `--screenshot=${outPath}`,
    toFileUrl(join(tmp, job.out + ".html")),
  ], { encoding: "utf8" });
  if (r.status !== 0) console.error("FAIL", job.out);
  else console.log("wrote", outPath);
}
console.log("Done");
