import assert from "node:assert/strict";
import { test } from "node:test";
import { claims, trustMetrics } from "@/data/business";
import { testimonials } from "@/data/testimonials";
import { getVisibleTestimonials } from "@/lib/content";
import { isMetricDisplayable } from "@/lib/trust";

test("an enabled claim must record who approved it and when", () => {
  for (const [key, claim] of Object.entries(claims)) {
    if (claim.enabled) {
      assert.ok(claim.approvedBy, `${key}: approvedBy required`);
      assert.match(claim.approvedOn ?? "", /^\d{4}-\d{2}-\d{2}$/, `${key}: approvedOn must be an ISO date`);
    }
  }
});

test("a metric with a value must have a source and an as-of date", () => {
  for (const m of trustMetrics) {
    if (m.value !== null) {
      assert.ok(m.source, `${m.key}: source required`);
      assert.ok(m.asOf, `${m.key}: asOf required`);
    }
  }
});

test("unapproved or empty metrics are never displayed", () => {
  assert.equal(isMetricDisplayable({ key: "x", label: "x", value: "4.5", source: "s", asOf: "2026-01-01", approved: false }), false);
  assert.equal(isMetricDisplayable({ key: "x", label: "x", value: null, source: "s", asOf: "2026-01-01", approved: true }), false);
  assert.equal(isMetricDisplayable({ key: "x", label: "x", value: "4.5", source: "s", asOf: "2026-01-01", approved: true }), true);
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
