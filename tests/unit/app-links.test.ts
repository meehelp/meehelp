import assert from "node:assert/strict";
import { test } from "node:test";
import { appLinks, storeUrl } from "@/data/app-links";

test("store links are the official public listings", () => {
  assert.equal(appLinks.android.storeUrl, "https://play.google.com/store/apps/details?id=com.meehelp.meehelp&hl=en_IN");
  assert.equal(appLinks.ios.storeUrl, "https://apps.apple.com/in/app/meehelp-find-helpers-near-you/id1625634794");
  assert.equal(appLinks.ios.appId, "1625634794");
});

test("Play Store links carry an encoded install referrer", () => {
  const url = new URL(storeUrl("android", "home_hero"));
  assert.equal(url.searchParams.get("id"), "com.meehelp.meehelp");
  const referrer = new URLSearchParams(url.searchParams.get("referrer") ?? "");
  assert.equal(referrer.get("utm_source"), "meehelp_website");
  assert.equal(referrer.get("utm_campaign"), "home_hero");
});

test("deep linking stays disabled until reviewed", () => {
  assert.equal(appLinks.deepLinking.enabled, false);
  assert.equal(appLinks.deepLinking.baseUrl, null);
});
