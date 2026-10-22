import assert from "node:assert/strict";
import { test } from "node:test";
import { businessModels } from "@/data/business-models";
import { ctas } from "@/data/ctas";
import { cities } from "@/data/cities";
import { serviceCities } from "@/data/service-cities";
import { services } from "@/data/services";
import { getBuiltServices, getSiteRoutes, serviceCityStatus, serviceHubStatus } from "@/lib/content";
import { resolveRoute } from "@/lib/content/resolve";

test("every service declares all model-support fields (true / false / null)", () => {
  for (const s of services) {
    for (const k of ["marketplace", "onDemand", "instantBooking", "scheduledBooking", "hourlyBooking"] as const) {
      assert.ok(k in s.models, `${s.slug}.${k}`);
      assert.ok(s.models[k] === true || s.models[k] === false || s.models[k] === null, `${s.slug}.${k}`);
    }
  }
});

test("booking types cannot be true for a service whose on-demand support is not true", () => {
  for (const s of services) {
    if (s.models.onDemand !== true) {
      for (const k of ["instantBooking", "scheduledBooking", "hourlyBooking"] as const) {
        assert.notEqual(s.models[k], true, `${s.slug}.${k}`);
      }
    }
  }
});

test("a service hub is never published on production unless marketplace support is confirmed", () => {
  for (const s of services) {
    if (s.models.marketplace !== true) assert.notEqual(serviceHubStatus(s), "published", s.slug);
  }
  const prodHubs = new Set(getBuiltServices("production").map((s) => s.slug));
  for (const s of services) if (s.models.marketplace !== true) assert.equal(prodHubs.has(s.slug), false, s.slug);
});

test("every city declares availability for every service and both models", () => {
  for (const c of cities) {
    assert.equal(c.marketActive, true, `${c.slug} is a confirmed active market`);
    for (const s of services) {
      assert.ok(c.availability[s.slug], `${c.slug}/${s.slug}`);
      assert.ok(c.availability[s.slug].marketplace && c.availability[s.slug].onDemand, `${c.slug}/${s.slug}`);
    }
  }
});

test("service-city pages need confirmed model support and city availability to publish", () => {
  for (const sc of serviceCities) {
    const s = services.find((x) => x.slug === sc.service)!;
    const c = cities.find((x) => x.slug === sc.city)!;
    const avail = c.availability[sc.service][sc.model];
    if (s.models[sc.model] !== true || (avail !== "available" && avail !== "limited")) {
      assert.notEqual(serviceCityStatus(sc), "published", `${sc.service}/${sc.city}/${sc.model}`);
    }
  }
});

test("on-demand service-city entries only ever resolve to on-demand routes", () => {
  for (const stage of ["development", "preview", "production"] as const) {
    for (const r of getSiteRoutes(stage).filter((x) => x.kind === "service-city")) {
      const onDemandPath = /^\/hourly-/.test(r.path);
      assert.equal(r.model, onDemandPath ? "onDemand" : "marketplace", r.path);
    }
  }
  for (const sc of serviceCities.filter((x) => x.model === "onDemand")) {
    const r = resolveRoute([`hourly-${sc.service === "babysitter-nanny" ? "babysitter" : sc.service}`, sc.city], "preview");
    assert.ok(r && r.kind === "service-city" && r.model === "onDemand", `${sc.service}/${sc.city}`);
    const m = resolveRoute([sc.service, sc.city], "preview");
    assert.ok(m && m.kind === "service-city" && m.model === "marketplace", `${sc.service}/${sc.city}`);
  }
});

test("both business models are configured at business level", () => {
  assert.equal(businessModels.marketplace.confirmed, true);
  assert.equal(businessModels.onDemand.confirmed, true);
});

test("CTA definitions are tied to one journey each", () => {
  for (const [key, cta] of Object.entries(ctas)) {
    assert.ok(["marketplace", "onDemand", "app"].includes(cta.model), key);
    assert.equal(cta.destination.anchor, "#get-the-app", key);
  }
  assert.equal(ctas.findService.model, "marketplace");
  assert.equal(ctas.choosePlan.model, "marketplace");
  assert.equal(ctas.bookNow.model, "onDemand");
  assert.equal(ctas.bookHourly.model, "onDemand");
});

test("the approved pricing page builds where prices may be shown", () => {
  assert.notEqual(resolveRoute(["pricing"], "production"), null);
  assert.notEqual(resolveRoute(["pricing"], "preview"), null);
  assert.equal(resolveRoute(["pricing", "mumbai"], "preview"), null);
});
