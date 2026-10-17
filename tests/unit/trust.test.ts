import assert from "node:assert/strict";
import { test } from "node:test";
import { claims, trustMetrics } from "@/data/business";
import { testimonials } from "@/data/testimonials";
import { getVisibleTestimonials } from "@/lib/content";
import { isMetricDisplayable } from "@/lib/trust";
import type { TrustMetric } from "@/lib/content/types";

test("an enabled claim must record who approved it and when", () => {
  for (const [key, claim] of Object.entries(claims)) {
    if (claim.enabled) {
      assert.ok(claim.approvedBy, `${key}: approvedBy required`);
      assert.match(claim.approvedOn ?? "", /^\d{4}-\d{2}-\d{2}$/, `${key}: approvedOn must be an ISO date`);
    }
  }
});

test("claims that are not part of the marketplace model stay disabled", () => {
  for (const key of ["replacementGuarantee", "placementGuarantee", "guaranteedHiring", "completelyFree"] as const) {
    assert.equal(claims[key].enabled, false, key);
  }
});

test("a metric with a value must have a source, source URL and date checked", () => {
  for (const m of trustMetrics) {
    if (m.value !== null) {
      assert.ok(m.source, `${m.key}: source required`);
      assert.ok(m.sourceUrl, `${m.key}: sourceUrl required`);
      assert.ok(m.dateChecked, `${m.key}: dateChecked required`);
    }
  }
});

test("metrics are displayed only when approved, display-enabled, sourced and dated", () => {
  const base: TrustMetric = {
    key: "x",
    metric: "x",
    value: "4.5",
    source: "s",
    sourceUrl: "https://example.invalid",
    dateChecked: "2026-01-01",
    approved: true,
    displayEnabled: true,
  };
  assert.equal(isMetricDisplayable(base), true);
  assert.equal(isMetricDisplayable({ ...base, approved: false }), false);
  assert.equal(isMetricDisplayable({ ...base, displayEnabled: false }), false);
  assert.equal(isMetricDisplayable({ ...base, value: null }), false);
  assert.equal(isMetricDisplayable({ ...base, dateChecked: null }), false);
});

test("no ratings or downloads are invented", () => {
  for (const m of trustMetrics) {
    if (!m.approved) assert.equal(m.displayEnabled, false, `${m.key}: cannot display unapproved metric`);
  }
});

test("placeholder or unconsented testimonials are never on production", () => {
  for (const t of getVisibleTestimonials("production")) {
    assert.equal(t.isPlaceholder, false, t.id);
    assert.equal(t.consentToPublish, true, t.id);
  }
});

test("placeholder testimonials are clearly labelled", () => {
  for (const t of testimonials.filter((x) => x.isPlaceholder)) {
    assert.match(t.quote, /\[DEV PLACEHOLDER\]/, t.id);
  }
});
