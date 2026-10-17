/**
 * Zero-JS and static-build guards for the Astro implementation.
 * Fails if a change would start shipping client JavaScript, re-introduce a
 * client framework, or change the URL/static-output conventions.
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import config from "../../astro.config.mjs";
import { getSiteRoutes } from "@/lib/content";
import { getServiceRouteParams, resolveRoute } from "@/lib/content/resolve";

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const astroFiles = walk("src").filter((f) => f.endsWith(".astro"));
const sourceFiles = walk("src").filter((f) => /\.(ts|tsx|astro|mjs|js)$/.test(f));

test("static output, trailing slashes, directory format, inlined CSS, no prefetch", () => {
  assert.equal(config.output, "static");
  assert.equal(config.trailingSlash, "always");
  assert.equal(config.build?.format, "directory");
  assert.equal(config.build?.inlineStylesheets, "always");
  assert.equal(config.prefetch, false);
  assert.equal(config.integrations?.length ?? 0, 0, "no framework integrations (React/Vue/…) — add only with justification");
});

test("no component hydrates in the browser (no client:* directives)", () => {
  const hits = astroFiles.filter((f) => /\sclient:(load|idle|visible|media|only)\b/.test(readFileSync(f, "utf8")));
  assert.deepEqual(hits, []);
});

test("every <script> in a component is an inline JSON-LD or analytics tag (never bundled)", () => {
  const hits: string[] = [];
  for (const f of astroFiles) {
    const text = readFileSync(f, "utf8").replace(/^---[\s\S]*?\n---/, "");
    for (const m of text.matchAll(/<script\b[^>]*>/g)) {
      const tag = m[0];
      const ok = /\bis:inline\b/.test(tag) && (/application\/ld\+json/.test(tag) || f.endsWith("analytics/Analytics.astro"));
      if (!ok) hits.push(`${f}: ${tag}`);
    }
  }
  assert.deepEqual(hits, []);
});

test("no Next.js or React imports remain", () => {
  const hits = sourceFiles.filter((f) => /from\s+["'](next|next\/[^"']+|react|react-dom)["']/.test(readFileSync(f, "utf8")));
  assert.deepEqual(hits, []);
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  for (const name of ["next", "react", "react-dom", "@astrojs/react"]) assert.equal(deps[name], undefined, name);
});

test("dependencies are pinned to exact versions", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  for (const [name, version] of Object.entries({ ...pkg.dependencies, ...pkg.devDependencies })) {
    assert.match(String(version), /^\d+\.\d+\.\d+$/, `${name}@${version}`);
  }
});

test("getStaticPaths params round-trip to the same routes", () => {
  for (const stage of ["development", "preview", "production"] as const) {
    const fromParams = getServiceRouteParams(stage).map(({ service, rest }) => {
      // Mirrors src/pages/[service]/[...rest].astro: rest joined with "/" or undefined.
      const restParam = rest.length > 0 ? rest.join("/") : undefined;
      const segments = [service, ...(restParam ? restParam.split("/") : [])];
      assert.notEqual(resolveRoute(segments, stage), null, `${stage}: ${segments.join("/")}`);
      return `/${segments.join("/")}/`;
    });
    const expected = getSiteRoutes(stage).filter((r) => r.kind !== "home").map((r) => r.path);
    assert.deepEqual(fromParams.sort(), expected.sort(), stage);
  }
});

// Locks the CURRENT publishing state. Update deliberately when the business confirms
// marketplace support or availability — it must never change as a side effect.
test("production builds only the home page while business facts are unconfirmed", () => {
  assert.deepEqual(getServiceRouteParams("production"), []);
  assert.deepEqual(getSiteRoutes("production").map((r) => r.path), ["/"]);
});
