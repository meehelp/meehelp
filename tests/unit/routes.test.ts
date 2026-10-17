import assert from "node:assert/strict";
import { test } from "node:test";
import { localities } from "@/data/localities";
import { serviceCities } from "@/data/service-cities";
import { getPublishedLocalityPages, getSiteRoutes, serviceCityStatus } from "@/lib/content";
import { getServiceRouteParams, resolveRoute } from "@/lib/content/resolve";
import type { SiteStage } from "@/lib/site";

const stages: SiteStage[] = ["development", "preview", "production"];

test("production routes are all published and indexable", () => {
  for (const r of getSiteRoutes("production")) {
    assert.equal(r.status, "published", r.path);
    assert.equal(r.indexable, true, r.path);
  }
});

test("non-production stages are never indexable", () => {
  for (const stage of ["development", "preview"] as const) {
    assert.equal(getSiteRoutes(stage).filter((r) => r.indexable).length, 0);
  }
});

test("service-city pages in review are built on preview but not on production", () => {
  const review = serviceCities.filter((sc) => serviceCityStatus(sc) === "review");
  const prodPaths = new Set(getSiteRoutes("production").map((r) => r.path));
  const previewPaths = new Set(getSiteRoutes("preview").map((r) => r.path));
  for (const sc of review) {
    const path = `/${sc.service}/${sc.city}/`;
    assert.equal(prodPaths.has(path), false, `${path} must not be on production`);
    assert.equal(previewPaths.has(path), true, `${path} should be on preview`);
  }
});

test("locality pages require explicit 'published' at every level, in every stage", () => {
  const published = getPublishedLocalityPages();
  for (const p of published) {
    assert.equal(p.locality.publishStatus, "published");
    assert.equal(p.content.publishStatus, "published");
  }
  const draftPaths = localities.flatMap((l) => Object.keys(l.services).map((s) => `/${s}/${l.city}/${l.slug}/`));
  for (const stage of stages) {
    const paths = new Set(getSiteRoutes(stage).map((r) => r.path));
    for (const path of draftPaths) {
      const isPublished = published.some((p) => `/${p.service}/${p.locality.city}/${p.locality.slug}/` === path);
      if (!isPublished) assert.equal(paths.has(path), false, `${path} built on ${stage}`);
    }
  }
});

test("combinations that are not explicitly listed never resolve", () => {
  const listed = new Set(serviceCities.map((sc) => `${sc.service}/${sc.city}`));
  assert.equal(listed.has("patient-care/kolkata"), false, "test assumes this combination is unlisted");
  for (const stage of stages) {
    assert.equal(resolveRoute(["patient-care", "kolkata"], stage), null);
    assert.equal(resolveRoute(["maid", "atlantis"], stage), null);
    assert.equal(resolveRoute(["not-a-service"], stage), null);
    assert.equal(resolveRoute(["maid", "mumbai", "andheri-west", "extra"], stage), null);
  }
});

test("static params match the route registry exactly", () => {
  for (const stage of stages) {
    const fromParams = getServiceRouteParams(stage).map((p) => `/${[p.service, ...p.rest].join("/")}/`);
    const fromRoutes = getSiteRoutes(stage).filter((r) => r.kind !== "home").map((r) => r.path);
    assert.deepEqual(fromParams.sort(), fromRoutes.sort());
  }
});

test("every registered route resolves to content", () => {
  for (const stage of stages) {
    for (const r of getSiteRoutes(stage).filter((x) => x.kind !== "home")) {
      assert.notEqual(resolveRoute(r.path.split("/").filter(Boolean), stage), null, `${stage} ${r.path}`);
    }
  }
});

test("all paths follow the lowercase, hyphenated, trailing-slash policy", () => {
  for (const r of getSiteRoutes("development")) {
    assert.match(r.path, /^\/([a-z0-9]+(-[a-z0-9]+)*\/)*$/, r.path);
  }
});
