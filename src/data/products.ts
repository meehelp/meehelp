import type { OnDemandProduct } from "@/lib/content/types";

/**
 * On-demand PRODUCT pages (SEO batch 1).
 *
 * /one-time-cleaning/ owns the one-time / one-off home cleaning intent: the
 * maid "On the go" flow (one visit, at least two tasks, 120/150/180 minutes,
 * book now or schedule). /hourly-maid/ owns hourly maid / maid for a few
 * hours (2–12 hour scheduled bookings). The two pages are separate products
 * and are NOT canonical to each other.
 *
 * Every statement reuses facts that were already approved for /hourly-maid/
 * (src/data/product-facts.ts, evidence ids in src/data/evidence.ts). App
 * mechanics are rendered from product facts, not typed here. No prices, no
 * arrival times, no guarantees.
 */
export const products: OnDemandProduct[] = [
  {
    slug: "one-time-cleaning",
    service: "maid",
    model: "onDemand",
    bookNow: true,
    name: "One-Time Cleaning",
    shortName: "One-time cleaning",
    headline: "Book a one-time home clean when you need it",
    description: [
      "Book one cleaning visit through the MeeHelp app when the house needs extra help. Choose the cleaning tasks, tell us about your home and select an available visit.",
      "It's a one-off booking with no monthly commitment. Book again whenever the house needs it.",
    ],
    steps: [
      { title: "Choose your tasks", body: "Pick at least two cleaning tasks in the app — for example dishes, bathrooms, floors, dusting or laundry." },
      { title: "Tell us about your home", body: "The app asks for your house size and the number of bathrooms." },
      { title: "Choose the length of the visit", body: "Pick a 120, 150 or 180-minute visit." },
      { title: "Book now or schedule", body: "Book now, or schedule the visit for a start time in the next few days." },
      { title: "Confirm in the app", body: "Pay part of the amount online to confirm. You pay the rest to the helper after the job." },
    ],
    useCases: [
      "Your regular maid is on leave and the dishes and floors are piling up.",
      "Guests are arriving and the house needs a proper clean first.",
      "The week got away from you and the bathrooms and laundry need catching up.",
    ],
    tasksIncluded: [
      "Washing dishes and wiping kitchen counters",
      "Cleaning bathrooms and toilets",
      "Sweeping and mopping floors",
      "Dusting furniture and surfaces",
      "Laundry — machine or hand wash",
    ],
    tasksExcluded: [
      "Bringing cleaning machines or materials — keep your own supplies ready",
      "Cooking — book an hourly cook instead",
      "Pest control, painting or appliance repair",
      "Cleaning outside windows or anything at height without safe access",
    ],
    sharedFactIds: ["o.included", "o.gender", "o.pin", "b.coverage"],
    safeguards: ["Show the helper which rooms and tasks come first, and which products to use on which surfaces."],
    faqs: [
      {
        question: "How long is a one-time cleaning visit?",
        answer: "You choose a 120, 150 or 180-minute visit when you book.",
      },
      {
        question: "Can I book a cleaning visit for today?",
        answer: "You can book now in the app, or schedule a visit up to 5 days ahead. Whether someone can come depends on which helpers are free near your address.",
      },
      {
        question: "Do I need to give the cleaner supplies?",
        answer: "Yes. Helpers don't bring cleaning machines or materials, so keep a mop, bucket, brushes and cleaning liquids ready.",
      },
      {
        question: "How do I pay for a one-time clean?",
        answer: "You pay part of the amount online in the app to confirm the booking, and pay the rest directly to the helper, in cash, once the job is done.",
      },
      {
        question: "How is this different from booking an hourly maid?",
        answer: "A one-time clean is one shorter visit for everyday cleaning tasks. For bigger jobs that need more time, you can book hourly help for 2 to 12 hours instead.",
      },
    ],
    alternative: {
      heading: "Need more time?",
      body: "For larger household jobs, MeeHelp also lets you book hourly help for 2 to 12 hours. Hourly help is better suited when the work needs more time than a standard one-time cleaning visit.",
      href: "/hourly-maid/",
      label: "Book hourly maid help",
    },
    seo: {
      title: "One-Time Home Cleaning Service | MeeHelp",
      description:
        "Book a one-time home cleaning visit with MeeHelp for dishes, bathrooms, floors, dusting and laundry. Choose your visit in the app, subject to availability.",
    },
    publishStatus: "published",
    updatedAt: "2026-10-22",
  },
];

export const productPath = (slug: OnDemandProduct["slug"]) => `/${slug}/`;
