import type { BusinessModel, ServiceSlug } from "@/lib/content/types";

/**
 * Customer-facing statements about how MeeHelp actually works, each backed by
 * one or more evidence items in src/data/evidence.ts. Rendered by
 * components/content/ProductFacts.astro with a `data-evidence` attribute so
 * `npm run report` can count evidence-backed statements per page.
 *
 * Only this file may describe app mechanics (hours, durations, booking
 * windows, profile fields). Tests fail if a fact cites an unknown or
 * non-public evidence item.
 */
export interface ProductFact {
  id: string;
  text: string;
  evidence: string[];
  model: BusinessModel | "both";
  /** Omit for every service. */
  services?: ServiceSlug[];
}

const STAFF: ServiceSlug[] = ["maid", "cook", "babysitter-nanny", "patient-care"];
const CARE_HOURLY: ServiceSlug[] = ["babysitter-nanny", "elder-care", "patient-care"];
const HOURLY_ONLY: ServiceSlug[] = ["cook", ...CARE_HOURLY];

export const productFacts: ProductFact[] = [
  // ── Marketplace: hiring directly ──────────────────────────────────────────
  {
    id: "m.hours",
    model: "marketplace",
    services: STAFF,
    text: "Hire part-time help for 2, 4, 6, 8, 10 or 12 hours a day, or full-time help who lives in with you.",
    evidence: ["mkt.part-time-hours", "mkt.full-time-live-in", "cat.helper-categories"],
  },
  {
    id: "m.prefs.maid",
    model: "marketplace",
    services: ["maid"],
    text: "Tell the app the work you need, the size of your home (1 to 5 BHK) and, if you have one, whether you prefer a male or female helper.",
    evidence: ["mkt.preferences"],
  },
  {
    id: "m.prefs.cook",
    model: "marketplace",
    services: ["cook"],
    text: "Tell the app how many people the cook will be cooking for (1 to 5 household members) and whether you prefer a male or female cook.",
    evidence: ["mkt.preferences"],
  },
  {
    id: "m.prefs.other",
    model: "marketplace",
    services: ["babysitter-nanny", "patient-care"],
    text: "Choose the hours a day you need help and, if you have one, a gender preference.",
    evidence: ["mkt.preferences", "mkt.part-time-hours"],
  },
  {
    id: "m.distance",
    model: "marketplace",
    services: STAFF,
    text: "Matching helpers near your address are listed with their distance in km. Sort the list by distance, or by date to see who joined most recently.",
    evidence: ["mkt.distance-sort"],
  },
  {
    id: "m.profile",
    model: "marketplace",
    services: STAFF,
    text: "Each profile shows the helper's experience, the work they do, their age, marital status and education, and whether they read, write and speak English. Salary isn't listed — you agree it with the helper.",
    evidence: ["mkt.profile-fields"],
  },
  {
    id: "m.contact",
    model: "marketplace",
    services: STAFF,
    text: "\"View Contact\" uses one contact from your plan. You can then call the helper, chat in the app or message them on WhatsApp.",
    evidence: ["mkt.contact"],
  },
  {
    id: "m.outcome",
    model: "marketplace",
    services: STAFF,
    text: "After a call you can mark what happened — interviewed, hired, didn't answer or didn't turn up.",
    evidence: ["mkt.outcome-survey"],
  },
  {
    id: "m.trial",
    model: "marketplace",
    services: STAFF,
    text: "If you want a trial day, agree it with the helper directly — when it is, what they'll do and what you'll pay for it.",
    evidence: ["mkt.no-trial-feature"],
  },
  {
    id: "m.advance",
    model: "marketplace",
    services: STAFF,
    text: "Don't pay a helper in advance for work they haven't done. The app shows the same reminder.",
    evidence: ["mkt.no-advance"],
  },
  {
    id: "m.checks",
    model: "marketplace",
    services: STAFF,
    text: "Ask to see the helper's ID before they start. Checking documents is the employer's responsibility, and MeeHelp recommends that you arrange police verification once you have hired someone.",
    evidence: ["mkt.employer-checks"],
  },

  // ── On-demand: one-time cleaning (maid) ───────────────────────────────────
  {
    id: "o.otg.tasks",
    model: "onDemand",
    services: ["maid"],
    text: "For a one-time clean, pick at least two tasks — for example dishes, bathrooms, sweeping and mopping, dusting, or laundry (machine or hand wash).",
    evidence: ["od.otg-tasks"],
  },
  {
    id: "o.otg.length",
    model: "onDemand",
    services: ["maid"],
    text: "Choose a 120, 150 or 180-minute visit.",
    evidence: ["od.otg-durations"],
  },
  {
    id: "o.otg.when",
    model: "onDemand",
    services: ["maid"],
    text: "Book now, or schedule the visit up to 5 days ahead for a start time between 7 AM and 8 PM.",
    evidence: ["od.otg-book-now", "impl.instant-scope"],
  },
  {
    id: "o.otg.materials",
    model: "onDemand",
    services: ["maid"],
    text: "Keep your mop, bucket and cleaning liquids ready: cleaners don't bring machines or materials.",
    evidence: ["od.no-materials"],
  },
  {
    id: "o.maid.hourly",
    model: "onDemand",
    services: ["maid"],
    text: "For bigger jobs, book hourly help instead — 2 to 12 hours for work such as deep-cleaning fans, windows, balconies, the chimney or the fridge.",
    evidence: ["od.hourly-tasks", "od.hourly-durations"],
  },

  // ── On-demand: hourly (cook and care) ─────────────────────────────────────
  {
    id: "o.cook.members",
    model: "onDemand",
    services: ["cook"],
    text: "Book cooking as an hourly task and tell the app how many household members you're cooking for (1 to 5).",
    evidence: ["od.cook-hourly"],
  },
  {
    id: "o.baby.task",
    model: "onDemand",
    services: ["babysitter-nanny"],
    text: "Baby care is its own task in an hourly booking, separate from cleaning or cooking.",
    evidence: ["od.hourly-tasks"],
  },
  {
    id: "o.elder.task",
    model: "onDemand",
    services: ["elder-care"],
    text: "Elder care is its own task in an hourly booking, separate from patient care: choose it when an older family member needs company and help with their routine.",
    evidence: ["od.hourly-tasks"],
  },
  {
    id: "o.patient.task",
    model: "onDemand",
    services: ["patient-care"],
    text: "Patient care is its own task in an hourly booking, separate from elder care: choose it when someone is unwell or recovering and needs personal care.",
    evidence: ["od.hourly-tasks"],
  },
  {
    id: "o.hourly.length",
    model: "onDemand",
    services: HOURLY_ONLY,
    text: "Bookings run for 2 to 12 hours, in 2-hour steps. Later start times allow shorter bookings only.",
    evidence: ["od.hourly-durations"],
  },
  {
    id: "o.hourly.when",
    model: "onDemand",
    services: HOURLY_ONLY,
    text: "Schedule at least 2 hours ahead and up to 5 days ahead, for a start time between 7 AM and 8 PM.",
    evidence: ["od.hourly-schedule", "impl.instant-scope"],
  },

  // ── Both ──────────────────────────────────────────────────────────────────
  {
    id: "b.coverage",
    model: "both",
    text: "The app checks your address — city, pincode and map location — and tells you straight away if it isn't covered yet.",
    evidence: ["cov.address-check"],
  },

  // ── On-demand: every booking ──────────────────────────────────────────────
  {
    id: "o.included",
    model: "onDemand",
    text: "Each task shows what's included and what isn't before you confirm.",
    evidence: ["od.included-sheet"],
  },
  {
    id: "o.gender",
    model: "onDemand",
    text: "You can ask for a male or female helper. The extra charge for this applies only if a helper of that gender is assigned; otherwise the first available helper comes.",
    evidence: ["od.gender-pref"],
  },
  {
    id: "o.pin",
    model: "onDemand",
    text: "The helper's details appear once you've paid, and the job starts when you share the PIN shown in your app.",
    evidence: ["od.details-after-payment"],
  },
];

/** Facts for a service and model, in file order. */
export function factsFor(service: ServiceSlug, model: BusinessModel): ProductFact[] {
  return productFacts.filter((f) => (f.model === model || f.model === "both") && (!f.services || f.services.includes(service)));
}
