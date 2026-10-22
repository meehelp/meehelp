import type { OnDemandContent, ServiceSlug } from "@/lib/content/types";

/**
 * ON-DEMAND proposition per category: book help in the MeeHelp app for a
 * set number of hours. Confirmed by the business for all five categories in
 * all eight cities.
 *
 * Phase 4.5: copy follows how the app implements booking today
 * (src/data/evidence.ts):
 *   - one-time cleaning visits (maid) can be booked now or scheduled — they
 *     have their own page, /one-time-cleaning/ (src/data/products.ts);
 *   - hourly bookings — cleaning, cooking, baby care, elder care, patient care — are
 *     scheduled at least 2 hours ahead (`bookNow: false`), so this copy never
 *     promises instant help for them.
 * App mechanics (durations, windows) are stated only in src/data/product-facts.ts.
 * Prices, cancellation terms and arrival times are not stated: not confirmed.
 *
 * This copy must never describe contact plans, contacting/negotiating with
 * helpers or hiring — that is the marketplace proposition.
 */
export const onDemandContent: Record<ServiceSlug, OnDemandContent> = {
  maid: {
    slug: "hourly-maid",
    bookingNoun: "an hourly maid",
    // One-time cleaning (the only instant flow) has its own page: /one-time-cleaning/.
    bookNow: false,
    name: "Hourly Maid",
    shortName: "Hourly maid",
    headline: "Book a maid for a few hours of help at home",
    description: [
      "Book household help for a few hours when the work needs more time. Choose 2 to 12 hours in the MeeHelp app for eligible household tasks, subject to helper availability near your address.",
      "Each booking is one visit with no monthly commitment. Book again whenever the house needs it.",
    ],
    useCases: [
      "The kitchen chimney, fans or windows haven't been cleaned in months.",
      "You're moving in or out and the flat needs a longer clean.",
      "The balconies and the fridge need a thorough clean before guests arrive.",
      "A big household job needs more time than a short cleaning visit.",
    ],
    tasksIncluded: [
      "Deep cleaning fans, windows and balconies",
      "Cleaning the kitchen chimney or the fridge",
      "Sweeping and mopping floors",
      "Dusting furniture and surfaces",
      "Cleaning bathrooms and toilets",
    ],
    tasksExcluded: [
      "Bringing cleaning machines or materials — keep your own supplies ready",
      "Cooking — book an hourly cook instead",
      "Pest control, painting or appliance repair",
      "Cleaning outside windows or anything at height without safe access",
    ],
    safeguards: [
      "Show the helper which rooms and tasks come first, and which products to use on which surfaces.",
    ],
    faqs: [
      {
        question: "How many hours can I book a maid for?",
        answer: "You can book 2 to 12 hours, in 2-hour steps. Later start times allow shorter bookings only.",
      },
      {
        question: "How far ahead do I need to book?",
        answer: "Hourly bookings are scheduled at least 2 hours ahead, and up to 5 days ahead, for a start time between 7 AM and 8 PM. Whether someone can come depends on which helpers are free near your address.",
      },
      {
        question: "Do I need to give the helper supplies?",
        answer: "Yes. Helpers don't bring cleaning machines or materials, so keep a mop, bucket, brushes and cleaning liquids ready.",
      },
      {
        question: "Should I book hourly help or a one-time clean?",
        answer: "Hourly help suits bigger jobs that need more time, such as fans, windows, balconies, the chimney or the fridge. For everyday cleaning such as floors, bathrooms, dishes, dusting and laundry, a shorter one-time cleaning visit may be enough.",
      },
      {
        question: "How is this different from hiring a regular maid?",
        answer: "An hourly booking is one visit, booked and confirmed in the app. If you want the same person every day, a regular part-time maid may suit you better.",
      },
    ],
    alternative: {
      heading: "Only need one cleaning visit?",
      body: "For regular household cleaning such as floors, bathrooms, dishes, dusting and laundry, you can book a shorter one-time cleaning visit instead.",
      href: "/one-time-cleaning/",
      label: "Book a one-time clean",
    },
    seo: {
      title: "Hourly Maid Service – Book Help by the Hour | MeeHelp",
      description:
        "Book a maid by the hour through MeeHelp for larger cleaning and household jobs. Choose 2 to 12 hours in the app, subject to helper availability near you.",
    },
    publishStatus: "published",
    updatedAt: "2026-10-22",
  },
  cook: {
    slug: "hourly-cook",
    bookingNoun: "a cook by the hour",
    bookNow: false,
    name: "Hourly Cook",
    shortName: "Hourly cook",
    headline: "Book a cook by the hour",
    description: [
      "Book a cook through the MeeHelp app for a few hours: for guests, a family get-together or a week when you can't manage the kitchen. Tell the app how many people you're cooking for and choose the hours.",
      "Decide the menu before the visit and keep the ingredients ready. The cook prepares the food in your kitchen.",
    ],
    useCases: [
      "Guests are coming over and you'd rather serve home-cooked food.",
      "Your regular cook is away for a few days.",
      "You want a few days of meals prepared in one go.",
      "Someone at home is unwell and needs simple, fresh meals.",
    ],
    tasksIncluded: [
      "Cooking the dishes you choose",
      "Preparation such as chopping, grinding and kneading dough",
      "Packing tiffins and storing cooked food properly",
      "Cleaning the cooking area and the utensils used",
    ],
    tasksExcluded: [
      "Buying groceries",
      "Catering for large events",
      "General house cleaning — book an hourly maid instead",
      "Looking after children or patients",
    ],
    safeguards: [
      "Write down any allergies and food rules (for example, no onion or garlic) before the cook starts.",
    ],
    faqs: [
      {
        question: "How far ahead do I need to book a cook?",
        answer: "Hourly bookings are scheduled at least 2 hours ahead, and up to 5 days ahead. Book early if you're expecting guests.",
      },
      {
        question: "How many hours should I book?",
        answer: "Bookings run in 2-hour steps. A simple family meal fits a short booking; several dishes for guests, or a few days of meal prep, needs longer.",
      },
      {
        question: "Do I need to have the ingredients ready?",
        answer: "Yes. Keep the ingredients and utensils ready before the cook arrives, and share the menu when the booking starts.",
      },
      {
        question: "Can I book the same cook every day?",
        answer: "Hourly bookings are one-off visits. For daily cooking, a regular cook is usually the better fit.",
      },
    ],
    seo: {
      title: "Hourly Cook – Book a Cook for Guests or Meal Prep | MeeHelp",
      description:
        "Book a cook by the hour in the MeeHelp app for guests, family meals or a few days of meal prep, cooked in your own kitchen. Schedule up to 5 days ahead.",
    },
    publishStatus: "published",
    updatedAt: "2026-10-17",
  },
  "babysitter-nanny": {
    slug: "hourly-babysitter",
    bookingNoun: "a babysitter by the hour",
    bookNow: false,
    name: "Hourly Babysitter",
    shortName: "Hourly babysitter",
    headline: "Book a babysitter by the hour",
    description: [
      "Book baby care through the MeeHelp app for a set number of hours: an evening out, a long work call, or an afternoon of errands you can't take your child on.",
      "Bookings are scheduled ahead, which gives you time to write down your child's routine, allergies and emergency contacts before the babysitter arrives.",
    ],
    useCases: [
      "An evening out or a family function.",
      "A few hours of meetings while you work from home.",
      "Appointments or errands you can't take your child to.",
      "Your regular nanny or the grandparents are away for the day.",
    ],
    tasksIncluded: [
      "Diaper changes, bathing and dressing, as you'd like them done",
      "Bottles, formula or expressed milk, and feeds at the times you set",
      "Keeping to the nap and bedtime routine you set",
      "Play, reading and singing suited to your child's age",
      "Tidying the play area and cleaning toys afterwards",
    ],
    tasksExcluded: [
      "Medical care or advice — always ask your paediatrician",
      "Giving medicines without your clear written instructions",
      "Taking your child out of the home, unless you've agreed it",
      "Driving your child anywhere",
      "Housework for the family",
    ],
    safeguards: [
      "If this babysitter hasn't looked after your child before, stay at home for the first part of the booking.",
      "Leave your child's routine, allergies, emergency contacts and your doctor's number in writing.",
    ],
    faqs: [
      {
        question: "How far ahead do I need to book a babysitter?",
        answer: "Hourly bookings are scheduled at least 2 hours ahead and up to 5 days ahead, for a start time between 7 AM and 8 PM.",
      },
      {
        question: "Can I stay at home during the booking?",
        answer: "Yes, and it's a good idea the first time, so you can see how the babysitter and your child get along.",
      },
      {
        question: "Can I ask for a female babysitter?",
        answer: "You can choose a gender preference when you book. If a helper of that gender is available they are assigned; otherwise the first available helper comes.",
      },
      {
        question: "Is an hourly babysitter the same as a nanny?",
        answer: "No. An hourly booking covers one occasion. A nanny works a regular schedule and becomes part of your child's routine.",
      },
    ],
    seo: {
      title: "Hourly Babysitter – Book Baby Care by the Hour | MeeHelp",
      description:
        "Book a babysitter by the hour in the MeeHelp app for an evening out, a work call or errands. Schedule 2 hours to 5 days ahead and leave your child's routine.",
    },
    publishStatus: "published",
    updatedAt: "2026-10-17",
  },
  "elder-care": {
    slug: "hourly-elder-care",
    bookingNoun: "hourly elder care",
    bookNow: false,
    name: "Hourly Elder Care",
    shortName: "Hourly elder care",
    headline: "Hourly elder care for an older parent at home",
    description: [
      "Book an elder care attendant through the MeeHelp app for the hours you can't be there: a day at the office, a trip out of town, or an afternoon when your parent shouldn't be alone.",
      "Elder care is for an older person who is managing day to day but needs company, a steady hand and someone to keep to their routine. If they are ill or recovering, book patient care instead.",
    ],
    useCases: [
      "You'll be out all day and don't want your parent home alone.",
      "Your parent has a routine check-up and needs someone to go along.",
      "Their usual carer, or the family member who helps, needs a day off.",
      "They like company in the afternoons and the house is empty.",
    ],
    tasksIncluded: [
      "Company and conversation through the day",
      "A steady arm when walking, and help getting up or into a wheelchair",
      "Help with bathing, dressing and the toilet if needed",
      "Meals and tea at the usual times",
      "Going along on a walk, to the temple or to a routine appointment",
    ],
    tasksExcluded: [
      "Injections, insulin, IV lines or any other invasive procedure",
      "Wound dressing, bed-sore or catheter care",
      "Diagnosing illness or changing medicines",
      "Handling money or bank work",
      "Housework for the whole household",
    ],
    safeguards: [
      "Write down your parent's routine, medicines, mobility needs and emergency contacts for the attendant.",
    ],
    faqs: [
      {
        question: "What's the difference between elder care and patient care?",
        answer: "They are separate tasks when you book, though the needs can overlap. Elder care is daily-living help, routine and company for an older person. Patient care is attendant support for someone who is ill, recovering or bedridden, at any age.",
      },
      {
        question: "Can the attendant take my parent to the doctor?",
        answer: "Yes, for a routine appointment. Book enough hours to cover the journey and the wait, and agree beforehand how travel will be paid.",
      },
      {
        question: "Is this medical care?",
        answer: "No. An elder care attendant gives non-medical support. For injections, wound care or other medical needs, ask your parent's doctor about a qualified nurse.",
      },
      {
        question: "What if my parent needs someone every day?",
        answer: "Hourly bookings suit occasional days. For daily help, a regular arrangement with one person may suit your parent better.",
      },
    ],
    seo: {
      title: "Hourly Elder Care – An Attendant for Your Parent | MeeHelp",
      description:
        "Book hourly elder care in the MeeHelp app: company, a steady arm and help with the daily routine for an older parent while you're out. Non-medical support.",
    },
    publishStatus: "published",
    updatedAt: "2026-10-17",
  },
  "patient-care": {
    slug: "hourly-patient-care",
    bookingNoun: "hourly patient care",
    bookNow: false,
    name: "Hourly Patient Care",
    shortName: "Hourly patient care",
    headline: "Hourly patient care during recovery at home",
    description: [
      "Book a patient care attendant through the MeeHelp app for the hours a family member who is unwell, recovering or bedridden needs hands-on personal care: washing, changing, turning and help to sit up or move.",
      "Patient care is about the patient's condition, not their age. It is non-medical: attendants follow the doctor's instructions you give them, and anything clinical stays with a qualified nurse.",
    ],
    useCases: [
      "A family member is coming home from hospital and the first days are hard to manage.",
      "The patient needs washing, changing or turning at set times.",
      "The family member doing the caring needs a few hours off.",
      "The patient's regular attendant is on leave.",
    ],
    tasksIncluded: [
      "Helping the patient sit up, turn in bed and move safely",
      "Sponge baths, adult diapers and bedpans",
      "Help with eating, and with drinking enough",
      "Reminders for prescribed oral medicines — tablets, syrups, inhalers",
      "Keeping the bed, linen and immediate area clean",
    ],
    tasksExcluded: [
      "Injections, IV drips and other invasive procedures — these need a qualified nurse",
      "Medical advice, diagnosis or changing prescriptions",
      "Emergency response — in an emergency, call 108 or your doctor",
      "Housework for the family",
    ],
    safeguards: [
      "Keep the discharge summary, the doctor's instructions and the medicine schedule where the attendant can see them.",
    ],
    faqs: [
      {
        question: "Can I book an attendant for the day of a hospital discharge?",
        answer: "Yes. Schedule the booking for when the patient is due home — at least 2 hours ahead — and share the discharge instructions with the attendant.",
      },
      {
        question: "Is this nursing care?",
        answer: "No. Attendants give non-medical personal care. Injections, IV lines and wound care need a qualified nurse.",
      },
      {
        question: "How is patient care different from elder care?",
        answer: "Patient care is attendant support for someone who is ill, recovering or bedridden. Elder care is daily-living help and company for an older person. The needs overlap, so describe the person's condition when you book.",
      },
      {
        question: "What should I tell the attendant?",
        answer: "The patient's condition, how much they can move, the medicine schedule, warning signs to watch for and who to call in an emergency.",
      },
    ],
    seo: {
      title: "Hourly Patient Care – Personal Care at Home | MeeHelp",
      description:
        "Book a patient care attendant by the hour in the MeeHelp app for washing, changing and moving a patient who is unwell or recovering. Non-medical care.",
    },
    publishStatus: "published",
    updatedAt: "2026-10-17",
  },
};
