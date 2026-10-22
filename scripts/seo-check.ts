/**
 * npm run seo  — build the static site and validate the generated HTML.
 *
 *   npm run seo                     production build (default)
 *   npm run seo -- --stage=preview  preview build (everything must be noindex)
 *   npm run seo -- --stage=release-review  first-release review build: exactly the
 *                                   approved release pages, noindex/noarchive, no placeholders
 *   npm run seo -- --no-build       validate the existing dist/ folder
 *
 * Checks every generated page for: title, meta description, canonical,
 * robots, exactly one H1, heading order, Open Graph/Twitter tags, valid
 * JSON-LD (no review/rating markup), image alt text, broken internal links,
 * placeholder/draft text and disabled claims leaking into production. Also
 * checks that sitemap.xml contains exactly the indexable published routes and
 * that robots.txt matches the stage.
 *
 * Exit code 1 on any error. A JSON report is written to reports/seo-report.json.
 */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { parse, type HTMLElement } from "node-html-parser";

const args = process.argv.slice(2);
const stageArg = args.find((a) => a.startsWith("--stage="))?.split("=")[1] ?? "production";
if (stageArg !== "production" && stageArg !== "preview" && stageArg !== "release-review") {
  console.error(`Unknown stage "${stageArg}". Use production, preview or release-review.`);
  process.exit(2);
}
const stage = stageArg;
const skipBuild = args.includes("--no-build");

process.env.SITE_STAGE = stage;
const OUT = join(process.cwd(), "dist");

if (!skipBuild) {
  console.log(`\n▶ Building static site (SITE_STAGE=${stage}) …\n`);
  execSync("npx astro build", { stdio: "inherit", env: { ...process.env, SITE_STAGE: stage, ASTRO_TELEMETRY_DISABLED: "1" } });
}

// Import after SITE_STAGE is set, so the registry reflects the same stage as the build.
const { getSiteRoutes } = await import("@/lib/content");
const guards = await import("@/lib/guards/claims");
const sim = await import("./lib/similarity");
let similaritySummary = "no service-city pages built";
const { allowedPriceStrings, arePricesPublishable } = await import("@/lib/pricing");
const { ctas } = await import("@/data/ctas");
const { siteUrl } = await import("@/lib/site");

type Issue = { level: "error" | "warning"; page: string; message: string };
const issues: Issue[] = [];
const error = (page: string, message: string) => issues.push({ level: "error", page, message });
const warn = (page: string, message: string) => issues.push({ level: "warning", page, message });

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

if (!existsSync(OUT)) {
  console.error("dist/ not found — run without --no-build.");
  process.exit(2);
}

const allFiles = walk(OUT);
const fileSet = new Set(allFiles.map((f) => "/" + relative(OUT, f).split("\\").join("/")));
const routes = getSiteRoutes();
const routeByPath = new Map(routes.map((r) => [r.path, r]));
// Public utility/legal pages are intentionally outside the SEO route registry and sitemap.
const { utilityPagePaths } = await import("@/lib/content/release-scope");
const utilityPaths = new Set(utilityPagePaths);

/** Generated HTML pages, as URL paths ("/maid/"). Excludes framework 404 files. */
const pagePaths = allFiles
  .filter((f) => f.endsWith("index.html"))
  .map((f) => "/" + relative(OUT, f).replace(/index\.html$/, "").split("\\").join("/"))
  .filter((p) => p !== "/404/" && p !== "/_not-found/");

// ---------- Release-review: exactly the approved first-release pages ----------
if (stage === "release-review") {
  const { releaseReviewPaths } = await import("@/lib/content/release-scope");
  const built = new Set(pagePaths);
  for (const p of releaseReviewPaths) if (!built.has(p)) error(p, "Approved release page missing from the release-review build");
  for (const p of pagePaths) if (!utilityPaths.has(p) && !releaseReviewPaths.has(p)) error(p, "Page outside the approved release set leaked into the release-review build");
  if (releaseReviewPaths.size !== 17) error("/", `Release set must contain exactly 17 pages (has ${releaseReviewPaths.size})`);
}

// ---------- Utility pages: in every artifact, never indexed, never in the sitemap ----------
for (const p of utilityPaths) {
  const file = join(OUT, p, "index.html");
  if (!existsSync(file)) {
    error(p, "Utility page missing from the build (the footer links to it)");
    continue;
  }
  const robots = parse(readFileSync(file, "utf8")).querySelector('meta[name="robots"]')?.getAttribute("content") ?? "";
  const expected = `noindex, follow${stage === "release-review" ? ", noarchive" : ""}`;
  if (robots !== expected) error(p, `Utility page robots must be "${expected}" (is "${robots}")`);
}

// ---------- Built pages must match the route registry exactly ----------
for (const p of pagePaths) if (!utilityPaths.has(p) && !routeByPath.has(p)) error(p, "Page was generated but is not in the route registry");
for (const r of routes) if (!pagePaths.includes(r.path)) error(r.path, "Route is registered but no page was generated");

// ---------- Claims / wording / pricing guards ----------
// Built from the business configuration, so enabling a fact later relaxes its guard.
const wordingRules = [...guards.verificationRules(), ...guards.commercialRules(), ...guards.unsupportedClaimRules()];
const placeholderText = /\[DEV PLACEHOLDER\]|\[DRAFT\]|lorem ipsum|TODO/i;
const priceStrings = allowedPriceStrings();
const homePrices = new Set(priceStrings.home);
const allPrices = new Set([...priceStrings.home, ...priceStrings.office, ...priceStrings.business]);
const pricesPublishable = arePricesPublishable();
// Salary guides may show their own market ranges — and no other rupee figure (never MeeHelp plan prices).
const { salaryGuides, salaryFigures } = await import("@/data/salary-guides");
const { rupees, salaryGuidePath, salaryGuideProblems } = await import("@/lib/content/salary-guides");
const guideByPath = new Map(salaryGuides.map((g) => [salaryGuidePath(g), g]));
const ctaUsage = new Map<string, number>();

/** Visible text of an element: scripts/styles removed, and optionally nested [data-model] blocks removed. */
function visibleText(el: HTMLElement, excludeNestedModels = false): string {
  const clone = parse(el.toString());
  clone.querySelectorAll("script, style, template").forEach((n) => n.remove());
  if (excludeNestedModels) {
    const root = clone.firstChild as HTMLElement | undefined;
    root?.querySelectorAll?.("[data-model]").forEach((n) => n.remove());
  }
  return clone.structuredText.replace(/\s+/g, " ");
}

const titles = new Map<string, string[]>();
const descriptions = new Map<string, string[]>();
const internalLinks = new Map<string, Set<string>>();
const inboundCount = new Map<string, number>(routes.map((r) => [r.path, 0]));

function linkTarget(href: string): string | null {
  if (!href.startsWith("/") || href.startsWith("//")) return null;
  const path = href.split("#")[0]!.split("?")[0]!;
  return path || null;
}

function resolvesToFile(path: string): boolean {
  if (fileSet.has(path)) return true;
  if (path.endsWith("/") && fileSet.has(`${path}index.html`)) return true;
  return false;
}

function checkHeadings(page: string, root: HTMLElement) {
  const main = root.querySelector("main") ?? root;
  const levels = main.querySelectorAll("h1, h2, h3, h4, h5, h6").map((h) => Number(h.tagName.slice(1)));
  let previous = 0;
  for (const level of levels) {
    if (previous && level > previous + 1) {
      error(page, `Heading level skips from h${previous} to h${level}`);
      return;
    }
    previous = level;
  }
}

function checkPage(page: string, html: string, expectIndexable: boolean, isNotFound = false) {
  const root = parse(html);
  const head = root.querySelector("head");
  if (!head) return error(page, "Missing <head>");

  const title = head.querySelector("title")?.text.trim() ?? "";
  if (!title) error(page, "Missing <title>");
  else {
    if (title.length > 65) warn(page, `Title is ${title.length} chars (aim ≤ 60)`);
    if (!isNotFound) titles.set(title, [...(titles.get(title) ?? []), page]);
  }

  const description = head.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() ?? "";
  if (!description) error(page, "Missing meta description");
  else {
    if (description.length < 70 || description.length > 160)
      warn(page, `Meta description is ${description.length} chars (aim 70–160)`);
    if (!isNotFound) descriptions.set(description, [...(descriptions.get(description) ?? []), page]);
  }

  const robots = head.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "";
  const noindex = /noindex/i.test(robots);
  if (expectIndexable && noindex) error(page, `Expected indexable page but robots="${robots}"`);
  if (!expectIndexable && !noindex) error(page, `Expected noindex but robots="${robots || "(none)"}"`);
  if (stage === "release-review" && !/noarchive/i.test(robots)) error(page, `Release-review page must be noarchive: robots="${robots}"`);

  if (!isNotFound) {
    const canonical = head.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "";
    const expected = `${siteUrl}${page}`;
    if (!canonical) error(page, "Missing canonical");
    else if (canonical !== expected) error(page, `Canonical is ${canonical}, expected ${expected}`);

    const og = (p: string) => head.querySelector(`meta[property="og:${p}"]`)?.getAttribute("content");
    for (const prop of ["title", "description", "url", "image", "type", "site_name"]) {
      if (!og(prop)) error(page, `Missing og:${prop}`);
    }
    if (og("url") && og("url") !== expected) error(page, `og:url ${og("url")} does not match canonical`);
    if (!head.querySelector('meta[name="twitter:card"]')) error(page, "Missing twitter:card");
  }

  const h1s = root.querySelectorAll("h1");
  if (h1s.length !== 1) error(page, `Expected exactly one <h1>, found ${h1s.length}`);
  else if (!h1s[0]!.text.trim()) error(page, "Empty <h1>");
  checkHeadings(page, root);

  const main = root.querySelector("main");
  const mainText = main?.text.replace(/\s+/g, " ").trim() ?? "";
  if (!isNotFound && mainText.length < 600) warn(page, `Only ${mainText.length} chars of server-rendered main content`);

  // JSON-LD
  const ldBlocks = root.querySelectorAll('script[type="application/ld+json"]');
  const types: string[] = [];
  for (const block of ldBlocks) {
    try {
      const data = JSON.parse(block.textContent);
      types.push(String(data["@type"]));
      if (data["@context"] !== "https://schema.org") error(page, "JSON-LD without schema.org @context");
    } catch {
      error(page, "Invalid JSON-LD");
    }
  }
  if (/"@type":"(AggregateRating|Review)"/.test(html)) error(page, "Review/AggregateRating markup is not allowed");
  if (page === "/" && !isNotFound) {
    if (!types.includes("Organization")) error(page, "Home page missing Organization schema");
    if (!types.includes("WebSite")) error(page, "Home page missing WebSite schema");
  } else if (!isNotFound) {
    if (!types.includes("BreadcrumbList")) error(page, "Missing BreadcrumbList schema");
    if (!root.querySelector('nav[aria-label="Breadcrumb"]')) error(page, "Missing visible breadcrumb");
  }
  if (types.includes("FAQPage") && !root.querySelector(".faq")) error(page, "FAQPage schema without visible FAQs");

  // Images
  for (const img of root.querySelectorAll("img")) {
    if (!img.hasAttribute("alt")) error(page, `<img src="${img.getAttribute("src")}"> has no alt attribute`);
    if (!img.getAttribute("width") || !img.getAttribute("height"))
      warn(page, `<img src="${img.getAttribute("src")}"> has no width/height (layout shift risk)`);
  }

  // Internal links
  const links = new Set<string>();
  for (const a of root.querySelectorAll("a[href]")) {
    const target = linkTarget(a.getAttribute("href") ?? "");
    if (target) links.add(target);
    if (!a.text.trim() && !a.getAttribute("aria-label")) error(page, `Link to ${a.getAttribute("href")} has no accessible name`);
  }
  internalLinks.set(page, links);

  // In-page anchors (CTAs point at #get-the-app) must exist on the page.
  for (const a of root.querySelectorAll('a[href^="#"]')) {
    const id = (a.getAttribute("href") ?? "").slice(1);
    if (id && !root.querySelector(`[id="${id}"]`)) error(page, `In-page link #${id} has no target`);
  }

  // Zero client JavaScript: only JSON-LD data blocks (and analytics, when configured) may appear.
  for (const sc of root.querySelectorAll("script")) {
    const type = sc.getAttribute("type");
    const isData = type === "application/ld+json";
    const isAnalytics = sc.getAttribute("id") === "analytics" || /googletagmanager\.com/.test(sc.getAttribute("src") ?? "");
    if (!isData && !isAnalytics) error(page, `Client script found: <script${type ? ` type="${type}"` : ""}${sc.getAttribute("src") ? ` src="${sc.getAttribute("src")}"` : ""}>`);
  }
  if (root.querySelector('link[rel="modulepreload"], link[rel="preload"][as="script"]')) error(page, "Script preload found");

  const body = root.querySelector("body");
  if (!body) return;
  const visible = visibleText(body);

  // Placeholders never reach production.
  if ((stage === "production" || stage === "release-review") && placeholderText.test(visible)) error(page, `Placeholder or draft text in ${stage} HTML`);
  if (stage === "release-review" && body.querySelector(".qr-panel--placeholder, [data-placeholder]")) error(page, "Placeholder element in release-review HTML");

  // Unsupported verification / commercial claims (every stage — preview mirrors production rules).
  for (const { rule, match } of guards.findViolations(visible, wordingRules)) {
    error(page, `Unsupported claim (${rule.reason}): "${match}"`);
  }

  // Clinical safety: no positive invasive / wound / catheter / nursing claims; vitals only "where trained".
  const claimable = parse(body.toString());
  claimable.querySelectorAll("[data-excluded], script, style").forEach((n) => n.remove());
  for (const f of guards.clinicalClaimFindings(visibleText(claimable))) error(page, `Clinical claim not approved: "${f.slice(0, 140)}"`);
  if (guards.broadRefundPattern.test(visible)) error(page, `Cancellation wording broader than the app's policy: "${visible.match(guards.broadRefundPattern)![0]}"`);
  if (guards.stalePricePattern.test(visible)) error(page, `Stale app price ₹299 found: "${visible.match(guards.stalePricePattern)![0]}"`);
  // Instant booking exists only for the one-time cleaning flow, which has its own page (SEO batch 1).
  // /hourly-maid/ and its city pages are scheduled-only like every other hourly booking.
  const oneTimeCleaningPage = page === "/one-time-cleaning/";
  for (const cta of body.querySelectorAll("[data-cta]")) {
    const key = cta.getAttribute("data-cta") as keyof typeof ctas;
    if (ctas[key]?.scope === "one-time-cleaning" && !oneTimeCleaningPage) error(page, `Instant CTA "${key}" outside the one-time cleaning pages`);
  }
  if (routeByPath.get(page)?.model === "onDemand" && !oneTimeCleaningPage) {
    const m = visible.match(/\binstant(?:ly)?\b|\bbook now\b|\bright away\b|\bstraight away\b/i);
    if (m) error(page, `Instant-booking wording on a scheduled-only page: "${m[0]}"`);
  }

  // Prices: only configured plan prices, never with the app's "*"; Office/Business only on /pricing/.
  const asterisk = visible.match(guards.pricedAsteriskPattern);
  if (asterisk) error(page, `Price shown with an asterisk: "${asterisk[0]}"`);
  for (const el of body.querySelectorAll(".plan__price")) if (el.text.includes("*")) error(page, "Asterisk inside a plan price");
  const guide = guideByPath.get(page);
  if (guide) {
    const figures = new Set(salaryFigures(guide).map(rupees));
    for (const figure of visible.match(guards.priceStringPattern) ?? []) {
      if (!figures.has(figure.replace(/\s/g, ""))) error(page, `Rupee figure "${figure}" is not one of this guide's salary ranges`);
    }
    const claim = visible.match(guards.salaryGuideClaimPattern);
    if (claim) error(page, `Salary guide wording not allowed (average/legal/government/MeeHelp rate): "${claim[0]}"`);
    if (!visible.includes(guide.disclosure)) error(page, "Salary guide is missing its indicative-range disclosure");
    if (!body.querySelector("[data-salary-disclosure]")) error(page, "Salary disclosure must be rendered below the table");
    if (stage === "production") for (const problem of salaryGuideProblems(guide)) error(page, `Salary guide cannot be published: ${problem}`);
  }
  const prices = guide ? [] : (visible.match(guards.priceStringPattern) ?? []);
  for (const price of prices) {
    const normalised = price.replace(/\s/g, "");
    if (!allPrices.has(normalised)) error(page, `Price "${price}" is not from src/data/plans.ts`);
    else if (page !== "/pricing/" && !homePrices.has(normalised)) error(page, `Office/Business price "${price}" outside /pricing/`);
  }
  if (stage === "production" && !pricesPublishable && prices.length > 0) {
    error(page, "Prices shown on production while publishPrices is off");
  }

  // Marketplace and on-demand must not mix: wording and CTAs inside each [data-model] block.
  for (const block of body.querySelectorAll("[data-model]")) {
    const model = block.getAttribute("data-model") as "marketplace" | "onDemand";
    if (model !== "marketplace" && model !== "onDemand") {
      error(page, `Unknown data-model "${model}"`);
      continue;
    }
    const text = visibleText(block, true);
    const m = text.match(guards.forbiddenInModel(model));
    if (m) error(page, `${model} section contains wording from the other proposition: "${m[0]}"`);
    for (const cta of block.querySelectorAll("[data-cta-model]")) {
      const nested = cta.closest("[data-model]");
      if (nested && nested !== block) continue;
      const ctaModel = cta.getAttribute("data-cta-model");
      if (ctaModel !== model && ctaModel !== "app") error(page, `${ctaModel} CTA inside a ${model} section`);
    }
  }
  const route = routeByPath.get(page);
  if (route?.model === "marketplace") {
    if (body.querySelector('[data-model="onDemand"]')) error(page, "Marketplace page contains an on-demand section");
    if (body.querySelector('[data-cta-model="onDemand"]')) error(page, "Marketplace page contains an on-demand CTA");
  }
  if (route?.model === "onDemand") {
    if (body.querySelector('[data-model="marketplace"]')) error(page, "On-demand page contains a marketplace section");
    if (body.querySelector('[data-cta-model="marketplace"]')) error(page, "On-demand page contains a marketplace CTA");
    if (body.querySelector(".plans, .plan, .plans-summary")) error(page, "On-demand page shows marketplace contact plans");
    if (guards.priceStringPattern.test(visible)) error(page, "On-demand page shows a price (no on-demand prices have been supplied)");
    guards.priceStringPattern.lastIndex = 0;
  }

  // Cross-model links: outside any proposition section, and pointing at a page of the declared model.
  for (const aside of body.querySelectorAll("[data-cross-model]")) {
    const target = aside.getAttribute("data-cross-model");
    if (aside.parentNode && (aside.parentNode as HTMLElement).closest?.("[data-model]")) error(page, "Cross-model link nested inside a proposition section");
    const hrefs = aside.querySelectorAll("a[href]").map((a) => linkTarget(a.getAttribute("href") ?? "")).filter(Boolean) as string[];
    if (hrefs.length === 0) error(page, "Cross-model link without an internal link");
    for (const h of hrefs) {
      const targetRoute = routeByPath.get(h);
      if (!targetRoute) error(page, `Cross-model link to unknown page ${h}`);
      else if (targetRoute.model !== target) error(page, `Cross-model link to ${h} (${targetRoute.model}) declared as ${target}`);
      else if (route && targetRoute.model === route.model) error(page, `Cross-model link to a page of the same model: ${h}`);
    }
  }
  for (const cta of body.querySelectorAll("[data-cta]")) {
    const key = cta.getAttribute("data-cta")!;
    if (!(key in ctas)) error(page, `Unknown CTA "${key}"`);
    ctaUsage.set(key, (ctaUsage.get(key) ?? 0) + 1);
  }
}

// ---------- Pages ----------
for (const page of pagePaths) {
  const route = routeByPath.get(page);
  const html = readFileSync(join(OUT, page, "index.html"), "utf8");
  checkPage(page, html, route?.indexable ?? false);
}

// 404 page
const notFoundFile = join(OUT, "404.html");
if (!existsSync(notFoundFile)) error("/404.html", "Missing 404.html");
else checkPage("/404.html", readFileSync(notFoundFile, "utf8"), false, true);

// ---------- Anti-doorway similarity (reported as warnings — never "fixed" by inventing content) ----------
{
  const cityPages = routes.filter((r) => r.kind === "service-city");
  if (cityPages.length > 1) {
    const { cities } = await import("@/data/cities");
    const cityTerms = cities.flatMap((c) => [c.name, c.displayName, ...c.includes, c.descriptors.areas]);
    const normalise = sim.makeNormaliser(cityTerms, ["xnoservicex"]);
    const bodyText = (path: string) => {
      const main = parse(readFileSync(join(OUT, path, "index.html"), "utf8")).querySelector("main");
      if (!main) return "";
      main.querySelectorAll("script, style, [data-boilerplate]").forEach((n) => n.remove());
      return main.structuredText;
    };
    const groups = new Map<string, typeof cityPages>();
    for (const r of cityPages) {
      const [first] = r.path.split("/").filter(Boolean);
      groups.set(first!, [...(groups.get(first!) ?? []), r]);
    }
    let high = 0;
    for (const group of groups.values()) {
      for (const res of sim.analyseSimilarity(group.map((r) => ({ path: r.path, text: bodyText(r.path) })), normalise)) {
        if (res.risk === "high") {
          high++;
          warn(res.path, `Doorway risk: body copy ${res.maxSimilarity} similar to ${res.mostSimilarTo} (unique share ${res.uniqueShare}) — keep in review`);
        }
      }
    }
    similaritySummary = `${high} of ${cityPages.length} city pages at high doorway risk (see npm run report)`;
  }
}

// ---------- No JavaScript files in the build ----------
for (const f of allFiles.filter((x) => /\.(m?js)$/.test(x))) error("/" + relative(OUT, f), "JavaScript file in build output");

// ---------- Duplicates ----------
for (const [title, pages] of titles) if (pages.length > 1) error(pages.join(", "), `Duplicate title "${title}"`);
for (const [d, pages] of descriptions) if (pages.length > 1) error(pages.join(", "), `Duplicate description "${d.slice(0, 60)}…"`);

// ---------- Internal links ----------
for (const [page, links] of internalLinks) {
  for (const target of links) {
    if (!resolvesToFile(target)) error(page, `Broken internal link: ${target}`);
    if (target.length > 1 && !target.endsWith("/") && !/\.[a-z0-9]+$/i.test(target))
      error(page, `Internal link without trailing slash: ${target}`);
    if (inboundCount.has(target) && target !== page) inboundCount.set(target, inboundCount.get(target)! + 1);
  }
}
for (const [path, count] of inboundCount) if (path !== "/" && count === 0) error(path, "Orphan page: no internal links point to it");

// ---------- Sitemap ----------
const sitemapFile = join(OUT, "sitemap.xml");
const sitemapXml = existsSync(sitemapFile) ? readFileSync(sitemapFile, "utf8") : "";
if (!sitemapXml) error("/sitemap.xml", "Missing sitemap.xml");
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
const expectedSitemap = routes.filter((r) => r.indexable).map((r) => `${siteUrl}${r.path}`);
for (const url of sitemapUrls) {
  if (!expectedSitemap.includes(url)) error("/sitemap.xml", `Unexpected URL in sitemap: ${url}`);
  const path = url.replace(siteUrl, "");
  const route = routeByPath.get(path);
  if (!route) error("/sitemap.xml", `Sitemap URL has no route: ${url}`);
  else if (route.status !== "published") error("/sitemap.xml", `Unpublished URL in sitemap: ${url}`);
}
for (const url of expectedSitemap) if (!sitemapUrls.includes(url)) error("/sitemap.xml", `Missing from sitemap: ${url}`);
if (new Set(sitemapUrls).size !== sitemapUrls.length) error("/sitemap.xml", "Duplicate URLs in sitemap");
if (stage !== "production" && sitemapUrls.length > 0) error("/sitemap.xml", "Non-production sitemap must be empty");

// ---------- robots.txt ----------
const robotsFile = join(OUT, "robots.txt");
const robotsTxt = existsSync(robotsFile) ? readFileSync(robotsFile, "utf8") : "";
if (!robotsTxt) error("/robots.txt", "Missing robots.txt");
else if (stage === "production") {
  if (/Disallow:\s*\/\s*$/m.test(robotsTxt)) error("/robots.txt", "Production robots.txt blocks the whole site");
  if (!robotsTxt.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) error("/robots.txt", "Production robots.txt missing Sitemap line");
} else if (!/Disallow:\s*\/\s*$/m.test(robotsTxt)) {
  error("/robots.txt", "Non-production robots.txt must disallow everything");
}

// ---------- Report ----------
const errors = issues.filter((i) => i.level === "error");
const warnings = issues.filter((i) => i.level === "warning");

console.log(`\nSEO check — stage: ${stage}, site: ${siteUrl}`);
console.log(`Pages checked: ${pagePaths.length} (+404) · Sitemap URLs: ${sitemapUrls.length}\n`);
console.log("Page".padEnd(28) + "Index".padEnd(8) + "Title");
for (const page of pagePaths) {
  const r = routeByPath.get(page);
  console.log(page.padEnd(28) + (r?.indexable ? "yes" : "no").padEnd(8) + (r?.title ?? ""));
}
for (const i of [...errors, ...warnings]) console.log(`${i.level === "error" ? "✗ ERROR" : "! warn "}  ${i.page}  ${i.message}`);

mkdirSync("reports", { recursive: true });
writeFileSync(
  "reports/seo-report.json",
  JSON.stringify({ stage, siteUrl, pages: pagePaths, sitemap: sitemapUrls, issues }, null, 2),
);

console.log(`Info: similarity — ${similaritySummary}.`);
const unapprovedCtas = [...ctaUsage.keys()].filter((k) => ctas[k as keyof typeof ctas]?.wording !== "approved");
if (unapprovedCtas.length > 0) {
  console.log(`\nInfo: CTA wording still "proposed" (needs business approval): ${unapprovedCtas.map((k) => `${k} ×${ctaUsage.get(k)}`).join(", ")}`);
}
console.log(`Info: prices ${pricesPublishable ? "shown" : "hidden"} on this build (publishPrices gate${stage === "production" ? "" : " applies on production only"}).`);

console.log(`\n${errors.length} error(s), ${warnings.length} warning(s). Report: reports/seo-report.json`);
process.exit(errors.length > 0 ? 1 : 0);
