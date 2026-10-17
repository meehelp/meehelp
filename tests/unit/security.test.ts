import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const skipDirs = new Set(["node_modules", ".next", "out", ".git", "reports", "screenshots"]);
const textExt = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".md", ".css", ".txt", ".example", ".yml", ".yaml", ""]);
const forbiddenFiles = /\.(pem|p8|p12|jks|keystore|key)$|firebase-adminsdk|google-services\.json|GoogleService-Info\.plist/i;

const secretPatterns: [string, RegExp][] = [
  ["Google API key", /AIza[0-9A-Za-z_-]{35}/],
  ["Branch key", /key_(live|test)_[A-Za-z0-9]{20,}/],
  ["Twilio account SID", /\bAC[0-9a-f]{32}\b/],
  ["Private key block", /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ["Service-account JSON", /"private_key_id"\s*:/],
  ["AdMob app ID", /ca-app-pub-\d{10,}/],
  ["Razorpay key", /rzp_(live|test)_[A-Za-z0-9]{10,}/],
];

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (skipDirs.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const files = walk(root);

test("no key or credential files are present", () => {
  assert.deepEqual(files.filter((f) => forbiddenFiles.test(f)), []);
});

test("no secrets appear in source files", () => {
  const hits: string[] = [];
  for (const f of files) {
    if (!textExt.has(extname(f)) || f.endsWith("security.test.ts")) continue;
    const text = readFileSync(f, "utf8");
    for (const [label, re] of secretPatterns) if (re.test(text)) hits.push(`${label}: ${f}`);
  }
  assert.deepEqual(hits, []);
});

test("no connection to the production backend or legacy link domains", () => {
  const banned = /meehelp\.co\.in|api\.meehelp\.in|meehelp\.online|app\.link\b/;
  const hits = files
    .filter((f) => [".ts", ".tsx", ".mjs", ".js"].includes(extname(f)) && !f.endsWith("security.test.ts"))
    .filter((f) => banned.test(readFileSync(f, "utf8")));
  assert.deepEqual(hits, []);
});

test(".env.example holds variable names only", () => {
  const lines = readFileSync(join(root, ".env.example"), "utf8").split("\n");
  for (const line of lines) {
    if (!line.trim() || line.startsWith("#")) continue;
    assert.match(line, /^[A-Z0-9_]+=$/, `has a value: ${line}`);
  }
});
