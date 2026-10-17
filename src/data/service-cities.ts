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
  // Phase 4.5: hand-written pages keep only local context that changes the
  // hiring decision. Monsoon, festival, police-process and cuisine claims were
  // removed; app mechanics come from src/data/product-facts.ts.
  "maid/mumbai/marketplace": {
    headline: "Maid service in Mumbai: house help that fits your building's routine",
    introduction: [
      "In Mumbai, part-time house help usually works fixed time slots across several flats, often starting early in the morning. Someone who already works in or near your society is far more likely to arrive on time every day.",
      "Choose the hours you need — part-time from 2 to 12 hours a day, or a live-in helper — then contact helpers near your address and agree the tasks, time slot and salary with them directly.",
    ],
    points: [
      "Daily jhadu-pocha (sweeping and mopping) and dishes in a fixed morning slot",
      "Laundry in flats with limited balcony space for drying",
      "Bathroom cleaning two or three times a week",
      "A live-in helper for a family that needs someone through the day",
    ],
    localFaqs: [
      {
        question: "What time do maids in Mumbai usually come?",
        answer:
          "Many part-time helpers work early-morning and late-morning slots across several homes. Agree a fixed time with the helper when you speak to them, and choose hours in the app that match it.",
      },
      {
        question: "My society asks for helper registration. What do I need?",
        answer:
          "Most societies ask for a photo ID. Check with your society office before the helper's first day so they aren't stopped at the gate.",
      },
    ],
    localCta: {
      heading: "Find house help near your building",
      body: "Download the MeeHelp app to see helpers near your address, sorted by distance, and contact them directly.",
    },
    seo: {
      title: "Maid Service in Mumbai – Find House Help Near You | MeeHelp",
      description:
        "Find a part-time or live-in maid in Mumbai, Thane or Navi Mumbai for cleaning, dishes and laundry. See helpers near your building on MeeHelp.",
    },
  },
  "maid/delhi-ncr/marketplace": {
    headline: "Maid service in Delhi NCR, from independent floors to gated societies",
    introduction: [
      "Across Delhi, Gurugram and Noida, homes range from compact flats to independent houses on several floors, so the work involved differs a lot. Being clear about the number of rooms, floors and bathrooms helps you choose the right hours and agree a fair salary.",
      "On MeeHelp you see helpers near your address with their distance in km, contact them directly and agree the work and salary yourself.",
    ],
    points: [
      "Daily cleaning and dishes for independent floors with terraces or balconies",
      "Part-time help for a few hours in the morning, or a live-in helper",
      "Laundry and ironing for working households",
      "Extra cleaning hours agreed in advance",
    ],
    localFaqs: [
      {
        question: "Can a maid clean a multi-floor independent house?",
        answer:
          "Yes, but it takes longer than a flat. Tell the helper the number of floors, rooms and bathrooms when you speak to them, so you can agree hours and a salary that reflect the work.",
      },
      {
        question: "How do gate passes work in Gurugram and Noida societies?",
        answer:
          "Most gated societies register staff through the society office or a visitor-management app. Register your helper before their first day so they aren't stopped at the gate.",
      },
    ],
    localCta: {
      heading: "Find house help in Delhi NCR",
      body: "Download the MeeHelp app to see helpers in Delhi, Gurugram or Noida near your address and contact them directly.",
    },
    seo: {
      title: "Maid Service in Delhi NCR – House Help Near You | MeeHelp",
      description:
        "Find a maid in Delhi, Gurugram or Noida for daily cleaning, dishes and laundry. Part-time or live-in house help near you through the MeeHelp app.",
    },
  },
  "cook/mumbai/marketplace": {
    headline: "Home cooks in Mumbai for everyday family meals",
    introduction: [
      "Mumbai kitchens are often small and mealtimes are tied to long commutes, so many families want a cook who prepares the day's food in one visit — tiffins packed before you leave, or dinner ready before you get home.",
      "Tell the app how many people the cook will cook for, contact cooks near you, and agree a trial meal, the timings and the salary with them directly.",
    ],
    points: [
      "Morning visits to cook breakfast and pack tiffins for office and school",
      "Evening visits so dinner is ready after the commute",
      "One visit that covers both lunch and dinner",
      "A live-in cook for a family that eats at home all day",
    ],
    localFaqs: [
      {
        question: "Can a cook prepare lunch and dinner in one visit?",
        answer:
          "Many Mumbai families do this to fit around work hours. Discuss it with the cook and agree how food will be stored until dinner.",
      },
      {
        question: "My kitchen is very small. Does that matter?",
        answer:
          "Tell the cook about your kitchen, stove and storage on the first call, so they can plan the cooking around it.",
      },
    ],
    localCta: {
      heading: "Find a home cook in Mumbai",
      body: "Download the MeeHelp app to see cooks near your address and contact them directly.",
    },
    seo: {
      title: "Cook in Mumbai – Hire a Home Cook Near You | MeeHelp",
      description:
        "Hire a home cook in Mumbai, Thane or Navi Mumbai for breakfast, tiffins or dinner — part-time or live-in. Find cooks near you through the MeeHelp app.",
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
