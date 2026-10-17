/**
 * Phase 4 content architecture: business configuration, the 92-page preview
 * inventory, wording guards, intent map, canonical separation and the
 * similarity analyser used by npm run seo and npm run report.
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { cities } from "@/data/cities";
import { home } from "@/data/home";
import { bookingTypes, marketplaceSteps, onDemandSteps } from "@/data/how-it-works";
import { intentTargets, siteIntents } from "@/data/intent-map";
import { plans, pricingPage, pricingSettings } from "@/data/plans";
import { serviceCities } from "@/data/service-cities";
import { services } from "@/data/services";
import { getServiceCityContent, getSiteRoutes, serviceCityStatus, serviceHubStatus } from "@/lib/content";
import { buildIntentMap } from "@/lib/content/intent";
import { serviceCityPath, servicePath } from "@/lib/content/paths";
import { resolveRoute } from "@/lib/content/resolve";
import { commercialRules, findViolations, pricedAsteriskPattern } from "@/lib/guards/claims";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { analyseSimilarity, jaccard, makeNormaliser, riskOf, shingles, THRESHOLDS } from "../../scripts/lib/similarity";

const MODELS = ["marketplace", "onDemand"] as const;

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => strings(v, out));
  return out;
}

/** Every piece of evergreen copy: data files plus every composed city page. */
const evergreen = strings([
  services,
  cities,
  home,
  pricingPage,
  plans,
  marketplaceSteps,
  onDemandSteps,
  bookingTypes,
  serviceCities.map(getServiceCityContent),
]);

const ruleHits = (id: string) =>
  evergreen.flatMap((s) => findViolations(s, commercialRules()).filter((v) => v.rule.id === id).map(() => s.slice(0, 90)));

test("every service supports marketplace, on-demand, instant, scheduled and hourly booking", () => {
  assert.equal(services.length, 5);
  for (const s of services) {
    for (const k of ["marketplace", "onDemand", "instantBooking", "scheduledBooking", "hourlyBooking"] as const) {
      assert.equal(s.models[k], true, `${s.slug}.${k}`);
    }
  }
});

test("all 8 cities are active and available for every service in both models", () => {
  assert.deepEqual(cities.map((c) => c.slug).sort(), [
    "ahmedabad",
    "bengaluru",
    "chennai",
    "delhi-ncr",
    "hyderabad",
    "kolkata",
    "mumbai",
    "pune",
  ]);
  for (const c of cities) {
    assert.equal(c.marketActive, true, c.slug);
    for (const s of services) for (const m of MODELS) assert.equal(c.availability[s.slug][m], "available", `${c.slug}/${s.slug}/${m}`);
  }
});

test("the free profile view promotion never appears in evergreen copy, titles or metas", () => {
  assert.deepEqual(ruleHits("promo-free-profile"), []);
  const routes = getSiteRoutes("preview");
  for (const r of routes) assert.doesNotMatch(`${r.title} ${r.description}`, /\bfree\b/i, r.path);
  // The guard itself catches the obvious phrasings.
  for (const bad of ["Get 1 free profile view", "Your first profile view is free", "free helper profile views"]) {
    assert.ok(findViolations(bad, commercialRules()).some((v) => v.rule.id === "promo-free-profile"), bad);
  }
});

test("no price carries an asterisk anywhere", () => {
  assert.equal(pricingSettings.asterisk.show, false);
  assert.deepEqual(evergreen.filter((s) => pricedAsteriskPattern.test(s)), []);
  assert.ok(pricedAsteriskPattern.test("₹499*"));
  const components = readdirSync("src/components/pricing").map((f) => join("src/components/pricing", f));
  for (const f of [...components, "src/lib/pricing.ts"]) {
    const code = readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    assert.doesNotMatch(code, /["'`>]\s*\*\s*["'`<]|\*\s*<\/sup>|<sup>\s*\*/, `${f} renders an asterisk`);
  }
});

test("no tax wording while no tax statement has been provided", () => {
  assert.equal(pricingSettings.taxStatement, null);
  assert.deepEqual(ruleHits("tax"), []);
  for (const bad of ["₹499 + GST", "Prices inclusive of taxes", "GST extra", "taxes as applicable"]) {
    assert.ok(findViolations(bad, commercialRules()).some((v) => v.rule.id === "tax"), bad);
  }
});

test("no 'free hiring' or guarantee claims in evergreen copy", () => {
  for (const id of ["free", "guarantee"]) {
    const rule = commercialRules().find((r) => r.id === id);
    if (rule) assert.deepEqual(ruleHits(id), [], id);
  }
});

test("city route inventory is complete: 5 + 5 hubs, 40 + 40 city pages, home and pricing = 92", () => {
  const routes = getSiteRoutes("preview");
  assert.equal(routes.length, 92);
  const paths = new Set(routes.map((r) => r.path));
  for (const s of services) {
    for (const m of MODELS) {
      assert.ok(paths.has(servicePath(s.slug, m)), servicePath(s.slug, m));
      for (const c of cities) assert.ok(paths.has(serviceCityPath(s.slug, c.slug, m)), serviceCityPath(s.slug, c.slug, m));
    }
  }
  assert.ok(paths.has("/") && paths.has("/pricing/"));
  assert.equal(serviceCities.length, 80);
  // No locality, blog, competitor or synonym routes in the preview inventory.
  for (const r of routes) assert.ok(["home", "service", "service-city", "pricing"].includes(r.kind), r.path);
  assert.deepEqual(
    services.map((s) => s.onDemand.slug),
    ["hourly-maid", "hourly-cook", "hourly-babysitter", "hourly-elder-care", "hourly-patient-care"],
  );
});

test("expanded pages stay in review: noindex on every stage, production builds home only", () => {
  for (const stage of ["preview", "production"] as const) {
    for (const r of getSiteRoutes(stage).filter((x) => x.kind !== "home")) {
      assert.equal(r.indexable, false, `${stage} ${r.path}`);
    }
  }
  assert.deepEqual(getSiteRoutes("production").map((r) => r.path), ["/"]);
  for (const s of services) for (const m of MODELS) assert.equal(serviceHubStatus(s, m), "review", `${s.slug}/${m}`);
  for (const sc of serviceCities) assert.equal(serviceCityStatus(sc), "review", `${sc.service}/${sc.city}/${sc.model}`);
});

test("the intent map covers every route and the committed JSON is up to date", () => {
  const map = buildIntentMap("preview");
  assert.deepEqual(map.map((e) => e.path).sort(), getSiteRoutes("preview").map((r) => r.path).sort());
  for (const e of map) {
    assert.ok(e.primaryIntent && e.primaryKeyword && e.proposition, e.path);
    assert.ok(e.supportingKeywords.length >= 2, e.path);
    assert.equal(e.note, "intent targets — not search-volume estimates");
  }
  for (const s of services) for (const m of MODELS) assert.ok(intentTargets[s.slug][m].cityKeywords.length >= 1, `${s.slug}/${m}`);
  assert.ok(siteIntents.home && siteIntents.pricing);
  // Each primary keyword targets one page only (no cannibalisation inside the site).
  const keywords = map.map((e) => e.primaryKeyword.toLowerCase());
  assert.equal(new Set(keywords).size, keywords.length);
  const committed = JSON.parse(readFileSync("docs/seo/intent-map.json", "utf8"));
  assert.deepEqual(committed.pages, JSON.parse(JSON.stringify(map)), "run npm run intent-map");
});

test("marketplace and on-demand pages have separate, self-referencing canonicals", () => {
  for (const s of services) {
    const hub = resolveRoute([s.slug], "preview");
    const od = resolveRoute([s.onDemand.slug], "preview");
    assert.ok(hub && hub.kind === "service" && od && od.kind === "service");
    assert.equal(hub.model, "marketplace");
    assert.equal(od.model, "onDemand");
    for (const c of cities) {
      const a = serviceCityPath(s.slug, c.slug, "marketplace");
      const b = serviceCityPath(s.slug, c.slug, "onDemand");
      assert.notEqual(a, b);
      const ma = buildPageMetadata({ title: "t", description: "d", path: a, indexable: false });
      const mb = buildPageMetadata({ title: "t", description: "d", path: b, indexable: false });
      assert.ok(ma.canonical?.endsWith(a) && mb.canonical?.endsWith(b), `${a} / ${b}`);
    }
  }
});

test("titles, metas and H1s are unique across the whole preview inventory", () => {
  const routes = getSiteRoutes("preview");
  const dupes = (xs: string[]) => xs.filter((x, i) => xs.indexOf(x) !== i);
  assert.deepEqual(dupes(routes.map((r) => r.title)), []);
  assert.deepEqual(dupes(routes.map((r) => r.description)), []);
  assert.deepEqual(dupes(buildIntentMap("preview").map((e) => e.h1)), []);
});

test("the similarity analyser scores city-swapped copy as high risk and distinct copy as low", () => {
  const normalise = makeNormaliser(["Mumbai", "Pune", "Navi Mumbai"], ["maid"]);
  assert.deepEqual(normalise("Find a maid in Navi Mumbai"), normalise("Find a maid in Pune"));
  const body = "Search for house help who work in the city and contact them directly to agree tasks timings and salary yourself.";
  const swapped = analyseSimilarity(
    [
      { path: "/maid/mumbai/", text: body.replace("the city", "Mumbai") },
      { path: "/maid/pune/", text: body.replace("the city", "Pune") },
    ],
    normalise,
  );
  assert.ok(swapped.every((r) => r.risk === "high" && r.maxSimilarity === 1), JSON.stringify(swapped));
  const distinct = analyseSimilarity(
    [
      { path: "/a/", text: "Monsoon months mean laundry takes longer to dry so many families ask for ironing on fixed days." },
      { path: "/b/", text: "Gated societies often register domestic workers at the gate and issue a pass before the first visit." },
    ],
    normalise,
  );
  assert.ok(distinct.every((r) => r.risk === "low"), JSON.stringify(distinct));
  assert.equal(jaccard(shingles(["a", "b", "c", "d", "e"]), shingles(["a", "b", "c", "d", "e"])), 1);
  assert.equal(riskOf(THRESHOLDS.highSimilarity, 1), "high");
  assert.equal(riskOf(0, THRESHOLDS.highUnique - 0.01), "high");
  assert.equal(riskOf(0.1, 0.9), "low");
});
