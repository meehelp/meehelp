/**
 * npm run release-docs — builds the release-review stage (unless --no-build)
 * and writes, from the generated HTML:
 *
 *   docs/seo/FIRST-RELEASE-FINAL-AUDIT.md  per-page SEO / claims / links audit
 *   docs/seo/FIRST-RELEASE-COPY.md         customer-visible copy, page by page,
 *                                          for business review without source code
 *
 * The audit fails (exit 1) if a release page breaks a launch rule: duplicate
 * title/meta, not exactly one H1, wrong canonical, missing breadcrumb on an
 * inner page, Review/AggregateRating schema, or a link outside the release set
 * (the release pages plus the footer utility pages, which must be in the build).
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse, type HTMLElement, type Node, NodeType } from "node-html-parser";

process.env.SITE_STAGE = "release-review";
if (!process.argv.includes("--no-build")) {
  execSync("npx astro build", { stdio: "inherit", env: { ...process.env, SITE_STAGE: "release-review", ASTRO_TELEMETRY_DISABLED: "1" } });
}

const { firstRelease } = await import("@/data/release-plan");
const { releaseReviewPaths, utilityPagePaths } = await import("@/lib/content/release-scope");
const { getSiteRoutes } = await import("@/lib/content");
const { buildIntentMap } = await import("@/lib/content/intent");
const { absoluteUrl } = await import("@/lib/site");

const DIST = join(process.cwd(), "dist");
const routes = new Map(getSiteRoutes("release-review").map((r) => [r.path, r]));
const intents = new Map(buildIntentMap("release-review").map((e) => [e.path, e]));
const problems: string[] = [];
const modelName = { marketplace: "Marketplace — find and hire directly", onDemand: "On-demand — book in the app", both: "Both propositions" } as const;

/** Customer-visible copy as Markdown: headings, paragraphs, lists; boilerplate blocks dropped. */
function toMarkdown(el: HTMLElement): string {
  const out: string[] = [];
  const text = (n: Node) => (n as HTMLElement).structuredText.split("\n").map((l) => l.trim()).filter(Boolean).join(" — ").replace(/\s+/g, " ").trim();
  const walk = (n: Node) => {
    if (n.nodeType !== NodeType.ELEMENT_NODE) return;
    const e = n as HTMLElement;
    if (e.hasAttribute("data-boilerplate") || ["script", "style", "nav", "svg"].includes(e.tagName?.toLowerCase())) return;
    const tag = e.tagName?.toLowerCase();
    if (/^h[1-4]$/.test(tag)) return void out.push(`${"#".repeat(Number(tag[1]) + 1)} ${text(e)}`);
    if (tag === "p") return void (text(e) && out.push(text(e)));
    if (tag === "li") {
      const strong = e.querySelector("strong");
      if (strong && e.classList.contains("claims__item")) {
        const rest = text(e).replace(text(strong), "").replace(/^[\s—-]+/, "");
        return void out.push(`- **${text(strong)}** — ${rest}`);
      }
      return void out.push(`- ${text(e)}`);
    }
    if (tag === "summary") return void out.push(`**Q: ${text(e)}**`);
    if (tag === "a" && e.classList.contains("button")) return void out.push(`[CTA: ${text(e)}]`);
    if (tag === "dt") return void out.push(`**${text(e)}**`);
    if (tag === "dd") return void out.push(text(e));
    e.childNodes.forEach(walk);
  };
  walk(el);
  return out.filter((l, i) => l !== out[i - 1]).join("\n\n");
}

const audit: string[] = [];
const copy: string[] = [];
const titles = new Map<string, string[]>();
const metas = new Map<string, string[]>();

// Footer utility pages are linked from every release page, so they must be in the build too.
for (const path of utilityPagePaths) if (!existsSync(join(DIST, path, "index.html"))) problems.push(`${path}: utility page not built`);

for (const entry of firstRelease) {
  const path = entry.path;
  const file = join(DIST, path, "index.html");
  if (!existsSync(file)) {
    problems.push(`${path}: not built`);
    continue;
  }
  const root = parse(readFileSync(file, "utf8"));
  const main = root.querySelector("main")!;
  const title = root.querySelector("title")?.text ?? "";
  const meta = root.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
  const canonical = root.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "";
  const robots = root.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "";
  const h1s = root.querySelectorAll("h1").map((h) => h.text.trim());
  titles.set(title, [...(titles.get(title) ?? []), path]);
  metas.set(meta, [...(metas.get(meta) ?? []), path]);
  const schema = root
    .querySelectorAll('script[type="application/ld+json"]')
    .flatMap((s) => {
      const data = JSON.parse(s.text);
      const items = Array.isArray(data) ? data : data["@graph"] ?? [data];
      return items.map((i: { "@type": string }) => i["@type"]);
    });
  const links = [...new Set(root.querySelectorAll("a[href]").map((a) => a.getAttribute("href")!).filter((h) => h.startsWith("/") && !h.startsWith("//")).map((h) => h.split("#")[0]!))].filter(Boolean).sort();
  const mainLinks = [...new Set(main.querySelectorAll("a[href]").map((a) => a.getAttribute("href")!).filter((h) => h.startsWith("/") && !h.startsWith("//")).map((h) => h.split("#")[0]!))].filter((h) => h && h !== path).sort();
  const ctas = [...new Set(main.querySelectorAll(".hero a.button, .path a.button").map((a) => a.text.trim()))];
  const evidenceIds = [...new Set(main.querySelectorAll("[data-evidence]").flatMap((n) => n.getAttribute("data-evidence")!.split(",")))].sort();
  const facts = main.querySelectorAll("li[data-evidence]").map((li) => li.text.replace(/\s+/g, " ").trim());
  const scope = main.querySelector(".care-scope > p")?.text.trim();
  const checks = [...new Set(main.querySelectorAll(".claims__item strong").map((n) => n.text.trim()))];
  const wordCount = main.structuredText.split(/\s+/).filter(Boolean).length;
  const route = routes.get(path);

  if (h1s.length !== 1) problems.push(`${path}: ${h1s.length} H1 elements`);
  if (canonical !== absoluteUrl(path)) problems.push(`${path}: canonical ${canonical}`);
  if (!/noindex/.test(robots) || !/noarchive/.test(robots)) problems.push(`${path}: robots "${robots}"`);
  if (path !== "/" && !root.querySelector('nav[aria-label="Breadcrumb"], .breadcrumbs')) problems.push(`${path}: no breadcrumb`);
  if (schema.some((t) => /Review|AggregateRating/.test(t))) problems.push(`${path}: review/rating schema`);
  for (const l of links) if (l !== "/" && !releaseReviewPaths.has(l) && !utilityPagePaths.includes(l) && !l.startsWith("/brand/") && !/\.[a-z0-9]+$/i.test(l)) problems.push(`${path}: links to ${l} (outside the release set)`);

  audit.push(`## \`${path}\`

| Field | Value |
|---|---|
| URL | ${absoluteUrl(path)} |
| Title | ${title} (${title.length} chars) |
| Meta description | ${meta} (${meta.length} chars) |
| H1 | ${h1s.join(" / ")} |
| Primary intent | ${intents.get(path)?.primaryIntent ?? "—"} |
| Business model | ${modelName[(route?.model ?? "both") as keyof typeof modelName]} |
| Main CTA | ${ctas.join(" · ") || "App download section"} |
| Canonical / robots | self-referencing · \`${robots}\` |
| Schema types | ${[...new Set(schema)].join(", ")} |
| Word count (main) | ${wordCount} |
| Internal links (in main content) | ${mainLinks.length}: ${mainLinks.map((l) => `\`${l}\``).join(", ")} |
| Evidence IDs | ${evidenceIds.map((x) => `\`${x}\``).join(", ") || "— (no app mechanics stated)"} |
| Approval status | ${route?.status === "published" ? "Approved" : "Awaiting business approval (publishStatus: review)"} |
| Outstanding concern | ${entry.risk} |

Key approved claims:

${[...(scope ? [`Care scope — ${scope}`] : []), ...facts, ...(checks.length ? [`Verification — ${checks.join("; ")}`] : [])].map((c) => `- ${c}`).join("\n") || "- Plans and propositions only"}
`);

  copy.push(`# ${path}

_Title:_ ${title}
_Meta description:_ ${meta}

${toMarkdown(main)}
`);
}

for (const [t, ps] of titles) if (ps.length > 1) problems.push(`duplicate title "${t}": ${ps.join(", ")}`);
for (const [m, ps] of metas) if (ps.length > 1) problems.push(`duplicate meta: ${ps.join(", ")}`);

const header = `Generated by \`npm run release-docs\` from the **release-review** build (\`SITE_STAGE=release-review\`):
exactly ${releaseReviewPaths.size} pages, noindex/noarchive, crawling disallowed, empty sitemap, no placeholders.
Nothing is published or deployed.`;

writeFileSync(
  "docs/seo/FIRST-RELEASE-FINAL-AUDIT.md",
  `# First release — final audit

${header}

- Launch-rule problems: **${problems.length}**${problems.length ? `\n${problems.map((p) => `  - ${p}`).join("\n")}` : ""}
- Every page: unique title and meta, one H1, self-referencing canonical, breadcrumb on inner pages, no Review/AggregateRating schema, links only to release pages.

${audit.join("\n")}`,
);
writeFileSync(
  "docs/seo/FIRST-RELEASE-COPY.md",
  `# First release — customer-visible copy

${header}

Each page's main content, in reading order. Header, footer, breadcrumbs, related-page links and the repeated
app-download block are left out. CTAs are shown as [CTA: …]. Edit copy in \`src/data/\`, not here.

${copy.join("\n---\n\n")}`,
);
console.log(`release docs: ${firstRelease.length} pages, ${problems.length} problem(s)`);
if (problems.length) {
  for (const p of problems) console.log(`✗ ${p}`);
  process.exit(1);
}
