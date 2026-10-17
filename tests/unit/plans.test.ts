import assert from "node:assert/strict";
import { test } from "node:test";
import { plans, pricingSettings, segments } from "@/data/plans";
import { arePricesPublishable, formatInr, getActivePlans } from "@/lib/pricing";

const expected = [
  ["home-1", "home", 10, 499, null, null, 1, false],
  ["home-2", "home", 15, 699, null, null, 2, true],
  ["home-3", "home", 20, 899, null, null, 3, false],
  ["office-1", "office", 30, 1199.2, 1499, 20, 3, false],
  ["office-2", "office", 40, 1399.3, 1999, 30, 3, true],
  ["office-3", "office", 50, 1649.45, 2999, 45, 6, false],
  ["business-1", "business", 80, 16000, 20000, 20, 6, false],
  ["business-2", "business", 110, 19600, 28000, 30, 11, true],
  ["business-3", "business", 140, 22750, 35000, 35, 12, false],
] as const;

test("all 9 confirmed plans are configured exactly", () => {
  assert.equal(plans.length, 9);
  for (const [id, segment, contacts, price, previous, discount, months, best] of expected) {
    const p = plans.find((x) => x.id === id);
    assert.ok(p, id);
    assert.equal(p.segment, segment, id);
    assert.equal(p.contacts, contacts, id);
    assert.equal(p.currentPrice, price, id);
    assert.equal(p.previousPrice, previous, id);
    assert.equal(p.discountPercent, discount, id);
    assert.deepEqual(p.validity, { value: months, unit: "month" }, id);
    assert.equal(p.bestValue, best, id);
    assert.equal(p.priceNote, "pending business confirmation", id);
  }
});

test("three segments, three active plans each, exactly one best value per segment", () => {
  assert.deepEqual(segments.map((s) => s.id).sort(), ["business", "home", "office"]);
  for (const s of segments) {
    const ps = getActivePlans(s.id);
    assert.equal(ps.length, 3, s.id);
    assert.equal(ps.filter((p) => p.bestValue).length, 1, s.id);
    assert.deepEqual(ps.map((p) => p.displayOrder), [1, 2, 3], s.id);
  }
  assert.equal(new Set(plans.map((p) => p.id)).size, plans.length);
});

test("displayed discounts match current vs previous price", () => {
  for (const p of plans) {
    if (p.previousPrice === null) {
      assert.equal(p.discountPercent, null, p.id);
      continue;
    }
    const computed = (1 - p.currentPrice / p.previousPrice) * 100;
    assert.ok(Math.abs(computed - (p.discountPercent ?? -1)) < 0.01, `${p.id}: ${computed}`);
  }
});

test("only Home is a consumer segment", () => {
  assert.deepEqual(segments.filter((s) => s.audience === "consumer").map((s) => s.id), ["home"]);
});

test("prices are not published on production while the asterisk meaning is unconfirmed", () => {
  if (pricingSettings.priceNote.status !== "confirmed") {
    assert.equal(arePricesPublishable("production"), false);
    assert.equal(pricingSettings.priceNote.text, null, "no price note text may be invented");
  }
  if (pricingSettings.publishPrices) {
    assert.equal(pricingSettings.priceNote.status, "confirmed", "publishPrices requires a confirmed price note");
  }
});

test("free profile views are configured centrally", () => {
  assert.equal(pricingSettings.freeProfileViews.value, 1);
});

test("INR formatting", () => {
  assert.equal(formatInr(499), "₹499");
  assert.equal(formatInr(1199.2), "₹1,199.20");
  assert.equal(formatInr(16000), "₹16,000");
  assert.equal(formatInr(1649.45), "₹1,649.45");
});
