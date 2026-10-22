/**
 * npm run intent-map — writes docs/seo/intent-map.json from src/data/intent-map.ts
 * and the route registry (preview stage: every page under review).
 * `npm test` fails if the committed file is out of date.
 */
import { mkdirSync, writeFileSync } from "node:fs";

process.env.SITE_STAGE = "preview";
const { buildIntentMap } = await import("@/lib/content/intent");
const entries = buildIntentMap("preview");
mkdirSync("docs/seo", { recursive: true });
writeFileSync("docs/seo/intent-map.json", JSON.stringify({ note: "Intent targets — not search-volume estimates.", stage: "preview", pages: entries }, null, 2) + "\n");
console.log(`docs/seo/intent-map.json: ${entries.length} pages`);
