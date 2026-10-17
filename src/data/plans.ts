/**
 * Marketplace contact plans — the ONLY place prices may be written.
 *
 * A plan buys access to a number of helper CONTACTS for a validity period.
 * Source: plan screens currently shown in the MeeHelp app (Phase 3 brief).
 *
 * Rules (enforced by tests and `npm run seo`):
 * - No price may appear in page copy; components read prices from here.
 * - Office and Business plans render only on the pricing page.
 * - The app shows an asterisk (*) next to prices. Its meaning is NOT confirmed,
 *   so no tax/GST interpretation may be shown. Prices are not published on
 *   production until `priceNote.status` is "confirmed" AND `publishPrices` is true.
 */

export type PlanSegment = "home" | "office" | "business";

export interface Plan {
  id: string;
  segment: PlanSegment;
  displayName: string;
  /** Number of helper contacts included. */
  contacts: number;
  /** Current displayed price in INR. */
  currentPrice: number;
  /** Previous displayed price in INR (struck through), or null. */
  previousPrice: number | null;
  /** Displayed discount percentage, or null. */
  discountPercent: number | null;
  validity: { value: number; unit: "month" };
  bestValue: boolean;
  active: boolean;
  displayOrder: number;
  /** Date this price took effect, if known. */
  effectiveDate: string | null;
  /** Date this plan was last checked against the app. */
  lastReviewed: string;
  priceNote: "pending business confirmation";
  /** Key into data/ctas.ts. */
  ctaKey: "choosePlan";
}

export interface SegmentInfo {
  id: PlanSegment;
  name: string;
  /** Short neutral description. */
  description: string;
  /** Consumer pages show only consumer segments. */
  audience: "consumer" | "b2b";
  displayOrder: number;
}

export const pricingSettings = {
  currency: "INR" as const,
  /** Profile views before a plan is needed. Rendered only by the plans component. */
  freeProfileViews: { value: 1, showOnWebsite: true },
  priceNote: {
    status: "pending" as "pending" | "confirmed",
    /** Customer-facing explanation of the asterisk — set only once confirmed. */
    text: null as string | null,
    internalNote: "The app shows * beside current prices. Meaning not confirmed — do not state GST/tax treatment.",
  },
  /** Show prices on production builds. Requires priceNote.status === "confirmed". */
  publishPrices: false,
  source: "MeeHelp app plan screens supplied in the Phase 3 brief",
  lastReviewed: "2026-10-17",
};

export const segments: SegmentInfo[] = [
  { id: "home", name: "Home", description: "For households.", audience: "consumer", displayOrder: 1 },
  { id: "office", name: "Office", description: "For offices.", audience: "b2b", displayOrder: 2 },
  { id: "business", name: "Business", description: "For businesses.", audience: "b2b", displayOrder: 3 },
];

const base = {
  active: true,
  effectiveDate: null,
  lastReviewed: "2026-10-17",
  priceNote: "pending business confirmation" as const,
  ctaKey: "choosePlan" as const,
};
const months = (value: number) => ({ value, unit: "month" as const });

export const plans: Plan[] = [
  { ...base, id: "home-1", segment: "home", displayName: "Home Plan 1", contacts: 10, currentPrice: 499, previousPrice: null, discountPercent: null, validity: months(1), bestValue: false, displayOrder: 1 },
  { ...base, id: "home-2", segment: "home", displayName: "Home Plan 2", contacts: 15, currentPrice: 699, previousPrice: null, discountPercent: null, validity: months(2), bestValue: true, displayOrder: 2 },
  { ...base, id: "home-3", segment: "home", displayName: "Home Plan 3", contacts: 20, currentPrice: 899, previousPrice: null, discountPercent: null, validity: months(3), bestValue: false, displayOrder: 3 },

  { ...base, id: "office-1", segment: "office", displayName: "Office Plan 1", contacts: 30, currentPrice: 1199.2, previousPrice: 1499, discountPercent: 20, validity: months(3), bestValue: false, displayOrder: 1 },
  { ...base, id: "office-2", segment: "office", displayName: "Office Plan 2", contacts: 40, currentPrice: 1399.3, previousPrice: 1999, discountPercent: 30, validity: months(3), bestValue: true, displayOrder: 2 },
  { ...base, id: "office-3", segment: "office", displayName: "Office Plan 3", contacts: 50, currentPrice: 1649.45, previousPrice: 2999, discountPercent: 45, validity: months(6), bestValue: false, displayOrder: 3 },

  { ...base, id: "business-1", segment: "business", displayName: "Business Plan 1", contacts: 80, currentPrice: 16000, previousPrice: 20000, discountPercent: 20, validity: months(6), bestValue: false, displayOrder: 1 },
  { ...base, id: "business-2", segment: "business", displayName: "Business Plan 2", contacts: 110, currentPrice: 19600, previousPrice: 28000, discountPercent: 30, validity: months(11), bestValue: true, displayOrder: 2 },
  { ...base, id: "business-3", segment: "business", displayName: "Business Plan 3", contacts: 140, currentPrice: 22750, previousPrice: 35000, discountPercent: 35, validity: months(12), bestValue: false, displayOrder: 3 },
];

/** Pricing page content (marketplace). */
export const pricingPage = {
  headline: "MeeHelp plans for contacting helpers",
  intro: [
    "On MeeHelp you find helpers yourself and contact them directly. A plan gives you a set number of helper contacts for a fixed period.",
    "You agree the work, timings and salary directly with the helper — the plan price is for contacting helpers through MeeHelp.",
  ],
  seo: {
    title: "MeeHelp Plans – Contact Helpers Directly | MeeHelp",
    description:
      "Compare MeeHelp Home, Office and Business plans. Each plan gives you a set number of helper contacts so you can speak to and hire helpers directly.",
  },
  publishStatus: "review" as const,
  updatedAt: "2026-10-17",
};
