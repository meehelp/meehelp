/**
 * Phase 4.5 content-truth guards: evidence-backed claims, no city filler,
 * Elder Care / Patient Care differentiation, no clinical or unsupported
 * product claims, no fabricated coverage, and durations that match the app.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { cities } from "@/data/cities";
import { cityFrames } from "@/data/city-frames";
import { evidence, openQuestions, serviceModelEvidence } from "@/data/evidence";
import { home } from "@/data/home";
import { onDemandContent } from "@/data/on-demand";
import { productFacts } from "@/data/product-facts";
import { serviceCities } from "@/data/service-cities";
import { services } from "@/data/services";
import { getServiceCityContent } from "@/lib/content";
import { cityFillerPattern, findViolations, unsupportedClaimRules } from "@/lib/guards/claims";
import { jaccard, shingles } from "../../scripts/lib/similarity";

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => strings(v, out));
  return out;
}
const byId = new Map(evidence.map((e) => [e.id, e]));
const composed = serviceCities.map((sc) => ({ sc, content: getServiceCityContent(sc) }));
const evergreen = strings([services, home, productFacts, cityFrames, composed.map((c) => c.content)]);
const tokens = (t: string) => t.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").split(/\s+/).filter(Boolean);
const overlap = (a: string[], b: string[]) => jaccard(shingles(tokens(a.join(" ")), 3), shingles(tokens(b.join(" ")), 3));

test("every evidence item is complete and contains no secrets or personal data", () => {
  const ids = evidence.map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length, "evidence ids are unique");
  for (const e of evidence) {
    assert.ok(e.claim.length > 10 && e.sourceFile.length > 3, e.id);
    assert.ok(["high", "medium", "low"].includes(e.confidence), e.id);
    assert.ok(["marketplace", "onDemand", "both"].includes(e.proposition), e.id);
    const text = JSON.stringify(e);
    assert.doesNotMatch(text, /AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{20,}|rzp_(?:live|test)_|key_live_|-----BEGIN|sk_live_|\bAC[0-9a-f]{32}\b/, `${e.id} contains a secret-like value`);
    assert.doesNotMatch(text, /\+91[ -]?\d{10}|\b\d{10}\b|@[a-z0-9-]+\.(?:com|in)\b/i, `${e.id} contains a phone number or email`);
  }
});

test("every product fact on the site cites existing, public-safe evidence", () => {
  for (const f of productFacts) {
    assert.ok(f.evidence.length > 0, f.id);
    for (const id of f.evidence) {
      const e = byId.get(id);
      assert.ok(e, `${f.id} cites unknown evidence ${id}`);
      assert.equal(e.publicSafe, true, `${f.id} cites non-public evidence ${id}`);
      assert.equal(e.usedOnSite, true, `${id} is used by ${f.id} but marked usedOnSite: false`);
    }
  }
  for (const [service, models] of Object.entries(serviceModelEvidence)) {
    for (const ids of Object.values(models)) for (const id of ids) assert.ok(byId.has(id), `${service}: ${id}`);
  }
  assert.ok(openQuestions.length > 0);
});

test("the evidence ledger export is up to date", () => {
  const committed = JSON.parse(readFileSync("docs/seo/CONTENT-EVIDENCE.json", "utf8"));
  assert.deepEqual(committed.items.map((i: { id: string }) => i.id), evidence.map((e) => e.id), "run npm run evidence");
  for (const item of committed.items) {
    const { productFacts: used, ...rest } = item;
    assert.deepEqual(rest, JSON.parse(JSON.stringify(byId.get(item.id))), `run npm run evidence (${item.id})`);
    assert.deepEqual(used, productFacts.filter((f) => f.evidence.includes(item.id)).map((f) => f.id));
  }
  assert.match(readFileSync("docs/seo/CONTENT-EVIDENCE.md", "utf8"), new RegExp(`${evidence.length} items`));
});

test("city pages carry no irrelevant filler (festivals, weather, cuisine, tourism)", () => {
  const cityCopy = cities.flatMap((c) => strings([c.facts, c.faqs, c.descriptors]).map((s) => `${c.slug}: ${s}`));
  assert.deepEqual(cityCopy.filter((s) => cityFillerPattern.test(s)), []);
  const pages = composed.flatMap(({ sc, content }) => strings(content).map((s) => `${sc.service}/${sc.city}/${sc.model}: ${s}`));
  assert.deepEqual(pages.filter((s) => cityFillerPattern.test(s)), []);
  assert.deepEqual(strings(cityFrames).filter((s) => /\{(?:cuisine|festivals?|languages)\}/.test(s)), []);
  // The pattern itself still catches the old filler.
  for (const bad of ["Book ahead before Diwali", "Monsoon rain can disrupt trains", "Maharashtrian cuisine"]) assert.match(bad, cityFillerPattern);
});

test("Elder Care and Patient Care are distinct, not near-identical", () => {
  const elder = services.find((s) => s.slug === "elder-care")!;
  const patient = services.find((s) => s.slug === "patient-care")!;
  const pairs: [string, string[], string[]][] = [
    ["hub description", elder.description, patient.description],
    ["hub situations", elder.customerProblems, patient.customerProblems],
    ["hub tasks", elder.tasksIncluded, patient.tasksIncluded],
    ["hourly description", onDemandContent["elder-care"].description, onDemandContent["patient-care"].description],
    ["hourly use cases", onDemandContent["elder-care"].useCases, onDemandContent["patient-care"].useCases],
    ["hourly tasks", onDemandContent["elder-care"].tasksIncluded, onDemandContent["patient-care"].tasksIncluded],
    ["city frames", strings(cityFrames["elder-care"]), strings(cityFrames["patient-care"])],
  ];
  for (const [label, a, b] of pairs) assert.ok(overlap(a, b) < 0.3, `${label}: overlap ${overlap(a, b).toFixed(2)}`);
  // Each has its own evidence-backed task fact, and both pages explain the difference.
  assert.ok(productFacts.some((f) => f.id === "o.elder.task" && f.services?.join() === "elder-care"));
  assert.ok(productFacts.some((f) => f.id === "o.patient.task" && f.services?.join() === "patient-care"));
  for (const od of [onDemandContent["elder-care"], onDemandContent["patient-care"]]) {
    assert.ok(od.faqs.some((f) => /elder care/i.test(f.question + f.answer) && /patient care/i.test(f.question + f.answer)), od.slug);
  }
});

test("care categories make no clinical claims", async () => {
  const { clinicalClaimFindings } = await import("@/lib/guards/claims");
  const invasive = /\b(?:inject\w*|insulin|iv\b|intravenous|drips?|catheter\w*|wound\w*|bed[- ]?sores?)/i;
  const care = ["elder-care", "patient-care", "babysitter-nanny"] as const;
  const positive = care.flatMap((s) => {
    const svc = services.find((x) => x.slug === s)!;
    return [...svc.tasksIncluded, ...svc.customerProblems, ...onDemandContent[s].tasksIncluded, ...onDemandContent[s].useCases, ...strings(cityFrames[s]).filter((x) => !x.includes("{"))];
  });
  assert.deepEqual(positive.filter((t) => invasive.test(t)), [], "invasive, wound or catheter work may only appear as an exclusion");
  const careFacts = productFacts.filter((f) => f.services?.some((s) => (care as readonly string[]).includes(s))).map((f) => f.text);
  assert.deepEqual(careFacts.filter((t) => invasive.test(t)), []);
  // Descriptions and FAQ answers pass the sentence-level clinical guard.
  const prose = care.flatMap((s) => {
    const svc = services.find((x) => x.slug === s)!;
    return [...svc.description, ...svc.faqs.map((f) => f.answer), ...onDemandContent[s].description, ...onDemandContent[s].faqs.map((f) => f.answer)];
  });
  assert.deepEqual(prose.flatMap((t) => clinicalClaimFindings(t)), []);
});

test("no unsupported product claims anywhere in evergreen copy", () => {
  const hits = evergreen.flatMap((s) => findViolations(s, unsupportedClaimRules()).map((v) => `${v.rule.id}: ${s.slice(0, 90)}`));
  assert.deepEqual(hits, []);
  for (const bad of [
    "Filter helpers by experience and language",
    "Live tracking for every booking",
    "Top-rated maids near you",
    "Trained caregivers at your door",
    "We provide nursing care at home",
    "Start your free trial",
  ]) {
    assert.ok(findViolations(bad, unsupportedClaimRules()).length > 0, bad);
  }
  for (const ok of ["This is not nursing care.", "Agree a trial day with the helper directly.", "Medical treatment isn't part of their role."]) {
    assert.deepEqual(findViolations(ok, unsupportedClaimRules()), [], ok);
  }
});

test("no fabricated local coverage", () => {
  for (const { sc, content } of composed) assert.deepEqual(content.areasServed, [], `${sc.service}/${sc.city}: areasServed needs confirmed data`);
  const claims = /\b(?:we (?:serve|cover)|now serving|available in (?:all|every) (?:area|locality|sector|neighbourhood)s?|all (?:areas|localities|sectors) of)\b/i;
  assert.deepEqual(evergreen.filter((s) => claims.test(s)), []);
  for (const c of cities) {
    for (const f of c.facts) assert.doesNotMatch(f.text, /\b\d[\d,]*\+?\s*(?:helpers?|maids?|families|customers|bookings|km)\b/i, `${c.slug}: no counts or statistics`);
  }
});

test("on-demand durations, windows and booking modes match the app", () => {
  const onDemandCopy = strings([onDemandContent, Object.values(cityFrames).map((f) => f.onDemand), productFacts.filter((f) => f.model === "onDemand")]);
  const allowed = { hour: new Set([2, 4, 6, 8, 10, 12]), minute: new Set([120, 150, 180]), day: new Set([5]) };
  for (const s of onDemandCopy) {
    for (const m of s.matchAll(/\b(\d+)[- ]?(hours?|minutes?|days?)\b/gi)) {
      const unit = m[2]!.toLowerCase().replace(/s$/, "") as keyof typeof allowed;
      assert.ok(allowed[unit].has(Number(m[1])), `"${m[0]}" is not an app value: ${s.slice(0, 80)}`);
    }
    assert.doesNotMatch(s, /₹|\bRs\.?\s?\d|\bINR\b|per hour rate|\/hour\b/i, `on-demand prices are unknown: ${s.slice(0, 80)}`);
  }
  // Instant ("Book now") is only promised where the app offers it.
  for (const svc of services) {
    const od = svc.onDemand;
    if (od.bookNow) continue;
    const copy = strings([od, cityFrames[svc.slug].onDemand]);
    assert.deepEqual(copy.filter((t) => /\b(?:instant(?:ly)?|book now|right away|straight away|right now|at short notice)\b/i.test(t)), [], svc.slug);
  }
  assert.equal(onDemandContent.maid.bookNow, true);
});

test("hand-written city pages exist only where they add local information", () => {
  const written = serviceCities.filter((sc) => sc.overrides);
  for (const sc of written) {
    const c = getServiceCityContent(sc);
    assert.ok(c.localFaqs.length >= 2 && c.introduction.length >= 1, `${sc.service}/${sc.city}`);
    assert.ok(strings(c).every((s) => !cityFillerPattern.test(s)), `${sc.service}/${sc.city}`);
  }
  // Phase 4.6: elder care maps to the shared care-helper pool (biz.elder-pool), not a separate category.
  assert.ok(serviceModelEvidence["elder-care"].marketplace.includes("biz.elder-pool"));
});

test("copy avoids stock SEO phrasing", () => {
  const stock = /\blooking for (?:a|an|someone)\b|\bwhether you need\b|\bour platform makes\b|\bin today's\b|\btrusted and reliable\b|\bhassle[- ]free\b|\bone[- ]stop\b|\b(?:best|world)[- ]class\b|\bseamless(?:ly)?\b/i;
  const files = ["src/components/templates/ServiceTemplate.astro", "src/components/templates/OnDemandHubTemplate.astro", "src/components/templates/ServiceCityTemplate.astro", "src/components/templates/OnDemandCityTemplate.astro", "src/pages/index.astro"];
  assert.deepEqual(evergreen.filter((s) => stock.test(s)), []);
  for (const f of files) assert.doesNotMatch(readFileSync(f, "utf8"), stock, f);
});

test("the first-release recommendation contains no HOLD pages and stays small", async () => {
  const { firstRelease } = await import("@/data/release-plan");
  const report = JSON.parse(readFileSync("docs/seo/quality-report.json", "utf8")) as { pages: { path: string; readiness: string }[] };
  const readiness = new Map(report.pages.map((p) => [p.path, p.readiness]));
  assert.ok(firstRelease.length >= 10 && firstRelease.length <= 20, `${firstRelease.length} pages`);
  for (const r of firstRelease) {
    assert.ok(readiness.has(r.path), `${r.path} is not a preview route`);
    assert.notEqual(readiness.get(r.path), "HOLD", r.path);
    if (r.when === "now") assert.equal(readiness.get(r.path), "READY", r.path);
    else assert.ok(r.waitsOn?.every((q) => openQuestions.some((o) => o.id === q)), r.path);
  }
});

test("on-demand steps and tips never promise instant help or give hiring advice", async () => {
  const { bookingSafeguards, scheduledOnlySteps } = await import("@/data/how-it-works");
  assert.deepEqual(strings(scheduledOnlySteps).filter((s) => /\binstant(?:ly)?\b|\bbook now\b/i.test(s)), []);
  assert.deepEqual(bookingSafeguards.filter((s) => /\bsalary\b|\bnotice period\b|\btrial\b|\bweekly off\b/i.test(s)), []);
});
