/**
 * Phase 5 — release-review stage: exactly the 17 approved first-release
 * pages (15 from Phase 5 + /one-time-cleaning/ from SEO batch 1 + /maid-salary/mumbai/ from batch 1B), nothing else, no placeholders; other stages unchanged.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { appLinks } from "@/data/app-links";
import { firstRelease } from "@/data/release-plan";
import { serviceCities } from "@/data/service-cities";
import { services } from "@/data/services";
import { getBuiltServiceCities, getSiteRoutes, getVisibleTestimonials, isHubBuilt, isPricingBuilt, isServiceCityBuilt } from "@/lib/content";
import { serviceCityPath } from "@/lib/content/paths";
import { inStageScope, releaseReviewPaths, utilityPagePaths } from "@/lib/content/release-scope";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getServiceRouteParams, resolveRoute } from "@/lib/content/resolve";
import { hidesPlaceholders } from "@/lib/site";

/** The approved candidate set (Phase 5 brief) — changing it needs a new business decision. */
const APPROVED = [
  "/",
  "/pricing/",
  "/maid/",
  "/cook/",
  "/babysitter-nanny/",
  "/elder-care/",
  "/patient-care/",
  "/hourly-maid/",
  "/hourly-cook/",
  "/hourly-babysitter/",
  "/hourly-elder-care/",
  "/hourly-patient-care/",
  "/maid/mumbai/",
  "/maid/delhi-ncr/",
  "/cook/mumbai/",
  // SEO batch 1: the one-time cleaning intent moved off /hourly-maid/ onto its own page.
  "/one-time-cleaning/",
  // SEO batch 1B: the Mumbai maid salary guide.
  "/maid-salary/mumbai/",
].sort();

test("release-review contains exactly the 17 approved SEO URLs", () => {
  assert.deepEqual([...releaseReviewPaths].sort(), APPROVED);
  assert.deepEqual(firstRelease.map((r) => r.path).sort(), APPROVED);
  assert.ok(firstRelease.every((r) => r.when === "now"));
  const routes = getSiteRoutes("release-review");
  assert.deepEqual(routes.map((r) => r.path).sort(), APPROVED);
  const params = getServiceRouteParams("release-review").map((p) => `/${[p.service, ...p.rest].join("/")}/`);
  assert.deepEqual(params.sort(), APPROVED.filter((p) => p !== "/"));
});

test("no REVIEW or HOLD page leaks into release-review", () => {
  const report = JSON.parse(readFileSync("docs/seo/quality-report.json", "utf8")) as { pages: { path: string; readiness: string }[] };
  for (const p of APPROVED) assert.equal(report.pages.find((x) => x.path === p)?.readiness, "READY", p);
  const excluded = report.pages.filter((p) => p.readiness !== "READY").map((p) => p.path);
  assert.ok(excluded.length > 0);
  for (const path of excluded) {
    assert.equal(inStageScope(path, "release-review"), false, path);
    assert.equal(resolveRoute(path.split("/").filter(Boolean), "release-review"), null, path);
  }
  // Every other service × city page is unavailable in release-review.
  for (const sc of serviceCities) {
    const path = serviceCityPath(sc.service, sc.city, sc.model);
    assert.equal(isServiceCityBuilt(sc, "release-review"), APPROVED.includes(path), path);
  }
  assert.deepEqual(getBuiltServiceCities("release-review").map((sc) => serviceCityPath(sc.service, sc.city, sc.model)).sort(), ["/cook/mumbai/", "/maid/delhi-ncr/", "/maid/mumbai/"]);
});

test("every release hub, pricing and counterpart is available in release-review", () => {
  for (const s of services) {
    assert.ok(isHubBuilt(s, "marketplace", "release-review"), s.slug);
    assert.ok(isHubBuilt(s, "onDemand", "release-review"), s.onDemand.slug);
  }
  assert.ok(isPricingBuilt("release-review"));
  // City pages' counterpart (on-demand city) pages are NOT in the release, so no cross-link is rendered to them.
  for (const path of ["/hourly-maid/mumbai/", "/hourly-maid/delhi-ncr/", "/hourly-cook/mumbai/"]) assert.equal(inStageScope(path, "release-review"), false, path);
});

test("release-review is noindex, sitemap-empty and placeholder-free", () => {
  assert.ok(getSiteRoutes("release-review").every((r) => !r.indexable));
  assert.equal(hidesPlaceholders("release-review"), true);
  assert.equal(hidesPlaceholders("preview"), false);
  assert.ok(getVisibleTestimonials("release-review").every((t) => !t.isPlaceholder && t.consentToPublish));
});

test("preview stays complete while production contains exactly the approved release", () => {
  assert.equal(getSiteRoutes("preview").length, 94);
  assert.deepEqual(getSiteRoutes("production").map((r) => r.path).sort(), APPROVED);
  assert.ok(getSiteRoutes("production").every((r) => r.indexable), "production release pages must be indexable");
  assert.ok(getSiteRoutes("development").length >= 94);
  for (const stage of ["development", "preview", "production"] as const) for (const p of ["/maid/bengaluru/", "/hourly-cook/pune/"]) assert.equal(inStageScope(p, stage), true);
});

test("store links are the official listings", () => {
  const urls = JSON.stringify(appLinks);
  assert.match(urls, /https:\/\/play\.google\.com\/store\/apps\/details\?id=com\.meehelp\.meehelp/);
  assert.match(urls, /https:\/\/apps\.apple\.com\/in\/app\/meehelp-find-helpers-near-you\/id1625634794/);
});

test("footer utility pages are in every artifact but outside the SEO registry and sitemap", () => {
  assert.deepEqual([...utilityPagePaths], ["/privacy-policy/"]);
  // The footer links to each utility page, and every one is a hand-written page built in every stage.
  const footer = readFileSync("src/components/layout/SiteFooter.astro", "utf8");
  for (const p of utilityPagePaths) {
    assert.ok(footer.includes(`href="${p}"`), p);
    assert.ok(readFileSync(`src/pages${p.replace(/\/$/, "")}.astro`, "utf8").includes("follow: true"), `${p} must be noindex, follow`);
    for (const stage of ["development", "preview", "release-review", "production"] as const) {
      assert.ok(!getSiteRoutes(stage).some((r) => r.path === p), `${p} must stay out of the ${stage} route registry / sitemap`);
    }
  }
  // scripts/hosting-smoke.mjs keeps its own copy of the list (plain Node, no TS imports).
  const smoke = readFileSync("scripts/hosting-smoke.mjs", "utf8");
  assert.equal(smoke.match(/const UTILITY = (\[[^\]]*\]);/)?.[1], JSON.stringify(utilityPagePaths));
});

test("noindex pages are nofollow unless they opt into follow", () => {
  const base = { title: "t", description: "d", path: "/x/", indexable: false };
  assert.match(buildPageMetadata(base).robots, /^noindex, nofollow/);
  assert.match(buildPageMetadata({ ...base, follow: true }).robots, /^noindex, follow/);
  assert.equal(buildPageMetadata({ ...base, indexable: true, follow: true }).robots, "index, follow");
});
