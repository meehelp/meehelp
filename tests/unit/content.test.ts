import assert from "node:assert/strict";
import { test } from "node:test";
import { cities } from "@/data/cities";
import { localities } from "@/data/localities";
import { serviceCities } from "@/data/service-cities";
import { services } from "@/data/services";
import { getServiceCityContent, getSiteRoutes } from "@/lib/content";

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
  assert.deepEqual(duplicates(serviceCities.map((sc) => `${sc.service}/${sc.city}/${sc.model}`)), []);
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
    assert.ok(svc.arrangements.length >= 1, `${svc.slug} arrangements`);
  }
});

test("service-city pages have genuinely local content, not city-swapped copy", () => {
  const names = cities
    .flatMap((c) => [c.name, c.displayName, ...c.includes, c.descriptors.areas, c.descriptors.cuisine, c.descriptors.festivals, c.descriptors.festival, c.descriptors.languages])
    .map((n) => n.toLowerCase())
    .sort((a, b) => b.length - a.length);
  const mask = (text: string) => names.reduce((t, n) => t.replaceAll(n, "{x}"), text.toLowerCase());

  for (const sc of serviceCities) {
    const svc = services.find((s) => s.slug === sc.service)!;
    const c = getServiceCityContent(sc);
    const id = `${sc.service}/${sc.city}/${sc.model}`;
    assert.ok(c.introduction.length >= 1, `${id} intro`);
    assert.ok(c.points.length >= 3, `${id} points`);
    assert.ok(c.localNotes.length >= 1, `${id} local notes`);
    // Pages with a single (generated coverage) FAQ are flagged "needs content" by npm run report.
    assert.ok(c.localFaqs.length >= 1, `${id} faqs`);
    for (const para of c.introduction) assert.ok(!svc.description.includes(para), `${id} reuses service copy`);
    // FAQ questions must not repeat the hub's questions for the same model.
    const hubFaqs = sc.model === "marketplace" ? svc.faqs : svc.onDemand.faqs;
    const hubQuestions = new Set(hubFaqs.map((f) => f.question));
    for (const f of c.localFaqs) assert.ok(!hubQuestions.has(f.question), `${id}: ${f.question}`);
  }

  // No two pages' main local content may be identical once city terms are masked.
  const masked = serviceCities.map((sc) => {
    const c = getServiceCityContent(sc);
    return mask([sc.service, sc.model, ...c.introduction, ...c.localNotes, ...c.localFaqs.map((f) => f.answer)].join(" "));
  });
  assert.deepEqual(duplicates(masked), []);
});
