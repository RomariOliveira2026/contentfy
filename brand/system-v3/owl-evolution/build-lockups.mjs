import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "svg");
const wordmarkDir = join(here, "..", "svg");

const owl = readFileSync(join(out, "symbol-master.svg"), "utf8")
  .replace(/<svg[^>]*>/, "")
  .replace(/<\/svg>/, "")
  .replace(/<defs>[\s\S]*?<\/defs>/, (m) => m); // keep defs

function wm(file) {
  const raw = readFileSync(join(wordmarkDir, file), "utf8");
  const defs = raw.match(/<defs>[\s\S]*?<\/defs>/)?.[0] ?? "";
  const content = raw
    .replace(/<svg[^>]*>/, "")
    .replace(/<\/svg>/, "")
    .replace(/<defs>[\s\S]*?<\/defs>/, "")
    .trim();
  return { defs, content };
}

const dark = wm("wordmark.svg");
const light = wm("wordmark-on-light.svg");

// Extract owl body without outer svg — re-id gradient to avoid clash
const owlInner = readFileSync(join(out, "symbol-master.svg"), "utf8")
  .replace(/id="ring"/g, 'id="owlRing"')
  .replace(/url\(#ring\)/g, "url(#owlRing)")
  .replace(/<svg[^>]*>/, "")
  .replace(/<\/svg>/, "")
  .trim();

const horizontalDark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 72" role="img" aria-label="ContentFy">
  ${dark.defs}
  <g transform="translate(2,4) scale(1)">
    ${owlInner}
  </g>
  <g transform="translate(78,8) scale(0.96)">
    ${dark.content}
  </g>
</svg>
`;

const horizontalLight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 72" role="img" aria-label="ContentFy">
  ${light.defs}
  <g transform="translate(2,4) scale(1)">
    ${owlInner}
  </g>
  <g transform="translate(78,8) scale(0.96)">
    ${light.content}
  </g>
</svg>
`;

const vertical = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 210" role="img" aria-label="ContentFy">
  ${dark.defs}
  <g transform="translate(110,8) scale(1.25)">
    ${owlInner}
  </g>
  <g transform="translate(4,100) scale(0.98)">
    ${dark.content}
  </g>
</svg>
`;

writeFileSync(join(out, "logo-horizontal.svg"), horizontalDark);
writeFileSync(join(out, "logo-horizontal-on-light.svg"), horizontalLight);
writeFileSync(join(out, "logo-vertical.svg"), vertical);
console.log("owl-evolution lockups built (wordmark unchanged)");
