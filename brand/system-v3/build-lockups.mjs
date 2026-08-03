import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "svg");
const athena = `M22.2 8.4c1.1-2.4 3.2-4 5.6-4.2.9-.1 1.8.1 2.6.6L32 6.2l1.6-1.4c.8-.5 1.7-.7 2.6-.6 2.4.2 4.5 1.8 5.6 4.2l8.8 8.2c1.5 1.4 2.4 3.4 2.4 5.6v13.6c0 4.5-2.3 8.7-6.1 11.3L32 61.2 17.1 47.1c-3.8-2.6-6.1-6.8-6.1-11.3V22.2c0-2.2.9-4.2 2.4-5.6l8.8-8.2zM19.4 29a4.3 4.3 0 1 0 8.6 0a4.3 4.3 0 1 0-8.6 0zm16.6 0a4.3 4.3 0 1 0 8.6 0a4.3 4.3 0 1 0-8.6 0zM32 35.8l-3.5 6.8h7L32 35.8z`;

function extractWordmarkInner(file, keepGradId = "fyGrad") {
  const raw = readFileSync(join(dir, file), "utf8");
  const defs = raw.match(/<defs>[\s\S]*?<\/defs>/)?.[0] ?? "";
  const content = raw
    .replace(/<svg[^>]*>/, "")
    .replace(/<\/svg>/, "")
    .replace(/<defs>[\s\S]*?<\/defs>/, "")
    .trim();
  return { defs, content };
}

const darkWm = extractWordmarkInner("wordmark.svg");
const lightWm = extractWordmarkInner("wordmark-on-light.svg");

const horizontalDark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 72" role="img" aria-label="ContentFy">
  ${darkWm.defs}
  <g transform="translate(2,4) scale(1)" fill="#F97316">
    <path fill-rule="evenodd" d="${athena}"/>
  </g>
  <g transform="translate(78,8) scale(0.96)">
    ${darkWm.content}
  </g>
</svg>
`;

const horizontalLight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 72" role="img" aria-label="ContentFy">
  ${lightWm.defs}
  <g transform="translate(2,4)" fill="#F97316">
    <path fill-rule="evenodd" d="${athena}"/>
  </g>
  <g transform="translate(78,8) scale(0.96)">
    ${lightWm.content}
  </g>
</svg>
`;

const vertical = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 210" role="img" aria-label="ContentFy">
  ${darkWm.defs}
  <g transform="translate(110,8) scale(1.25)" fill="#F97316">
    <path fill-rule="evenodd" d="${athena}"/>
  </g>
  <g transform="translate(4,100) scale(0.98)">
    ${darkWm.content}
  </g>
</svg>
`;

writeFileSync(join(dir, "logo-horizontal.svg"), horizontalDark);
writeFileSync(join(dir, "logo-horizontal-on-light.svg"), horizontalLight);
writeFileSync(join(dir, "logo-vertical.svg"), vertical);
console.log("lockups built");
