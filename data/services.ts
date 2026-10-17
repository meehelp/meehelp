import type { Service, ServiceSlug } from "@/lib/content/types";

/**
 * Service hub content. Copy is written to answer real customer questions and
 * makes no verification, pricing or coverage claims. Review with the business
 * before launch (see docs/CONTENT-REVIEW.md).
 */
export const services: Service[] = [
  {
    slug: "maid",
    name: "Maid / House Help",
    shortName: "Maid",
    icon: "maid",
    roleWithArticle: "a maid",
    summary: "Daily cleaning, dishes and laundry — one-off, part-time or full-time.",
    headline: "Find a maid or house help near you",
    description: [
      "Whether you need someone for daily sweeping and mopping, help with dishes and laundry, or a one-off deep clean, MeeHelp helps you find house help that fits your home and your routine.",
      "You decide the tasks and the hours. The app shows you helpers who work in your area, so you can speak to them and agree the arrangement before any work starts.",
    ],
    customerProblems: [
      "Your regular maid has left and you need someone quickly.",
      "You both work long hours and the housework keeps piling up.",
      "You want one dependable routine instead of calling different people every week.",
      "Guests are arriving, or you are moving in or out, and the home needs a thorough clean.",
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
      "Cooking meals — book a cook, or agree this separately",
      "Looking after children, elderly or unwell family members",
      "Specialist work such as pest control, painting or appliance repair",
      "Cleaning exterior windows or anything at height without safe access",
    ],
    engagementTypes: ["on-demand", "part-time", "full-time"],
    safeguards: [
      "Walk the helper through each room on the first day and show them which products to use on which surfaces.",
    ],
    faqs: [
      {
        question: "What does a maid usually do in a home?",
        answer:
          "Most house help covers daily cleaning: sweeping, mopping, dusting, dishes, bathrooms and laundry. Every home is different, so list the tasks you need when you post your requirement and confirm them with the helper before they start.",
      },
      {
        question: "Can I hire a maid for just a few hours a day?",
        answer:
          "Yes. Many households hire house help for a fixed number of hours each morning or evening, or only on certain days of the week. Choose the hours that suit you when you tell us what you need in the app.",
      },
      {
        question: "How are a maid's charges worked out?",
        answer:
          "Charges usually depend on the hours, the tasks, the size of your home and the number of people living there. The app shows the charges for your requirement before you confirm anything.",
      },
      {
        question: "Can the same person clean and cook?",
        answer:
          "Some helpers do both. If you want one person for cleaning and cooking, say so in your requirement and check the helper is comfortable with both before agreeing.",
      },
      {
        question: "Should I check a maid's ID?",
        answer:
          "Yes. Ask to see a government-issued photo ID and keep a copy with their consent. Many housing societies and local police stations also ask households to register domestic staff, so check what your building requires.",
      },
    ],
    seo: {
      title: "Maid Service Near You – Find House Help | MeeHelp",
      description:
        "Find a maid or house help near you for cleaning, dishes and laundry. Choose one-off, part-time or full-time help and connect through the MeeHelp app.",
    },
    publishStatus: "published",
    updatedAt: "2026-10-17",
  },
  {
    slug: "cook",
    name: "Cook",
    shortName: "Cook",
    icon: "cook",
    roleWithArticle: "a cook",
    summary: "Home-cooked meals made to your family's taste, from one meal a day to all three.",
    headline: "Find a home cook near you",
    description: [
      "Home-cooked food every day, without spending your evenings in the kitchen. MeeHelp helps you find cooks who can prepare meals the way your family likes them — vegetarian or non-vegetarian, regional or everyday.",
      "Tell us how many people you cook for, which meals you need and your food preferences, then speak to cooks near you before you decide.",
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
    engagementTypes: ["part-time", "full-time"],
    safeguards: [
      "Share any allergies and strict dietary rules (for example, no onion or garlic) in writing on the first day.",
    ],
    faqs: [
      {
        question: "Can I hire a cook for just one meal a day?",
        answer:
          "Yes. Many households hire a cook for one or two meals a day. Mention which meals you need and what time you would like the food ready.",
      },
      {
        question: "Can I ask for vegetarian-only or Jain cooking?",
        answer:
          "Yes. Choose your food preference when you post your requirement, and discuss specific rules — such as Jain food or no onion and garlic — with the cook before they start.",
      },
      {
        question: "How are a cook's charges worked out?",
        answer:
          "Charges usually depend on the number of people, the number of meals per day and the type of food. The app shows the charges for your requirement before you confirm.",
      },
      {
        question: "Does the cook buy groceries?",
        answer:
          "Usually you provide the ingredients and the cook prepares the meals. If you would like the cook to shop for you, agree this, and how money will be handled, in advance.",
      },
      {
        question: "How do I know a cook will suit my family's taste?",
        answer:
          "Ask for a trial meal or a trial day before agreeing to a longer arrangement, and give honest feedback on spice, salt and oil in the first week.",
      },
    ],
    seo: {
      title: "Cook Near You – Hire a Home Cook | MeeHelp",
      description:
        "Hire a home cook near you for daily meals, tiffins and family cooking. Veg or non-veg, one meal or all three — find cooks through the MeeHelp app.",
    },
    publishStatus: "published",
    updatedAt: "2026-10-17",
  },
  {
    slug: "babysitter-nanny",
    name: "Babysitter / Nanny",
    shortName: "Nanny",
    icon: "nanny",
    roleWithArticle: "a babysitter or nanny",
    summary: "Babysitters and nannies for a few hours or the whole day, with time to meet them first.",
    headline: "Find a babysitter or nanny near you",
    description: [
      "Leaving your child with someone new is a big decision. MeeHelp helps you find babysitters and nannies near you, and gives you time to speak to them and meet them before you decide.",
      "Whether you need a few hours of help while you work from home or a nanny for the whole day, you set the schedule and the responsibilities.",
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
      "Staying alone with your child before you have met them and checked their ID",
    ],
    engagementTypes: ["part-time", "full-time"],
    safeguards: [
      "Spend the first few days at home while the nanny settles in, so you can see how they and your child get along.",
      "Write down your child's routine, allergies, emergency contacts and your doctor's number, and keep it where the nanny can see it.",
    ],
    faqs: [
      {
        question: "What is the difference between a babysitter and a nanny?",
        answer:
          "A babysitter usually looks after a child for a few hours or on occasional days. A nanny works a regular schedule and becomes part of the child's daily routine.",
      },
      {
        question: "Can a nanny look after my child for the whole day?",
        answer:
          "Yes. Tell us the hours you need when you post your requirement, and agree meal breaks and a weekly off with the nanny before they start.",
      },
      {
        question: "How should I choose a nanny for my baby?",
        answer:
          "Meet them in person and watch how they interact with your child. Ask about their experience with children of the same age, check their ID, and plan a few trial days while you are at home.",
      },
      {
        question: "Can a nanny help with a newborn?",
        answer:
          "Some nannies have experience with infants — ask about it directly. For medical questions about your newborn, always speak to your paediatrician.",
      },
    ],
    seo: {
      title: "Babysitter Near You – Find a Nanny for Your Child | MeeHelp",
      description:
        "Find a babysitter or nanny near you for full-day or part-time childcare at home. Speak to and meet nannies before you decide, through the MeeHelp app.",
    },
    publishStatus: "published",
    updatedAt: "2026-10-17",
  },
  {
    slug: "elder-care",
    name: "Elder Care",
    shortName: "Elder care",
    icon: "elder",
    roleWithArticle: "an elder care attendant",
    summary: "Company, mobility help and daily routines for parents and grandparents at home.",
    headline: "Elder care at home for your parents",
    description: [
      "Many older people want to stay in their own homes, but need someone around for daily routines, company and safety. MeeHelp helps families find elder care attendants who support parents and grandparents at home.",
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
    engagementTypes: ["part-time", "full-time"],
    safeguards: [
      "Set up a daily check-in call with the attendant and your parent, especially if you live in another city.",
    ],
    faqs: [
      {
        question: "What does an elder care attendant do?",
        answer:
          "An attendant helps with everyday life: company, moving around safely, bathing and dressing, meals, medicine reminders and going out with your parent. They do not provide medical treatment.",
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
        question: "What should I tell the attendant before they start?",
        answer:
          "Share your parent's health conditions, medicine schedule, mobility needs, diet, daily routine, and the contact details of family members and their doctor.",
      },
    ],
    seo: {
      title: "Elder Care at Home – Attendants for Seniors | MeeHelp",
      description:
        "Find elder care attendants for your parents at home — company, mobility support, personal care and medicine reminders. Connect through MeeHelp.",
    },
    publishStatus: "published",
    updatedAt: "2026-10-17",
  },
  {
    slug: "patient-care",
    name: "Patient Care",
    shortName: "Patient care",
    icon: "patient",
    roleWithArticle: "a patient care attendant",
    summary: "Non-medical attendants for recovery at home, bedridden and limited-mobility patients.",
    headline: "Patient care attendants at home",
    description: [
      "Recovering at home after a hospital stay, surgery or illness often means needing someone by your side through the day. MeeHelp helps you find patient care attendants for non-medical support at home.",
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
    engagementTypes: ["part-time", "full-time"],
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
          "Yes. Describe the patient's condition, how much they can move, and any equipment at home — such as a hospital bed or wheelchair — so you can find an attendant with relevant experience.",
      },
      {
        question: "Can an attendant work long shifts?",
        answer:
          "Tell us the hours you need when you post your requirement. For long shifts, agree rest breaks, meals and a place for the attendant to rest before they start.",
      },
      {
        question: "Is patient care the same as elder care?",
        answer:
          "They overlap. Patient care focuses on someone recovering from an illness, injury or surgery. Elder care is day-to-day support for an older person who may not be unwell.",
      },
    ],
    seo: {
      title: "Patient Care at Home – Patient Attendant Service | MeeHelp",
      description:
        "Find a patient care attendant at home for recovery after hospital, or for bedridden and limited-mobility patients. Non-medical support through MeeHelp.",
    },
    publishStatus: "published",
    updatedAt: "2026-10-17",
  },
];

export const serviceSlugs = services.map((s) => s.slug) as ServiceSlug[];
