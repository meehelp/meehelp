/**
 * Build-time site configuration. All values come from environment variables
 * (names documented in .env.example). Nothing here is secret.
 */

export type SiteStage = "development" | "preview" | "production";

function readStage(): SiteStage {
  const raw = process.env.SITE_STAGE;
  return raw === "production" || raw === "preview" ? raw : "development";
}

export const siteStage: SiteStage = readStage();

/** Canonical origin. Canonicals always point here, even on preview builds. */
export const siteUrl: string = (process.env.SITE_URL || "https://meehelp.in").replace(/\/+$/, "");

export const isProductionStage = siteStage === "production";

/** Normalise to the site's trailing-slash policy: "/maid/mumbai/". */
export function normalisePath(path: string): string {
  if (!path || path === "/") return "/";
  const trimmed = path.replace(/^\/+|\/+$/g, "");
  return `/${trimmed}/`;
}

export function absoluteUrl(path: string): string {
  return `${siteUrl}${normalisePath(path)}`;
}
