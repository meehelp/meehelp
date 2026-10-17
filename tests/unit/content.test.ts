import assert from "node:assert/strict";
import { test } from "node:test";
import { cities } from "@/data/cities";
import { localities } from "@/data/localities";
import { serviceCities } from "@/data/service-cities";
import { services } from "@/data/services";
import { getSiteRoutes } from "@/lib/content";

const allRoutes = getSiteRoutes("development").filter((r) => r.status !== "draft");

function duplicates(values: string[]): string[] {
  const seen = new Set<string>();
  return values.filter((v) => (seen.has(v) ? true : (seen.add(v), false)));
}

test("titles are unique across all non-draft pages", () => {
  assert.deepEqual(duplicates(allRoutes.map((r) => r.title)), []);
});

test("meta descriptions are unique across all non-draft pages", () => {
  assert.deepEqual(duplicates(allRoutes.map((r) => r.description)), []);
});

test("titles and descriptions are a sensible length", () => {
  for (const r of allRoutes) {
    assert.ok(r.title.length >= 20 && r.title.length <= 65, `title length ${r.title.length}: ${r.path}`);
    assert.ok(
      r.description.length >= 70 && r.description.length <= 165,
      `description length ${r.description.length}: ${r.path}`,
    );
  }
});

test("city SEO fields are unique", () => {
  assert.deepEqual(duplicates(cities.map((c) => c.seo.title)), []);
  assert.deepEqual(duplicates(cities.map((c) => c.seo.description)), []);
});

test("slugs are unique", () => {
  assert.deepEqual(duplicates(services.map((s) => s.slug)), []);
  assert.deepEqual(duplicates(cities.map((c) => c.slug)), []);
  assert.deepEqual(duplicates(serviceCities.map((sc) => `${sc.service}/${sc.city}`)), []);
  assert.deepEqual(duplicates(localities.map((l) => `${l.city}/${l.slug}`)), []);
});

test("references point at real services and cities", () => {
  const s = new Set(services.map((x) => x.slug));
  const c = new Set(cities.map((x) => x.slug));
  for (const sc of serviceCities) {
    assert.ok(s.has(sc.service), sc.service);
    assert.ok(c.has(sc.city), sc.city);
  }
  for (const l of localities) {
    assert.ok(c.has(l.city), l.city);
    for (const key of Object.keys(l.services)) assert.ok(s.has(key as never), key);
  }
});

test("every service answers the core customer questions", () => {
  for (const svc of services) {
    assert.ok(svc.description.length >= 1, `${svc.slug} description`);
    assert.ok(svc.customerProblems.length >= 3, `${svc.slug} problems`);
    assert.ok(svc.tasksIncluded.length >= 4, `${svc.slug} included`);
    assert.ok(svc.tasksExcluded.length >= 2, `${svc.slug} excluded`);
    assert.ok(svc.faqs.length >= 3, `${svc.slug} faqs`);
    assert.ok(svc.engagementTypes.length >= 1, `${svc.slug} engagement types`);
  }
});

test("service-city pages have genuinely local content, not city-swapped copy", () => {
  const normalise = (text: string, cityNames: string[]) =>
    cityNames.reduce((t, n) => t.replaceAll(n, "{city}"), text.toLowerCase());
  const names = cities.flatMap((c) => [c.name, c.displayName, ...c.includes]).map((n) => n.toLowerCase());

  for (const sc of serviceCities) {
    const svc = services.find((s) => s.slug === sc.service)!;
    assert.ok(sc.localIntroduction.length >= 1, `${sc.service}/${sc.city} intro`);
    assert.ok(sc.commonRequirements.length >= 3, `${sc.service}/${sc.city} requirements`);
    assert.ok(sc.localFaqs.length >= 2, `${sc.service}/${sc.city} faqs`);
    for (const para of sc.localIntroduction) {
      assert.ok(!svc.description.includes(para), `${sc.service}/${sc.city} reuses service copy`);
    }
    // FAQ questions must not repeat the service hub's questions.
    const hubQuestions = new Set(svc.faqs.map((f) => f.question));
    for (const f of sc.localFaqs) assert.ok(!hubQuestions.has(f.question), `${sc.service}/${sc.city}: ${f.question}`);
  }

  // No two service-city intros may be identical once city names are masked.
  const masked = serviceCities.map((sc) => normalise(sc.localIntroduction.join(" "), names));
  assert.deepEqual(duplicates(masked), []);
});
