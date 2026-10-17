import type { ModelSupport, Service, ServiceSlug } from "@/lib/content/types";
import { cityFrames } from "./city-frames";
import { onDemandContent } from "./on-demand";

/**
 * Helper categories. Each hub page (/maid/ etc.) is a MARKETPLACE page:
 * the customer finds helpers, contacts them directly and hires them directly.
 * Copy must not describe on-demand booking (see data/business-models.ts).
 *
 * `models`: CONFIRMED in the Phase 4 brief (2026-10-17) — every category
 * supports both the marketplace and on-demand models, with instant,
 * scheduled and hourly booking.
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
  instantBooking: true,
  scheduledBooking: true,
  hourlyBooking: true,
};

/** Marketplace (find & hire directly) content per category. */
const marketplaceContent: Omit<Service, "onDemand" | "cityPage">[] = [
  {
    slug: "maid",
    name: "Maid / House Help",
    shortName: "Maid",
    icon: "maid",
    roleWithArticle: "a maid",
    summary: "Find house help for daily cleaning, dishes and laundry, and hire them directly.",
    models: { ...confirmedBothModels },
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
      "Supervising and playing with your child",
      "Feeding your child and preparing simple meals for them",
      "Bathing, dressing and changing diapers",
      "Following the nap and meal routine you set",
      "Walking your child to the park, school bus or nearby classes",
      "Keeping your child's room, toys and clothes tidy",
    ],
    tasksExcluded: [
      "Giving medicines without your clear written instructions",
      "Housework for the whole family, unless agreed in advance",
      "Driving your child, unless agreed and the person holds a valid licence",
      "Staying alone with your child before you have met them in person",
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
          "Some nannies have experience with infants — ask about it directly when you speak to them. For medical questions about your newborn, always speak to your paediatrician.",
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
    summary: "Find an attendant for company, mobility help and daily routines at home.",
    models: { ...confirmedBothModels },
    headline: "Elder care at home for your parents",
    description: [
      "Many older people want to stay in their own homes, but need someone around for company, a steady hand and their daily routine. On MeeHelp you can look for an attendant near you, contact them directly and choose who to hire.",
      "This is non-medical, day-to-day support. If your parent needs nursing or medical care, speak to their doctor about qualified nursing help.",
    ],
    customerProblems: [
      "Your parents live alone and you worry about them during the day.",
      "You live in another city and want someone dependable with them at home.",
      "An elderly family member needs help walking, bathing or getting dressed.",
      "You have been caring for a parent full-time and need a break.",
    ],
    tasksIncluded: [
      "Companionship and conversation",
      "Help with walking and moving around the home safely",
      "Help with bathing, grooming and dressing",
      "Preparing simple meals and helping at mealtimes",
      "Reminding them to take medicines at the right time",
      "Going with them on walks, errands or visits to the doctor",
    ],
    tasksExcluded: [
      "Medical procedures such as injections, IV drips or wound dressing — these need a qualified nurse",
      "Diagnosing illness or changing medicines",
      "Housework for the whole household, unless agreed in advance",
      "Handling money or bank transactions",
    ],
    arrangements: ["part-time", "full-time"],
    safeguards: [
      "Set up a daily check-in call with the attendant and your parent, especially if you live in another city.",
    ],
    faqs: [
      {
        question: "What does an elder care attendant do?",
        answer:
          "An attendant helps with everyday life: company, moving around safely, bathing and dressing, meals, medicine reminders and going out with your parent. Medical treatment isn't part of their role.",
      },
      {
        question: "Is an elder care attendant the same as a nurse?",
        answer:
          "No. A nurse is trained to carry out medical procedures. An attendant gives non-medical, day-to-day support. If your parent needs both, speak to their doctor about nursing care alongside an attendant.",
      },
      {
        question: "How can I keep track of my parent's care from another city?",
        answer:
          "Agree a daily check-in call, ask a neighbour or relative to drop in from time to time, and keep a written routine and list of emergency contacts at home.",
      },
      {
        question: "What should I discuss with an attendant before hiring?",
        answer:
          "Share your parent's health conditions, medicine schedule, mobility needs, diet and daily routine, and agree the hours and salary directly. A trial helps you see whether they are the right fit.",
      },
    ],
    seo: {
      title: "Elder Care at Home – Find an Attendant | MeeHelp",
      description:
        "Find an elder care attendant for your parents at home — company, mobility help, personal care and medicine reminders. Contact attendants directly on MeeHelp.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-17",
  },
  {
    slug: "patient-care",
    name: "Patient Care",
    shortName: "Patient care",
    icon: "patient",
    roleWithArticle: "a patient care attendant",
    summary: "Find a non-medical attendant for recovery at home or for bedridden patients.",
    models: { ...confirmedBothModels },
    headline: "Patient care attendants at home",
    description: [
      "Recovering at home after a hospital stay, surgery or illness often means needing someone by your side through the day — or night. On MeeHelp you see attendants near your address, contact them directly and hire part-time or a full-time attendant who lives in.",
      "An attendant helps with personal care, moving around and daily routines, following your doctor's advice. Medical procedures should always be done by a qualified nurse.",
    ],
    customerProblems: [
      "A family member has just come home from hospital and needs help.",
      "Someone at home is bedridden or has limited mobility.",
      "A patient needs support while they recover from surgery.",
      "Family members can't be at home through the day.",
    ],
    tasksIncluded: [
      "Helping the patient sit up, turn in bed, move and walk safely",
      "Bathing, sponge baths, toileting and diaper changes",
      "Feeding and helping at mealtimes",
      "Medicine reminders as per the doctor's schedule",
      "Keeping the patient's room and bed clean",
      "Noticing changes in the patient's condition and telling the family",
    ],
    tasksExcluded: [
      "Injections, IV lines, catheter or wound care — these need a qualified nurse",
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
          "A patient attendant helps with personal care, mobility, meals and routines. A nurse is qualified to give injections, manage IV lines and dress wounds. Many families use an attendant for daily care and a nurse for scheduled medical visits.",
      },
      {
        question: "Can I find an attendant for a bedridden patient?",
        answer:
          "Yes. When you speak to attendants, describe the patient's condition, how much they can move and any equipment at home — such as a hospital bed or wheelchair — so you can choose someone with relevant experience.",
      },
      {
        question: "Can an attendant work long shifts?",
        answer:
          "Discuss the hours you need with the attendant. For long shifts, agree rest breaks, meals and a place for the attendant to rest before they start.",
      },
      {
        question: "Is patient care the same as elder care?",
        answer:
          "No. Patient care is hands-on personal care for someone who is unwell, recovering or bedridden, at any age. Elder care is company and routine support for an older person who is managing day to day.",
      },
    ],
    seo: {
      title: "Patient Care at Home – Find a Patient Attendant | MeeHelp",
      description:
        "Find a patient care attendant for recovery after hospital, or for bedridden and limited-mobility patients. Contact attendants directly and hire on MeeHelp.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-17",
  },
];

/** Each category with its marketplace content, its separate on-demand content and its city-page frames. */
export const services: Service[] = marketplaceContent.map((s) => ({
  ...s,
  onDemand: onDemandContent[s.slug],
  cityPage: cityFrames[s.slug],
}));

export const serviceSlugs = services.map((s) => s.slug) as ServiceSlug[];
