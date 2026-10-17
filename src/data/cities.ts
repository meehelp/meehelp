import type { Availability, BusinessModel, City, ServiceSlug } from "@/lib/content/types";

/**
 * The eight active metros. CONFIRMED in the Phase 4 brief (2026-10-17):
 * every service is available in every listed city for BOTH the marketplace
 * and on-demand models. This is city-level availability — it is never a claim
 * that a particular locality is served.
 *
 * `facts` are practical, general knowledge about hiring or booking help in
 * the city (languages, housing and society rules, seasons, cuisine,
 * festivals, travel). They are tagged by service and model so each page uses
 * only what is relevant. They must never contain statistics, demand figures,
 * helper counts, response times or claims that a locality is served.
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
const CARE: ServiceSlug[] = ["elder-care", "patient-care"];
const PEOPLE: ServiceSlug[] = ["babysitter-nanny", "elder-care", "patient-care"];
const HOME_HELP: ServiceSlug[] = ["maid", "cook"];

export const cities: City[] = [
  {
    slug: "mumbai",
    name: "Mumbai",
    region: "Maharashtra",
    displayName: "Mumbai & MMR",
    includes: ["Thane", "Navi Mumbai"],
    marketActive: true,
    availability: allServicesAvailable(),
    descriptors: {
      areas: "Mumbai, Thane and Navi Mumbai",
      languages: "Marathi, Hindi, Gujarati and English",
      cuisine: "Maharashtrian, Gujarati, Konkani and Jain",
      festivals: "Ganesh Chaturthi and Diwali",
      festival: "Ganesh Chaturthi",
    },
    facts: [
      { text: "Heavy monsoon rain between June and September can disrupt local trains and roads. Agree in advance what happens on days when travel isn't possible." },
      { models: M, text: "Many housing societies register domestic staff at the gate, and some ask for a police verification form before issuing an entry pass." },
      { models: O, text: "For a single visit, many societies log the helper as a visitor or through a visitor-management app. Approve the entry before the booked time so the helper isn't held at the gate." },
      { services: ["maid"], text: "Flats are often compact, so be specific about the number of rooms and bathrooms — a 1 BHK can need far fewer hours than you might expect." },
      { services: ["cook"], text: "Kitchens are often small. Tell the cook about your stove, storage and any appliances before they start." },
      { services: ["cook"], text: "Home cooking ranges from Maharashtrian and Konkani food to Gujarati and Jain meals, so be specific about the dishes, spice level and any food rules you follow." },
      { services: ["babysitter-nanny"], models: M, text: "Long commutes mean many parents leave early and get home late. Agree fixed start and finish times with a nanny, and a plan for days when trains are delayed." },
      { services: ["babysitter-nanny"], models: O, text: "Travel across the city can take longer than expected, so book the babysitter for enough time to cover your journey home." },
      { services: CARE, text: "Some older buildings have no lift. If the person being cared for lives on an upper floor, say whether the attendant will need to help with stairs." },
      { services: CARE, text: "Hospital and clinic visits can take a long time in city traffic. Agree whether the attendant goes along and how travel is paid." },
      { services: HOME_HELP, models: O, text: "Ganesh Chaturthi and Diwali are when many homes want extra cleaning and cooking help, so book ahead if you need help before a festival." },
      { services: PEOPLE, models: M, text: "Marathi, Hindi, Gujarati and English are all widely spoken. Check the language you prefer when you speak to helpers." },
    ],
    faqs: [
      {
        models: M,
        question: "Does my society need to register my helper?",
        answer: "Many Mumbai societies do. Ask your society office what they need — usually a photo ID and sometimes a police verification form — before the helper's first day.",
      },
      {
        models: O,
        question: "Do I need to tell my society about a one-time booking?",
        answer: "It helps. Many Mumbai societies log visiting helpers at the gate or through a visitor-management app, so approve the entry before the booked time.",
      },
      {
        services: CARE,
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
    descriptors: {
      areas: "Delhi, Gurugram and Noida",
      languages: "Hindi, Punjabi and English",
      cuisine: "North Indian and Punjabi",
      festivals: "Diwali, Holi and the winter wedding season",
      festival: "Diwali",
    },
    facts: [
      { text: "Summer heat and winter fog can affect travel. Agree timings that work across the seasons." },
      { models: M, text: "Delhi Police and the police in neighbouring NCR districts offer verification for domestic workers, and many RWAs and societies expect it." },
      { models: O, text: "Gated societies in Gurugram and Noida usually log visiting helpers through the gate or a visitor-management app. Approve the entry before the booked time." },
      { services: ["maid"], text: "Homes range from compact flats to multi-storey independent floors. Count the floors, rooms, bathrooms and terraces when you decide how much help you need." },
      { services: ["maid"], models: M, text: "Dust builds up quickly in dry months, so many households agree more frequent dusting and mopping in summer." },
      { services: ["cook"], text: "Many households want North Indian and Punjabi home cooking — rotis, dals and sabzis — so be clear about the dishes you eat every day and how much oil and spice you like." },
      { services: ["cook"], models: O, text: "The winter wedding season and Diwali bring many family gatherings. If you need a cook for guests, book ahead." },
      { services: ["babysitter-nanny"], text: "Distances between Delhi, Gurugram and Noida are large. A babysitter or nanny who lives close to your sector is far more practical day to day." },
      { services: CARE, text: "Air quality is often poor between October and January. Agree with the attendant when walks should move indoors." },
      { services: CARE, text: "Extreme heat in May and June makes hydration and cool rest breaks especially important for older people and patients." },
      { services: ["maid"], models: O, text: "Diwali and Holi are when many homes want extra cleaning, so book ahead if you need help before a festival." },
      { services: PEOPLE, models: M, text: "Hindi is widely spoken, along with Punjabi and English. Check the language you prefer when you speak to helpers." },
    ],
    faqs: [
      {
        models: M,
        question: "How do I get police verification for a helper in Delhi NCR?",
        answer: "Delhi Police offers domestic help verification, including online. Gurugram, Noida and the other NCR districts have their own processes — your RWA or society office can usually tell you what they need.",
      },
      {
        models: O,
        question: "Will a visiting helper be allowed into my society?",
        answer: "Most gated societies in Gurugram and Noida log visitors at the gate or through an app. Approve the entry before the booked time so the helper isn't held up.",
      },
      {
        services: CARE,
        question: "What should an attendant do on high-pollution days?",
        answer: "Agree in advance that walks move indoors on bad air-quality days, and follow any advice from your doctor about outdoor activity.",
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
    descriptors: {
      areas: "Bengaluru",
      languages: "Kannada, Tamil, Telugu, Hindi and English",
      cuisine: "South Indian, North Indian and everyday family",
      festivals: "Ugadi, Ganesha Chaturthi and Diwali",
      festival: "Ugadi",
    },
    facts: [
      { text: "Traffic between neighbourhoods can be slow at peak hours, so a helper who lives nearby is usually more dependable." },
      { models: M, text: "Apartment complexes typically register household staff at security and may ask for a photo ID." },
      { models: O, text: "Most apartment complexes log visiting helpers at security or through an app. Approve the entry before the booked time." },
      { services: ["maid"], text: "Many households have two working adults with flexible hours. Agree a fixed daily window so the helper can plan work in other homes around it." },
      { services: ["cook"], text: "Many homes mix South Indian and North Indian cooking. Tell the cook which you eat on which days and how spicy you like it." },
      { services: ["cook"], models: O, text: "If you work from home, schedule cooking for a time that fits around your calls, so the kitchen isn't busy when you need quiet." },
      { services: ["babysitter-nanny"], text: "With many families living away from grandparents, agree a clear backup plan for days when the babysitter or nanny can't come." },
      { services: CARE, text: "Many parents move to Bengaluru to be near their children. If your parent is new to the city, an attendant who speaks their language helps them settle in." },
      { services: CARE, text: "Clinic and hospital trips across the city can take a long time at peak hours. Agree whether the attendant goes along and how travel is paid." },
      { services: HOME_HELP, models: O, text: "Ugadi, Ganesha Chaturthi and Diwali are when many homes want extra cleaning and cooking help, so book ahead if you need help before a festival." },
      { services: PEOPLE, models: M, text: "Kannada, Tamil, Telugu, Hindi and English are all common. Check the language you prefer when you speak to helpers." },
    ],
    faqs: [
      {
        services: PEOPLE,
        models: M,
        question: "Can I find a helper who speaks a particular language?",
        answer: "Bengaluru has a very mixed population, so it's worth checking. Look for it in helper profiles and confirm it when you speak to the helper.",
      },
      {
        models: O,
        question: "Will security let a visiting helper into my apartment complex?",
        answer: "Most complexes log visitors at the gate or through an app. Approve the entry before the booked time so the helper isn't held up.",
      },
      {
        services: ["cook"],
        question: "Can I ask for both South Indian and North Indian cooking?",
        answer: "Yes — many Bengaluru homes eat both. Tell the cook which dishes you want on which days.",
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
    descriptors: {
      areas: "Hyderabad and Secunderabad",
      languages: "Telugu, Hindi, Urdu and English",
      cuisine: "Hyderabadi, Andhra and North Indian",
      festivals: "Sankranti, Bonalu, Eid and Diwali",
      festival: "Sankranti",
    },
    facts: [
      { text: "Summers are very hot, especially from April to June. Agree working hours, breaks and drinking water for longer visits." },
      { models: M, text: "Gated communities usually register household staff and may issue ID cards or app-based passes." },
      { models: O, text: "Gated communities usually log visiting helpers through the gate or an app. Approve the entry before the booked time." },
      { services: ["maid"], text: "Homes range from large gated-community flats to older independent houses. Mention the size and layout of your home when you decide how much help you need." },
      { services: ["cook"], text: "Many households cook Hyderabadi or Andhra-style food, which can be much spicier than North Indian cooking. Be clear about spice levels." },
      { services: ["cook"], models: O, text: "Festivals such as Sankranti and Eid bring family meals and guests. If you need a cook for a festival, book ahead." },
      { services: ["babysitter-nanny"], text: "Long commutes to the IT corridors are common. Agree start and finish times that leave room for traffic." },
      { services: CARE, text: "Heat in the summer months makes hydration and cool rest breaks especially important for older people and patients." },
      { services: CARE, models: M, text: "If your parent is more comfortable in Telugu or Urdu, check this when you speak to attendants." },
      { services: ["maid"], models: O, text: "Sankranti, Bonalu and Diwali are when many homes want extra cleaning, so book ahead if you need help before a festival." },
      { services: ["babysitter-nanny", "maid", "cook"], models: M, text: "Telugu, Hindi, Urdu and English are commonly spoken. Check the language you prefer when you speak to helpers." },
    ],
    faqs: [
      {
        services: ["cook"],
        question: "Can I find a cook for Hyderabadi or Andhra-style food?",
        answer: "Tell the cook the cuisine and spice level you want, and ask for a trial meal before a longer arrangement.",
      },
      {
        models: O,
        question: "Will a visiting helper be let into my gated community?",
        answer: "Most communities log visitors at the gate or through an app. Approve the entry before the booked time.",
      },
      {
        services: CARE,
        question: "How can an attendant help my parent through the hot months?",
        answer: "Agree regular water and rest breaks, keep outings to cooler parts of the day, and follow your doctor's advice on heat.",
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
    descriptors: {
      areas: "Chennai",
      languages: "Tamil and English",
      cuisine: "South Indian vegetarian and Chettinad",
      festivals: "Pongal, Navaratri and Diwali",
      festival: "Pongal",
    },
    facts: [
      { text: "Heavy rain during the north-east monsoon, from October to December, can flood roads in some areas. Agree a plan for those days." },
      { models: M, text: "Apartment associations often keep a register of household staff, and some ask for a photo ID." },
      { models: O, text: "Apartment security often logs visiting helpers. Approve the entry before the booked time." },
      { services: ["maid"], text: "Many households like cleaning done early, before the heat of the day. Mention the time slot you prefer." },
      { services: ["cook"], text: "Many households want South Indian vegetarian cooking — sambar, rasam, poriyal — while others prefer Chettinad dishes. Specify the dishes and style you're used to." },
      { services: ["cook"], models: O, text: "Pongal and Navaratri bring traditional festival dishes and guests. If you need a cook for a festival, book ahead." },
      { services: ["babysitter-nanny"], text: "Heat and humidity for much of the year mean more time indoors. Agree indoor play and nap routines with the babysitter or nanny." },
      { services: CARE, text: "Heat and humidity for most of the year make hydration and rest breaks especially important for older people and patients." },
      { services: PEOPLE, models: M, text: "Tamil is the main language for most household staff. Mention if you need someone who also speaks English or Hindi." },
      { services: ["maid"], models: O, text: "Pongal and Diwali are when many homes want a thorough clean, so book ahead if you need help before a festival." },
      { services: ["maid", "cook"], models: M, text: "Tamil is the main language for most household staff. Mention if you need someone who also speaks English or Hindi." },
    ],
    faqs: [
      {
        services: ["cook"],
        question: "Can I find a cook for South Indian vegetarian food?",
        answer: "Yes — tell the cook the dishes and style you want, and ask for a trial meal before agreeing to a longer arrangement.",
      },
      {
        question: "What happens on heavy-rain days during the monsoon?",
        answer: "Roads in some areas can flood between October and December. Agree in advance how you'll handle days when travel isn't safe.",
      },
    ],
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
    descriptors: {
      areas: "Pune and Pimpri-Chinchwad",
      languages: "Marathi, Hindi and English",
      cuisine: "Maharashtrian and North Indian",
      festivals: "Ganeshotsav and Diwali",
      festival: "Ganeshotsav",
    },
    facts: [
      { text: "Monsoon rain from June to September can slow travel. Agree a plan for heavy-rain days." },
      { models: M, text: "Large housing societies, especially in newer areas, usually register household staff at the gate." },
      { models: O, text: "Housing societies usually log visiting helpers at the gate or through an app. Approve the entry before the booked time." },
      { services: ["maid"], models: M, text: "If you share a flat, agree between flatmates who the main contact is and how the helper's salary will be split." },
      { services: ["maid"], models: O, text: "Shared flats often book a thorough clean between tenants or when someone moves out." },
      { services: ["cook"], text: "Many households want Maharashtrian home food — bhakri, varan, usal — alongside North Indian dishes. Tell the cook which you prefer." },
      { services: ["cook"], models: O, text: "Ganeshotsav and Diwali bring guests and festival cooking. If you need a cook for a festival, book ahead." },
      { services: ["babysitter-nanny"], text: "Many young families have moved to Pune for work, away from grandparents. Agree a backup plan for days when the babysitter or nanny can't come." },
      { services: CARE, text: "Many parents relocate to Pune to be near their children. An attendant who speaks their language can help them settle in." },
      { services: CARE, text: "Clinic and hospital trips can take time in peak-hour traffic. Agree whether the attendant goes along and how travel is paid." },
      { services: ["maid"], models: O, text: "Ganeshotsav and Diwali are when many homes want extra cleaning, so book ahead if you need help before a festival." },
      { services: PEOPLE, models: M, text: "Marathi and Hindi are the most common languages, along with English. Check the language you prefer when you speak to helpers." },
    ],
    faqs: [
      {
        services: ["maid"],
        models: M,
        question: "Can flatmates hire one helper together?",
        answer: "Yes. Agree among yourselves who the main contact is and how the salary will be split before you speak to helpers.",
      },
      {
        models: O,
        question: "Can I book a clean when moving out of a flat?",
        answer: "Yes — schedule a visit for moving day or just before, and book enough hours for the size of the flat.",
      },
      {
        services: ["cook"],
        question: "Can I find a cook for Maharashtrian food?",
        answer: "Tell the cook the dishes you want, and ask for a trial meal before a longer arrangement.",
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
    descriptors: {
      areas: "Kolkata, Salt Lake and New Town",
      languages: "Bengali, Hindi and English",
      cuisine: "Bengali and Marwari vegetarian",
      festivals: "Durga Puja, Kali Puja and Diwali",
      festival: "Durga Puja",
    },
    facts: [
      { text: "Monsoon waterlogging can affect travel in some neighbourhoods. Agree a plan for heavy-rain days." },
      { models: M, text: "Apartment buildings and housing complexes often register household staff and may ask for a photo ID." },
      { models: O, text: "Apartment complexes often log visiting helpers at the gate. Approve the entry before the booked time." },
      { services: ["maid"], text: "Many older houses and flats have high ceilings and large rooms. Describe your home so the helper can plan the work." },
      { services: ["cook"], text: "Many households cook Bengali food, including fish and rice dishes, while Marwari households often want vegetarian meals. Be specific about what you eat." },
      { services: ["cook"], models: O, text: "Durga Puja and Kali Puja bring family gatherings and festival cooking. If you need a cook for the pujas, book ahead." },
      { services: ["babysitter-nanny"], text: "If grandparents help with childcare, agree how the babysitter or nanny will share the day with them." },
      { services: CARE, text: "Many Kolkata homes include elderly family members. If you need help with both care and cooking, mention both — some attendants can help with simple meals." },
      { services: CARE, text: "Humidity in the summer and monsoon months makes hydration and rest breaks important for older people and patients." },
      { services: ["maid"], models: O, text: "Durga Puja and Diwali are when many homes want a thorough clean, so book ahead if you need help before a festival." },
      { services: PEOPLE, models: M, text: "Bengali is the main language for most household staff, with Hindi also common. Check the language you prefer when you speak to helpers." },
    ],
    faqs: [
      {
        services: CARE,
        question: "Can one person help with elder care and simple cooking?",
        answer: "Some attendants can prepare simple meals. Mention both needs and agree the daily routine before they start.",
      },
      {
        services: ["cook"],
        question: "Can I find a cook for Bengali food?",
        answer: "Tell the cook the dishes you want — including fish preparations if you eat them — and ask for a trial meal before a longer arrangement.",
      },
      {
        models: O,
        question: "Can I book extra help for Durga Puja?",
        answer: "Yes — schedule the visit ahead of the festival and book enough hours for the cleaning or cooking you need.",
      },
    ],
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
    descriptors: {
      areas: "Ahmedabad and Gandhinagar",
      languages: "Gujarati, Hindi and English",
      cuisine: "Gujarati vegetarian and Jain",
      festivals: "Navratri, Uttarayan and Diwali",
      festival: "Navratri",
    },
    facts: [
      { text: "Summers are very hot. Agree working hours, breaks and drinking water for longer visits." },
      { models: M, text: "Housing societies often register household staff at the gate and may ask for a photo ID." },
      { models: O, text: "Housing societies often log visiting helpers at the gate or through an app. Approve the entry before the booked time." },
      { services: ["maid"], text: "Fine dust in the dry months means many households want dusting and mopping more often. Mention how often you need it." },
      { services: ["cook"], text: "Many households want Gujarati vegetarian or Jain cooking. If you follow Jain food rules, write them down for the cook — including what not to use and when." },
      { services: ["cook"], models: O, text: "Navratri and Diwali bring guests and festival snacks. If you need a cook for a festival, book ahead." },
      { services: ["babysitter-nanny"], text: "During the hottest months, agree indoor play and nap routines and keep outings to the cooler parts of the day." },
      { services: CARE, text: "Extreme heat in summer makes hydration and cool rest breaks especially important for older people and patients." },
      { services: CARE, models: M, text: "If your parent is most comfortable in Gujarati, check this when you speak to attendants." },
      { services: ["maid"], models: O, text: "Navratri and Diwali are when many homes want a thorough clean, so book ahead if you need help before a festival." },
      { services: ["babysitter-nanny", "maid", "cook"], models: M, text: "Gujarati and Hindi are the most common languages. Check the language you prefer when you speak to helpers." },
    ],
    faqs: [
      {
        services: ["cook"],
        question: "Can I find a cook for Jain food in Ahmedabad?",
        answer: "Tell the cook you need Jain food, and confirm the specific rules — including what not to use and when — before they start.",
      },
      {
        models: O,
        question: "Can I book extra help before Navratri or Diwali?",
        answer: "Yes — schedule a visit ahead of the festival and book enough hours for the cleaning or cooking you need.",
      },
      {
        services: CARE,
        question: "How can an attendant help my parent in the summer heat?",
        answer: "Agree regular water and rest breaks, keep outings to cooler times of day, and follow your doctor's advice on heat.",
      },
    ],
    seo: {
      title: "Domestic Help in Ahmedabad – Maids, Cooks & Care | MeeHelp",
      description: "Find house help in Ahmedabad and Gandhinagar — maids, cooks for veg and Jain food, nannies, elder care and patient attendants, via MeeHelp.",
    },
    publishStatus: "review",
    updatedAt: "2026-10-17",
  },
];
