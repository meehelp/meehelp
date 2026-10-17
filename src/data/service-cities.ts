import type { BusinessModel, CitySlug, ServiceCity, ServiceCityContent, ServiceSlug } from "@/lib/content/types";

/**
 * The explicit registry of service × city × model pages. A page exists only if
 * it is listed here — nothing is generated from combinations automatically.
 *
 * All 80 entries (5 services × 8 cities × 2 models) were confirmed available
 * in the Phase 4 brief. Every entry is held in "review": they build on the
 * preview (noindex) and are excluded from production until approved.
 *
 * Content is composed from the service's city frame and the city's tagged
 * facts (src/lib/content/compose.ts). `overrides` holds hand-written content
 * for pages where we have more genuinely local material.
 */
const handwritten: Record<string, Partial<ServiceCityContent>> = {
  "maid/mumbai/marketplace": {
      headline: "Maid service in Mumbai: house help that fits your building's routine",
      introduction: [
        "In Mumbai, house help usually works fixed slots across several flats in the same society, often starting early in the morning. Choosing someone who already works nearby makes it far more likely they will arrive on time, every day.",
        "Review profiles of helpers near you, contact the ones you like, and agree the tasks, time slot and salary with them directly.",
      ],
      points: [
        "Daily jhadu-pocha (sweeping and mopping) and dishes in a fixed morning slot",
        "Laundry and drying-rack management in flats with limited balcony space",
        "Bathroom cleaning two or three times a week",
        "A helper who can also clean the kitchen and balcony after the monsoon",
      ],
      localFaqs: [
        {
          question: "What time do maids in Mumbai usually come?",
          answer:
            "Many part-time helpers work early-morning and late-morning slots across several homes. Agree a fixed time with the helper when you speak to them.",
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
        body: "Download the MeeHelp app to review profiles of helpers who work in your area and contact them directly.",
      },
      seo: {
        title: "Maid Service in Mumbai – Find House Help Near You | MeeHelp",
        description:
          "Looking for a maid in Mumbai? Find part-time or full-time house help near your building for cleaning, dishes and laundry, through the MeeHelp app.",
      },
  
  },
  "maid/delhi-ncr/marketplace": {
      headline: "Maid service in Delhi NCR, from independent floors to gated societies",
      introduction: [
        "Across Delhi, Gurugram and Noida, homes vary from compact flats to multi-storey independent houses, so the work involved can differ a lot. Being clear about the number of rooms, floors and bathrooms helps you find the right helper and agree fair charges.",
        "On MeeHelp you review profiles of helpers near you, contact them directly and agree the work and salary yourself.",
      ],
      points: [
        "Daily cleaning and dishes for independent floors with terraces or balconies",
        "Dusting and mopping more often during dusty summer months",
        "Laundry and ironing for working households",
        "Extra cleaning hours agreed ahead of festivals",
      ],
      localFaqs: [
        {
          question: "Do I need police verification for my maid in Delhi?",
          answer:
            "Delhi Police offers domestic help verification, and many RWAs ask for it. Gurugram, Noida and other NCR districts have their own processes — your society office can guide you.",
        },
        {
          question: "Can a maid clean a multi-floor independent house?",
          answer:
            "Yes, but it takes longer than a flat. Tell the helper the number of floors, rooms and bathrooms when you speak to them, so you can agree hours and salary that reflect the work.",
        },
        {
          question: "How do gate passes work in Gurugram and Noida societies?",
          answer:
            "Most gated societies register staff through the society office or a visitor-management app. Register your helper before their first day so they aren't stopped at the gate.",
        },
      ],
      localCta: {
        heading: "Find house help in Delhi NCR",
        body: "Download the MeeHelp app to review profiles of helpers in Delhi, Gurugram or Noida and contact them directly.",
      },
      seo: {
        title: "Maid Service in Delhi NCR – House Help Near You | MeeHelp",
        description:
          "Find a maid in Delhi, Gurugram or Noida for daily cleaning, dishes and laundry. Part-time or full-time house help near you through the MeeHelp app.",
      },
  
  },
  "cook/mumbai/marketplace": {
      headline: "Home cooks in Mumbai for everyday family meals",
      introduction: [
        "Mumbai kitchens are often small and mealtimes are tied to long commutes, so many families want a cook who can prepare the day's food in one efficient visit — dinner ready before you get home, or tiffins packed before you leave.",
        "Review profiles of cooks near you, contact the ones you like, and call them for a trial before you agree the meals, timings and salary.",
      ],
      points: [
        "Morning visits to cook breakfast and pack tiffins for office and school",
        "Evening visits so dinner is ready after the commute",
        "Maharashtrian, Gujarati, North Indian or Jain home cooking",
        "One visit that covers both lunch and dinner",
      ],
      localFaqs: [
        {
          question: "Can a cook prepare lunch and dinner in one visit?",
          answer:
            "Many Mumbai families do this to fit around work hours. Discuss it with the cook and agree how food will be stored until dinner.",
        },
        {
          question: "Can I find a cook for Gujarati or Jain food in Mumbai?",
          answer:
            "Yes — look for cooks whose profiles match your food preference, and confirm specific rules, such as no onion and garlic, with the cook before they start.",
        },
        {
          question: "My kitchen is very small. Does that matter?",
          answer:
            "Let the cook know about your kitchen and equipment at the start. Experienced home cooks in Mumbai are used to working in compact kitchens.",
        },
      ],
      localCta: {
        heading: "Find a home cook in Mumbai",
        body: "Download the MeeHelp app to review profiles of cooks near you and contact them directly.",
      },
      seo: {
        title: "Cook in Mumbai – Hire a Home Cook Near You | MeeHelp",
        description:
          "Hire a home cook in Mumbai for breakfast, tiffins or dinner — veg, non-veg, Gujarati or Jain food. Find cooks near you through the MeeHelp app.",
      },
  
  },
  "elder-care/bengaluru/marketplace": {
      headline: "Elder care at home in Bengaluru for parents living with or near you",
      introduction: [
        "Many Bengaluru families have parents who have moved to the city to be near their children, or who live alone while their children work long hours. An elder care attendant can give them company, help with daily routines, and peace of mind for you during the working day.",
        "Review profiles of attendants near you, contact them directly, and discuss your parent's routine, mobility and language before you decide.",
      ],
      points: [
        "Daytime company and supervision while family members are at work",
        "Help with walking, bathing and dressing",
        "An attendant who speaks your parent's language — Kannada, Tamil, Telugu, Hindi or another",
        "Going with your parent to doctor's appointments",
      ],
      localFaqs: [
        {
          question: "Can I find an attendant who speaks my parent's language?",
          answer:
            "Bengaluru has a very mixed population, so it is worth asking. Confirm the language when you speak to the attendant.",
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
        body: "Download the MeeHelp app to review profiles of elder care attendants near you and contact them directly.",
      },
      seo: {
        title: "Elder Care at Home in Bengaluru – Attendants | MeeHelp",
        description:
          "Find an elder care attendant in Bengaluru for company, mobility help, personal care and medicine reminders at home. Connect through MeeHelp.",
      },
  
  },
};

const page = (service: ServiceSlug, city: CitySlug, model: BusinessModel): ServiceCity => ({
  service,
  city,
  model,
  publishStatus: "review",
  updatedAt: "2026-10-17",
  overrides: handwritten[`${service}/${city}/${model}`],
});

export const serviceCities: ServiceCity[] = [
  // Marketplace — find and hire directly
  page("maid", "mumbai", "marketplace"), page("maid", "delhi-ncr", "marketplace"), page("maid", "bengaluru", "marketplace"), page("maid", "hyderabad", "marketplace"),
  page("maid", "chennai", "marketplace"), page("maid", "pune", "marketplace"), page("maid", "kolkata", "marketplace"), page("maid", "ahmedabad", "marketplace"),
  page("cook", "mumbai", "marketplace"), page("cook", "delhi-ncr", "marketplace"), page("cook", "bengaluru", "marketplace"), page("cook", "hyderabad", "marketplace"),
  page("cook", "chennai", "marketplace"), page("cook", "pune", "marketplace"), page("cook", "kolkata", "marketplace"), page("cook", "ahmedabad", "marketplace"),
  page("babysitter-nanny", "mumbai", "marketplace"), page("babysitter-nanny", "delhi-ncr", "marketplace"), page("babysitter-nanny", "bengaluru", "marketplace"), page("babysitter-nanny", "hyderabad", "marketplace"),
  page("babysitter-nanny", "chennai", "marketplace"), page("babysitter-nanny", "pune", "marketplace"), page("babysitter-nanny", "kolkata", "marketplace"), page("babysitter-nanny", "ahmedabad", "marketplace"),
  page("elder-care", "mumbai", "marketplace"), page("elder-care", "delhi-ncr", "marketplace"), page("elder-care", "bengaluru", "marketplace"), page("elder-care", "hyderabad", "marketplace"),
  page("elder-care", "chennai", "marketplace"), page("elder-care", "pune", "marketplace"), page("elder-care", "kolkata", "marketplace"), page("elder-care", "ahmedabad", "marketplace"),
  page("patient-care", "mumbai", "marketplace"), page("patient-care", "delhi-ncr", "marketplace"), page("patient-care", "bengaluru", "marketplace"), page("patient-care", "hyderabad", "marketplace"),
  page("patient-care", "chennai", "marketplace"), page("patient-care", "pune", "marketplace"), page("patient-care", "kolkata", "marketplace"), page("patient-care", "ahmedabad", "marketplace"),
  // On-demand — book by the hour
  page("maid", "mumbai", "onDemand"), page("maid", "delhi-ncr", "onDemand"), page("maid", "bengaluru", "onDemand"), page("maid", "hyderabad", "onDemand"),
  page("maid", "chennai", "onDemand"), page("maid", "pune", "onDemand"), page("maid", "kolkata", "onDemand"), page("maid", "ahmedabad", "onDemand"),
  page("cook", "mumbai", "onDemand"), page("cook", "delhi-ncr", "onDemand"), page("cook", "bengaluru", "onDemand"), page("cook", "hyderabad", "onDemand"),
  page("cook", "chennai", "onDemand"), page("cook", "pune", "onDemand"), page("cook", "kolkata", "onDemand"), page("cook", "ahmedabad", "onDemand"),
  page("babysitter-nanny", "mumbai", "onDemand"), page("babysitter-nanny", "delhi-ncr", "onDemand"), page("babysitter-nanny", "bengaluru", "onDemand"), page("babysitter-nanny", "hyderabad", "onDemand"),
  page("babysitter-nanny", "chennai", "onDemand"), page("babysitter-nanny", "pune", "onDemand"), page("babysitter-nanny", "kolkata", "onDemand"), page("babysitter-nanny", "ahmedabad", "onDemand"),
  page("elder-care", "mumbai", "onDemand"), page("elder-care", "delhi-ncr", "onDemand"), page("elder-care", "bengaluru", "onDemand"), page("elder-care", "hyderabad", "onDemand"),
  page("elder-care", "chennai", "onDemand"), page("elder-care", "pune", "onDemand"), page("elder-care", "kolkata", "onDemand"), page("elder-care", "ahmedabad", "onDemand"),
  page("patient-care", "mumbai", "onDemand"), page("patient-care", "delhi-ncr", "onDemand"), page("patient-care", "bengaluru", "onDemand"), page("patient-care", "hyderabad", "onDemand"),
  page("patient-care", "chennai", "onDemand"), page("patient-care", "pune", "onDemand"), page("patient-care", "kolkata", "onDemand"), page("patient-care", "ahmedabad", "onDemand"),
];
