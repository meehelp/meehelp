/**
 * RECOMMENDED first public release (Phase 4.5). This is a recommendation only:
 * nothing here changes publishStatus, the sitemap or robots. Publishing still
 * requires the business to approve each page and flip its publishStatus.
 *
 * Chosen from docs/seo/QUALITY-REPORT.md (v2): READY pages, plus the three
 * care booking hubs once Q-CARE-TASKS is answered. Tests fail if a HOLD page
 * is ever added here.
 */
export interface ReleaseEntry {
  path: string;
  /** "now": READY in the quality report. "after": publish once the listed questions are answered. */
  when: "now" | "after";
  waitsOn?: string[];
  why: string;
}

export const firstRelease: ReleaseEntry[] = [
  { path: "/", when: "now", why: "Explains both propositions; links to every hub and pricing." },
  { path: "/pricing/", when: "now", why: "The 9 confirmed plans, what a contact is, salary not included; links back to the hubs." },
  { path: "/maid/", when: "now", why: "Highest-demand hire intent; part-time 2–12 h or live-in, house-size preference, profile fields, contact flow — all evidenced." },
  { path: "/cook/", when: "now", why: "Distinct hire intent; household-size preference and live-in option evidenced; food-preference claims removed." },
  { path: "/babysitter-nanny/", when: "now", why: "Distinct childcare hire intent; 'Baby Care' is a helper category; part-time/live-in evidenced." },
  { path: "/patient-care/", when: "now", why: "'Patient Care' is a helper category; non-medical scope stated plainly and distinct from elder care." },
  { path: "/hourly-maid/", when: "now", why: "Strongest on-demand evidence: one-time clean (≥2 tasks, 120/150/180 min, book now or schedule), no materials, PIN start." },
  { path: "/hourly-cook/", when: "now", why: "Hourly cooking task with household size; scheduled 2 h–5 days ahead — no instant promise." },
  { path: "/maid/mumbai/", when: "now", why: "Hand-written: society registration, compact flats, Thane/Navi Mumbai distances; low doorway risk." },
  { path: "/maid/delhi-ncr/", when: "now", why: "Hand-written: independent floors vs gated societies, distances across Delhi/Gurugram/Noida; low doorway risk." },
  { path: "/cook/mumbai/", when: "now", why: "Hand-written: commute-driven meal timing and small kitchens; low doorway risk." },
  { path: "/hourly-babysitter/", when: "after", waitsOn: ["Q-CARE-TASKS"], why: "Distinct booking intent with evidenced scheduling rules; needs the app's own baby-care task text." },
  { path: "/hourly-elder-care/", when: "after", waitsOn: ["Q-CARE-TASKS"], why: "Elder care exists as its own hourly task; publish once its included/excluded text is supplied." },
  { path: "/hourly-patient-care/", when: "after", waitsOn: ["Q-CARE-TASKS"], why: "Patient care exists as its own hourly task; publish once its included/excluded text is supplied." },
];
