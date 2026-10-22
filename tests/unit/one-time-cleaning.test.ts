/**
 * SEO batch 1 — /one-time-cleaning/ owns the one-time home cleaning intent;
 * /hourly-maid/ owns hourly maid / maid for a few hours. Separate pages,
 * separate metadata, linked both ways, neither canonical to the other.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { schemaSettings } from "@/data/business";
import { ctas } from "@/data/ctas";
import { onDemandContent } from "@/data/on-demand";
import { factsForPage, productFacts } from "@/data/product-facts";
import { productPath, products } from "@/data/products";
import { getSiteRoutes } from "@/lib/content";
import { buildIntentMap } from "@/lib/content/intent";
import { resolveRoute } from "@/lib/content/resolve";
import { routeMetadata } from "@/lib/seo/route-meta";

const product = products.find((p) => p.slug === "one-time-cleaning")!;
const PATH = "/one-time-cleaning/";

test("the product is registered through the route registry in every stage", () => {
  assert.equal(productPath(product.slug), PATH);
  for (const stage of ["development", "preview", "release-review", "production"] as const) {
    const route = getSiteRoutes(stage).find((r) => r.path === PATH);
    assert.ok(route, stage);
    assert.equal(route.kind, "product");
    assert.equal(route.model, "onDemand");
    assert.equal(route.indexable, stage === "production", stage);
  }
  assert.equal(resolveRoute(["one-time-cleaning"], "production")?.kind, "product");
  assert.equal(resolveRoute(["one-time-cleaning", "mumbai"], "production"), null, "no city pages for the product");
});

test("metadata, H1 and canonical follow the brief and differ from /hourly-maid/", () => {
  const route = resolveRoute(["one-time-cleaning"], "production")!;
  const meta = routeMetadata(route);
  assert.equal(meta.title, "One-Time Home Cleaning Service | MeeHelp");
  assert.equal(
    meta.description,
    "Book a one-time home cleaning visit with MeeHelp for dishes, bathrooms, floors, dusting and laundry. Choose your visit in the app, subject to availability.",
  );
  assert.equal(meta.canonical, "https://meehelp.in/one-time-cleaning/");
  assert.equal(product.headline, "Book a one-time home clean when you need it");

  const hourly = routeMetadata(resolveRoute(["hourly-maid"], "production")!);
  assert.equal(hourly.title, "Hourly Maid Service – Book Help by the Hour | MeeHelp");
  assert.equal(hourly.canonical, "https://meehelp.in/hourly-maid/");
  assert.equal(onDemandContent.maid.headline, "Book a maid for a few hours of help at home");
  assert.notEqual(meta.description, hourly.description);

  const intents = buildIntentMap("production");
  const own = intents.find((e) => e.path === PATH)!;
  const hub = intents.find((e) => e.path === "/hourly-maid/")!;
  assert.equal(own.h1, product.headline);
  assert.notEqual(own.primaryKeyword, hub.primaryKeyword);
});

test("the two pages link to each other and no longer share the one-time content", () => {
  assert.equal(product.alternative.href, "/hourly-maid/");
  assert.equal(product.alternative.label, "Book hourly maid help");
  assert.equal(onDemandContent.maid.alternative?.href, PATH);
  assert.equal(onDemandContent.maid.alternative?.label, "Book a one-time clean");
  // The 120/150/180-minute visit is described only on /one-time-cleaning/.
  const hubCopy = JSON.stringify(onDemandContent.maid);
  assert.doesNotMatch(hubCopy, /\b1[258]0\b|minute|book now/i);
  assert.equal(onDemandContent.maid.bookNow, false);
  // The home page links to the product page through the registry helper.
  assert.match(readFileSync("src/pages/index.astro", "utf8"), /getBuiltProducts\(\)/);
});

test("the page uses only facts already approved for /hourly-maid/", () => {
  const facts = factsForPage("one-time-cleaning", product.sharedFactIds);
  const ids = facts.map((f) => f.id).sort();
  assert.deepEqual(ids, ["b.coverage", "o.gender", "o.included", "o.otg.cancel", "o.otg.length", "o.otg.materials", "o.otg.payment", "o.otg.tasks", "o.otg.when", "o.pin"]);
  for (const f of facts) assert.ok(f.evidence.length > 0, f.id);
  for (const id of product.sharedFactIds) assert.ok(productFacts.some((f) => f.id === id && !f.page), id);
  const copy = JSON.stringify(product);
  assert.doesNotMatch(
    copy,
    /professional|trained|equipment|chemicals|guarantee|instant|in \d+ minutes|arriv(?:e|al) (?:at|by|within)|background|police|verified|safest|deep[- ]clean/i,
  );
});

test("the instant CTA is scoped to the product page and only Service + BreadcrumbList schema is emitted", () => {
  assert.equal(ctas.bookOneTimeClean.label, "Book a one-time clean");
  assert.equal(ctas.bookOneTimeClean.scope, "one-time-cleaning");
  assert.equal(schemaSettings.faqPage, false);
  const template = readFileSync("src/components/templates/OnDemandProductTemplate.astro", "utf8");
  assert.match(template, /serviceSchema\(/);
  assert.doesNotMatch(template, /LocalBusiness|AggregateRating|Review|JobPosting/);
  assert.match(template, /<Breadcrumbs items=\{\[\{ name: "Home", path: "\/" \}, \{ name: product\.name, path \}\]\}/);
});
