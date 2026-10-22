import { firstRelease } from "@/data/release-plan";
import { siteStage, type SiteStage } from "@/lib/site";

/**
 * The release-review build contains EXACTLY the approved first-release pages
 * (src/data/release-plan.ts, when: "now") — nothing else, however its status
 * reads. Other stages are not limited by this list.
 */
export const releaseReviewPaths: ReadonlySet<string> = new Set(firstRelease.filter((r) => r.when === "now").map((r) => r.path));

/**
 * Public utility/legal pages linked from the site footer. They are hand-written
 * pages (src/pages/), built in EVERY stage so the footer never links to a
 * missing page, but they are outside the SEO route registry: never in the
 * sitemap and always noindex (links followed). scripts/hosting-smoke.mjs keeps
 * a copy of this list (a test keeps the two in sync).
 */
export const utilityPagePaths: readonly string[] = ["/privacy-policy/"];

/** Whether a page at `path` may be built for the stage (scope only — status is checked separately). */
export function inStageScope(path: string, stage: SiteStage = siteStage): boolean {
  return stage !== "release-review" || releaseReviewPaths.has(path);
}
