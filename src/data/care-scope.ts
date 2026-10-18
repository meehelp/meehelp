import type { ServiceSlug } from "@/lib/content/types";

/**
 * BUSINESS-APPROVED SERVICE SCOPE for the care categories (Phase 4.6 brief,
 * 2026-10-18; evidence biz.scope-*). Rewritten into consumer language — not
 * pasted verbatim.
 *
 * Every item has a status:
 *   "published"         — may appear on Website V2 pages
 *   "review"            — business-supplied, but needs a confirmed training /
 *                         credential pathway before it is published (wound,
 *                         bed-sore and catheter-related support)
 *   "clinical-approval" — high-risk clinical work (injections, insulin, IV).
 *                         Never published while clinicalServices.invasive is false.
 * Only "published" items render (components/content/CareScope.astro). The
 * guards in src/lib/guards/claims.ts block the review/clinical wording on
 * pages, so a status change alone cannot leak them.
 *
 * Framing rules: helpers follow the family's instructions and the agreed
 * scope; nothing here is a medical, developmental or safety guarantee; no
 * helper is described as a nurse or a paediatric professional.
 */
export type ScopeStatus = "published" | "review" | "clinical-approval";

export interface ScopeItem {
  text: string;
  status: ScopeStatus;
}

export interface ScopeGroup {
  title: string;
  /** Shown under the title, e.g. the condition under which the group applies. */
  note?: string;
  items: ScopeItem[];
}

export interface CareScope {
  evidence: string[];
  intro: string;
  groups: ScopeGroup[];
}

const p = (text: string): ScopeItem => ({ text, status: "published" });
const review = (text: string): ScopeItem => ({ text, status: "review" });
const clinical = (text: string): ScopeItem => ({ text, status: "clinical-approval" });

/** Clinical-service switches. Both stay false for the first release. */
export const clinicalServices = {
  /** Injections, insulin, IV lines and other invasive procedures. */
  invasive: false,
  /** Wound dressing, bed-sore care and catheter-related support. */
  woundAndCatheter: false,
} as const;

export const careScopes: Partial<Record<ServiceSlug, CareScope>> = {
  "babysitter-nanny": {
    evidence: ["biz.scope-baby"],
    intro: "What a babysitter or nanny does is agreed with you, and they follow your instructions for your child's routine, food and sleep.",
    groups: [
      {
        title: "Everyday care",
        items: [
          p("Bathing, basic grooming and dressing your baby"),
          p("Diaper changes and keeping your baby's skin clean and dry"),
          p("Help with potty training, at a pace that suits your child's age"),
          p("Washing baby clothes and bedding, if you agree it"),
        ],
      },
      {
        title: "Feeding",
        items: [
          p("Sterilising bottles and preparing formula as you show them"),
          p("Warming expressed breast milk the way you instruct"),
          p("Feeding at the times you set, including purees and porridge for older babies"),
          p("Burping, and cleaning feeding things and the high chair afterwards"),
        ],
      },
      {
        title: "Sleep and routine",
        items: [
          p("Keeping to the nap and bedtime routine you set"),
          p("Watching over your baby while they sleep, following your safe-sleep instructions"),
        ],
      },
      {
        title: "Play and activity",
        items: [
          p("Tummy time, reading, singing and play suited to your child's age"),
          p("Indoor activities, and trips to a nearby park or play area if you approve"),
        ],
      },
      {
        title: "Your baby's space",
        items: [p("Keeping the nursery and play area tidy, cleaning toys and wiping down your baby's immediate surroundings")],
      },
    ],
  },
  "elder-care": {
    evidence: ["biz.scope-elder-daily", "biz.scope-elder-special", "biz.scope-elder-clinical"],
    intro: "Elder care is help for an older person with daily living, moving around, their routine and company, agreed with the family.",
    groups: [
      {
        title: "Personal care",
        items: [
          p("Help with bathing, grooming, dressing and brushing teeth"),
          p("Toilet help, bedpans and adult-diaper changes"),
        ],
      },
      {
        title: "Moving around safely",
        items: [
          p("Support when walking, and help moving from bed to wheelchair"),
          p("Changing position in bed or a chair through the day"),
        ],
      },
      {
        title: "Meals and the home",
        items: [
          p("Preparing meals and help at mealtimes"),
          p("Light housekeeping around the senior, laundry and changing bed linen"),
          p("Groceries and small errands nearby"),
        ],
      },
      {
        title: "Company and outings",
        items: [
          p("Conversation, reading together and short walks"),
          p("Going along to appointments"),
        ],
      },
      {
        title: "Special care needs",
        note: "Only when a caregiver trained for this is specifically engaged — ask about it before you hire or book.",
        items: [
          p("Help keeping to the medicine schedule the doctor has set"),
          p("Checking blood pressure, blood sugar, oxygen level or temperature and telling the family, where the assigned caregiver is trained to do this"),
          p("Prescribed rehabilitation exercises"),
          p("Support for someone living with dementia or Alzheimer's"),
          review("Wound dressing and bed-sore care"),
          review("Catheter-related support"),
          clinical("Injections, insulin administration and IV lines"),
        ],
      },
    ],
  },
  "patient-care": {
    evidence: ["biz.scope-patient", "biz.patient-no-invasive"],
    intro: "Patient care is attendant support for someone who is unwell, recovering or bedridden and depends on help through the day.",
    groups: [
      {
        title: "Personal care",
        items: [p("Bathing or sponge baths, grooming and dressing"), p("Adult diapers and bedpan help")],
      },
      {
        title: "Mobility",
        items: [p("Moving from bed to wheelchair and supported walking"), p("Turning and repositioning a patient who is bedridden")],
      },
      {
        title: "Food and water",
        items: [p("Help with eating"), p("Making sure the patient drinks enough through the day")],
      },
      {
        title: "Medicines",
        items: [p("Reminders for oral medicines the doctor has prescribed — tablets, syrups and inhalers")],
      },
      {
        title: "Monitoring",
        note: "Where the assigned caregiver is trained — this is observing and reporting to the family or doctor, not diagnosis.",
        items: [p("Taking temperature and blood pressure, and noting other basic observations within their training")],
      },
      {
        title: "Comfort and surroundings",
        items: [
          p("Company and reassurance"),
          p("Keeping the patient's area tidy, changing bed linen and basic upkeep of the room and washroom"),
        ],
      },
      {
        title: "Not part of patient care",
        items: [clinical("Injections, IV drips and other invasive medical procedures")],
      },
    ],
  },
};

/** The published items only, grouped — what pages may render. */
export function publishedScope(service: ServiceSlug): CareScope | null {
  const scope = careScopes[service];
  if (!scope) return null;
  const groups = scope.groups
    .map((g) => ({ ...g, items: g.items.filter((i) => i.status === "published") }))
    .filter((g) => g.items.length > 0);
  return { ...scope, groups };
}
