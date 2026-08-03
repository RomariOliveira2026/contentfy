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

function mark(file) {
  return readFileSync(join(out, file), "utf8")
    .replace(/id="/g, 'id="v8')
    .replace(/url\(#/g, "url(#v8")
    .replace(/<svg[^>]*>/, "")
    .replace(/<\/svg>/, "")
    .trim();
}

const dark = wm("wordmark.svg");
const light = wm("wordmark-on-light.svg");
const master = mark("contentfy-symbol-master.svg");
const compact = mark("contentfy-symbol-compact.svg");

writeFileSync(
  join(out, "contentfy-logo-horizontal-master.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 90" role="img" aria-label="ContentFy">
  ${dark.defs}
  <g transform="translate(4,2) scale(0.55)">${master}</g>
  <g transform="translate(90,18) scale(1)">${dark.content}</g>
</svg>
`,
);

writeFileSync(
  join(out, "contentfy-logo-horizontal-master-on-light.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 90" role="img" aria-label="ContentFy">
  ${light.defs}
  <g transform="translate(4,2) scale(0.55)">${master}</g>
  <g transform="translate(90,18) scale(1)">${light.content}</g>
</svg>
`,
);

writeFileSync(
  join(out, "contentfy-logo-horizontal-compact.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 72" role="img" aria-label="ContentFy">
  ${dark.defs}
  <g transform="translate(2,0) scale(0.45)">${compact}</g>
  <g transform="translate(78,10) scale(0.9)">${dark.content}</g>
</svg>
`,
);

writeFileSync(
  join(out, "contentfy-logo-vertical-master.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 280" role="img" aria-label="ContentFy">
  ${dark.defs}
  <g transform="translate(76,4) scale(1)">${master}</g>
  <g transform="translate(-6,175) scale(0.95)">${dark.content}</g>
</svg>
`,
);

console.log("v8 lockups built");
