import { claims, trustMetrics, type ClaimKey } from "@/data/business";
import { isCheckActive, verificationChecks, type VerificationKey } from "@/data/verification";
import type { BusinessModel, Claim, TrustMetric } from "@/lib/content/types";

/** A claim is shown only when enabled AND approval details are recorded. */
export function isClaimActive(claim: Claim): boolean {
  return claim.enabled && Boolean(claim.approvedBy) && Boolean(claim.approvedOn);
}

/** Active claims for a page of the given model ("both"-model claims always qualify). */
export function getActiveClaims(model: BusinessModel | "both", keys?: ClaimKey[]): (Claim & { key: ClaimKey })[] {
  return (Object.entries(claims) as [ClaimKey, Claim][])
    .filter(([key]) => !keys || keys.includes(key))
    .filter(([, c]) => isClaimActive(c))
    .filter(([, c]) => c.model === "both" || model === "both" || c.model === model)
    .map(([key, c]) => ({ ...c, key }));
}

export function getActiveVerificationChecks() {
  return (Object.entries(verificationChecks) as [VerificationKey, (typeof verificationChecks)[VerificationKey]][])
    .filter(([, c]) => isCheckActive(c))
    .map(([key, c]) => ({ ...c, key }));
}

/** A metric is shown only when approved, display-enabled, and fully sourced and dated. */
export function isMetricDisplayable(m: TrustMetric): boolean {
  return m.approved && m.displayEnabled && Boolean(m.value) && Boolean(m.source) && Boolean(m.dateChecked);
}

export function getDisplayableMetrics(keys?: string[]): TrustMetric[] {
  return trustMetrics.filter((m) => (!keys || keys.includes(m.key)) && isMetricDisplayable(m));
}
