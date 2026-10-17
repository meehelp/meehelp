import type { OnDemandContent, ServiceSlug } from "@/lib/content/types";

/**
 * ON-DEMAND proposition per category: book help by the hour in the app —
 * instantly or for a scheduled time. Confirmed in the Phase 4 brief for all
 * five categories in all eight cities.
 *
 * This copy must never describe contact plans, contacting/negotiating with
 * helpers or hiring — that is the marketplace proposition. No on-demand
 * prices, minimum durations or arrival times have been supplied, so none are
 * stated.
 */
export const onDemandContent: Record<ServiceSlug, OnDemandContent> = {
  maid: {
    slug: "hourly-maid",
    bookingNoun: "an hourly maid",
    name: "Hourly Maid",
    shortName: "Hourly maid",
    headline: "Book an hourly maid for cleaning at home",
    description: [
      "Need the floors mopped, the kitchen cleaned or the laundry done? Book a maid by the hour through the MeeHelp app — right away, or for a time that suits you.",
      "You choose the hours and the tasks for each visit. There is no long-term arrangement: book again whenever you need help.",
    ],
    useCases: [
      "Your regular maid is on leave and the housework is piling up.",
      "Guests are arriving and the home needs a thorough clean.",
      "You want a deep clean of the kitchen or bathrooms.",
      "You're moving in or out and need a few hours of cleaning.",
      "You need extra help before a festival or a family function.",
    ],
    tasksIncluded: [
      "Sweeping and mopping floors",
      "Dusting furniture and surfaces",
      "Washing dishes and cleaning kitchen counters",
      "Cleaning bathrooms and toilets",
      "Washing, drying and folding clothes",
      "Tidying rooms and making beds",
    ],
    tasksExcluded: [
      "Cooking — book an hourly cook instead",
      "Looking after children, elderly or unwell family members",
      "Specialist work such as pest control, painting or appliance repair",
      "Cleaning exterior windows or anything at height without safe access",
    ],
    safeguards: [
      "Show the helper the rooms and the tasks to do first, and the products to use on each surface.",
    ],
    faqs: [
      {
        question: "Can I book a maid for a few hours?",
        answer: "Yes. On-demand bookings are by the hour — choose the hours you need when you book in the MeeHelp app.",
      },
      {
        question: "Can I book a maid right now?",
        answer: "You can make an instant booking in the app. Whether someone can come straight away depends on who is free near you at that time, so you can also schedule a visit for later.",
      },
      {
        question: "Can I schedule a maid for a later date?",
        answer: "Yes. Choose a scheduled booking and pick the date and time that suits you.",
      },
      {
        question: "What is the difference between an hourly maid and a regular maid?",
        answer: "An hourly booking is a single visit you book in the app. If you want the same person to come every day, finding a maid for a regular arrangement may suit you better.",
      },
    ],
    seo: {
      title: "Hourly Maid – Book House Help by the Hour | MeeHelp",
      description:
        "Book an hourly maid through the MeeHelp app — instantly or for a scheduled time — for cleaning, dishes, laundry or a thorough clean before guests arrive.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-17",
  },
  cook: {
    slug: "hourly-cook",
    bookingNoun: "a cook by the hour",
    name: "Hourly Cook",
    shortName: "Hourly cook",
    headline: "Book a cook by the hour",
    description: [
      "Guests coming over, a family celebration, or a day when you just can't cook? Book a cook through the MeeHelp app for the hours you need — now or at a scheduled time.",
      "Decide the menu before the visit and keep the ingredients ready; the cook prepares the food in your kitchen.",
    ],
    useCases: [
      "Guests are coming and you want home-cooked food.",
      "Your regular cook is away for a few days.",
      "A festival or family function needs special dishes.",
      "You want a few days of meals prepared in one go.",
      "Someone at home is unwell and needs fresh, simple meals.",
    ],
    tasksIncluded: [
      "Cooking the dishes you choose",
      "Preparation such as cutting, grinding and kneading dough",
      "Cooking for guests within the booked time",
      "Packing tiffins and storing food properly",
      "Cleaning the cooking area and the utensils used",
    ],
    tasksExcluded: [
      "Grocery shopping, unless agreed",
      "Catering for large events",
      "General house cleaning — book an hourly maid instead",
      "Looking after children or patients",
    ],
    safeguards: [
      "Write down any allergies and food rules (for example, no onion or garlic) before the cook starts.",
    ],
    faqs: [
      {
        question: "Can I book a cook for just one meal?",
        answer: "Yes. Book the hours the meal needs, and tell the cook the menu and how many people are eating.",
      },
      {
        question: "Can I book a cook for guests at home?",
        answer: "Yes. Book enough hours for the menu and the number of guests. For a large event, a caterer may suit you better.",
      },
      {
        question: "Do I need to have the ingredients ready?",
        answer: "Plan to have the ingredients and utensils ready before the cook arrives, unless you've arranged otherwise.",
      },
      {
        question: "Can I book a cook at short notice?",
        answer: "You can make an instant booking in the app. If no one is free near you right then, schedule the visit for a later time.",
      },
    ],
    seo: {
      title: "Hourly Cook – Book a Cook for a Meal or Party | MeeHelp",
      description:
        "Book a cook by the hour with MeeHelp — instantly or scheduled — for guests, festivals, a family meal or a few days of meal prep, cooked in your own kitchen.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-17",
  },
  "babysitter-nanny": {
    slug: "hourly-babysitter",
    bookingNoun: "a babysitter by the hour",
    name: "Hourly Babysitter",
    shortName: "Hourly babysitter",
    headline: "Book a babysitter by the hour",
    description: [
      "Need someone to watch your child for an evening, during a work call or while you run errands? Book a babysitter through the MeeHelp app for the hours you need.",
      "Plan ahead where you can: a scheduled booking gives you time to write down your child's routine, allergies and emergency contacts.",
    ],
    useCases: [
      "An evening out or a family function.",
      "A few hours of meetings while you work from home.",
      "Errands or appointments you can't take your child to.",
      "Your regular nanny or the grandparents are away.",
      "A school holiday day when you still have to work.",
    ],
    tasksIncluded: [
      "Supervising and playing with your child",
      "Feeding meals you've prepared or left instructions for",
      "Following the nap and bedtime routine you set",
      "Bathing, dressing and changing diapers",
      "Tidying the play area afterwards",
    ],
    tasksExcluded: [
      "Giving medicines without your clear written instructions",
      "Taking your child out of the home, unless you've agreed it",
      "Driving your child anywhere",
      "Housework for the family",
    ],
    safeguards: [
      "If it's the first time this babysitter is looking after your child, stay at home for the first part of the booking.",
      "Leave your child's routine, allergies, emergency contacts and your doctor's number in writing.",
    ],
    faqs: [
      {
        question: "Can I book a babysitter for a few hours in the evening?",
        answer: "Yes. Book the hours you need and add enough time for your journey home.",
      },
      {
        question: "Can I book a babysitter at short notice?",
        answer: "You can make an instant booking in the app. Whether someone is free right away depends on availability near you — scheduling ahead gives you the best chance.",
      },
      {
        question: "Can I stay at home during the booking?",
        answer: "Yes, and it's a good idea the first time, so you can see how the babysitter and your child get along.",
      },
      {
        question: "Is an hourly babysitter the same as a nanny?",
        answer: "No. An hourly booking covers a set number of hours on one occasion. A nanny works a regular schedule and becomes part of your child's routine.",
      },
    ],
    seo: {
      title: "Hourly Babysitter – Book Childcare by the Hour | MeeHelp",
      description:
        "Book a babysitter by the hour through the MeeHelp app — instantly or for a scheduled time — for an evening out, a work call or a busy day at home.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-17",
  },
  "elder-care": {
    slug: "hourly-elder-care",
    bookingNoun: "hourly elder care",
    name: "Hourly Elder Care",
    shortName: "Hourly elder care",
    headline: "Hourly elder care at home",
    description: [
      "When you can't be with an elderly parent for a few hours — at work, travelling or running errands — book an elder care attendant through the MeeHelp app for the time you need.",
      "This is non-medical support: company, help moving around safely and help with daily routines. For medical needs, speak to your parent's doctor about a qualified nurse.",
    ],
    useCases: [
      "You need to be out for the day and don't want your parent alone.",
      "Your parent has a doctor's appointment and needs someone to go along.",
      "A regular carer is on leave.",
      "A family member who cares full-time needs a break.",
      "Your parent needs extra help for a few days after an illness.",
    ],
    tasksIncluded: [
      "Companionship and conversation",
      "Help walking and moving around the home safely",
      "Help at mealtimes",
      "Medicine reminders, following the schedule you give",
      "Going along on a walk or to an appointment",
      "Help with bathing and dressing",
    ],
    tasksExcluded: [
      "Medical procedures such as injections, IV drips or wound dressing",
      "Diagnosing illness or changing medicines",
      "Handling money or bank transactions",
      "Housework for the household",
    ],
    safeguards: [
      "Write down your parent's medicines, health conditions, mobility needs and emergency contacts for the attendant.",
    ],
    faqs: [
      {
        question: "Can I book an attendant just to take my parent to the doctor?",
        answer: "Yes. Book enough hours to cover the journey and the appointment, and decide in advance how travel will be paid.",
      },
      {
        question: "Can I book elder care for a few hours at short notice?",
        answer: "You can make an instant booking in the app. If no one is free near you right then, schedule the visit for a later time.",
      },
      {
        question: "Is this medical care?",
        answer: "No. An attendant gives non-medical support. For injections, wound care or other medical needs, ask your parent's doctor about a qualified nurse.",
      },
      {
        question: "What if my parent needs help every day?",
        answer: "Hourly bookings suit occasional needs. If your parent needs someone every day, a regular arrangement with one attendant may suit you better.",
      },
    ],
    seo: {
      title: "Hourly Elder Care at Home – Book an Attendant | MeeHelp",
      description:
        "Book an elder care attendant by the hour — instantly or scheduled — for company, mobility help or a trip to the doctor while you're away. Book on MeeHelp.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-17",
  },
  "patient-care": {
    slug: "hourly-patient-care",
    bookingNoun: "hourly patient care",
    name: "Hourly Patient Care",
    shortName: "Hourly patient care",
    headline: "Hourly patient care attendants at home",
    description: [
      "Book a patient care attendant by the hour through the MeeHelp app — for the first days after a hospital discharge, while the family is away, or to give a full-time carer a break.",
      "Attendants help with personal care, moving around and daily routines. Medical procedures must always be done by a qualified nurse.",
    ],
    useCases: [
      "A family member has just come home from hospital.",
      "The patient needs help with bathing and moving at set times.",
      "A family member caring full-time needs a few hours off.",
      "The patient has a follow-up appointment and needs someone to go along.",
      "A regular attendant is on leave.",
    ],
    tasksIncluded: [
      "Helping the patient sit up, turn in bed and walk safely",
      "Bathing, sponge baths, toileting and diaper changes",
      "Feeding and helping at mealtimes",
      "Medicine reminders, following the doctor's schedule",
      "Keeping the patient's bed and room clean",
    ],
    tasksExcluded: [
      "Injections, IV lines, catheter or wound care — these need a qualified nurse",
      "Medical advice, diagnosis or changing prescriptions",
      "Emergency medical response — in an emergency, call 108 or your doctor",
      "Housework for the family",
    ],
    safeguards: [
      "Keep the discharge summary, the doctor's instructions and the medicine schedule where the attendant can see them.",
    ],
    faqs: [
      {
        question: "Can I book a patient attendant for a few hours?",
        answer: "Yes. On-demand bookings are by the hour — choose the hours you need when you book in the app.",
      },
      {
        question: "Can I book an attendant for the day of a hospital discharge?",
        answer: "Yes. Schedule the visit for the time the patient is due home, and share the discharge instructions with the attendant.",
      },
      {
        question: "Is this nursing care?",
        answer: "No. Attendants give non-medical personal care. Injections, IV lines and wound care need a qualified nurse.",
      },
      {
        question: "What should I share with the attendant?",
        answer: "The patient's condition, how much they can move, the medicine schedule, warning signs to watch for and emergency contacts.",
      },
    ],
    seo: {
      title: "Hourly Patient Care – Book an Attendant at Home | MeeHelp",
      description:
        "Book a patient care attendant by the hour on MeeHelp — instantly or scheduled — for help after a hospital discharge, personal care or a break for family carers.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-17",
  },
};
