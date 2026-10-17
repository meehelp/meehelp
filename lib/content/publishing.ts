import { siteStage, type SiteStage } from "@/lib/site";
import type { PublishStatus } from "./types";

/**
 * Whether content with this status is BUILT at all for a stage.
 * - production: only "published"
 * - preview:    "published" and "review" (noindex)
 * - development: everything
 */
export function isBuilt(status: PublishStatus, stage: SiteStage = siteStage): boolean {
  if (stage === "production") return status === "published";
  if (stage === "preview") return status !== "draft";
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
