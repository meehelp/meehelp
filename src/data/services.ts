import type { ModelSupport, Service, ServiceSlug } from "@/lib/content/types";
import { cityFrames } from "./city-frames";
import { onDemandContent } from "./on-demand";

/**
 * Helper categories. Each hub page (/maid/ etc.) is a MARKETPLACE page:
 * the customer finds helpers, contacts them directly and hires them directly.
 * Copy must not describe on-demand booking (see data/business-models.ts).
 *
 * `models`: CONFIRMED in the Phase 4 brief (2026-10-17) — every category
 * supports both the marketplace and on-demand models with scheduled, hourly
 * booking. Phase 4.6 (biz.instant-scope): instant booking applies ONLY to the
 * one-time cleaning flow, i.e. the maid category; cook and care are scheduled.
 *
 * `publishStatus` is "review" for every page: the copy was rewritten in
 * Phase 4/4.5 and has not been approved for public indexing.
 *
 * Phase 4.5: task lists describe the role in general terms — the app's own
 * task names live in the admin panel (evidence cat.task-names-server) and
 * need business approval (Q-TASKS). App mechanics come from
 * src/data/product-facts.ts. Elder care has no marketplace helper category in
 * the product code (Q-ELDER), so its marketplace pages are held. Confirming the
 * models must not publish unreviewed copy as a side effect.
 * Prices never appear in this file; they come from src/data/plans.ts.
 */
const confirmedBothModels: ModelSupport = {
  marketplace: true,
  onDemand: true,
  instantBooking: false,
  scheduledBooking: true,
  hourlyBooking: true,
};
/** One-time cleaning ("On the go") is the only flow with Book Now. */
const withOneTimeCleaning: ModelSupport = { ...confirmedBothModels, instantBooking: true };

/** Marketplace (find & hire directly) content per category. */
const marketplaceContent: Omit<Service, "onDemand" | "cityPage">[] = [
  {
    slug: "maid",
    name: "Maid / House Help",
    shortName: "Maid",
    icon: "maid",
    roleWithArticle: "a maid",
    summary: "Find house help for daily cleaning, dishes and laundry, and hire them directly.",
    models: { ...withOneTimeCleaning },
    headline: "Find a maid or house help near you",
    description: [
      "Hire house help for daily sweeping and mopping, dishes, bathrooms and laundry: part-time for a few hours each day, or full-time help who lives in. On MeeHelp you see profiles of helpers near your address, contact the ones you like and hire them directly.",
      "You decide the tasks and the hours, and agree the salary with the helper yourself. MeeHelp doesn't place the helper or take a cut of their salary.",
    ],
    customerProblems: [
      "Your regular maid has left and you need someone new.",
      "You both work long hours and the housework keeps piling up.",
      "You want one dependable person instead of calling different people every week.",
      "You have moved to a new area and don't know who to ask.",
    ],
    tasksIncluded: [
      "Sweeping and mopping floors",
      "Dusting furniture and surfaces",
      "Washing dishes and wiping kitchen counters",
      "Cleaning bathrooms and toilets",
      "Washing, drying and folding clothes",
      "Making beds and tidying rooms",
      "Taking out household waste",
    ],
    tasksExcluded: [
      "Cooking meals — hire a cook, or agree this separately",
      "Looking after children, elderly or unwell family members",
      "Specialist work such as pest control, painting or appliance repair",
      "Cleaning exterior windows or anything at height without safe access",
    ],
    arrangements: ["part-time", "full-time"],
    safeguards: [
      "Walk the helper through each room on the first day and show them which products to use on which surfaces.",
    ],
    faqs: [
      {
        question: "What does a maid usually do in a home?",
        answer:
          "Most house help covers daily cleaning: sweeping, mopping, dusting, dishes, bathrooms and laundry. Every home is different, so agree the list of tasks with the helper before they start.",
      },
      {
        question: "Can I hire a maid for just a few hours a day?",
        answer:
          "Yes. Part-time help can be hired for 2 to 12 hours a day — choose the hours when you search, then agree the exact time slot with the helper.",
      },
      {
        question: "Who decides the maid's salary?",
        answer:
          "You and the helper agree the salary directly. MeeHelp doesn't take a placement fee — you choose a plan for the number of helper contacts you need.",
      },
      {
        question: "Can I try a maid before hiring?",
        answer:
          "Yes, if you agree it with the helper. The app doesn't arrange trials: once you've spoken to a helper, agree a trial day with them directly and agree what you'll pay for it.",
      },
      {
        question: "What if it doesn't work out?",
        answer:
          "You can end the arrangement and speak to other helpers. MeeHelp doesn't place helpers with you, so you stay in control of who you hire.",
      },
    ],
    seo: {
      title: "Maid Near You – Find & Hire House Help | MeeHelp",
      description:
        "Find a maid or house help near you for cleaning, dishes and laundry. Review profiles, contact helpers directly and agree the salary yourself on MeeHelp.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-17",
  },
  {
    slug: "cook",
    name: "Cook",
    shortName: "Cook",
    icon: "cook",
    roleWithArticle: "a cook",
    summary: "Find a home cook who cooks the way your family likes, and hire them directly.",
    models: { ...confirmedBothModels },
    headline: "Find a home cook near you",
    description: [
      "Hire a cook for the meals your family eats every day — part-time for one or two meals, or a full-time cook who lives in. On MeeHelp you tell the app how many people the cook will be cooking for, see cooks near your address and contact the ones you want to speak to.",
      "Profiles don't list food preferences, so talk to each cook about the food you eat, your rules in the kitchen and the meal times you need, and agree the salary with them directly.",
    ],
    customerProblems: [
      "You want healthy home food instead of ordering in.",
      "Your family has specific needs — Jain, vegetarian, low-oil or diabetic-friendly meals.",
      "Your previous cook left and mealtimes have become a daily struggle.",
      "Elderly parents or young children need fresh meals at set times.",
    ],
    tasksIncluded: [
      "Planning the day's menu with you",
      "Cutting, preparing and cooking breakfast, lunch or dinner",
      "Cooking to your family's taste, spice level and dietary needs",
      "Packing tiffins and lunch boxes",
      "Cleaning the cooking area and the utensils they use",
      "Storing leftovers properly",
    ],
    tasksExcluded: [
      "Grocery shopping, unless agreed in advance",
      "General house cleaning or a full kitchen deep clean",
      "Cooking for large parties or events, unless agreed in advance",
      "Looking after children or patients",
    ],
    arrangements: ["part-time", "full-time"],
    safeguards: [
      "Share any allergies and strict dietary rules (for example, no onion or garlic) in writing on the first day.",
    ],
    faqs: [
      {
        question: "Can I hire a cook for just one meal a day?",
        answer:
          "Yes. Many households hire a cook for one or two meals a day. Tell the cook which meals you need and what time you would like the food ready.",
      },
      {
        question: "Can I find a cook for vegetarian-only or Jain food?",
        answer:
          "Profiles don't show food preferences, so ask about it on your first call. Explain your rules — such as Jain food or no onion and garlic — and ask for a trial meal before you decide.",
      },
      {
        question: "How is a cook's salary decided?",
        answer:
          "You agree it directly with the cook, usually based on the number of people and meals and the type of food. MeeHelp doesn't take a placement fee.",
      },
      {
        question: "Does the cook buy groceries?",
        answer:
          "Usually you provide the ingredients and the cook prepares the meals. If you would like the cook to shop for you, agree this, and how money will be handled, in advance.",
      },
      {
        question: "How do I know a cook will suit my family's taste?",
        answer:
          "Agree a trial meal with the cook before you decide, and give honest feedback on spice, salt and oil in the first week.",
      },
    ],
    seo: {
      title: "Cook Near You – Find & Hire a Home Cook | MeeHelp",
      description:
        "Hire a home cook near you for daily meals and tiffins, part-time or live-in. Contact cooks directly, agree a trial meal and the salary yourself on MeeHelp.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-17",
  },
  {
    slug: "babysitter-nanny",
    name: "Babysitter / Nanny",
    shortName: "Nanny",
    icon: "nanny",
    roleWithArticle: "a babysitter or nanny",
    summary: "Find a babysitter or nanny, speak to them and meet them before you decide.",
    models: { ...confirmedBothModels },
    headline: "Find a babysitter or nanny near you",
    description: [
      "Leaving your child with someone new is a big decision. On MeeHelp you review profiles of babysitters and nannies near you, contact the ones you like, and take your time to speak to them and meet them before you decide.",
      "Hire part-time for the hours you work, or a full-time nanny who lives in. You agree the schedule, the responsibilities and the salary directly with them.",
    ],
    customerProblems: [
      "You are going back to work and need dependable care at home.",
      "You work from home but need someone to look after your child during the day.",
      "Grandparents help out, but need support on some days.",
      "You need an extra pair of hands with a newborn or a toddler.",
    ],
    tasksIncluded: [
      "Bathing, dressing, diaper changes and keeping your baby clean",
      "Bottles, formula and feeding at the times you set",
      "Keeping to the nap and bedtime routine you set",
      "Age-appropriate play, reading and outings you approve",
      "Keeping the nursery and play area tidy",
    ],
    tasksExcluded: [
      "Medical care or advice — always ask your paediatrician",
      "Giving medicines without your clear written instructions",
      "Housework for the whole family, unless agreed in advance",
      "Driving your child, unless agreed and the person holds a valid licence",
    ],
    arrangements: ["part-time", "full-time"],
    safeguards: [
      "Spend the first few days at home while the nanny settles in, so you can see how they and your child get along.",
      "Write down your child's routine, allergies, emergency contacts and your doctor's number, and keep it where the nanny can see it.",
    ],
    faqs: [
      {
        question: "What is the difference between a babysitter and a nanny?",
        answer:
          "A babysitter usually looks after a child for some hours on certain days. A nanny works a regular schedule and becomes part of the child's daily routine.",
      },
      {
        question: "Can a nanny look after my child for the whole day?",
        answer:
          "Yes. Discuss the hours you need with the nanny, and agree meal breaks and a weekly off before they start.",
      },
      {
        question: "How should I choose a nanny for my baby?",
        answer:
          "Speak to a few nannies, meet them in person and watch how they interact with your child. Ask about their experience with children of the same age, and plan a trial while you are at home.",
      },
      {
        question: "Can a nanny help with a newborn?",
        answer:
          "Yes — bathing, diaper changes, bottles and formula, warming expressed milk and keeping to the sleep routine you set are all part of baby care. Ask each nanny about their experience with infants, and take medical questions to your paediatrician.",
      },
    ],
    seo: {
      title: "Babysitter & Nanny Near You – Find and Hire | MeeHelp",
      description:
        "Find a babysitter or nanny near you. Review profiles, contact nannies directly, meet them and hire the right person for your child with MeeHelp.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-17",
  },
  {
    slug: "elder-care",
    name: "Elder Care",
    shortName: "Elder care",
    icon: "elder",
    roleWithArticle: "an elder care attendant",
    summary: "Find a care attendant for an older parent: daily living, moving around, routine and company.",
    models: { ...confirmedBothModels },
    headline: "Elder care at home for your parents",
    description: [
      "Many older people want to stay in their own homes but need a hand with bathing and dressing, moving around safely, meals and their daily routine — and someone to talk to. On MeeHelp you find a care attendant near you, contact them directly and agree the hours, the tasks and the salary yourself.",
      "In the app, elder care and patient care attendants come from the same pool of care helpers. What makes it elder care is what your parent needs, so describe their routine, health and mobility when you speak to each attendant.",
    ],
    customerProblems: [
      "Your parents live alone and need someone with them during the day.",
      "A parent needs help getting up, bathing or walking safely.",
      "You live in another city and want a steady person at home with them.",
      "You have been the main carer for a parent and need regular help.",
    ],
    tasksIncluded: [
      "Help with bathing, grooming, dressing and toileting",
      "Support when walking and moving from bed to wheelchair",
      "Preparing meals and help at mealtimes",
      "Light housekeeping around the senior and changing bed linen",
      "Company, reading together, short walks and going along to appointments",
    ],
    tasksExcluded: [
      "Injections, insulin, IV lines or any other invasive procedure",
      "Wound dressing, bed-sore or catheter care",
      "Diagnosing illness or changing medicines",
      "Handling money or bank work",
    ],
    arrangements: ["part-time", "full-time"],
    safeguards: [
      "Write down your parent's routine, medicines, mobility needs and emergency contacts, and go through them with the attendant on the first day.",
    ],
    faqs: [
      {
        question: "Is elder care a separate category from patient care in the app?",
        answer:
          "No. Both are served by the same pool of care attendants. The difference is your parent's needs — explain them when you call, so you choose someone whose experience fits.",
      },
      {
        question: "What does an elder care attendant do?",
        answer:
          "Help with personal care, moving around safely, meals and the daily routine, light housekeeping around your parent, errands, and company — reading, conversation, short walks and going along to appointments.",
      },
      {
        question: "Can the attendant check my parent's blood pressure or sugar?",
        answer:
          "Only where the assigned caregiver is trained to, and as monitoring that they report to you — not diagnosis. Ask about it before you hire, and follow your doctor's advice.",
      },
      {
        question: "Is an elder care attendant a nurse?",
        answer:
          "No. Attendants give daily-living support. Injections, IV lines and other medical procedures are not part of the service — ask your parent's doctor about a qualified nurse for those.",
      },
    ],
    seo: {
      title: "Elder Care at Home – Find a Care Attendant | MeeHelp",
      description:
        "Find a care attendant for an older parent at home: help with bathing, moving around, meals, routine and company. Contact attendants directly on MeeHelp.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-18",
  },
  {
    slug: "patient-care",
    name: "Patient Care",
    shortName: "Patient care",
    icon: "patient",
    roleWithArticle: "a patient care attendant",
    summary: "Find an attendant for someone unwell, recovering or bedridden at home.",
    models: { ...confirmedBothModels },
    headline: "Patient care attendants at home",
    description: [
      "When someone at home is unwell, recovering from surgery or bedridden, they may need an attendant by their side for most of the day — or night. On MeeHelp you see care attendants near your address, contact them directly and hire part-time or a full-time attendant who lives in.",
      "Patient care is attendant support, not nursing: personal care, moving and turning, food and water, reminders for prescribed oral medicines and, where the caregiver is trained, basic monitoring reported to the family.",
    ],
    customerProblems: [
      "A family member has come home from hospital and needs help through the day.",
      "Someone at home is bedridden and needs turning, washing and changing.",
      "A patient needs help to move safely while they recover.",
      "Family members can't be at home through the day or night.",
    ],
    tasksIncluded: [
      "Sponge baths, grooming, dressing, adult diapers and bedpans",
      "Moving from bed to wheelchair, supported walking and repositioning",
      "Help with eating and drinking enough",
      "Reminders for prescribed oral medicines",
      "Keeping the patient's area, linen and washroom clean",
    ],
    tasksExcluded: [
      "Injections, IV drips and other invasive medical procedures",
      "Medical advice, diagnosis or changing prescriptions",
      "Housework for the whole family, unless agreed in advance",
      "Emergency medical response — in an emergency, call 108 or your doctor",
    ],
    arrangements: ["part-time", "full-time"],
    safeguards: [
      "Keep the doctor's instructions, discharge summary and medicine schedule where the attendant can see them.",
    ],
    faqs: [
      {
        question: "What is the difference between a patient attendant and a nurse?",
        answer:
          "An attendant helps with personal care, moving, food and medicine reminders. Injections, IV drips and other medical procedures need a qualified nurse and are not part of patient care on MeeHelp.",
      },
      {
        question: "Can an attendant look after a bedridden patient?",
        answer:
          "Yes — turning and repositioning, sponge baths, adult diapers and bedpans are part of patient care. Describe the patient's condition and any equipment at home, such as a hospital bed or wheelchair, when you speak to attendants.",
      },
      {
        question: "Can the attendant monitor temperature or blood pressure?",
        answer:
          "Where the assigned caregiver is trained to, they can take readings and tell you or the doctor. They do not diagnose or change treatment.",
      },
      {
        question: "Is patient care the same as elder care?",
        answer:
          "They overlap, and the same care attendants do both. Patient care is for someone who is ill, recovering or bedridden, at any age; elder care is daily-living support and company for an older person.",
      },
    ],
    seo: {
      title: "Patient Care at Home – Find a Patient Attendant | MeeHelp",
      description:
        "Find a patient care attendant for someone unwell, recovering or bedridden: personal care, moving, meals and medicine reminders. Hire directly on MeeHelp.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-18",
  },
];

/** Each category with its marketplace content, its separate on-demand content and its city-page frames. */
export const services: Service[] = marketplaceContent.map((s) => ({
  ...s,
  onDemand: onDemandContent[s.slug],
  cityPage: cityFrames[s.slug],
}));

export const serviceSlugs = services.map((s) => s.slug) as ServiceSlug[];
