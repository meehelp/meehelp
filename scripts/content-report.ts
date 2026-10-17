/**
 * npm run report — content-quality report for every PREVIEW page.
 *
 *   npm run report               build preview, then report
 *   npm run report -- --no-build report on the existing dist/ (must be a preview build)
 *
 * Writes docs/seo/quality-report.json (machine-readable) and
 * docs/seo/QUALITY-REPORT.md (human summary). Readiness is a content
 * judgement only; every page still needs business approval before it can be
 * published.
 */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse, type HTMLElement } from "node-html-parser";
import { analyseSimilarity, makeNormaliser, THRESHOLDS, type SimilarityResult } from "./lib/similarity";

process.env.SITE_STAGE = "preview";
if (!process.argv.includes("--no-build")) {
  execSync("npx astro build", { stdio: "inherit", env: { ...process.env, SITE_STAGE: "preview", ASTRO_TELEMETRY_DISABLED: "1" } });
}

const { getSiteRoutes, getServiceCity, getServiceCityContent } = await import("@/lib/content");
const { cities } = await import("@/data/cities");
const { services } = await import("@/data/services");
const { ctas } = await import("@/data/ctas");
const { trustMetrics } = await import("@/data/business");

const DIST = join(process.cwd(), "dist");
const routes = getSiteRoutes("preview");

const MIN_WORDS = { home: 400, pricing: 400, service: 600, "service-city": 450, locality: 450 } as const;
const MIN_LOCAL_NOTES = 3;
const MIN_LOCAL_FAQS = 2;

/** Main content text. `bodyOnly` drops navigation/CTA blocks marked data-boilerplate (breadcrumbs,
 * related links, cross-model link, app download) so similarity compares body copy only. */
function mainText(main: HTMLElement, bodyOnly = false): string {
  const clone = parse(main.toString());
  clone.querySelectorAll("script, style").forEach((n) => n.remove());
  if (bodyOnly) clone.querySelectorAll("[data-boilerplate]").forEach((n) => n.remove());
  return clone.structuredText.replace(/\s+/g, " ").trim();
}

interface PageRow {
  path: string;
  kind: string;
  model: string;
  service: string | null;
  city: string | null;
  status: string;
  title: string;
  h1: string;
  metaDescription: string;
  wordCount: number;
  /** Words of body copy (navigation/CTA blocks excluded). */
  bodyWordCount: number;
  internalLinks: number;
  localNotes: number | null;
  localFaqs: number | null;
  /** Doorway check: same service + model across the 8 cities (city names normalised). */
  similarity: Omit<SimilarityResult, "path"> | null;
  /** Template-overlap check: same city + model across the 5 services (city and service names normalised). */
  crossServiceSimilarity: Omit<SimilarityResult, "path"> | null;
  missingInformation: string[];
  readiness: "ready-for-approval" | "needs-content";
  reasons: string[];
}

const anyProposedCta = Object.values(ctas).some((c) => c.wording !== "approved");
const noMetrics = trustMetrics.every((m) => !m.approved);

const rows: PageRow[] = [];
const texts: Record<string, string> = {};
for (const r of routes) {
  const file = join(DIST, r.path, "index.html");
  if (!existsSync(file)) throw new Error(`Missing built page ${r.path} — run a preview build`);
  const root = parse(readFileSync(file, "utf8"));
  const main = root.querySelector("main")!;
  const text = mainText(main);
  texts[r.path] = mainText(main, true);
  const links = new Set(
    main
      .querySelectorAll("a[href]")
      .map((a) => a.getAttribute("href")!)
      .filter((h) => h.startsWith("/") && !h.startsWith("//")),
  );
  const segments = r.path.split("/").filter(Boolean);
  const service = services.find((s) => s.slug === segments[0] || s.onDemand.slug === segments[0]) ?? null;
  const city = segments[1] ? cities.find((c) => c.slug === segments[1]) ?? null : null;
  let localNotes: number | null = null;
  let localFaqs: number | null = null;
  if (r.kind === "service-city" && service && city) {
    const sc = getServiceCity(service.slug, city.slug, r.model === "onDemand" ? "onDemand" : "marketplace")!;
    const content = getServiceCityContent(sc);
    localNotes = content.localNotes.length;
    localFaqs = content.localFaqs.length;
  }
  const missing: string[] = [];
  if (r.status !== "published") missing.push("Copy not yet approved for publishing (publishStatus: review)");
  if (anyProposedCta) missing.push("CTA wording not yet approved");
  if (r.model === "onDemand") missing.push("On-demand prices not supplied", "Minimum booking duration not supplied");
  if (r.kind === "service-city") missing.push("No confirmed list of areas/localities served");
  if (noMetrics && (r.kind === "home" || r.kind === "service")) missing.push("App ratings/downloads not supplied");
  rows.push({
    path: r.path,
    kind: r.kind,
    model: r.model,
    service: service?.slug ?? null,
    city: city?.slug ?? null,
    status: r.status,
    title: root.querySelector("title")?.text ?? "",
    h1: root.querySelector("h1")?.text.trim() ?? "",
    metaDescription: root.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
    wordCount: text.split(/\s+/).filter(Boolean).length,
    bodyWordCount: texts[r.path]!.split(/\s+/).filter(Boolean).length,
    internalLinks: links.size,
    localNotes,
    localFaqs,
    similarity: null,
    crossServiceSimilarity: null,
    missingInformation: missing,
    readiness: "ready-for-approval",
    reasons: [],
  });
}

// Similarity: city pages against each other; hubs against each other.
const cityTerms = cities.flatMap((c) => [c.name, c.displayName, ...c.includes, c.descriptors.areas]);
const serviceTerms = services.flatMap((s) => [
  s.name,
  s.shortName,
  s.roleWithArticle,
  s.onDemand.name,
  s.onDemand.shortName,
  s.onDemand.bookingNoun,
]);
const cityOnly = makeNormaliser(cityTerms, ["xnoservicex"]);
const cityAndService = makeNormaliser(cityTerms, serviceTerms);
const assign = (group: PageRow[], normalise: (t: string) => string[], field: "similarity" | "crossServiceSimilarity") => {
  for (const res of analyseSimilarity(group.map((r) => ({ path: r.path, text: texts[r.path]! })), normalise)) {
    const { path: _p, ...rest } = res;
    rows.find((r) => r.path === res.path)![field] = rest;
  }
};
const cityPages = rows.filter((r) => r.kind === "service-city");
// 1. Doorway risk: each service × model compared across its 8 city pages.
for (const key of new Set(cityPages.map((r) => `${r.service}|${r.model}`))) {
  assign(cityPages.filter((r) => `${r.service}|${r.model}` === key), cityOnly, "similarity");
}
// 2. Template overlap: each city × model compared across its 5 service pages.
for (const key of new Set(cityPages.map((r) => `${r.city}|${r.model}`))) {
  assign(cityPages.filter((r) => `${r.city}|${r.model}` === key), cityAndService, "crossServiceSimilarity");
}
// Hubs: compared with each other per model (service names normalised).
for (const model of ["marketplace", "onDemand"]) {
  assign(rows.filter((r) => r.kind === "service" && r.model === model), cityAndService, "similarity");
}

for (const row of rows) {
  const min = MIN_WORDS[row.kind as keyof typeof MIN_WORDS] ?? 400;
  if (row.wordCount < min) row.reasons.push(`Only ${row.wordCount} words of main content (minimum ${min})`);
  if (row.localNotes !== null && row.localNotes < MIN_LOCAL_NOTES)
    row.reasons.push(`Only ${row.localNotes} city-specific notes (minimum ${MIN_LOCAL_NOTES})`);
  if (row.localFaqs !== null && row.localFaqs < MIN_LOCAL_FAQS)
    row.reasons.push(`Only ${row.localFaqs} local FAQ (minimum ${MIN_LOCAL_FAQS})`);
  if (row.similarity?.risk === "high")
    row.reasons.push(
      `Doorway risk — same service in other cities: similarity ${row.similarity.maxSimilarity} with ${row.similarity.mostSimilarTo}, unique share ${row.similarity.uniqueShare}`,
    );
  if (row.crossServiceSimilarity?.risk === "high")
    row.reasons.push(
      `Template overlap — other services in this city: similarity ${row.crossServiceSimilarity.maxSimilarity} with ${row.crossServiceSimilarity.mostSimilarTo}`,
    );
  row.readiness = row.reasons.length === 0 ? "ready-for-approval" : "needs-content";
}

mkdirSync("docs/seo", { recursive: true });
writeFileSync(
  "docs/seo/quality-report.json",
  JSON.stringify({ generatedFrom: "preview build", thresholds: { ...THRESHOLDS, minWords: MIN_WORDS, minLocalNotes: MIN_LOCAL_NOTES, minLocalFaqs: MIN_LOCAL_FAQS }, pages: rows }, null, 2) + "\n",
);

// ---------- Human summary ----------
const count = (f: (r: PageRow) => boolean) => rows.filter(f).length;
const byRisk = (risk: string, kind: string) => count((r) => r.kind === kind && r.similarity?.risk === risk);
const avg = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : 0);
const cityRows = rows.filter((r) => r.kind === "service-city");
const sims = cityRows.map((r) => r.similarity!.maxSimilarity).sort((a, b) => a - b);
const uniq = cityRows.map((r) => r.similarity!.uniqueShare).sort((a, b) => a - b);
const xsims = cityRows.map((r) => r.crossServiceSimilarity!.maxSimilarity).sort((a, b) => a - b);
const xRisk = (risk: string) => count((r) => r.kind === "service-city" && r.crossServiceSimilarity?.risk === risk);
const median = (xs: number[]) => xs[Math.floor(xs.length / 2)] ?? 0;
const table = (list: PageRow[]) =>
  [
    "| Page | Model | Words (body) | Links | Notes | Doorway sim. | Unique | Doorway risk | Cross-service sim. | Overlap risk | Readiness |",
    "|---|---|---|---|---|---|---|---|---|---|---|",
    ...list.map(
      (r) =>
        `| \`${r.path}\` | ${r.model} | ${r.wordCount} (${r.bodyWordCount}) | ${r.internalLinks} | ${r.localNotes ?? "—"} | ${r.similarity?.maxSimilarity ?? "—"} | ${r.similarity?.uniqueShare ?? "—"} | ${r.similarity?.risk ?? "—"} | ${r.crossServiceSimilarity?.maxSimilarity ?? "—"} | ${r.crossServiceSimilarity?.risk ?? "—"} | ${r.readiness} |`,
    ),
  ].join("\n");

const md = `# Content quality report (preview)

Generated by \`npm run report\` from a preview build. Machine-readable data: \`docs/seo/quality-report.json\`.
Readiness is a **content** judgement; every page still needs business approval (all are \`publishStatus: review\`).

## Summary

- Pages: **${rows.length}** (home 1, pricing 1, hubs ${count((r) => r.kind === "service")}, city pages ${cityRows.length})
- Ready for approval (content): **${count((r) => r.readiness === "ready-for-approval")}** · Needs content: **${count((r) => r.readiness === "needs-content")}**
- **Doorway risk** (same service + model across cities): low ${byRisk("low", "service-city")}, medium ${byRisk("medium", "service-city")}, high ${byRisk("high", "service-city")} — max similarity median ${median(sims)}, max ${sims[sims.length - 1] ?? 0}; unique share median ${median(uniq)}, min ${uniq[0] ?? 0}
- **Template overlap** (same city + model across services): low ${xRisk("low")}, medium ${xRisk("medium")}, high ${xRisk("high")} — max similarity median ${median(xsims)}, max ${xsims[xsims.length - 1] ?? 0}
- Average words: hubs ${avg(rows.filter((r) => r.kind === "service").map((r) => r.wordCount))}, city pages ${avg(cityRows.map((r) => r.wordCount))}

## Method

- Similarity: 5-word shingle Jaccard on main-body copy — \`<main>\` text minus navigation/CTA blocks marked \`data-boilerplate\` (breadcrumbs, related-page links, the cross-model link, the app-download block) — see \`scripts/lib/similarity.ts\`. Measured two ways:
  - **Doorway risk** — each city page against the same service + model in the other 7 cities, with city names normalised. This is the classic "swap the city name" pattern.
  - **Template overlap** — each city page against the other 4 services in the same city + model, with city and service names normalised. Different services target different intents, but heavy overlap (e.g. elder care vs patient care) is still flagged.
- Risk: **high** if max similarity ≥ ${THRESHOLDS.highSimilarity} or unique share < ${THRESHOLDS.highUnique}; **medium** if ≥ ${THRESHOLDS.mediumSimilarity} or < ${THRESHOLDS.mediumUnique}.
- Needs content when: high similarity risk, fewer than ${MIN_LOCAL_NOTES} city-specific notes, fewer than ${MIN_LOCAL_FAQS} local FAQs, or fewer words than the minimum for the page type (${Object.entries(MIN_WORDS).map(([k, v]) => `${k} ${v}`).join(", ")}).
- Thresholds were fixed before results were seen. Never close a gap by inventing local detail: pages that lack genuine information stay in review.

## Site-wide missing information

- On-demand prices and minimum booking duration (not stated anywhere on the site).
- Confirmed areas/localities per city (city pages say "across {city}" only).
- App ratings and downloads (trust metrics disabled).
- Approved CTA wording (all CTAs are "proposed").

## Pages needing content

${count((r) => r.readiness === "needs-content") === 0 ? "None." : rows.filter((r) => r.readiness === "needs-content").map((r) => `- \`${r.path}\`: ${r.reasons.join("; ")}`).join("\n")}

## Hubs, home and pricing

${table(rows.filter((r) => r.kind !== "service-city"))}

## City pages

${table(cityRows)}
`;
writeFileSync("docs/seo/QUALITY-REPORT.md", md);
console.log(md.split("## Method")[0]);
