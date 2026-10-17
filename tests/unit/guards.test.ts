import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { cities } from "@/data/cities";
import { home } from "@/data/home";
import { serviceCities } from "@/data/service-cities";
import { services } from "@/data/services";
import { verificationChecks } from "@/data/verification";
import { commercialRules, findViolations, forbiddenInModel, priceStringPattern, verificationRules } from "@/lib/guards/claims";

const rules = [...verificationRules(), ...commercialRules()];
const flagged = (text: string) => findViolations(text, rules).map((v) => v.rule.id);

test("unconfirmed checks are disabled; confirmed identity checks are enabled", () => {
  for (const key of ["policeVerification", "criminalBackgroundCheck", "referenceVerification", "employmentHistoryVerification"] as const) {
    assert.equal(verificationChecks[key].enabled, false, key);
  }
  for (const key of ["mobileOtpVerified", "aadhaarVerified", "currentAddressRecorded", "permanentAddressRecorded"] as const) {
    assert.equal(verificationChecks[key].enabled, true, key);
    assert.ok(verificationChecks[key].approvedBy && verificationChecks[key].approvedOn, key);
  }
});

test("unsupported verification claims are caught", () => {
  const bad = [
    "All our maids are police verified.",
    "Helpers are verified by the police.",
    "Every helper comes with police verification.",
    "Background-checked nannies near you",
    "We carry out a criminal background check on every cook.",
    "Fully verified helpers",
    "100% verified staff",
    "Hire verified maids in Mumbai",
    "References checked for every attendant",
    "Previous employers verified",
    "Employment history verified",
    "Thoroughly vetted caregivers",
  ];
  for (const text of bad) assert.notEqual(flagged(text).length, 0, text);
});

test("honest advice and confirmed wording are allowed", () => {
  const ok = [
    "Aadhaar verified",
    "Aadhaar-verified helpers near you",
    "Mobile number verified by OTP",
    "Aadhaar verification confirms a helper's identity. It is not a police verification or a criminal background check, so follow the hiring tips below as well.",
    "Many housing societies and local police ask households to register domestic staff.",
    "Delhi Police offers domestic help verification, and many RWAs and societies expect it.",
    "Most societies ask for a photo ID, and some ask for a police verification form.",
    "MeeHelp doesn't charge a placement agency fee.",
  ];
  for (const text of ok) assert.deepEqual(flagged(text), [], text);
});

test("forbidden marketplace commercial claims are caught", () => {
  for (const text of [
    "Replacement guaranteed within 7 days",
    "Free replacement if it doesn't work out",
    "Placement guarantee",
    "Guaranteed maid in 24 hours",
    "Completely free",
    "Zero charges for customers",
    "No charges at all",
    "Free maid service",
  ]) {
    assert.notEqual(flagged(text).length, 0, text);
  }
});

test("marketplace and on-demand wording are distinguishable", () => {
  const market = forbiddenInModel("marketplace"); // on-demand wording
  const onDemand = forbiddenInModel("onDemand"); // marketplace wording
  for (const t of ["Book now", "Instant booking", "Hourly maid service", "Same-day help", "a one-off deep clean", "on-demand cleaning"]) {
    assert.match(t, market, t);
  }
  for (const t of ["Choose a contact plan", "negotiate the salary", "hire directly", "your first profile view is free"]) {
    assert.match(t, onDemand, t);
  }
  for (const t of ["Can I hire a maid for just a few hours a day?", "Agree the hours and salary with the helper"]) {
    assert.doesNotMatch(t, market, t);
  }
});

/** All customer-facing strings from content data. */
function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => strings(v, out));
  return out;
}

test("content copy contains no unsupported claims", () => {
  const copy = strings([services, cities, serviceCities, home]);
  const hits = copy.flatMap((s) => findViolations(s, rules).map((v) => `${v.rule.id}: ${s.slice(0, 80)}`));
  assert.deepEqual(hits, []);
});

test("marketplace content never uses on-demand wording", () => {
  const copy = strings([services, serviceCities.filter((sc) => sc.model === "marketplace")]);
  const hits = copy.filter((s) => forbiddenInModel("marketplace").test(s));
  assert.deepEqual(hits, []);
});

test("no prices or free-view counts are typed into copy — they come from src/data/plans.ts", () => {
  const files = walk("src").filter((f) => /\.(ts|tsx|astro)$/.test(f) && !f.endsWith("src/data/plans.ts"));
  assert.ok(files.some((f) => f.endsWith(".astro")), "Astro components must be scanned");
  const priceHits: string[] = [];
  const freeHits: string[] = [];
  for (const f of files) {
    // Comments may explain the rule; only code and copy are checked.
    const text = readFileSync(f, "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    if (text.match(priceStringPattern)) priceHits.push(f);
    if (/\b(?:1|one|first)\s+(?:free\s+)?(?:helper\s+)?profile view|free profile view/i.test(text)) freeHits.push(f);
  }
  assert.deepEqual(priceHits, []);
  assert.deepEqual(freeHits, []);
});

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}
