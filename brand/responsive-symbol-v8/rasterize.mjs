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
  { svg: "contentfy-symbol-master.svg", w: 512, h: 616, out: "contentfy-symbol-master-512.png", bg: "transparent" },
  { svg: "contentfy-symbol-compact.svg", w: 512, h: 616, out: "contentfy-symbol-compact-512.png", bg: "transparent" },
  { svg: "contentfy-symbol-micro.svg", w: 256, h: 256, out: "contentfy-symbol-micro-256.png", bg: "transparent" },
  { svg: "contentfy-symbol-master-mono-dark.svg", w: 512, h: 616, out: "contentfy-symbol-master-mono-dark-512.png", bg: "transparent" },
  { svg: "contentfy-symbol-master-mono-light.svg", w: 512, h: 616, out: "contentfy-symbol-master-mono-light-512.png", bg: "#070B12" },
  { svg: "contentfy-symbol-compact-mono.svg", w: 512, h: 616, out: "contentfy-symbol-compact-mono-512.png", bg: "transparent", color: "#070B12" },
  { svg: "contentfy-symbol-micro-mono.svg", w: 128, h: 128, out: "contentfy-symbol-micro-mono-128.png", bg: "transparent", color: "#070B12" },
  { svg: "contentfy-symbol-silhouette.svg", w: 512, h: 616, out: "contentfy-symbol-silhouette-512.png", bg: "transparent" },
  { svg: "contentfy-construction-grid.svg", w: 512, h: 616, out: "contentfy-construction-grid-512.png", bg: "#F8FAFC" },
  { svg: "contentfy-app-icon.svg", w: 1024, h: 1024, out: "contentfy-app-icon-1024.png", bg: "transparent" },
  { svg: "contentfy-app-icon.svg", w: 512, h: 512, out: "contentfy-app-icon-512.png", bg: "transparent" },
  { svg: "contentfy-favicon.svg", w: 48, h: 48, out: "contentfy-favicon-48.png", bg: "transparent" },
  { svg: "contentfy-favicon.svg", w: 32, h: 32, out: "contentfy-favicon-32.png", bg: "transparent" },
  { svg: "contentfy-avatar.svg", w: 256, h: 256, out: "contentfy-avatar-256.png", bg: "transparent" },
  { svg: "contentfy-symbol-micro-mono.svg", w: 16, h: 16, out: "micro-16.png", bg: "#070B12", color: "#F8FAFC" },
  { svg: "contentfy-symbol-micro-mono.svg", w: 20, h: 20, out: "micro-20.png", bg: "#070B12", color: "#F8FAFC" },
  { svg: "contentfy-symbol-micro-mono.svg", w: 24, h: 24, out: "micro-24.png", bg: "#070B12", color: "#F8FAFC" },
  { svg: "contentfy-symbol-micro-mono.svg", w: 32, h: 32, out: "micro-32.png", bg: "#070B12", color: "#F8FAFC" },
  { svg: "contentfy-logo-horizontal-master.svg", w: 880, h: 180, out: "logo-horizontal-master-880.png", bg: "#070B12" },
  { svg: "contentfy-logo-horizontal-master-on-light.svg", w: 880, h: 180, out: "logo-horizontal-master-on-light-880.png", bg: "#F8FAFC" },
  { svg: "contentfy-logo-horizontal-compact.svg", w: 800, h: 144, out: "logo-horizontal-compact-800.png", bg: "#070B12" },
  { svg: "contentfy-logo-vertical-master.svg", w: 560, h: 560, out: "logo-vertical-master-560.png", bg: "#070B12" },
  // approval helpers on light
  { svg: "contentfy-symbol-master.svg", w: 512, h: 616, out: "contentfy-symbol-master-on-light-512.png", bg: "#F8FAFC" },
  { svg: "contentfy-symbol-compact.svg", w: 512, h: 616, out: "contentfy-symbol-compact-on-light-512.png", bg: "#F8FAFC" },
  { svg: "contentfy-symbol-micro.svg", w: 256, h: 256, out: "contentfy-symbol-micro-on-light-256.png", bg: "#F8FAFC" },
];

const tmp = join(tmpdir(), "cf-v8");
mkdirSync(tmp, { recursive: true });
const toFileUrl = (p) => "file:///" + p.replace(/\\/g, "/");

for (const job of JOBS) {
  let svg = readFileSync(join(svgDir, job.svg), "utf8");
  if (job.color) svg = svg.replace(/currentColor/g, job.color);
  const bg = job.bg ?? "transparent";
  const html = `<!doctype html><html><head><style>
    html,body{margin:0;width:${job.w}px;height:${job.h}px;background:${bg};overflow:hidden}
    .b{width:${job.w}px;height:${job.h}px;display:flex;align-items:center;justify-content:center}
    svg{width:88%;height:88%;display:block}
  </style></head><body><div class="b">${svg}</div></body></html>`;
  writeFileSync(join(tmp, job.out + ".html"), html);
  const outPath = join(pngDir, job.out);
  const r = spawnSync(chrome, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars",
    "--default-background-color=00000000",
    `--window-size=${job.w},${job.h}`, `--screenshot=${outPath}`,
    toFileUrl(join(tmp, job.out + ".html")),
  ], { encoding: "utf8" });
  if (r.status !== 0) console.error("FAIL", job.out, r.stderr?.slice?.(0, 200));
  else console.log("wrote", outPath);
}
console.log("Done");
