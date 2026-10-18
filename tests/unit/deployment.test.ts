/**
 * Phase 5.5 — protected Vercel staging: the build command, the deployment
 * guard, vercel.json and the absence of secrets / preview hostnames.
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { CANONICAL_ORIGIN, deploymentProblems } from "../../deploy-guard.mjs";
import { siteUrl } from "@/lib/site";

const pkg = JSON.parse(readFileSync("package.json", "utf8")) as { scripts: Record<string, string> };
const vercel = JSON.parse(readFileSync("vercel.json", "utf8")) as {
  buildCommand?: string;
  installCommand: string;
  outputDirectory: string;
  framework: string;
  trailingSlash: boolean;
  env?: unknown;
  build?: unknown;
  headers: { source: string; has?: { type: string; value: string }[]; headers: { key: string; value: string }[] }[];
};

test("the release-review build command always builds the release-review stage", () => {
  assert.equal(pkg.scripts["build:release-review"], "SITE_STAGE=release-review astro build");
  assert.equal(pkg.scripts["build:production"], "SITE_STAGE=production astro build");
  assert.doesNotMatch(pkg.scripts["build:release-review"]!, /production/);
});

test("vercel.json is minimal and does not force a stage", () => {
  assert.equal(vercel.framework, "astro");
  assert.equal(vercel.installCommand, "npm ci");
  assert.equal(vercel.outputDirectory, "dist");
  assert.equal(vercel.trailingSlash, true);
  // The stage lives in the Vercel project settings (build command + env), never in vercel.json,
  // so the same file works for the eventual production build.
  assert.equal(vercel.buildCommand, undefined);
  assert.equal(vercel.env, undefined);
  assert.equal(vercel.build, undefined);
  assert.doesNotMatch(JSON.stringify(vercel), /release-review|SITE_STAGE|meehelp\.in/);
});

test("security headers are present and the CSP keeps the static site working", () => {
  const global = vercel.headers.find((h) => h.source === "/(.*)" && !h.has)!;
  const get = (k: string) => global.headers.find((h) => h.key === k)?.value ?? "";
  assert.equal(get("X-Content-Type-Options"), "nosniff");
  assert.equal(get("Referrer-Policy"), "strict-origin-when-cross-origin");
  assert.match(get("Permissions-Policy"), /camera=\(\).*microphone=\(\).*geolocation=\(\)/);
  assert.equal(get("X-Frame-Options"), "DENY");
  const csp = get("Content-Security-Policy");
  assert.match(csp, /frame-ancestors 'none'/);
  assert.match(csp, /script-src 'self' 'unsafe-inline' https:\/\/www\.googletagmanager\.com/, "production GA4 may load the Google tag; release-review still emits no analytics script");
  assert.match(csp, /style-src 'self' 'unsafe-inline'/, "the stylesheet is inlined into each page");
  assert.match(csp, /font-src 'self'/);
  assert.match(csp, /img-src 'self' data: https:\/\/www\.google-analytics\.com https:\/\/\*\.google-analytics\.com/);
  assert.match(csp, /connect-src 'self' https:\/\/www\.google-analytics\.com https:\/\/\*\.google-analytics\.com https:\/\/www\.googletagmanager\.com/);
  assert.doesNotMatch(csp, /unsafe-eval|\*/);
  // HSTS is left to the platform for *.vercel.app; for meehelp.in it needs a subdomain audit first.
  assert.ok(!vercel.headers.some((r) => r.headers.some((h) => h.key === "Strict-Transport-Security")));
});

test("X-Robots-Tag noindex applies only to *.vercel.app hosts", () => {
  const rules = vercel.headers.filter((r) => r.headers.some((h) => h.key === "X-Robots-Tag"));
  assert.equal(rules.length, 1);
  assert.equal(rules[0]!.headers[0]!.value, "noindex, nofollow, noarchive");
  assert.deepEqual(rules[0]!.has, [{ type: "host", value: ".*\\.vercel\\.app" }]);
  const hostRe = new RegExp(`^${rules[0]!.has![0]!.value}$`);
  assert.ok(hostRe.test("meehelp-git-seo-phase-4-content-preview-meehelp.vercel.app"));
  assert.ok(!hostRe.test("meehelp.in"));
  assert.ok(!hostRe.test("www.meehelp.in"));
});

test("the deployment guard blocks unsafe hosted builds", () => {
  assert.deepEqual(deploymentProblems({}), []);
  assert.deepEqual(deploymentProblems({ SITE_STAGE: "preview" }), []);
  assert.deepEqual(deploymentProblems({ VERCEL: "1", VERCEL_ENV: "preview", SITE_STAGE: "release-review" }), []);
  assert.deepEqual(deploymentProblems({ VERCEL: "1", VERCEL_ENV: "production", SITE_STAGE: "production" }), []);
  assert.equal(deploymentProblems({ VERCEL: "1", VERCEL_ENV: "preview" }).length, 1, "stage must be explicit on Vercel");
  assert.equal(deploymentProblems({ VERCEL: "1", VERCEL_ENV: "production", SITE_STAGE: "release-review" }).length, 1, "review build must never be a production deployment");
  assert.equal(deploymentProblems({ SITE_STAGE: "release-review", SITE_URL: "https://meehelp-abc.vercel.app" }).length, 1, "canonical must stay meehelp.in");
  assert.equal(deploymentProblems({ VERCEL: "1", VERCEL_ENV: "preview", SITE_STAGE: "release-review", SITE_URL: "https://x.vercel.app" }).length, 1);
  assert.equal(deploymentProblems({ SITE_STAGE: "staging" }).length, 1);
  assert.match(readFileSync("astro.config.mjs", "utf8"), /deploymentProblems\(process\.env\)/);
});

test("canonical origin stays https://meehelp.in", () => {
  assert.equal(CANONICAL_ORIGIN, "https://meehelp.in");
  assert.equal(siteUrl, "https://meehelp.in");
});

test("no Vercel hostname or secrets in site source and configuration", () => {
  const walk = (d: string): string[] => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
  const files = [...walk("src"), "astro.config.mjs", "deploy-guard.mjs", "vercel.json", ".env.example", "package.json"];
  for (const f of files) {
    const text = readFileSync(f, "utf8");
    if (f !== "vercel.json") assert.doesNotMatch(text, /[a-z0-9-]+\.vercel\.app/i, `${f} contains a Vercel hostname`);
    assert.doesNotMatch(text, /VERCEL_TOKEN|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|rzp_(?:live|test)_|key_live_|-----BEGIN|\bAC[0-9a-f]{32}\b|sk_live_/, `${f} contains a secret-like value`);
  }
  // .env.example lists names only, and none of them is a credential.
  const env = readFileSync(".env.example", "utf8");
  for (const line of env.split("\n").filter((l) => /^[A-Z_]+=/.test(l))) {
    assert.match(line, /=$/, `${line} must have no value`);
    assert.doesNotMatch(line, /PASSWORD|SECRET|TOKEN|PRIVATE|API_KEY|DATABASE|FIREBASE|TWILIO|RAZORPAY|BRANCH_KEY/, line);
  }
  assert.match(env, /release-review/, ".env.example documents the release-review stage");
});
