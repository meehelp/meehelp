/**
 * Phase 4.6 — final business reconciliation: instant scope, Aadhaar and
 * address wording, ₹299, elder-care mapping, care scopes, clinical safety,
 * narrow cancellation, and dynamic app values kept out of evergreen copy.
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { businessModels } from "@/data/business-models";
import { careScopes, clinicalServices, publishedScope } from "@/data/care-scope";
import { cityFrames } from "@/data/city-frames";
import { ctas } from "@/data/ctas";
import { evidence } from "@/data/evidence";
import { home } from "@/data/home";
import { scheduledOnlySteps } from "@/data/how-it-works";
import { observedAmounts, observedHourlySchedule, observedOneTimeCleaning } from "@/data/observed-app-values";
import { onDemandContent } from "@/data/on-demand";
import { plans, pricingPage } from "@/data/plans";
import { factsFor, productFacts } from "@/data/product-facts";
import { reconciliation } from "@/data/reconciliation";
import { firstRelease } from "@/data/release-plan";
import { serviceCities } from "@/data/service-cities";
import { services } from "@/data/services";
import { verificationChecks, verificationScope } from "@/data/verification";
import { getServiceCityContent, getSiteRoutes } from "@/lib/content";
import { buildIntentMap } from "@/lib/content/intent";
import { broadRefundPattern, clinicalClaimFindings, findViolations, stalePricePattern, verificationRules } from "@/lib/guards/claims";

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => strings(v, out));
  return out;
}
const scopeText = (["babysitter-nanny", "elder-care", "patient-care"] as const).flatMap((s) => {
  const scope = publishedScope(s)!;
  return [scope.intro, ...scope.groups.flatMap((g) => [g.title, g.note ?? "", ...g.items.map((i) => i.text)])];
});
const evergreen = strings([
  services,
  home,
  pricingPage,
  productFacts,
  cityFrames,
  verificationScope,
  Object.values(verificationChecks).filter((c) => c.enabled),
  serviceCities.map(getServiceCityContent),
  scopeText,
]);
const verificationHits = (text: string) => findViolations(text, verificationRules()).map((v) => v.rule.id);

test("₹299 (stale app copy) never appears in Website V2 content", () => {
  assert.deepEqual(evergreen.filter((s) => stalePricePattern.test(s)), []);
  assert.ok(!plans.some((p) => p.currentPrice === 299 || p.previousPrice === 299));
  assert.equal(Math.min(...plans.filter((p) => p.segment === "home").map((p) => p.currentPrice)), 499);
  const allowed = new Set(["src/data/evidence.ts", "src/data/reconciliation.ts", "src/lib/guards/claims.ts"]);
  const walk = (d: string): string[] => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
  const hits = walk("src").filter((f) => !allowed.has(f) && /\.(ts|astro)$/.test(f) && stalePricePattern.test(readFileSync(f, "utf8")));
  assert.deepEqual(hits, []);
  for (const bad of ["Plans start at Rs 299", "Only ₹299!"]) assert.match(bad, stalePricePattern);
});

test("instant booking is limited to the one-time cleaning flow", () => {
  assert.equal(businessModels.onDemand.instantScope, "one-time-cleaning");
  assert.deepEqual(services.filter((s) => s.models.instantBooking).map((s) => s.slug), ["maid"]);
  for (const [key, cta] of Object.entries(ctas)) {
    if (/instant|now/i.test(cta.label) && cta.model === "onDemand") assert.equal(cta.scope, "one-time-cleaning", key);
  }
  // Templates render the instant CTA only behind bookNow.
  for (const f of ["src/components/templates/OnDemandHubTemplate.astro", "src/components/templates/OnDemandCityTemplate.astro"]) {
    for (const line of readFileSync(f, "utf8").split("\n").filter((l) => l.includes('ctaKey="bookNow"'))) assert.match(line, /od\.bookNow \?/, f);
  }
  assert.doesNotMatch(readFileSync("src/pages/index.astro", "utf8"), /ctaKey="bookNow"|ctaKey="bookInstant"/);
  // Instant facts are maid-only.
  for (const f of productFacts.filter((x) => /\bbook now\b|\binstant/i.test(x.text))) assert.deepEqual(f.services, ["maid"], f.id);
});

test("care hubs do not claim instant booking", () => {
  for (const slug of ["cook", "babysitter-nanny", "elder-care", "patient-care"] as const) {
    const od = onDemandContent[slug];
    assert.equal(od.bookNow, false, slug);
    const copy = strings([od, cityFrames[slug].onDemand, factsFor(slug, "onDemand").map((f) => f.text), scheduledOnlySteps]);
    assert.deepEqual(copy.filter((s) => /\binstant(?:ly)?\b|\bbook now\b|\bright away\b|\bstraight away\b|\bat short notice\b/i.test(s)), [], slug);
  }
  for (const id of ["cook", "babysitter-nanny", "elder-care", "patient-care"]) {
    const intent = buildIntentMap("preview").find((e) => e.service === id && e.model === "onDemand" && e.kind === "service")!;
    assert.doesNotMatch(`${intent.primaryIntent} ${intent.proposition} ${intent.supportingKeywords.join(" ")}`, /instant|book now/i, id);
  }
});

test("Aadhaar wording describes a manually reviewed document", () => {
  const a = verificationChecks.aadhaarDocumentReviewed;
  assert.equal(a.enabled, true);
  assert.equal(a.claim, "Aadhaar document reviewed");
  assert.match(a.detail, /submit/i);
  assert.match(a.detail, /manually/i);
  assert.ok(a.approvedOn && a.approvedOn >= "2026-10-18");
  assert.equal(evidence.find((e) => e.id === "biz.aadhaar-manual")?.sourceType, "businessConfirmation");
});

test("no electronic Aadhaar verification claims", () => {
  for (const bad of [
    "Aadhaar verified helpers",
    "Aadhaar-verified",
    "Verified through Aadhaar OTP",
    "Identity checked against the government database",
    "e-KYC based Aadhaar check",
    "UIDAI verified",
    "Fully verified helpers",
    "Background verified",
    "Electronically verified identity",
  ]) {
    assert.ok(verificationHits(bad).length > 0, bad);
  }
  assert.deepEqual(evergreen.filter((s) => verificationHits(s).includes("aadhaar-electronic")), []);
});

test("no independent current or permanent address verification claims", () => {
  assert.equal(verificationChecks.currentAddressRecorded.enabled, false);
  assert.equal(verificationChecks.permanentAddressRecorded.enabled, false);
  for (const bad of ["Permanent address on record", "Address verified", "We verify the helper's address", "Current address is verified"]) {
    assert.ok(verificationHits(bad).includes("address-verification"), bad);
  }
  assert.deepEqual(evergreen.filter((s) => verificationHits(s).includes("address-verification")), []);
  assert.match(verificationChecks.aadhaarDocumentReviewed.detail, /address on that document/i);
});

test("elder care maps to the shared care-helper pool, not a separate category", () => {
  const pool = productFacts.find((f) => f.id === "m.elder.pool");
  assert.ok(pool && pool.services?.join() === "elder-care" && pool.evidence.includes("biz.elder-pool"));
  const elder = services.find((s) => s.slug === "elder-care")!;
  assert.ok(elder.description.some((d) => /same pool/i.test(d)));
  assert.ok(elder.faqs.some((f) => /separate category/i.test(f.question) && /^No\b/.test(f.answer)));
  // Any mention of an elder-care "category" must be a question or a negation.
  const mentions = evergreen.flatMap((s) => s.split(/(?<=[.!?])\s+/)).filter((s) => /\belder[- ]care\s+(?:helper\s+)?categor/i.test(s));
  for (const m of mentions) assert.ok(/\?$|\bno\b|\bnot\b|\bisn't\b/i.test(m), m);
});

test("invasive clinical services are disabled and never rendered", () => {
  assert.equal(clinicalServices.invasive, false);
  assert.equal(clinicalServices.woundAndCatheter, false);
  const all = Object.values(careScopes).flatMap((s) => s!.groups.flatMap((g) => g.items));
  for (const i of all.filter((x) => /inject|insulin|\biv\b|invasive/i.test(x.text))) assert.equal(i.status, "clinical-approval", i.text);
  for (const i of all.filter((x) => /wound|bed-sore|catheter/i.test(x.text))) assert.notEqual(i.status, "published", i.text);
  assert.deepEqual(scopeText.filter((t) => /inject|insulin|\biv\b|invasive|wound|bed-sore|catheter/i.test(t)), []);
  for (const bad of ["Our attendants give injections at home.", "IV therapy at home.", "Insulin administration included.", "We provide wound dressing.", "Nursing care by our nurses."]) {
    assert.ok(clinicalClaimFindings(bad).length > 0, bad);
  }
  for (const ok of ["Injections, IV drips and other invasive procedures are not part of patient care.", "Is this nursing care?", "Taking temperature and blood pressure, where the assigned caregiver is trained."]) {
    assert.deepEqual(clinicalClaimFindings(ok), [], ok);
  }
  const clinical = evidence.find((e) => e.id === "biz.scope-elder-clinical")!;
  assert.equal(clinical.requiresBusinessClinicalApproval, true);
  assert.equal(clinical.usedOnSite, false);
});

test("patient care does not claim injections or IV", () => {
  const patient = services.find((s) => s.slug === "patient-care")!;
  const scope = publishedScope("patient-care")!;
  const scopeItems = scope.groups.flatMap((g) => g.items.map((i) => i.text));
  const positive = [...patient.tasksIncluded, ...patient.description, ...onDemandContent["patient-care"].tasksIncluded, ...scopeItems];
  assert.deepEqual(positive.flatMap((t) => clinicalClaimFindings(t)), []);
  assert.deepEqual(positive.filter((t) => /inject|\biv\b|intravenous|drip/i.test(t) && !/\bnot\b|\bno\b/i.test(t)), []);
  assert.ok(patient.tasksExcluded.some((t) => /injections/i.test(t) && /IV/.test(t)));
  // Vitals appear only with the "trained" qualifier.
  for (const t of scopeItems.filter((x) => /temperature|blood pressure/i.test(x))) {
    const group = scope.groups.find((g) => g.items.some((i) => i.text === t));
    assert.ok(/trained/i.test(t) || /trained/i.test(group?.note ?? ""), t);
  }
});

test("care hubs use the business-approved scopes", () => {
  const expected: Record<string, string[]> = {
    "babysitter-nanny": ["Everyday care", "Feeding", "Sleep and routine", "Play and activity", "Your baby's space"],
    "elder-care": ["Personal care", "Moving around safely", "Meals and the home", "Company and outings", "Special care needs"],
    "patient-care": ["Personal care", "Mobility", "Food and water", "Medicines", "Monitoring", "Comfort and surroundings"],
  };
  for (const [slug, titles] of Object.entries(expected)) {
    const scope = publishedScope(slug as never)!;
    assert.deepEqual(scope.groups.map((g) => g.title), titles, slug);
    for (const id of scope.evidence) assert.equal(evidence.find((e) => e.id === id)?.sourceType, "businessConfirmation", id);
  }
  for (const f of ["src/components/templates/ServiceTemplate.astro", "src/components/templates/OnDemandHubTemplate.astro"]) {
    assert.match(readFileSync(f, "utf8"), /<CareScope service=\{service\.slug\} \/>/, f);
  }
  // Baby care is framed by parental instructions and makes no guarantees.
  const babyScope = publishedScope("babysitter-nanny")!;
  const baby = [babyScope.intro, ...babyScope.groups.flatMap((g) => g.items.map((i) => i.text))];
  assert.ok(baby.some((t) => /your instructions|you set|as you show|you instruct/i.test(t)));
  assert.deepEqual(baby.filter((t) => /guarantee|paediatric|pediatric|ensure (?:your|the) (?:baby|child)'?s? (?:safety|development)/i.test(t)), []);
});

test("one-time-cleaning cancellation wording is narrow and accurate", () => {
  const cancel = productFacts.find((f) => f.id === "o.otg.cancel")!;
  assert.deepEqual(cancel.services, ["maid"]);
  assert.match(cancel.text, /no helper was assigned/);
  assert.match(cancel.text, /2–7 working days/);
  assert.match(cancel.text, /not refunded/);
  assert.ok(cancel.evidence.includes("shot.cancellation"));
  for (const s of evergreen.filter((x) => /refund/i.test(x))) assert.ok(/no helper was assigned|not refunded|no refund/i.test(s), s);
  for (const bad of ["All cancellations before acceptance get a refund.", "Free cancellation!", "Cancel anytime", "Full refund if you cancel"]) assert.match(bad, broadRefundPattern);
  assert.doesNotMatch(cancel.text, broadRefundPattern);
  assert.ok(!productFacts.some((f) => /reschedul/i.test(f.text)), "rescheduling stays unknown");
});

test("screenshot-derived prices are observations, never evergreen prices", () => {
  assert.equal(observedOneTimeCleaning.evergreenCopyAllowed, false);
  assert.equal(observedHourlySchedule.evergreenCopyAllowed, false);
  for (const e of evidence.filter((x) => x.observation === "observedCurrentAppFlow")) {
    assert.equal(e.publicSafe, false, e.id);
    assert.equal(e.usedOnSite, false, e.id);
  }
  const money = (n: number) => new RegExp(`(?:₹|\\bRs\\.?\\s?)${n.toLocaleString("en-IN").replace(".", "\\.")}\\b|(?:₹|\\bRs\\.?\\s?)${String(n).replace(".", "\\.")}\\b`);
  const onDemandCopy = strings([onDemandContent, Object.values(cityFrames).map((f) => f.onDemand), productFacts]);
  for (const n of observedAmounts()) assert.deepEqual(onDemandCopy.filter((s) => money(n).test(s)), [], `₹${n}`);
  assert.deepEqual(onDemandCopy.filter((s) => /\b(?:starting|starts?|from)\s+(?:at\s+)?₹/i.test(s)), []);
  assert.deepEqual(onDemandCopy.filter((s) => /\b\d+\s?%|\bgst\b|platform fee/i.test(s)), [], "no fee percentages or tax wording");
});

test("dynamic and promotional values never reach titles, metas or the intent map", () => {
  const routes = getSiteRoutes("preview");
  for (const r of routes) {
    assert.doesNotMatch(`${r.title} ${r.description}`, /₹|\bRs\b|\d+\s?%|\b(?:off|discount|offer|sale|cashback|free)\b/i, r.path);
  }
  for (const e of buildIntentMap("preview")) {
    assert.doesNotMatch(`${e.primaryKeyword} ${e.supportingKeywords.join(" ")} ${e.proposition}`, /₹|\d+\s?%|discount|offer/i, e.path);
  }
});

test("evidence sources stay separately identifiable and the reconciliation is exported", () => {
  for (const e of evidence) {
    assert.ok(["codeEvidence", "businessConfirmation", "currentAppScreenshot"].includes(e.sourceType), e.id);
    if (e.id.startsWith("biz.")) assert.equal(e.sourceType, "businessConfirmation", e.id);
    if (e.id.startsWith("shot.")) assert.equal(e.sourceType, "currentAppScreenshot", e.id);
    if (/^(?:mkt|od|cat|trust|cov|impl)\./.test(e.id)) assert.equal(e.sourceType, "codeEvidence", e.id);
    if (e.supersededBy) assert.ok(evidence.some((x) => x.id === e.supersededBy), `${e.id} → ${e.supersededBy}`);
    // Screenshots contain a customer address and wallet balance: never recorded.
    assert.doesNotMatch(JSON.stringify(e), /crescent|jerbai|wadia|nisarga|bhoiwada|parel|available:\s*₹|4121/i, e.id);
  }
  const ids = new Set(evidence.map((e) => e.id));
  for (const r of reconciliation) for (const id of r.evidence) assert.ok(ids.has(id), `${r.topic}: ${id}`);
  const exported = JSON.parse(readFileSync("docs/seo/PRODUCT-TRUTH-RECONCILIATION.json", "utf8"));
  assert.deepEqual(exported.topics, JSON.parse(JSON.stringify(reconciliation)), "run npm run evidence");
  assert.match(readFileSync("docs/seo/PRODUCT-TRUTH-RECONCILIATION.md", "utf8"), /Website V2 position/);
});

test("the first-release review pack covers every proposed page", () => {
  const pack = readFileSync("docs/seo/FIRST-RELEASE-REVIEW.md", "utf8");
  for (const r of firstRelease) {
    assert.ok(pack.includes(`## \`${r.path}\``), r.path);
    assert.ok(r.risk.length > 10, `${r.path} needs an outstanding-risk note`);
  }
  for (const field of ["H1", "Title", "Primary intent", "Readiness", "CTA", "Evidence IDs", "Outstanding risk", "Approval status"]) assert.ok(pack.includes(`| ${field} |`), field);
});
