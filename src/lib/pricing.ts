import { plans, pricingSettings, segments, type Plan, type PlanSegment } from "@/data/plans";
import { siteStage, type SiteStage } from "@/lib/site";

/** Prices appear on production only while the business-controlled `publishPrices` gate is on. */
export function arePricesPublishable(stage: SiteStage = siteStage): boolean {
  if (stage !== "production") return true;
  return pricingSettings.publishPrices;
}

export function getActivePlans(segment: PlanSegment): Plan[] {
  return plans.filter((p) => p.segment === segment && p.active).sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getSegments(audience?: "consumer" | "b2b") {
  return segments.filter((s) => !audience || s.audience === audience).sort((a, b) => a.displayOrder - b.displayOrder);
}

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 2 });

/** "₹499", "₹1,199.20", "₹16,000". Whole rupees drop the decimals; others keep two. */
export function formatInr(amount: number): string {
  if (Number.isInteger(amount)) return inr.format(amount);
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
}

export function formatValidity(v: Plan["validity"]): string {
  return `${v.value} ${v.unit}${v.value === 1 ? "" : "s"}`;
}

/** Every price string the site is allowed to show, per segment (used by the SEO validator). */
export function allowedPriceStrings(): Record<PlanSegment, string[]> {
  const out: Record<PlanSegment, string[]> = { home: [], office: [], business: [] };
  for (const p of plans) {
    out[p.segment].push(formatInr(p.currentPrice));
    if (p.previousPrice !== null) out[p.segment].push(formatInr(p.previousPrice));
  }
  return out;
}
