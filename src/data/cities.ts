import type { Availability, BusinessModel, City, ServiceSlug } from "@/lib/content/types";

/**
 * The eight active metros. CONFIRMED in the Phase 4 brief (2026-10-17):
 * every service is available in every listed city for BOTH the marketplace
 * and on-demand models. This is city-level availability — it is never a claim
 * that a particular locality is served.
 *
 * `facts` (Phase 4.5): ONLY local context that changes a hiring or booking
 * decision — society/gate access, housing types that change the hours you
 * need, distances that make the app's distance sort matter, buildings without
 * lifts for care. Weather, festivals, cuisine, languages and police processes
 * were removed: they made pages look different without helping the customer
 * (tests block them). Facts are tagged by service and model; they must never
 * contain statistics, demand figures, helper counts, response times or claims
 * that a locality is served. A city with little relevant context simply has
 * a shorter page — and the quality report says so.
 *
 * City copy stays in "review" until approved.
 */
const availableForBothModels: Record<BusinessModel, Availability> = { marketplace: "available", onDemand: "available" };
const allServicesAvailable = (): Record<ServiceSlug, Record<BusinessModel, Availability>> => ({
  maid: { ...availableForBothModels },
  cook: { ...availableForBothModels },
  "babysitter-nanny": { ...availableForBothModels },
  "elder-care": { ...availableForBothModels },
  "patient-care": { ...availableForBothModels },
});

const M: BusinessModel[] = ["marketplace"];
const O: BusinessModel[] = ["onDemand"];

export const cities: City[] = [
  {
    slug: "mumbai",
    name: "Mumbai",
    region: "Maharashtra",
    displayName: "Mumbai & MMR",
    includes: ["Thane", "Navi Mumbai"],
    marketActive: true,
    availability: allServicesAvailable(),
    descriptors: { areas: "Mumbai, Thane and Navi Mumbai" },
    facts: [
      { models: M, text: "Most housing societies register household staff at the gate before they start. Ask your society office what it needs — usually a photo ID — so the helper isn't turned away on day one." },
      { models: O, text: "For a single visit, many societies log the helper as a visitor or through a visitor-management app. Approve the entry before the booked time so the helper isn't held at the gate." },
      { services: ["maid"], text: "Flats are often compact, so say exactly how many rooms and bathrooms there are — a 1 BHK needs far less time than you might expect, and the hours you choose depend on it." },
      { services: ["maid", "cook", "babysitter-nanny", "patient-care"], models: M, text: "Thane, Navi Mumbai and the island city are a long commute apart. The app shows each helper's distance in km — sort by distance so the person you hire lives close enough to arrive on time." },
      { services: ["elder-care", "patient-care"], text: "Many older buildings have no lift. If the person being cared for lives on an upper floor, tell the attendant whether they'll need to help with stairs." },
    ],
    faqs: [
      {
        models: M,
        question: "Does my society need to register my helper?",
        answer: "Most Mumbai societies do. Ask the society office what it needs — usually a photo ID — before the helper's first day.",
      },
      {
        models: O,
        question: "Do I need to tell my society about a one-time booking?",
        answer: "It helps. Many societies log visiting helpers at the gate or through a visitor-management app, so approve the entry before the booked time.",
      },
      {
        services: ["elder-care", "patient-care"],
        question: "What if there is no lift in our building?",
        answer: "Tell the attendant before they start, so they know whether they'll need to help with stairs on outings or appointments.",
      },
    ],
    seo: {
      title: "Domestic Help in Mumbai – Maids, Cooks & Care | MeeHelp",
      description: "Find house help in Mumbai, Thane and Navi Mumbai: maids, cooks, nannies, elder care and patient attendants near you, through the MeeHelp app.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-17",
  },
  {
    slug: "delhi-ncr",
    name: "Delhi NCR",
    region: "Delhi, Haryana & Uttar Pradesh",
    displayName: "Delhi NCR",
    includes: ["Delhi", "Gurugram", "Noida", "Ghaziabad", "Faridabad"],
    marketActive: true,
    availability: allServicesAvailable(),
    descriptors: { areas: "Delhi, Gurugram and Noida" },
    facts: [
      { models: M, text: "RWAs and gated societies usually issue a pass for household staff. Check what your RWA or society office needs before the helper starts." },
      { models: O, text: "Gated societies in Gurugram and Noida usually log visiting helpers at the gate or through a visitor-management app. Approve the entry before the booked time." },
      { services: ["maid"], text: "Homes range from compact flats to independent floors on several storeys. Count the floors, rooms, bathrooms and terraces — it decides how many hours of help you need." },
      { services: ["maid", "cook", "babysitter-nanny", "patient-care"], models: M, text: "Delhi, Gurugram and Noida are far apart. The app shows each helper's distance in km, so sort by distance and shortlist people who live near your sector." },
    ],
    faqs: [
      {
        services: ["maid"],
        question: "Can a maid clean a multi-storey independent floor?",
        answer: "Yes, but it takes longer than a flat. Say how many floors, rooms and bathrooms there are, and choose the hours to match.",
      },
      {
        models: O,
        question: "Will a visiting helper be allowed into my society?",
        answer: "Most gated societies in Gurugram and Noida log visitors at the gate or through an app. Approve the entry before the booked time so the helper isn't held up.",
      },
    ],
    seo: {
      title: "Domestic Help in Delhi NCR – Maids, Cooks & Care | MeeHelp",
      description: "Find house help across Delhi, Gurugram, Noida, Ghaziabad and Faridabad — maids, cooks, nannies, elder care and patient attendants, via MeeHelp.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-17",
  },
  {
    slug: "bengaluru",
    name: "Bengaluru",
    region: "Karnataka",
    displayName: "Bengaluru",
    includes: [],
    marketActive: true,
    availability: allServicesAvailable(),
    descriptors: { areas: "Bengaluru" },
    facts: [
      { models: M, text: "Apartment complexes typically register household staff at security and may ask for a photo ID." },
      { models: O, text: "Most apartment complexes log visiting helpers at security or through an app. Approve the entry before the booked time." },
      { services: ["maid", "cook", "babysitter-nanny", "patient-care"], models: M, text: "Peak-hour traffic makes even short distances slow. The app shows each helper's distance in km — someone who lives nearby is far more likely to arrive on time every day." },
    ],
    faqs: [
      {
        models: O,
        question: "Will security let a visiting helper into my apartment complex?",
        answer: "Most complexes log visitors at security or through an app. Approve the entry in advance so the helper isn't held at the gate.",
      },
    ],
    seo: {
      title: "Domestic Help in Bengaluru – Maids, Cooks & Care | MeeHelp",
      description: "Find house help in Bengaluru — maids, cooks, nannies, elder care and patient care attendants who live near you. Connect through the MeeHelp app.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-17",
  },
  {
    slug: "hyderabad",
    name: "Hyderabad",
    region: "Telangana",
    displayName: "Hyderabad",
    includes: ["Secunderabad"],
    marketActive: true,
    availability: allServicesAvailable(),
    descriptors: { areas: "Hyderabad and Secunderabad" },
    facts: [
      { models: M, text: "Gated communities usually register household staff and may issue ID cards or app-based passes." },
      { models: O, text: "Gated communities usually log visiting helpers through the gate or an app. Approve the entry before the booked time." },
      { services: ["maid"], text: "Homes range from large gated-community flats to older independent houses. Describe the size and layout of your home when you choose the hours." },
    ],
    faqs: [
      {
        models: O,
        question: "Will a visiting helper be let into my gated community?",
        answer: "Most gated communities log visitors at the gate or through an app. Approve the entry before the booked time.",
      },
    ],
    seo: {
      title: "Domestic Help in Hyderabad – Maids, Cooks & Care | MeeHelp",
      description: "Find house help in Hyderabad and Secunderabad — maids, cooks, nannies, elder care and patient attendants near you, through the MeeHelp app.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-17",
  },
  {
    slug: "chennai",
    name: "Chennai",
    region: "Tamil Nadu",
    displayName: "Chennai",
    includes: [],
    marketActive: true,
    availability: allServicesAvailable(),
    descriptors: { areas: "Chennai" },
    facts: [
      { models: M, text: "Apartment associations often keep a register of household staff, and some ask for a photo ID." },
      { models: O, text: "Apartment security often logs visiting helpers. Approve the entry before the booked time." },
    ],
    faqs: [],
    seo: {
      title: "Domestic Help in Chennai – Maids, Cooks & Care | MeeHelp",
      description: "Find house help in Chennai — maids, cooks for South Indian meals, nannies, elder care and patient care attendants near you, through MeeHelp.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-17",
  },
  {
    slug: "pune",
    name: "Pune",
    region: "Maharashtra",
    displayName: "Pune",
    includes: ["Pimpri-Chinchwad"],
    marketActive: true,
    availability: allServicesAvailable(),
    descriptors: { areas: "Pune and Pimpri-Chinchwad" },
    facts: [
      { models: M, text: "Large housing societies, especially in newer areas, usually register household staff at the gate." },
      { models: O, text: "Housing societies usually log visiting helpers at the gate or through an app. Approve the entry before the booked time." },
      { services: ["maid"], models: M, text: "If you share a flat, agree between flatmates who the main contact is and how the helper's salary will be split." },
      { services: ["maid"], models: O, text: "Shared flats often book a one-time clean between tenants or when someone moves out." },
    ],
    faqs: [
      {
        services: ["maid"],
        models: M,
        question: "Can flatmates hire one helper together?",
        answer: "Yes. Agree who the helper's main contact is, the tasks for each room and how the salary is split before the helper starts.",
      },
      {
        services: ["maid"],
        models: O,
        question: "Can I book a clean when moving out of a flat?",
        answer: "Yes. Book a one-time clean and choose the tasks. Remember that cleaners don't bring machines or materials.",
      },
    ],
    seo: {
      title: "Domestic Help in Pune – Maids, Cooks & Care | MeeHelp",
      description: "Find house help in Pune and Pimpri-Chinchwad — maids, cooks, nannies, elder care and patient attendants near you, through the MeeHelp app.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-17",
  },
  {
    slug: "kolkata",
    name: "Kolkata",
    region: "West Bengal",
    displayName: "Kolkata",
    includes: ["Salt Lake", "New Town"],
    marketActive: true,
    availability: allServicesAvailable(),
    descriptors: { areas: "Kolkata, Salt Lake and New Town" },
    facts: [
      { models: M, text: "Apartment buildings and housing complexes often register household staff and may ask for a photo ID." },
      { models: O, text: "Apartment complexes often log visiting helpers at the gate. Approve the entry before the booked time." },
      { services: ["maid"], text: "Many older houses and flats have high ceilings and large rooms. Describe your home so you choose enough hours for the work." },
      { services: ["elder-care", "patient-care"], text: "Many older houses have steep stairs and no lift. If the person being cared for is on an upper floor, tell the attendant whether they'll need to help with stairs." },
    ],
    faqs: [],
    seo: {
      title: "Domestic Help in Kolkata – Maids, Cooks & Care | MeeHelp",
      description: "Find house help in Kolkata, Salt Lake and New Town — maids, cooks, nannies, elder care and patient care attendants near you, through MeeHelp.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-17",
  },
  {
    slug: "ahmedabad",
    name: "Ahmedabad",
    region: "Gujarat",
    displayName: "Ahmedabad",
    includes: ["Gandhinagar"],
    marketActive: true,
    availability: allServicesAvailable(),
    descriptors: { areas: "Ahmedabad and Gandhinagar" },
    facts: [
      { models: M, text: "Housing societies often register household staff at the gate and may ask for a photo ID." },
      { models: O, text: "Housing societies often log visiting helpers at the gate or through an app. Approve the entry before the booked time." },
    ],
    faqs: [],
    seo: {
      title: "Domestic Help in Ahmedabad – Maids, Cooks & Care | MeeHelp",
      description: "Find house help in Ahmedabad and Gandhinagar — maids, cooks for veg and Jain food, nannies, elder care and patient attendants, via MeeHelp.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-17",
  },
];
