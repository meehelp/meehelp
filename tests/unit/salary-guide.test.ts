/**
 * SEO batch 1B — /maid-salary/mumbai/ owns the Mumbai maid salary/charges
 * cluster: indicative market ranges only, linked both ways with /maid/mumbai/.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { schemaSettings } from "@/data/business";
import { guideIntents } from "@/data/intent-map";
import { salaryFigures, salaryGuides } from "@/data/salary-guides";
import { getSiteRoutes } from "@/lib/content";
import { buildIntentMap } from "@/lib/content/intent";
import { resolveRoute } from "@/lib/content/resolve";
import { fillGuideText, formatRange, guideSeo, rupees, salaryGuidePath, salaryGuideProblems } from "@/lib/content/salary-guides";
import { salaryGuideClaimPattern } from "@/lib/guards/claims";
import { routeMetadata } from "@/lib/seo/route-meta";

const guide = salaryGuides.find((g) => g.slug === "maid-salary" && g.city === "mumbai")!;
const PATH = "/maid-salary/mumbai/";
/** Every string a guide renders except the disclosure (the one place negated "average"/"minimum wage" wording may appear), tokens filled. */
const guideText = () =>
  [
    guide.headline,
    ...guide.intro,
    ...guide.sections.flatMap((s) => [s.title, ...s.paragraphs, ...(s.bullets ?? [])]),
    ...guide.methodology,
    ...guide.sources.flatMap((s) => [s.name, s.usedFor]),
    ...guide.faqs.flatMap((f) => [f.question, f.answer]),
  ].map((t) => fillGuideText(guide, t));

test("the guide is one registered route per city, with no /maid-salary/ index", () => {
  assert.equal(salaryGuidePath(guide), PATH);
  assert.equal(salaryGuides.length, 1, "one page owns the whole Mumbai salary cluster");
  for (const stage of ["development", "preview", "release-review", "production"] as const) {
    const route = getSiteRoutes(stage).find((r) => r.path === PATH);
    assert.ok(route, stage);
    assert.equal(route.kind, "guide");
    assert.equal(route.indexable, stage === "production", stage);
    assert.ok(!getSiteRoutes(stage).some((r) => r.path === "/maid-salary/"), `${stage}: no /maid-salary/ page yet`);
  }
  assert.equal(resolveRoute(["maid-salary"], "production"), null);
  assert.equal(resolveRoute(["maid-salary", "pune"], "production"), null);
  assert.equal(resolveRoute(["maid-salary", "mumbai", "andheri-west"], "production"), null);
});

test("title, meta, H1 and canonical follow the brief", () => {
  const meta = routeMetadata(resolveRoute(["maid-salary", "mumbai"], "production")!);
  assert.equal(meta.title, "Maid Salary in Mumbai 2026: Part-Time, Full-Time & Live-In");
  assert.equal(
    meta.description,
    "See indicative maid salary and charges in Mumbai for part-time, full-time and live-in help in 2026, plus the factors that affect what families may pay.",
  );
  assert.equal(meta.canonical, "https://meehelp.in/maid-salary/mumbai/");
  // robots depends on the build stage (SITE_STAGE); production "index, follow" is checked by `npm run seo` on the built page.
  assert.equal(fillGuideText(guide, guide.headline), "Maid salary in Mumbai: what families may pay in 2026");
  // The year is a token: changing guide.year changes title, meta and H1 together.
  for (const t of [guide.seo.title, guide.seo.description, guide.headline]) assert.match(t, /\{year\}/);
  assert.deepEqual(guideSeo({ ...guide, year: 2027 }).title, "Maid Salary in Mumbai 2027: Part-Time, Full-Time & Live-In");
});

test("the salary table is exactly the approved indicative ranges", () => {
  assert.deepEqual(
    guide.ranges.map((r) => [r.arrangement, formatRange(r)]),
    [
      ["Part-time maid / household help", "₹4,500–₹9,000"],
      ["Full-time live-out maid", "₹14,000–₹22,000"],
      ["Live-in maid", "₹18,000–₹28,000+"],
    ],
  );
  assert.equal(
    guide.disclosure,
    "These are indicative Mumbai market ranges, not fixed MeeHelp rates or guaranteed quotes. They are not averages, government rates or statutory minimum wages. Actual salary is agreed between the household and helper and can vary substantially with working hours, duties, experience, locality and household requirements.",
  );
  assert.deepEqual(salaryFigures(guide).map(rupees), ["₹4,500", "₹9,000", "₹14,000", "₹22,000", "₹18,000", "₹28,000"]);
});

test("the disclosure (and only the disclosure) states what the ranges are not", () => {
  for (const term of ["not fixed MeeHelp rates", "guaranteed quotes", "not averages", "government rates", "statutory minimum wages"]) assert.ok(guide.disclosure.includes(term), term);
  assert.match(guide.disclosure, salaryGuideClaimPattern, "the disclosure's negated terms are exactly what the guard catches elsewhere");
});

test("the title fits the normal 65-character limit", () => {
  const { title } = guideSeo(guide);
  assert.ok(title.length <= 65, `${title.length}`);
  assert.doesNotMatch(title, /\| MeeHelp$/);
});

test("no average, legal, government or minimum-wage claims; no other rupee figures", () => {
  for (const t of guideText()) {
    assert.doesNotMatch(t, salaryGuideClaimPattern, t);
    for (const figure of t.match(/₹\s?\d[\d,]*/g) ?? []) assert.ok(salaryFigures(guide).map(rupees).includes(figure), `${figure} in "${t.slice(0, 60)}"`);
  }
  for (const bad of ["The average maid salary", "the minimum wage for maids", "government rate", "legally required", "You must pay", "the official rate"]) {
    assert.match(bad, salaryGuideClaimPattern, bad);
  }
  // "24-hour maid" is explained as live-in, not 24 hours of work.
  assert.ok(guideText().some((t) => /24-hour maid/.test(t) && /not someone who works for 24 hours/.test(t)));
  // Full-time is never a 4-hour slot.
  assert.ok(guideText().some((t) => /four-hour slot is part-time/i.test(t)));
});

test("sources and methodology are present, dated and link only checked pages", () => {
  const names = guide.sources.map((s) => s.name);
  // Specific source groups only (no vague "other guides"); no source presented as authoritative.
  assert.ok(guide.sources.every((src) => !/^other\b/i.test(src.name)), "no vague source group");
  assert.ok(guide.methodology.some((m) => /No single source is treated as authoritative/.test(m)));
  assert.ok(guide.methodology.some((m) => /rounded, indicative band informed by several current published sources/.test(m)));
  for (const n of ["MyBuddyMaid", "Helpers Near Me", "TrustedMaid", "BookMyBai", "MyHelperIndia"]) assert.ok(names.includes(n), n);
  assert.ok(guide.methodology.some((m) => m.includes("{reviewed}")));
  assert.equal(fillGuideText(guide, "{reviewed}"), "October 2026");
  for (const l of guide.sources.flatMap((s) => s.links ?? [])) assert.match(l.href, /^https:\/\//);
  const template = readFileSync("src/components/templates/SalaryGuideTemplate.astro", "utf8");
  assert.match(template, /rel="nofollow noopener noreferrer"/);
});

test("publishing requires a current evidence date in the guide's year", () => {
  assert.deepEqual(salaryGuideProblems(guide), [], "the live guide must pass");
  assert.equal(guide.evidenceReviewedOn.slice(0, 4), String(guide.year));
  assert.ok(salaryGuideProblems({ ...guide, evidenceReviewedOn: "2026-10-22" }, new Date("2027-11-01")).some((p) => /days old/.test(p)));
  assert.ok(salaryGuideProblems({ ...guide, year: 2027 }).some((p) => /does not match/.test(p)));
  assert.ok(salaryGuideProblems({ ...guide, evidenceReviewedOn: "" }).length > 0);
});

test("schema is BreadcrumbList only and the breadcrumb has no /maid-salary/ parent", () => {
  assert.equal(schemaSettings.faqPage, false);
  const template = readFileSync("src/components/templates/SalaryGuideTemplate.astro", "utf8");
  assert.doesNotMatch(template, /<JsonLd|serviceSchema|faqPageSchema|"@type"|LocalBusiness|AggregateRating|JobPosting/);
  assert.match(template, /<Breadcrumbs items=\{\[\{ name: "Home", path: "\/" \}, \{ name: guide\.name, path \}\]\} \/>/);
});

test("the guide and /maid/mumbai/ link to each other; the city page keeps its intent", () => {
  const template = readFileSync("src/components/templates/SalaryGuideTemplate.astro", "utf8");
  assert.match(template, /href=\{cityPagePath\}>Find maids in \{city\.name\}/);
  assert.match(template, /href=\{pricingPath\}/);
  assert.match(template, /href=\{servicePath\(service\.slug\)\}/);
  const city = readFileSync("src/components/templates/ServiceCityTemplate.astro", "utf8");
  assert.match(city, /See our \{city\.name\} \{service\.shortName\.toLowerCase\(\)\} salary guide/);
  const intents = buildIntentMap("production");
  assert.equal(intents.find((e) => e.path === "/maid/mumbai/")?.primaryKeyword, "maid in Mumbai");
  assert.equal(intents.find((e) => e.path === PATH)?.primaryKeyword, guideIntents["maid-salary/mumbai"]!.primaryKeyword);
  assert.equal(guideIntents["maid-salary/mumbai"]!.primaryKeyword, "maid salary in Mumbai");
});
