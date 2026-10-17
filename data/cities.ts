import type { Availability, City, ServiceSlug } from "@/lib/content/types";

/**
 * Target metros. All cities are in "review" until the business confirms which
 * services are live in each one. Availability is "unknown" (renders nothing)
 * until confirmed.
 */
const unconfirmed: Record<ServiceSlug, Availability> = {
  maid: "unknown",
  cook: "unknown",
  "babysitter-nanny": "unknown",
  "elder-care": "unknown",
  "patient-care": "unknown",
};

export const cities: City[] = [
  {
    slug: "mumbai",
    name: "Mumbai",
    region: "Maharashtra",
    displayName: "Mumbai & MMR",
    includes: ["Thane", "Navi Mumbai"],
    serviceAvailability: { ...unconfirmed },
    intro: [
      "In Mumbai, part-time house help often works in several homes in the same building or neighbourhood, so a helper's timings matter as much as their skills.",
      "Across the Mumbai Metropolitan Region — the island city, the western and central suburbs, Thane and Navi Mumbai — finding someone who lives close by usually makes the arrangement more dependable.",
    ],
    localInformation: [
      "Many housing societies register domestic staff at the gate, and some ask for police verification before issuing an entry pass.",
      "Heavy monsoon rain can disrupt local trains and roads. Agree in advance what happens on days when travel isn't possible.",
      "Flats are often compact, so be specific about the size of your home — a 1 BHK may need far fewer hours than you expect.",
    ],
    faqs: [
      {
        question: "Can I find help in Thane or Navi Mumbai as well?",
        answer:
          "Open the MeeHelp app and enter your address to see the helpers available near you. Availability depends on your exact location.",
      },
      {
        question: "Does my society need to register my helper?",
        answer:
          "Many Mumbai societies do. Ask your society office what they need — usually a photo ID and sometimes a police verification form — before the helper's first day.",
      },
    ],
    seo: {
      title: "Domestic Help in Mumbai – Maids, Cooks & Care | MeeHelp",
      description:
        "Find house help in Mumbai, Thane and Navi Mumbai: maids, cooks, nannies, elder care and patient attendants near you, through the MeeHelp app.",
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
    serviceAvailability: { ...unconfirmed },
    intro: [
      "Delhi NCR spans Delhi, Gurugram, Noida, Ghaziabad and Faridabad, and homes range from independent floors to large gated societies.",
      "Because requirements vary so much, it helps to be precise about the size of your home, the tasks you need and the hours that suit you.",
    ],
    localInformation: [
      "Delhi Police and police in neighbouring NCR districts offer verification for domestic workers, and many RWAs and societies expect it.",
      "Summer heat and winter fog can affect travel. Agree timings that work across seasons.",
      "Gated societies in Gurugram and Noida usually issue staff passes through the society office or a visitor-management app.",
    ],
    faqs: [
      {
        question: "Can I find help in Gurugram and Noida?",
        answer:
          "Open the MeeHelp app and enter your address to see the helpers available near you. Availability depends on your exact location.",
      },
      {
        question: "How do I get police verification for my helper in Delhi?",
        answer:
          "Delhi Police offers domestic help verification, including online. Neighbouring districts have their own processes. Your RWA or society office can usually tell you what they need.",
      },
    ],
    seo: {
      title: "Domestic Help in Delhi NCR – Maids, Cooks & Care | MeeHelp",
      description:
        "Find house help across Delhi, Gurugram, Noida, Ghaziabad and Faridabad — maids, cooks, nannies, elder care and patient attendants, via MeeHelp.",
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
    serviceAvailability: { ...unconfirmed },
    intro: [
      "Many Bengaluru homes have two working adults with long or flexible hours, so help in the early morning and evening is often what families need most.",
      "With heavy traffic between neighbourhoods, a helper who lives nearby is usually more dependable than one travelling across the city.",
    ],
    localInformation: [
      "Kannada, Tamil, Telugu, Hindi and English are all widely spoken. Mention any language preference in your requirement.",
      "Apartment complexes typically register household staff at security and may ask for a photo ID.",
      "If you work flexible hours, agree a fixed daily window so the helper can plan work in other homes around it.",
    ],
    faqs: [
      {
        question: "Can I ask for a helper who speaks a particular language?",
        answer:
          "Yes. Mention the language you prefer when you post your requirement, and confirm it when you speak to the helper.",
      },
      {
        question: "Is MeeHelp available in my part of Bengaluru?",
        answer:
          "Open the MeeHelp app and enter your address to see the helpers available near you.",
      },
    ],
    seo: {
      title: "Domestic Help in Bengaluru – Maids, Cooks & Care | MeeHelp",
      description:
        "Find house help in Bengaluru — maids, cooks, nannies, elder care and patient care attendants who live near you. Connect through the MeeHelp app.",
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
    serviceAvailability: { ...unconfirmed },
    intro: [
      "Hyderabad's homes range from gated communities in the western IT corridor to older neighbourhoods in the heart of the city, and household routines vary just as much.",
      "Being clear about your timings, food preferences and the size of your home helps you find someone who fits.",
    ],
    localInformation: [
      "Telugu, Hindi, Urdu and English are commonly spoken. Mention any language preference.",
      "Gated communities usually register household staff and may issue ID cards or app-based passes.",
      "Summers are hot. Agree timings, breaks and drinking water for anyone working long hours.",
    ],
    faqs: [
      {
        question: "Can I find a cook for Hyderabadi or Andhra-style food?",
        answer:
          "Mention the cuisine you want when you post your requirement, and ask the cook for a trial meal before agreeing to a longer arrangement.",
      },
      {
        question: "Does MeeHelp cover Secunderabad?",
        answer:
          "Open the MeeHelp app and enter your address to see the helpers available near you.",
      },
    ],
    seo: {
      title: "Domestic Help in Hyderabad – Maids, Cooks & Care | MeeHelp",
      description:
        "Find house help in Hyderabad and Secunderabad — maids, cooks, nannies, elder care and patient attendants near you, through the MeeHelp app.",
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
    serviceAvailability: { ...unconfirmed },
    intro: [
      "In Chennai, many families look for help that fits a traditional daily rhythm — an early start in the kitchen, and cleaning done before the heat of the day.",
      "Be specific about your timings and food preferences to find a helper who fits your household.",
    ],
    localInformation: [
      "Tamil is the main language for most household staff. Mention if you need someone who also speaks English or Hindi.",
      "Many families want South Indian vegetarian cooking. Specify the dishes and style you are used to.",
      "During the north-east monsoon, flooding can disrupt travel in some areas. Agree a plan for those days.",
    ],
    faqs: [
      {
        question: "Can I find a cook for South Indian vegetarian food?",
        answer:
          "Yes — mention the food you want when you post your requirement, and try a sample meal before agreeing to a longer arrangement.",
      },
      {
        question: "Is MeeHelp available in my area of Chennai?",
        answer:
          "Open the MeeHelp app and enter your address to see the helpers available near you.",
      },
    ],
    seo: {
      title: "Domestic Help in Chennai – Maids, Cooks & Care | MeeHelp",
      description:
        "Find house help in Chennai — maids, cooks for South Indian meals, nannies, elder care and patient care attendants near you, through MeeHelp.",
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
    serviceAvailability: { ...unconfirmed },
    intro: [
      "Pune's households include young professionals sharing flats, families in large housing societies, and parents who have moved to be near their children.",
      "Whether you need a few hours of cleaning or full-day care for a parent, start by being clear about the tasks and timings.",
    ],
    localInformation: [
      "If you share a flat, agree between flatmates how tasks and payments will be split before hiring.",
      "Large societies, especially in newer areas, usually register household staff at the gate.",
      "Marathi and Hindi are the most common languages among household staff.",
    ],
    faqs: [
      {
        question: "Can flatmates hire one helper together?",
        answer:
          "Yes. Agree among yourselves who the main contact is and how payments will be split, then post one requirement for the whole flat.",
      },
      {
        question: "Does MeeHelp cover Pimpri-Chinchwad?",
        answer:
          "Open the MeeHelp app and enter your address to see the helpers available near you.",
      },
    ],
    seo: {
      title: "Domestic Help in Pune – Maids, Cooks & Care | MeeHelp",
      description:
        "Find house help in Pune and Pimpri-Chinchwad — maids, cooks, nannies, elder care and patient attendants near you, through the MeeHelp app.",
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
    serviceAvailability: { ...unconfirmed },
    intro: [
      "Many Kolkata homes include elderly family members, and families often look for help that covers both daily care and cooking.",
      "Being clear about who needs care, and which meals you need, helps you find the right person.",
    ],
    localInformation: [
      "If you need help for elderly parents, mention whether you also need cooking. Many families combine the two.",
      "Bengali is the main language for most household staff.",
      "Monsoon waterlogging can affect travel in some neighbourhoods. Agree a plan for those days.",
    ],
    faqs: [
      {
        question: "Can one person help with elder care and cooking?",
        answer:
          "Some helpers can do both. Mention both needs in your requirement and agree the daily routine before they start.",
      },
      {
        question: "Does MeeHelp cover Salt Lake and New Town?",
        answer:
          "Open the MeeHelp app and enter your address to see the helpers available near you.",
      },
    ],
    seo: {
      title: "Domestic Help in Kolkata – Maids, Cooks & Care | MeeHelp",
      description:
        "Find house help in Kolkata, Salt Lake and New Town — maids, cooks, nannies, elder care and patient care attendants near you, through MeeHelp.",
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
    serviceAvailability: { ...unconfirmed },
    intro: [
      "Many Ahmedabad households want vegetarian or Jain cooking, and food preferences are often the first thing families mention when looking for a cook.",
      "For cleaning and care, timings that fit around family routines matter most.",
    ],
    localInformation: [
      "If you follow Jain food rules, write them down for the cook — including what not to use and when.",
      "Gujarati and Hindi are the most common languages among household staff.",
      "Summers are very hot. Agree working hours, breaks and drinking water for long shifts.",
    ],
    faqs: [
      {
        question: "Can I find a cook for Jain food in Ahmedabad?",
        answer:
          "Mention Jain cooking when you post your requirement, and confirm the specific rules with the cook before they start.",
      },
      {
        question: "Does MeeHelp cover Gandhinagar?",
        answer:
          "Open the MeeHelp app and enter your address to see the helpers available near you.",
      },
    ],
    seo: {
      title: "Domestic Help in Ahmedabad – Maids, Cooks & Care | MeeHelp",
      description:
        "Find house help in Ahmedabad and Gandhinagar — maids, cooks for veg and Jain food, nannies, elder care and patient attendants, via MeeHelp.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-17",
  },
];
