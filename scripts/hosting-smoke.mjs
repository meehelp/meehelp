/**
 * npm run smoke:hosting — local reproduction of the Vercel static hosting
 * behaviour for the release-review build, then a smoke test against it.
 *
 *   1. builds SITE_STAGE=release-review (unless --no-build)
 *   2. serves dist/ applying vercel.json: trailingSlash 308 redirects, header
 *      rules (incl. `has` host conditions), directory index files, and
 *      404.html with HTTP 404
 *   3. checks routes, redirects, 404s, assets, robots.txt, sitemap.xml,
 *      canonical/robots meta, store links, headers, and (with Chromium) CSP
 *      violations, console errors, fonts and images on every release page
 *
 * Exit code 1 on any failure. Nothing is deployed; no network access beyond localhost.
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { createServer, request as httpRequest } from "node:http";
import { extname, join, normalize } from "node:path";

const ROOT = process.cwd();
const DIST = join(ROOT, "dist");
const RELEASE = [
  "/", "/pricing/", "/maid/", "/cook/", "/babysitter-nanny/", "/elder-care/", "/patient-care/",
  "/hourly-maid/", "/hourly-cook/", "/hourly-babysitter/", "/hourly-elder-care/", "/hourly-patient-care/",
  "/maid/mumbai/", "/maid/delhi-ncr/", "/cook/mumbai/", "/one-time-cleaning/",
];
const EXCLUDED_SAMPLE = ["/maid/bengaluru/", "/hourly-maid/mumbai/", "/elder-care/pune/", "/patient-care/kolkata/", "/hourly-cook/pune/", "/maid/mumbai/andheri-west/", "/no-such-page/"];

if (!process.argv.includes("--no-build")) {
  execSync("npm run build:release-review", { stdio: "inherit", env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" } });
}

const vercel = JSON.parse(readFileSync(join(ROOT, "vercel.json"), "utf8"));
const types = { ".html": "text/html; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml; charset=utf-8", ".png": "image/png", ".ttf": "font/ttf", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".webmanifest": "application/manifest+json", ".json": "application/json" };

/** vercel.json `source` (simple path-to-regexp subset used here) → RegExp. */
const sourceToRegExp = (src) => new RegExp(`^${src.replace(/\//g, "\\/")}$`);
function headersFor(path, host) {
  const out = {};
  for (const rule of vercel.headers ?? []) {
    if (!sourceToRegExp(rule.source).test(path)) continue;
    if (rule.has && !rule.has.every((h) => h.type === "host" && new RegExp(`^${h.value}$`).test(host))) continue;
    for (const h of rule.headers) out[h.key] = h.value;
  }
  return out;
}

const server = createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  const path = decodeURIComponent(url.pathname);
  const host = (req.headers.host ?? "").split(":")[0];
  const send = (status, file, extra = {}) => {
    const body = file ? readFileSync(file) : Buffer.alloc(0);
    res.writeHead(status, { "Content-Type": file ? types[extname(file)] ?? "application/octet-stream" : "text/plain", ...headersFor(path, host), ...extra });
    res.end(req.method === "HEAD" ? undefined : body);
  };
  // trailingSlash: true → 308 for extension-less paths without a trailing slash.
  if (vercel.trailingSlash && !path.endsWith("/") && !extname(path)) return send(308, null, { Location: `${path}/${url.search}` });
  const safe = normalize(path).replace(/^(\.\.[/\\])+/, "");
  let file = join(DIST, safe);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (existsSync(file) && statSync(file).isFile()) return send(200, file);
  return send(404, join(DIST, "404.html"));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

const failures = [];
const check = (ok, msg) => {
  if (!ok) failures.push(msg);
};
const get = (p, opts = {}) => fetch(base + p, { redirect: "manual", ...opts });

// ---------- Inventory on disk ----------
const htmlPages = [];
(function walk(d) {
  for (const n of readdirSync(d)) {
    const f = join(d, n);
    if (statSync(f).isDirectory()) walk(f);
    else if (n === "index.html") htmlPages.push("/" + f.slice(DIST.length + 1).replace(/index\.html$/, ""));
  }
})(DIST);
check(JSON.stringify(htmlPages.map((p) => p.replace(/^\/\//, "/")).sort()) === JSON.stringify([...RELEASE].sort()), `dist pages ≠ the 16 release pages: ${htmlPages.sort().join(", ")}`);
const jsFiles = execSync(`find "${DIST}" -name "*.js" -o -name "*.mjs"`).toString().trim();
check(jsFiles === "", `JavaScript files in dist: ${jsFiles}`);

// ---------- Routes ----------
const assetRefs = new Set();
for (const p of RELEASE) {
  const r = await get(p);
  check(r.status === 200, `${p} → ${r.status}`);
  const html = await r.text();
  check(/text\/html/.test(r.headers.get("content-type") ?? ""), `${p} content-type ${r.headers.get("content-type")}`);
  for (const h of ["x-content-type-options", "referrer-policy", "permissions-policy", "content-security-policy", "x-frame-options"]) check(r.headers.get(h), `${p} missing ${h}`);
  check(!r.headers.get("x-robots-tag"), `${p}: X-Robots-Tag must apply to *.vercel.app hosts only`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  check(canonical === `https://meehelp.in${p}`, `${p} canonical ${canonical}`);
  check(/<meta name="robots" content="noindex, nofollow, noarchive"/.test(html), `${p} robots meta`);
  check(!/vercel\.app|vercel\.com/i.test(html), `${p} mentions a Vercel hostname`);
  for (const m of html.matchAll(/(?:src|href)="(\/[^"#?]*\.(?:png|ttf|svg|ico|webmanifest|json|txt|xml))"/g)) assetRefs.add(m[1]);
  for (const m of html.matchAll(/url\((\/[^)]+)\)/g)) assetRefs.add(m[1]);
  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const t = m[1];
    if (!extname(t)) check(RELEASE.includes(t), `${p} links to ${t} (not in the release build)`);
  }
  for (const m of html.matchAll(/href="(https:\/\/(?:play\.google\.com|apps\.apple\.com)[^"]*)"/g)) {
    const u = m[1].replace(/&amp;/g, "&");
    check(u.startsWith("https://play.google.com/store/apps/details?id=com.meehelp.meehelp") || u.startsWith("https://apps.apple.com/in/app/meehelp-find-helpers-near-you/id1625634794"), `${p} unexpected store link ${u}`);
  }
  // Refresh on a nested route and the slash-less form.
  if (p !== "/") {
    const noSlash = await get(p.slice(0, -1));
    check(noSlash.status === 308 && noSlash.headers.get("location") === p, `${p.slice(0, -1)} → ${noSlash.status} ${noSlash.headers.get("location")}`);
    check((await get(p)).status === 200, `${p} second request (refresh) failed`);
  }
}
// ---------- Assets ----------
for (const a of assetRefs) {
  const r = await get(a);
  check(r.status === 200, `asset ${a} → ${r.status}`);
  if (a.endsWith(".ttf")) check(r.headers.get("content-type") === "font/ttf", `${a} content-type ${r.headers.get("content-type")}`);
  if (/^\/(fonts|brand|og)\//.test(a)) check(/max-age=604800/.test(r.headers.get("cache-control") ?? ""), `${a} cache-control`);
}
check((await get("/og/meehelp-og.png")).status === 200, "OG image missing");
// ---------- 404s and excluded pages ----------
for (const p of EXCLUDED_SAMPLE) {
  const r = await get(p);
  const body = await r.text();
  check(r.status === 404, `${p} → ${r.status} (expected 404)`);
  check(/noindex/.test(body), `${p} 404 body is not the noindex 404 page`);
}
// ---------- robots / sitemap ----------
const robots = await get("/robots.txt");
check(robots.status === 200 && /^User-Agent: \*\nDisallow: \/\n/m.test(await robots.text()), "robots.txt must Disallow: /");
const sitemap = await get("/sitemap.xml");
const sm = await sitemap.text();
check(sitemap.status === 200 && !/<loc>/.test(sm), "sitemap.xml must contain no URLs");
// ---------- vercel.app host gets X-Robots-Tag; meehelp.in host does not ----------
const headWithHost = (hostName) =>
  new Promise((resolve) => {
    const req = httpRequest({ host: "127.0.0.1", port: server.address().port, path: "/", method: "GET", headers: { host: hostName } }, (res) => {
      res.resume();
      resolve(res.headers);
    });
    req.on("error", () => resolve({}));
    req.end();
  });
check((await headWithHost("meehelp-review-abc123.vercel.app"))["x-robots-tag"] === "noindex, nofollow, noarchive", "*.vercel.app host must get X-Robots-Tag: noindex, nofollow, noarchive");
check(!(await headWithHost("meehelp.in"))["x-robots-tag"], "meehelp.in host must not get X-Robots-Tag from vercel.json");

// ---------- Browser: CSP, console, fonts, images ----------
let browserChecked = 0;
try {
  const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs").catch(() => import("playwright"));
  const browser = await chromium.launch();
  for (const p of RELEASE) {
    const page = await browser.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("requestfailed", (r) => errors.push(`request failed ${r.url()}`));
    await page.addInitScript(() => document.addEventListener("securitypolicyviolation", (e) => console.error(`CSP ${e.violatedDirective} ${e.blockedURI}`)));
    await page.goto(base + p, { waitUntil: "networkidle" });
    const result = await page.evaluate(async () => {
      await document.fonts.ready;
      return {
        lexend: [...document.fonts].some((f) => /lexend/i.test(f.family) && f.status === "loaded"),
        brokenImages: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.loading !== "lazy").map((i) => i.src),
        scripts: [...document.scripts].filter((s) => s.type !== "application/ld+json").length,
        jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].every((s) => { try { JSON.parse(s.textContent); return true; } catch { return false; } }),
      };
    });
    check(errors.length === 0, `${p} browser errors: ${errors.join(" | ")}`);
    check(result.lexend, `${p} Lexend font did not load`);
    check(result.brokenImages.length === 0, `${p} broken images: ${result.brokenImages.join(", ")}`);
    check(result.scripts === 0, `${p} has ${result.scripts} executable script(s)`);
    check(result.jsonLd, `${p} invalid JSON-LD`);
    browserChecked++;
    await page.close();
  }
  await browser.close();
} catch (e) {
  failures.push(`browser checks could not run: ${e.message}`);
}

server.close();
console.log(`hosting smoke: ${RELEASE.length} pages, ${assetRefs.size} assets, ${EXCLUDED_SAMPLE.length} excluded paths, ${browserChecked} pages in Chromium`);
if (failures.length) {
  for (const f of failures) console.log(`✗ ${f}`);
  process.exit(1);
}
console.log("✓ all hosting checks passed");
