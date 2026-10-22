/**
 * Marketplace contact plans — the ONLY place prices may be written.
 *
 * A plan buys access to a number of helper CONTACTS for a validity period.
 * Source: plan screens currently shown in the MeeHelp app (Phase 3 brief).
 *
 * Rules (enforced by tests and `npm run seo`):
 * - No price may appear in page copy; components read prices from here.
 * - Office and Business plans render only on the pricing page.
 * - The asterisk (*) the app shows beside prices has NO business meaning
 *   (confirmed in the Phase 4 brief) and is never shown on the website.
 * - No tax/GST statement has been provided, so none may be shown.
 * - Prices appear on production only while `publishPrices` is true.
 * - The free profile view is a PROMOTION (src/data/promotions.ts), not part of a plan.
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
  /** The app's "*" beside prices: confirmed meaningless, removed on the website. */
  asterisk: {
    show: false as const,
    decision: "No business meaning; removed from Website V2 (Phase 4 brief).",
    decidedOn: "2026-10-17",
  },
  /** No tax statement has been provided. Never add GST/tax wording until one is. */
  taxStatement: null as string | null,
  /** Show approved plan prices on production builds. */
  publishPrices: true,
  source: "MeeHelp app plan screens supplied in the Phase 3 brief (asterisk removed per Phase 4 brief)",
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

/** Pricing page content (marketplace). No prices are written here — cards read `plans`. */
export const pricingPage = {
  headline: "MeeHelp plans for contacting helpers",
  intro: [
    "On MeeHelp you find helpers yourself and contact them directly. A plan gives you a set number of helper contacts, valid for a fixed period.",
    "The plan price is paid to MeeHelp for contacting helpers. It is not the helper's salary: you agree the salary with the helper you hire and pay them directly.",
  ],
  whatIsAContact: [
    "A contact gives you one helper's contact details, so you can call them directly.",
    "Use your contacts on the helpers you'd like to speak to — to discuss the work, agree the salary and arrange a trial.",
    "Each plan is valid for the period shown. Choose a larger plan if you expect to speak to more helpers.",
  ],
  segmentIntros: {
    home: "For households hiring a maid, cook, babysitter or nanny, or an elder care or patient care attendant for their own home.",
    office: "For offices hiring housekeeping or support staff, where you expect to speak to more candidates.",
    business: "For businesses hiring support staff in larger numbers over a longer period.",
  } as Record<PlanSegment, string>,
  faqs: [
    {
      question: "What is a helper contact?",
      answer: "A contact gives you one helper's contact details so you can call them directly. A plan includes the number of contacts shown on it.",
    },
    {
      question: "Does the plan price include the helper's salary?",
      answer: "No. The plan is paid to MeeHelp for contacting helpers. You agree the helper's salary with them and pay them directly.",
    },
    {
      question: "Does MeeHelp charge a placement fee?",
      answer: "No. MeeHelp doesn't charge a placement agency fee. You choose whom to contact and whom to hire, and the working arrangement is between you and the helper.",
    },
    {
      question: "Which plan should a household choose?",
      answer: "Home plans are designed for households. Pick the number of contacts you expect to need — for example, if you want to speak to several helpers before you decide.",
    },
    {
      question: "Are plans for booking help by the hour?",
      answer: "No. Plans are only for finding and contacting helpers to hire directly. Booking help by the hour is separate and does not use a plan.",
    },
      {
        question: "What if a helper I hire doesn't work out?",
        answer: "MeeHelp doesn't place helpers and doesn't promise to replace one. You can use the remaining contacts in your plan to speak to other helpers while it is valid.",
      },
  ],
  seo: {
    title: "MeeHelp Plans – Contact Helpers Directly | MeeHelp",
    description:
      "Compare MeeHelp Home, Office and Business plans. Each plan gives you a set number of helper contacts so you can speak to and hire helpers directly.",
  },
  publishStatus: "published" as const,
  updatedAt: "2026-10-17",
};
