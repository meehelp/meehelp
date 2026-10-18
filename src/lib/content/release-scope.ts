import { firstRelease } from "@/data/release-plan";
import { siteStage, type SiteStage } from "@/lib/site";

/**
 * The release-review build contains EXACTLY the approved first-release pages
 * (src/data/release-plan.ts, when: "now") — nothing else, however its status
 * reads. Other stages are not limited by this list.
 */
export const releaseReviewPaths: ReadonlySet<string> = new Set(firstRelease.filter((r) => r.when === "now").map((r) => r.path));

/** Whether a page at `path` may be built for the stage (scope only — status is checked separately). */
export function inStageScope(path: string, stage: SiteStage = siteStage): boolean {
  return stage !== "release-review" || releaseReviewPaths.has(path);
}
