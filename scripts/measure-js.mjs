/**
 * Measures the browser JavaScript each generated page asks the browser to load.
 * Usage: node scripts/measure-js.mjs [outDir] [--json]
 *
 * Per page it counts:
 *   - external module scripts (<script src> without nomodule): raw + gzip bytes
 *   - nomodule scripts (legacy polyfills; modern browsers skip them): gzip bytes
 *   - inline <script> bytes (incl. JSON-LD, reported separately)
 * Gzip level 9 approximates CDN transfer size. Run on the same build stage for
 * before/after comparisons.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { gzipSync } from "node:zlib";

const outDir = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "out";
const asJson = process.argv.includes("--json");
if (!existsSync(outDir)) {
  console.error(`${outDir} not found — build first.`);
  process.exit(1);
}

const walk = (d, acc = []) => {
  for (const n of readdirSync(d)) {
    const f = join(d, n);
    statSync(f).isDirectory() ? walk(f, acc) : acc.push(f);
  }
  return acc;
};
const gz = (buf) => gzipSync(buf, { level: 9 }).length;

const pages = walk(outDir)
  .filter((f) => f.endsWith(".html"))
  .filter((f) => !/(^|[/\\])(_not-found|404)[/\\]index\.html$/.test(relative(outDir, f)));

const rows = [];
for (const file of pages) {
  const html = readFileSync(file, "utf8");
  const path = "/" + relative(outDir, file).replace(/index\.html$/, "").replace(/\\/g, "/");
  let moduleRaw = 0, moduleGz = 0, nomoduleGz = 0, files = 0;
  for (const m of html.matchAll(/<script\b([^>]*)\bsrc="([^"]+)"[^>]*>/g)) {
    const attrs = m[1] + m[0];
    const src = m[2];
    if (!src.startsWith("/")) continue;
    const buf = readFileSync(join(outDir, src.split("?")[0]));
    if (/nomodule/i.test(attrs)) nomoduleGz += gz(buf);
    else { moduleRaw += buf.length; moduleGz += gz(buf); files++; }
  }
  let inlineJs = 0, jsonLd = 0;
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/\bsrc=/.test(m[1])) continue;
    if (/application\/ld\+json/.test(m[1])) jsonLd += Buffer.byteLength(m[2]);
    else inlineJs += Buffer.byteLength(m[2]);
  }
  rows.push({
    path,
    scriptFiles: files,
    moduleJsRaw: moduleRaw,
    moduleJsGzip: moduleGz,
    nomoduleGzip: nomoduleGz,
    inlineJsBytes: inlineJs,
    jsonLdBytes: jsonLd,
    htmlGzip: gz(Buffer.from(html)),
  });
}
rows.sort((a, b) => a.path.localeCompare(b.path));

if (asJson) console.log(JSON.stringify(rows, null, 2));
else {
  const kb = (n) => (n / 1024).toFixed(1).padStart(7);
  console.log("page".padEnd(26) + "files" + "  JS raw KB" + "  JS gz KB" + "  nomodule gz" + "  inline JS KB" + "  HTML gz KB");
  for (const r of rows)
    console.log(
      r.path.padEnd(26) + String(r.scriptFiles).padStart(5) + kb(r.moduleJsRaw).padStart(11) + kb(r.moduleJsGzip).padStart(10) +
        kb(r.nomoduleGzip).padStart(13) + kb(r.inlineJsBytes).padStart(14) + kb(r.htmlGzip).padStart(12),
    );
}
