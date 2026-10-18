/**
 * Build-time site configuration. All values come from environment variables
 * (names documented in .env.example). Nothing here is secret.
 */

/**
 * - development:    everything that isn't draft
 * - preview:        all review + published pages, noindex
 * - release-review: ONLY the approved first-release pages (src/data/release-plan.ts),
 *                   noindex/noarchive, crawling disallowed, empty sitemap,
 *                   no placeholders — the exact build reviewed before launch
 * - production:     published pages only, indexable
 */
export type SiteStage = "development" | "preview" | "release-review" | "production";

function readStage(): SiteStage {
  const raw = process.env.SITE_STAGE;
  return raw === "production" || raw === "preview" || raw === "release-review" ? raw : "development";
}

export const siteStage: SiteStage = readStage();

/** Canonical origin. Canonicals always point here, even on preview builds. */
export const siteUrl: string = (process.env.SITE_URL || "https://meehelp.in").replace(/\/+$/, "");

export const isProductionStage = siteStage === "production";

/** Stages a customer could see (production, and the release-review build): never render placeholders. */
export function hidesPlaceholders(stage: SiteStage = siteStage): boolean {
  return stage === "production" || stage === "release-review";
}

/** Normalise to the site's trailing-slash policy: "/maid/mumbai/". */
export function normalisePath(path: string): string {
  if (!path || path === "/") return "/";
  const trimmed = path.replace(/^\/+|\/+$/g, "");
  return `/${trimmed}/`;
}

export function absoluteUrl(path: string): string {
  return `${siteUrl}${normalisePath(path)}`;
}
