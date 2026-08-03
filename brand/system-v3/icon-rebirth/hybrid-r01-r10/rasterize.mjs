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

const FILES = [
  "P1-fold-aperture.svg",
  "P2-axis-lens.svg",
  "P3-twin-pane.svg",
  "P1-micro.svg",
  "P2-micro.svg",
  "P3-micro.svg",
];

const SIZES = [16, 32, 64, 512];
const tmp = join(tmpdir(), "cf-hybrid");
mkdirSync(tmp, { recursive: true });
const toFileUrl = (p) => "file:///" + p.replace(/\\/g, "/");

for (const file of FILES) {
  const master = !file.includes("micro");
  const sizes = master ? SIZES : [16, 32];
  let svg = readFileSync(join(svgDir, file), "utf8").replace(/currentColor/g, "#070B12");
  for (const size of sizes) {
    const pad = Math.round(size * 0.08);
    const html = `<!doctype html><html><head><style>
      html,body{margin:0;width:${size}px;height:${size}px;background:#F8FAFC;overflow:hidden}
      .b{width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;padding:${pad}px;box-sizing:border-box}
      svg{width:100%;height:100%;display:block}
    </style></head><body><div class="b">${svg}</div></body></html>`;
    const htmlPath = join(tmp, `${file}-${size}.html`);
    writeFileSync(htmlPath, html);
    const out = join(pngDir, `${file.replace(".svg", "")}-${size}.png`);
    const r = spawnSync(chrome, [
      "--headless=new", "--disable-gpu", "--hide-scrollbars",
      `--window-size=${size},${size}`, `--screenshot=${out}`,
      toFileUrl(htmlPath),
    ], { encoding: "utf8" });
    if (r.status !== 0) console.error("FAIL", out);
    else console.log("wrote", out);
  }
}
console.log("Done");
