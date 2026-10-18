/**
 * npm run report — content-quality report v3 for every PREVIEW page.
 *
 *   npm run report               build preview, then report
 *   npm run report -- --no-build report on the existing dist/ (must be a preview build)
 *
 * Writes docs/seo/quality-report.json (machine-readable),
 * docs/seo/QUALITY-REPORT.md (human summary) and
 * docs/seo/FIRST-RELEASE-REVIEW.md (one entry per proposed release page).
 *
 * v3 (Phase 4.6): adds the clinical-safety, narrow-cancellation, stale-price
 * and instant-scope guards to the unsupported-claim count; business answers
 * replace the Phase 4.5 review blocks; before/after against Phase 4 and 4.5.
 *
 * v2 (Phase 4.5): word count is reported but is NOT a quality target. Pages
 * are scored on evidence-backed product facts, unsupported claims, genuinely
 * local notes, similarity and linking:
 *   HOLD   — must not be published as is (no product evidence for the service
 *            in this model, an unsupported claim, or a city page that is a
 *            near-duplicate with no real local information)
 *   REVIEW — publishable after the gaps listed are closed or accepted
 *   READY  — strongest candidates for the first public release (still need
 *            business approval: every page is publishStatus "review")
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
const { serviceModelEvidence, openQuestions } = await import("@/data/evidence");
const guards = await import("@/lib/guards/claims");

const DIST = join(process.cwd(), "dist");
const routes = getSiteRoutes("preview");
const rules = [...guards.verificationRules(), ...guards.commercialRules(), ...guards.unsupportedClaimRules()];

/** Thresholds (fixed before results were seen). */
const MIN_EVIDENCE = 3; // distinct evidence-backed product facts on a hub
const MIN_CITY_EVIDENCE = 2; // on a city page (the rest is linked from the hub)
const MIN_INTERNAL_LINKS = 3;

/**
 * Open questions that keep a service × model in REVIEW until answered.
 * Phase 4.6: Q-ELDER and Q-CARE-TASKS were answered by the business; the
 * remaining open questions concern content that is deliberately NOT published
 * (prices, fee rules, clinical items), so they do not block any page.
 */
const blockingQuestions: Record<string, string[]> = {};

function mainText(main: HTMLElement, bodyOnly = false): string {
  const clone = parse(main.toString());
  clone.querySelectorAll("script, style").forEach((n) => n.remove());
  if (bodyOnly) clone.querySelectorAll("[data-boilerplate]").forEach((n) => n.remove());
  return clone.structuredText.replace(/\s+/g, " ").trim();
}

type Readiness = "READY" | "REVIEW" | "HOLD";
interface PageRow {
  path: string;
  kind: string;
  proposition: string;
  service: string | null;
  city: string | null;
  status: string;
  title: string;
  h1: string;
  metaDescription: string;
  uniqueTitle: boolean;
  uniqueMeta: boolean;
  wordCount: number;
  /** Distinct evidence items cited by product facts on the page. */
  factualEvidenceCount: number;
  evidenceIds: string[];
  unsupportedClaimCount: number;
  unsupportedClaims: string[];
  /** City-specific notes (city pages only) and whether the page has hand-written local copy. */
  localNotes: number | null;
  handWritten: boolean | null;
  differentiationNotes: string[];
  internalLinks: number;
  /** Same service + model across the 8 cities (city names normalised). */
  sameServiceCrossCity: Omit<SimilarityResult, "path"> | null;
  /** Same city + model across the 5 services (city and service names normalised). */
  sameCityCrossService: Omit<SimilarityResult, "path"> | null;
  readiness: Readiness;
  reasons: string[];
}

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
      .filter((h) => h.startsWith("/") && !h.startsWith("//") && h !== r.path),
  );
  const evidenceIds = [...new Set(main.querySelectorAll("[data-evidence]").flatMap((n) => n.getAttribute("data-evidence")!.split(",")))].sort();
  const unsupported = rules.flatMap((rule) => {
    const m = text.match(rule.pattern);
    return m ? [`${rule.id}: "${m[0]}"`] : [];
  });
  const claimable = parse(main.toString());
  claimable.querySelectorAll("[data-excluded], script, style").forEach((n) => n.remove());
  for (const f of guards.clinicalClaimFindings(claimable.structuredText)) unsupported.push(`clinical: "${f.slice(0, 100)}"`);
  const broad = text.match(guards.broadRefundPattern);
  if (broad) unsupported.push(`broad-refund: "${broad[0]}"`);
  const stale = text.match(guards.stalePricePattern);
  if (stale) unsupported.push(`stale-price: "${stale[0]}"`);
  if (r.model === "onDemand" && !r.path.startsWith("/hourly-maid/")) {
    const m = text.match(/\binstant(?:ly)?\b|\bbook now\b|\bright away\b|\bstraight away\b/i);
    if (m) unsupported.push(`instant-scope: "${m[0]}"`);
  }
  const segments = r.path.split("/").filter(Boolean);
  const service = services.find((s) => s.slug === segments[0] || s.onDemand.slug === segments[0]) ?? null;
  const city = segments[1] ? cities.find((c) => c.slug === segments[1]) ?? null : null;
  let localNotes: number | null = null;
  let handWritten: boolean | null = null;
  const notes: string[] = [];
  if (r.kind === "service-city" && service && city) {
    const sc = getServiceCity(service.slug, city.slug, r.model === "onDemand" ? "onDemand" : "marketplace")!;
    const content = getServiceCityContent(sc);
    localNotes = content.localNotes.length;
    handWritten = Boolean(sc.overrides);
    if (handWritten) notes.push("hand-written local introduction and FAQs");
    for (const n of content.localNotes) notes.push(n.length > 90 ? `${n.slice(0, 87)}…` : n);
  }
  rows.push({
    path: r.path,
    kind: r.kind,
    proposition: r.model,
    service: service?.slug ?? null,
    city: city?.slug ?? null,
    status: r.status,
    title: root.querySelector("title")?.text ?? "",
    h1: root.querySelector("h1")?.text.trim() ?? "",
    metaDescription: root.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
    uniqueTitle: true,
    uniqueMeta: true,
    wordCount: text.split(/\s+/).filter(Boolean).length,
    factualEvidenceCount: evidenceIds.length,
    evidenceIds,
    unsupportedClaimCount: unsupported.length,
    unsupportedClaims: unsupported,
    localNotes,
    handWritten,
    differentiationNotes: notes,
    internalLinks: links.size,
    sameServiceCrossCity: null,
    sameCityCrossService: null,
    readiness: "READY",
    reasons: [],
  });
}

for (const row of rows) {
  row.uniqueTitle = rows.filter((r) => r.title === row.title).length === 1;
  row.uniqueMeta = rows.filter((r) => r.metaDescription === row.metaDescription).length === 1;
}

// ---------- Similarity ----------
const cityTerms = cities.flatMap((c) => [c.name, c.displayName, ...c.includes, c.descriptors.areas]);
const serviceTerms = services.flatMap((s) => [s.name, s.shortName, s.roleWithArticle, s.onDemand.name, s.onDemand.shortName, s.onDemand.bookingNoun]);
const cityOnly = makeNormaliser(cityTerms, ["xnoservicex"]);
const cityAndService = makeNormaliser(cityTerms, serviceTerms);
const assign = (group: PageRow[], normalise: (t: string) => string[], field: "sameServiceCrossCity" | "sameCityCrossService") => {
  for (const res of analyseSimilarity(group.map((r) => ({ path: r.path, text: texts[r.path]! })), normalise)) {
    const { path: _p, ...rest } = res;
    rows.find((r) => r.path === res.path)![field] = rest;
  }
};
const cityRows = rows.filter((r) => r.kind === "service-city");
for (const key of new Set(cityRows.map((r) => `${r.service}|${r.proposition}`))) {
  assign(cityRows.filter((r) => `${r.service}|${r.proposition}` === key), cityOnly, "sameServiceCrossCity");
}
for (const key of new Set(cityRows.map((r) => `${r.city}|${r.proposition}`))) {
  assign(cityRows.filter((r) => `${r.city}|${r.proposition}` === key), cityAndService, "sameCityCrossService");
}
for (const model of ["marketplace", "onDemand"]) {
  assign(rows.filter((r) => r.kind === "service" && r.proposition === model), cityAndService, "sameCityCrossService");
}

// ---------- Readiness ----------
for (const row of rows) {
  const hold: string[] = [];
  const review: string[] = [];
  const key = `${row.service}|${row.proposition}`;
  if (row.unsupportedClaimCount > 0) hold.push(`Unsupported claim(s): ${row.unsupportedClaims.join("; ")}`);
  if (row.service && serviceModelEvidence[row.service as keyof typeof serviceModelEvidence][row.proposition as "marketplace" | "onDemand"].length === 0)
    hold.push(`No product evidence for ${row.service} as a ${row.proposition} category (${(blockingQuestions[key] ?? []).join(", ") || "see evidence ledger"})`);
  if (row.kind === "service-city") {
    const doorwayHigh = row.sameServiceCrossCity?.risk === "high";
    if (doorwayHigh && !row.handWritten && (row.localNotes ?? 0) < 2)
      hold.push(
        `Near-duplicate of other city pages (similarity ${row.sameServiceCrossCity!.maxSimilarity} with ${row.sameServiceCrossCity!.mostSimilarTo}) and only ${row.localNotes} local note — no genuine local information to add`,
      );
    else if (doorwayHigh)
      review.push(`Doorway risk high (similarity ${row.sameServiceCrossCity!.maxSimilarity} with ${row.sameServiceCrossCity!.mostSimilarTo})`);
    if (row.sameCityCrossService?.risk === "high")
      review.push(`Template overlap high with ${row.sameCityCrossService.mostSimilarTo} (${row.sameCityCrossService.maxSimilarity})`);
    if (row.factualEvidenceCount < MIN_CITY_EVIDENCE) review.push(`Only ${row.factualEvidenceCount} evidence-backed fact(s)`);
    if (!row.handWritten) review.push("Composed page: no hand-written local copy");
  } else if (row.kind === "service") {
    if (row.factualEvidenceCount < MIN_EVIDENCE) review.push(`Only ${row.factualEvidenceCount} evidence-backed fact(s) (minimum ${MIN_EVIDENCE})`);
    if (row.sameCityCrossService?.risk === "high")
      review.push(`Overlaps another hub (${row.sameCityCrossService.mostSimilarTo}, ${row.sameCityCrossService.maxSimilarity})`);
  }
  for (const q of blockingQuestions[key] ?? []) if (!hold.some((h) => h.includes(q))) review.push(`Waiting on ${q}: ${openQuestions.find((x) => x.id === q)?.question}`);
  if (!row.uniqueTitle) hold.push("Duplicate title");
  if (!row.uniqueMeta) hold.push("Duplicate meta description");
  if (row.internalLinks < MIN_INTERNAL_LINKS) review.push(`Only ${row.internalLinks} internal links`);
  row.reasons = [...hold, ...review];
  row.readiness = hold.length > 0 ? "HOLD" : review.length > 0 ? "REVIEW" : "READY";
}

// ---------- Before / after ----------
interface BaselinePage {
  path: string;
  kind: string;
  doorway: { max: number; unique: number; risk: string } | null;
  overlap: { max: number; risk: string } | null;
}
const baselineFile = "docs/seo/quality-baseline-phase4.json";
const baseline: BaselinePage[] = existsSync(baselineFile) ? JSON.parse(readFileSync(baselineFile, "utf8")).pages : [];
const baseline45File = "docs/seo/quality-baseline-phase45.json";
const baseline45: (BaselinePage & { evidence: number; unsupported: number; readiness: string })[] = existsSync(baseline45File)
  ? JSON.parse(readFileSync(baseline45File, "utf8")).pages
  : [];
const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)] ?? 0;
};
const tally = (xs: (string | undefined)[]) => ({ low: xs.filter((x) => x === "low").length, medium: xs.filter((x) => x === "medium").length, high: xs.filter((x) => x === "high").length });
const baseCity = baseline.filter((p) => p.kind === "service-city");
const beforeAfter = {
  before: {
    doorway: { ...tally(baseCity.map((p) => p.doorway?.risk)), median: median(baseCity.map((p) => p.doorway?.max ?? 0)), max: Math.max(0, ...baseCity.map((p) => p.doorway?.max ?? 0)) },
    overlap: { ...tally(baseCity.map((p) => p.overlap?.risk)), median: median(baseCity.map((p) => p.overlap?.max ?? 0)), max: Math.max(0, ...baseCity.map((p) => p.overlap?.max ?? 0)) },
  },
  after: {
    doorway: { ...tally(cityRows.map((r) => r.sameServiceCrossCity?.risk)), median: median(cityRows.map((r) => r.sameServiceCrossCity?.maxSimilarity ?? 0)), max: Math.max(0, ...cityRows.map((r) => r.sameServiceCrossCity?.maxSimilarity ?? 0)) },
    overlap: { ...tally(cityRows.map((r) => r.sameCityCrossService?.risk)), median: median(cityRows.map((r) => r.sameCityCrossService?.maxSimilarity ?? 0)), max: Math.max(0, ...cityRows.map((r) => r.sameCityCrossService?.maxSimilarity ?? 0)) },
  },
};
const base45City = baseline45.filter((p) => p.kind === "service-city");
const phase45 = {
  doorway: { ...tally(base45City.map((p) => p.doorway?.risk)), median: median(base45City.map((p) => p.doorway?.max ?? 0)), max: Math.max(0, ...base45City.map((p) => p.doorway?.max ?? 0)) },
  overlap: { ...tally(base45City.map((p) => p.overlap?.risk)), median: median(base45City.map((p) => p.overlap?.max ?? 0)), max: Math.max(0, ...base45City.map((p) => p.overlap?.max ?? 0)) },
  evidence: baseline45.reduce((a, p) => a + (p.evidence ?? 0), 0),
  unsupported: baseline45.reduce((a, p) => a + (p.unsupported ?? 0), 0),
  readiness: tally2(baseline45.map((p) => p.readiness)),
};
function tally2(xs: string[]) {
  return { READY: xs.filter((x) => x === "READY").length, REVIEW: xs.filter((x) => x === "REVIEW").length, HOLD: xs.filter((x) => x === "HOLD").length };
}
const phase46 = {
  evidence: rows.reduce((a, r) => a + r.factualEvidenceCount, 0),
  unsupported: rows.reduce((a, r) => a + r.unsupportedClaimCount, 0),
  readiness: tally2(rows.map((r) => r.readiness)),
};
const careBefore = baseCity.filter((p) => /^\/(?:hourly-)?(?:elder-care|patient-care)\//.test(p.path) && p.overlap?.risk === "high").length;
const careAfter = cityRows.filter((r) => (r.service === "elder-care" || r.service === "patient-care") && r.sameCityCrossService?.risk === "high").length;

mkdirSync("docs/seo", { recursive: true });
writeFileSync(
  "docs/seo/quality-report.json",
  JSON.stringify(
    {
      version: 2,
      generatedFrom: "preview build",
      thresholds: { ...THRESHOLDS, minEvidenceHub: MIN_EVIDENCE, minEvidenceCity: MIN_CITY_EVIDENCE, minInternalLinks: MIN_INTERNAL_LINKS, wordCount: "reported only — not a quality target" },
      beforeAfter: { phase4: beforeAfter.before, phase45, phase46: { ...beforeAfter.after, ...phase46 } },
      pages: rows,
    },
    null,
    2,
  ) + "\n",
);

// ---------- Human summary ----------
const count = (f: (r: PageRow) => boolean) => rows.filter(f).length;
const list = (rs: PageRow[]) => rs.map((r) => `\`${r.path}\``).join(", ") || "none";
const fmt = (x: { low: number; medium: number; high: number; median: number; max: number }) =>
  `low ${x.low} · medium ${x.medium} · high ${x.high} (median ${x.median}, max ${x.max})`;
const table = (rs: PageRow[]) =>
  [
    "| Page | Prop. | Words | Evidence | Unsupported | Local notes | Cross-city sim. | Cross-service sim. | Title/meta unique | Links | Readiness |",
    "|---|---|---|---|---|---|---|---|---|---|---|",
    ...rs.map(
      (r) =>
        `| \`${r.path}\` | ${r.proposition} | ${r.wordCount} | ${r.factualEvidenceCount} | ${r.unsupportedClaimCount} | ${r.localNotes ?? "—"}${r.handWritten ? " + hand-written" : ""} | ${r.sameServiceCrossCity ? `${r.sameServiceCrossCity.maxSimilarity} (${r.sameServiceCrossCity.risk})` : "—"} | ${r.sameCityCrossService ? `${r.sameCityCrossService.maxSimilarity} (${r.sameCityCrossService.risk})` : "—"} | ${r.uniqueTitle && r.uniqueMeta ? "yes" : "**no**"} | ${r.internalLinks} | **${r.readiness}** |`,
    ),
  ].join("\n");

const md = `# Content quality report v3 (preview)

Generated by \`npm run report\` from a preview build. Machine-readable: \`docs/seo/quality-report.json\`.
Every page is still \`publishStatus: review\`; readiness is a content judgement to guide business approval.

## Summary

- Pages: **${rows.length}** — READY **${count((r) => r.readiness === "READY")}** · REVIEW **${count((r) => r.readiness === "REVIEW")}** · HOLD **${count((r) => r.readiness === "HOLD")}**
- READY: ${list(rows.filter((r) => r.readiness === "READY"))}
- Unsupported claims found: **${rows.reduce((a, r) => a + r.unsupportedClaimCount, 0)}**
- Evidence-backed facts: hubs average ${Math.round(rows.filter((r) => r.kind === "service").reduce((a, r) => a + r.factualEvidenceCount, 0) / Math.max(1, count((r) => r.kind === "service")))} distinct evidence items; city pages ${Math.round(cityRows.reduce((a, r) => a + r.factualEvidenceCount, 0) / Math.max(1, cityRows.length))}

## Before and after

| Measure | Phase 4 | Phase 4.5 (before) | Phase 4.6 (after) |
|---|---|---|---|
| Doorway similarity — 80 city pages | ${fmt(beforeAfter.before.doorway)} | ${fmt(phase45.doorway)} | ${fmt(beforeAfter.after.doorway)} |
| Same-city service overlap — 80 city pages | ${fmt(beforeAfter.before.overlap)} | ${fmt(phase45.overlap)} | ${fmt(beforeAfter.after.overlap)} |
| Evidence-backed claims (distinct evidence items per page, summed over 92 pages) | 0 (not tracked) | ${phase45.evidence} | ${phase46.evidence} |
| Unsupported claims found | not measured | ${phase45.unsupported} (Phase 4.5 guards) | ${phase46.unsupported} (Phase 4.6 guards) |
| Readiness | — | READY ${phase45.readiness.READY} · REVIEW ${phase45.readiness.REVIEW} · HOLD ${phase45.readiness.HOLD} | READY ${phase46.readiness.READY} · REVIEW ${phase46.readiness.REVIEW} · HOLD ${phase46.readiness.HOLD} |
| Elder/patient care city pages with high overlap | ${careBefore} | — | ${careAfter} |

Thresholds are unchanged from Phase 4.5. The new care scopes are **service** facts, so they live on the hubs, not on
city pages: city-page similarity is essentially unchanged, and near-duplicate city pages stay HOLD or REVIEW.

## Method

- Similarity: 5-word shingle Jaccard on main-body copy (\`<main>\` minus blocks marked \`data-boilerplate\`); risk **high** if max similarity ≥ ${THRESHOLDS.highSimilarity} or unique share < ${THRESHOLDS.highUnique}, **medium** if ≥ ${THRESHOLDS.mediumSimilarity} or < ${THRESHOLDS.mediumUnique}.
- Evidence: distinct evidence items (\`src/data/evidence.ts\`) cited by product facts rendered on the page (\`data-evidence\`).
- Unsupported claims: verification, commercial and product-claim guard rules (\`src/lib/guards/claims.ts\`) run on the page text.
- **Word count is reported, not scored.** A short page with specific facts beats a long generic one.
- **HOLD**: unsupported claim; no product evidence for the service in this model; duplicate title/meta; or a city page at high doorway risk with fewer than 2 local notes and no hand-written copy.
- **REVIEW**: high doorway/overlap risk, fewer than ${MIN_EVIDENCE} (hub) / ${MIN_CITY_EVIDENCE} (city) evidence-backed facts, composed (not hand-written) city copy, fewer than ${MIN_INTERNAL_LINKS} internal links, or an open business question for that service.
- Unsupported claims (v3) also include: clinical claims (\`clinicalClaimFindings\`), refund wording broader than the app's policy, the stale ₹299 price, and instant-booking wording on scheduled-only pages.
- **READY**: none of the above.

## HOLD pages and why

${rows.filter((r) => r.readiness === "HOLD").map((r) => `- \`${r.path}\`: ${r.reasons.join("; ")}`).join("\n") || "None."}

## REVIEW pages and why

${rows.filter((r) => r.readiness === "REVIEW").map((r) => `- \`${r.path}\`: ${r.reasons.join("; ")}`).join("\n") || "None."}

## Home, pricing and hubs

${table(rows.filter((r) => r.kind !== "service-city"))}

## City pages

${table(cityRows)}

## Local differentiation notes (city pages)

${cityRows.map((r) => `- \`${r.path}\`: ${r.differentiationNotes.join(" · ") || "none"}`).join("\n")}
`;
writeFileSync("docs/seo/QUALITY-REPORT.md", md);
console.log(md.split("## Method")[0]);

// ---------- First-release review (docs/seo/FIRST-RELEASE-REVIEW.md) ----------
const { firstRelease } = await import("@/data/release-plan");
const { buildIntentMap } = await import("@/lib/content/intent");
const intents = new Map(buildIntentMap("preview").map((e) => [e.path, e]));
const reviewEntries = firstRelease.map((entry) => {
  const row = rows.find((r) => r.path === entry.path);
  if (!row) throw new Error(`Release page ${entry.path} is not a preview route`);
  const root = parse(readFileSync(join(DIST, entry.path, "index.html"), "utf8"));
  const main = root.querySelector("main")!;
  const ctaLabels = [...new Set(main.querySelectorAll(".hero a.button, .path a.button").map((a) => a.text.trim()))];
  const facts = main.querySelectorAll("li[data-evidence]").map((li) => li.text.replace(/\s+/g, " ").trim());
  const scope = main.querySelector(".care-scope > p")?.text.trim();
  const checks = main.querySelectorAll(".claims__item strong").map((n) => n.text.trim());
  const claims = [...(scope ? [`Care scope: ${scope}`] : []), ...facts.slice(0, 4), ...(checks.length ? [`Verification: ${[...new Set(checks)].join("; ")}`] : [])];
  return { entry, row, ctaLabels, claims, intent: intents.get(entry.path)?.primaryIntent ?? "" };
});
const releaseMd = `# First public release — review pack

Generated by \`npm run report\` from \`src/data/release-plan.ts\`, the preview build and the quality report.
**Nothing here is published.** Every page is \`publishStatus: review\` (noindex, not in the production sitemap) until the
business approves it. This pack is for the private noindex preview review.

- Proposed pages: **${firstRelease.length}** — ${reviewEntries.filter((e) => e.row.readiness === "READY").length} READY, ${reviewEntries.filter((e) => e.row.readiness !== "READY").length} not READY
- Evidence: \`docs/seo/CONTENT-EVIDENCE.md\` · reconciliation: \`docs/seo/PRODUCT-TRUTH-RECONCILIATION.md\` · quality: \`docs/seo/QUALITY-REPORT.md\`

| URL | Readiness | Approval |
|---|---|---|
${reviewEntries.map((e) => `| \`${e.entry.path}\` | ${e.row.readiness} | ${e.row.status === "published" ? "approved" : "awaiting business approval"} |`).join("\n")}

${reviewEntries
  .map(
    (e) => `## \`${e.entry.path}\`

| | |
|---|---|
| H1 | ${e.row.h1} |
| Title | ${e.row.title} |
| Meta description | ${e.row.metaDescription} |
| Primary intent | ${e.intent} |
| Readiness | **${e.row.readiness}**${e.row.reasons.length ? ` — ${e.row.reasons.join("; ")}` : ""} |
| CTA | ${e.ctaLabels.join(" · ") || "app download section"} |
| Evidence IDs | ${e.row.evidenceIds.map((x) => `\`${x}\``).join(", ") || "— (no app mechanics stated)"} |
| Why in the release | ${e.entry.why} |
| Outstanding risk | ${e.entry.risk} |
| Approval status | ${e.row.status === "published" ? "Approved" : "Awaiting business approval (publishStatus: review)"} |

Key business claims used:

${e.claims.map((c) => `- ${c}`).join("\n") || "- (none beyond the plans and propositions)"}
`,
  )
  .join("\n")}`;
writeFileSync("docs/seo/FIRST-RELEASE-REVIEW.md", releaseMd);
