import { siteStage, type SiteStage } from "@/lib/site";
import type { PublishStatus } from "./types";

/**
 * Whether content with this status is BUILT at all for a stage.
 * - production: only "published"
 * - preview:    "published" and "review" (noindex)
 * - release-review: like preview, but pages are ALSO limited to the release
 *   scope (see inStageScope) — callers that build a page pass its path
 * - development: everything
 */
export function isBuilt(status: PublishStatus, stage: SiteStage = siteStage): boolean {
  if (stage === "production") return status === "published";
  if (stage === "preview" || stage === "release-review") return status !== "draft";
  return true;
}

/** Whether a page may be indexed: production stage + published content only. */
export function isIndexable(status: PublishStatus, stage: SiteStage = siteStage): boolean {
  return stage === "production" && status === "published";
}

/** The effective status of a page is the "least published" of itself and its parents. */
export function combineStatus(...statuses: PublishStatus[]): PublishStatus {
  if (statuses.includes("draft")) return "draft";
  if (statuses.includes("review")) return "review";
  return "published";
}

/**
 * Business facts gate publishing just like editorial status:
 * confirmed yes → "published", NOT CONFIRMED (null) → "review", confirmed no → "draft".
 */
export function confirmedStatus(value: boolean | null): PublishStatus {
  if (value === true) return "published";
  if (value === null) return "review";
  return "draft";
}

/** Only "available"/"limited" can publish; "unknown" holds in review; the rest never builds. */
export function availabilityStatus(a: "available" | "limited" | "coming-soon" | "unavailable" | "unknown"): PublishStatus {
  if (a === "available" || a === "limited") return "published";
  if (a === "unknown") return "review";
  return "draft";
}
