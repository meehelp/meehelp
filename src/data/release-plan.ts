/**
 * APPROVED first public release. The business-approved URLs below are the
 * production release set; publishing status is explicitly enabled only for
 * these pages and remains review for the wider preview inventory.
 *
 * Chosen from docs/seo/QUALITY-REPORT.md (v3) — the home page,
 * pricing, the 10 hubs now backed by business truth, and the only 3 city
 * pages with genuinely local, hand-written content. Tests fail if a page here
 * is not READY. docs/seo/FIRST-RELEASE-REVIEW.md is generated from this list.
 */
export interface ReleaseEntry {
  path: string;
  /** "now": READY in the quality report. "after": publish once the listed questions are answered. */
  when: "now" | "after";
  waitsOn?: string[];
  why: string;
  /** What could still be wrong or need sign-off before this page goes public. */
  risk: string;
}

export const firstRelease: ReleaseEntry[] = [
  { path: "/", when: "now", why: "Explains both propositions; links to every hub and pricing.", risk: "CTA wording is still 'proposed'; no app ratings or download numbers (none supplied)." },
  { path: "/pricing/", when: "now", why: "The 9 confirmed plans, what a contact is, salary not included; links back to the hubs.", risk: "Plan prices must match the app on launch day; the app's stale lowest-plan onboarding copy should be fixed in the app (biz.299-stale)." },
  { path: "/maid/", when: "now", why: "Highest-demand hire intent; part-time 2–12 h or live-in, house-size preference, profile fields, contact flow — all evidenced.", risk: "Task names are general role descriptions (Q-TASKS)." },
  { path: "/cook/", when: "now", why: "Distinct hire intent; household-size preference and live-in option evidenced; no food-preference filter claims.", risk: "Task names are general role descriptions (Q-TASKS)." },
  { path: "/babysitter-nanny/", when: "now", why: "Childcare hire intent with the business-approved baby care scope, framed by parental instructions.", risk: "Scope is business-supplied, not visible in the app; no developmental or safety guarantees are made." },
  { path: "/elder-care/", when: "now", why: "Elder care as a customer need mapped to the shared care-helper pool (biz.elder-pool), with the approved daily-living scope.", risk: "How a customer selects elder care in the app is unconfirmed (Q-ELDER-LABEL); special-care items depend on a trained caregiver (Q-CLINICAL)." },
  { path: "/patient-care/", when: "now", why: "Patient-attendant intent with the approved scope; injections, IV and invasive procedures explicitly excluded.", risk: "Monitoring is stated only 'where the assigned caregiver is trained' (Q-CLINICAL)." },
  { path: "/hourly-maid/", when: "now", why: "The only instant flow: one-time clean (2+ tasks, 120/150/180 min, book now or schedule), no materials, pay part online and the rest to the helper, narrow cancellation rule.", risk: "Prices and fee percentages are deliberately not stated (Q-PRICE, Q-FEE); customer-initiated cancellation before acceptance is unspecified (Q-CANCEL)." },
  { path: "/hourly-cook/", when: "now", why: "Hourly cooking task with household size; scheduled 2 h–5 days ahead — no instant promise.", risk: "Cancellation terms for hourly bookings are not stated (Q-CANCEL)." },
  { path: "/hourly-babysitter/", when: "now", why: "Scheduled baby care by the hour with the approved scope.", risk: "Cancellation terms for hourly bookings are not stated (Q-CANCEL)." },
  { path: "/hourly-elder-care/", when: "now", why: "Scheduled elder care by the hour; daily-living scope; clinical work excluded.", risk: "Cancellation terms for hourly bookings are not stated (Q-CANCEL)." },
  { path: "/hourly-patient-care/", when: "now", why: "Scheduled patient care by the hour; approved scope; injections and IV excluded.", risk: "Cancellation terms for hourly bookings are not stated (Q-CANCEL)." },
  { path: "/maid/mumbai/", when: "now", why: "Hand-written: society registration, compact flats, Thane/Navi Mumbai distances; low doorway risk.", risk: "Local guidance is general practical advice; areas served are not listed (none confirmed)." },
  { path: "/maid/delhi-ncr/", when: "now", why: "Hand-written: independent floors vs gated societies, distances across Delhi/Gurugram/Noida; low doorway risk.", risk: "Local guidance is general practical advice; areas served are not listed (none confirmed)." },
  { path: "/cook/mumbai/", when: "now", why: "Hand-written: commute-driven meal timing and small kitchens; low doorway risk.", risk: "Local guidance is general practical advice; areas served are not listed (none confirmed)." },
];
