import { claims, trustMetrics, type ClaimKey } from "@/data/business";
import type { Claim, TrustMetric } from "@/lib/content/types";

/** A claim is shown only when enabled AND approval details are recorded. */
export function isClaimActive(claim: Claim): boolean {
  return claim.enabled && Boolean(claim.approvedBy) && Boolean(claim.approvedOn);
}

export function getActiveClaims(keys?: ClaimKey[]): (Claim & { key: ClaimKey })[] {
  const all = Object.entries(claims) as [ClaimKey, Claim][];
  return all
    .filter(([key]) => !keys || keys.includes(key))
    .filter(([, claim]) => isClaimActive(claim))
    .map(([key, claim]) => ({ ...claim, key }));
}

/** A metric is shown only when approved and fully sourced and dated. */
export function isMetricDisplayable(m: TrustMetric): boolean {
  return m.approved && Boolean(m.value) && Boolean(m.source) && Boolean(m.asOf);
}

export function getDisplayableMetrics(keys?: string[]): TrustMetric[] {
  return trustMetrics.filter((m) => (!keys || keys.includes(m.key)) && isMetricDisplayable(m));
}
