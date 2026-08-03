import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "svg");
const wmDir = join(here, "..", "system-v3", "svg");

function wm(file) {
  const raw = readFileSync(join(wmDir, file), "utf8");
  const defs = raw.match(/<defs>[\s\S]*?<\/defs>/)?.[0] ?? "";
  const content = raw
    .replace(/<svg[^>]*>/, "")
    .replace(/<\/svg>/, "")
    .replace(/<defs>[\s\S]*?<\/defs>/, "")
    .trim();
  return { defs, content };
}

const master = readFileSync(join(out, "symbol-master.svg"), "utf8")
  .replace(/id="/g, 'id="v6')
  .replace(/url\(#/g, "url(#v6")
  .replace(/<svg[^>]*>/, "")
  .replace(/<\/svg>/, "")
  .trim();

const dark = wm("wordmark.svg");
const light = wm("wordmark-on-light.svg");

writeFileSync(
  join(out, "logo-horizontal.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 80" role="img" aria-label="ContentFy">
  ${dark.defs}
  <g transform="translate(4,2) scale(0.58)">${master}</g>
  <g transform="translate(92,12) scale(0.95)">${dark.content}</g>
</svg>
`,
);

writeFileSync(
  join(out, "logo-horizontal-on-light.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 80" role="img" aria-label="ContentFy">
  ${light.defs}
  <g transform="translate(4,2) scale(0.58)">${master}</g>
  <g transform="translate(92,12) scale(0.95)">${light.content}</g>
</svg>
`,
);

writeFileSync(
  join(out, "logo-vertical.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 240" role="img" aria-label="ContentFy">
  ${dark.defs}
  <g transform="translate(76,4) scale(1)">${master}</g>
  <g transform="translate(-6,145) scale(0.95)">${dark.content}</g>
</svg>
`,
);

console.log("v6 lockups built");
