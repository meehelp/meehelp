import type { ServiceCity } from "@/lib/content/types";

/**
 * Service × city pages. Each entry is written individually for that
 * combination. Add a combination ONLY when the business confirms the service
 * is live in that city and there is genuinely local content to say.
 *
 * All entries below are in "review": they build on preview (noindex) and are
 * excluded from production until switched to "published".
 * `areasServed` stays empty until the business confirms specific areas.
 */
export const serviceCities: ServiceCity[] = [
  {
    service: "maid",
    city: "mumbai",
    localHeadline: "Maid service in Mumbai: house help that fits your building's routine",
    localIntroduction: [
      "In Mumbai, house help usually works fixed slots across several flats in the same society, often starting early in the morning. Choosing someone who already works nearby makes it far more likely they will arrive on time, every day.",
      "Tell us the size of your flat, which tasks you need, and the time slot you prefer. You can then speak to helpers near you and agree the details before they start.",
    ],
    availability: "unknown",
    commonRequirements: [
      "Daily jhadu-pocha (sweeping and mopping) and dishes in a fixed morning slot",
      "Laundry and drying-rack management in flats with limited balcony space",
      "Bathroom cleaning two or three times a week",
      "A one-off deep clean before Diwali or after the monsoon",
    ],
    areasServed: [],
    localFaqs: [
      {
        question: "What time do maids in Mumbai usually come?",
        answer:
          "Many part-time helpers work early-morning and late-morning slots across several homes. Mention your preferred slot when you post your requirement, and agree a fixed time with the helper.",
      },
      {
        question: "What happens on heavy-rain days?",
        answer:
          "Local trains and roads can be disrupted during the monsoon. Agree in advance whether the helper will make up the time on another day, and how you will let each other know.",
      },
      {
        question: "My society asks for helper registration. What do I need?",
        answer:
          "Most societies ask for a photo ID, and some ask for a police verification form. Check with your society office before the helper's first day.",
      },
    ],
    localCta: {
      heading: "Find house help near your building",
      body: "Download the MeeHelp app, enter your Mumbai address and see helpers who work in your area.",
    },
    seo: {
      title: "Maid Service in Mumbai – Find House Help Near You | MeeHelp",
      description:
        "Looking for a maid in Mumbai? Find part-time or full-time house help near your building for cleaning, dishes and laundry, through the MeeHelp app.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-17",
  },
  {
    service: "maid",
    city: "delhi-ncr",
    localHeadline: "Maid service in Delhi NCR, from independent floors to gated societies",
    localIntroduction: [
      "Across Delhi, Gurugram and Noida, homes vary from compact flats to multi-storey independent houses, so the work involved can differ a lot. Being clear about the number of rooms, floors and bathrooms helps you find the right helper and agree fair charges.",
      "Post your requirement in the MeeHelp app with your address and preferred timings, then speak to helpers near you before you decide.",
    ],
    availability: "unknown",
    commonRequirements: [
      "Daily cleaning and dishes for independent floors with terraces or balconies",
      "Dusting and mopping more often during dusty summer months",
      "Laundry and ironing for working households",
      "Festival deep cleaning before Diwali",
    ],
    areasServed: [],
    localFaqs: [
      {
        question: "Do I need police verification for my maid in Delhi?",
        answer:
          "Delhi Police offers domestic help verification, and many RWAs ask for it. Gurugram, Noida and other NCR districts have their own processes — your society office can guide you.",
      },
      {
        question: "Can a maid clean a multi-floor independent house?",
        answer:
          "Yes, but it takes longer than a flat. Mention the number of floors, rooms and bathrooms so the helper can plan, and the charges reflect the work.",
      },
      {
        question: "How do gate passes work in Gurugram and Noida societies?",
        answer:
          "Most gated societies register staff through the society office or a visitor-management app. Register your helper before their first day so they aren't stopped at the gate.",
      },
    ],
    localCta: {
      heading: "Find house help in Delhi NCR",
      body: "Download the MeeHelp app, enter your address in Delhi, Gurugram or Noida, and see helpers near you.",
    },
    seo: {
      title: "Maid Service in Delhi NCR – House Help Near You | MeeHelp",
      description:
        "Find a maid in Delhi, Gurugram or Noida for daily cleaning, dishes and laundry. Part-time or full-time house help near you through the MeeHelp app.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-17",
  },
  {
    service: "cook",
    city: "mumbai",
    localHeadline: "Home cooks in Mumbai for everyday family meals",
    localIntroduction: [
      "Mumbai kitchens are often small and mealtimes are tied to long commutes, so many families want a cook who can prepare the day's food in one efficient visit — dinner ready before you get home, or tiffins packed before you leave.",
      "Tell us how many people you cook for, which meals you need and your food preferences. Then speak to cooks near you and try a meal before agreeing.",
    ],
    availability: "unknown",
    commonRequirements: [
      "Morning visits to cook breakfast and pack tiffins for office and school",
      "Evening visits so dinner is ready after the commute",
      "Maharashtrian, Gujarati, North Indian or Jain home cooking",
      "One visit that covers both lunch and dinner",
    ],
    areasServed: [],
    localFaqs: [
      {
        question: "Can a cook prepare lunch and dinner in one visit?",
        answer:
          "Many Mumbai families do this to fit around work hours. Mention it in your requirement and agree how food will be stored until dinner.",
      },
      {
        question: "Can I find a cook for Gujarati or Jain food in Mumbai?",
        answer:
          "Yes — choose your food preference in the app and confirm specific rules, such as no onion and garlic, with the cook before they start.",
      },
      {
        question: "My kitchen is very small. Does that matter?",
        answer:
          "Let the cook know about your kitchen and equipment at the start. Experienced home cooks in Mumbai are used to working in compact kitchens.",
      },
    ],
    localCta: {
      heading: "Find a home cook in Mumbai",
      body: "Download the MeeHelp app, enter your address and tell us which meals you need.",
    },
    seo: {
      title: "Cook in Mumbai – Hire a Home Cook Near You | MeeHelp",
      description:
        "Hire a home cook in Mumbai for breakfast, tiffins or dinner — veg, non-veg, Gujarati or Jain food. Find cooks near you through the MeeHelp app.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-17",
  },
  {
    service: "elder-care",
    city: "bengaluru",
    localHeadline: "Elder care at home in Bengaluru for parents living with or near you",
    localIntroduction: [
      "Many Bengaluru families have parents who have moved to the city to be near their children, or who live alone while their children work long hours. An elder care attendant can give them company, help with daily routines, and peace of mind for you during the working day.",
      "Tell us about your parent's routine, mobility and language, and speak to attendants near you before you decide.",
    ],
    availability: "unknown",
    commonRequirements: [
      "Daytime company and supervision while family members are at work",
      "Help with walking, bathing and dressing",
      "An attendant who speaks your parent's language — Kannada, Tamil, Telugu, Hindi or another",
      "Going with your parent to doctor's appointments",
    ],
    areasServed: [],
    localFaqs: [
      {
        question: "Can I find an attendant who speaks my parent's language?",
        answer:
          "Bengaluru has a very mixed population, so it is worth asking. Mention the language in your requirement and confirm it when you speak to the attendant.",
      },
      {
        question: "Can the attendant take my parent to hospital appointments?",
        answer:
          "Yes, accompanying your parent is a common part of elder care. Agree how they will travel, and who pays for transport, in advance.",
      },
      {
        question: "My parent needs medical care too. What should I do?",
        answer:
          "An attendant provides non-medical support. For injections, wound care or other medical needs, ask your parent's doctor about a qualified nurse alongside the attendant.",
      },
    ],
    localCta: {
      heading: "Find elder care in Bengaluru",
      body: "Download the MeeHelp app, enter your address and tell us about your parent's needs.",
    },
    seo: {
      title: "Elder Care at Home in Bengaluru – Attendants | MeeHelp",
      description:
        "Find an elder care attendant in Bengaluru for company, mobility help, personal care and medicine reminders at home. Connect through MeeHelp.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-17",
  },
];
