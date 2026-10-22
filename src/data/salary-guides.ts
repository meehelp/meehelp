import type { SalaryGuide, SalaryRange } from "@/lib/content/types";

/**
 * SALARY GUIDES (SEO batch 1B) — informational pages about what households
 * pay a helper, which link on to the matching marketplace city page.
 *
 * Rules (enforced by tests and `npm run seo`):
 *   - Ranges are indicative MARKET figures, a rounded band informed by several
 *     current published sources and approved by the business (cross-checked,
 *     October 2026). They are never MeeHelp prices, never "average" figures and
 *     never legal, government or minimum rates — the disclosure says so, and is
 *     the only place those words may appear.
 *   - Rupee figures appear only on the guide page, and only these ranges.
 *   - MeeHelp's own charges (contact plans) are linked, never quoted here.
 *   - {year}, {reviewed} and {range:<key>} tokens are filled in by
 *     src/lib/content/salary-guides.ts, so the year and ranges are updated in one place.
 *   - Publishing needs a current evidenceReviewedOn date in the guide's year.
 */
export const salaryGuides: SalaryGuide[] = [
  {
    slug: "maid-salary",
    service: "maid",
    city: "mumbai",
    year: 2026,
    evidenceReviewedOn: "2026-10-22",
    name: "Maid Salary in Mumbai",
    headline: "Maid salary in Mumbai: what families may pay in {year}",
    intro: [
      "There is no single maid rate in Mumbai. What a household pays depends on how many hours the helper works, which tasks are included, how many days a week, and whether the helper goes home each day or lives in. Pin those down first, then compare salaries.",
      "As a rough guide for {year}: {range:part-time} a month for part-time help, {range:full-time-live-out} for a full-time maid who goes home each evening, and {range:live-in} for a live-in maid.",
    ],
    ranges: [
      { key: "part-time", arrangement: "Part-time maid / household help", min: 4500, max: 9000 },
      { key: "full-time-live-out", arrangement: "Full-time live-out maid", min: 14000, max: 22000 },
      { key: "live-in", arrangement: "Live-in maid", min: 18000, max: 28000, openEnded: true },
    ],
    disclosure:
      "These are indicative Mumbai market ranges, not fixed MeeHelp rates or guaranteed quotes. They are not averages, government rates or statutory minimum wages. Actual salary is agreed between the household and helper and can vary substantially with working hours, duties, experience, locality and household requirements.",
    sections: [
      {
        id: "part-time",
        title: "Part-time maid salary in Mumbai",
        rangeKey: "part-time",
        paragraphs: [
          "Most part-time house help in Mumbai works a fixed slot each day, often an hour or two in the morning, and moves between several flats in the same building or lane. The salary pays for that slot and the work agreed for it.",
          "A one-task arrangement, such as only jhadu-pocha or only dishes, is usually paid quite differently from a slot that covers sweeping, mopping, dishes and dusting together. Laundry or ironing on top takes more time and is usually paid for.",
          "The range is a guide, not a rule. A small flat with one task can sit below it; a large home with several tasks can sit above it.",
        ],
      },
      {
        id: "full-time",
        title: "Full-time live-out maid salary",
        rangeKey: "full-time-live-out",
        paragraphs: [
          "A full-time live-out maid comes in the morning and goes home in the evening, and usually covers most of the day's household work.",
          "\"Full-time\" means different things to different families. For one it is eight or more hours, for another a long morning. A four-hour slot is part-time, whatever it is called, so agree the actual start and finish times, the weekly off and the tasks rather than relying on the label.",
        ],
      },
      {
        id: "live-in",
        title: "Live-in maid salary (the \"24-hour maid\")",
        rangeKey: "live-in",
        paragraphs: [
          "A live-in maid stays in your home and helps through the day. When people search for a \"24-hour maid\", this is usually the arrangement they mean: someone who lives in, not someone who works for 24 hours straight. Working hours, rest time, meals and a weekly off still need to be agreed.",
          "Because the helper lives with you, tell them what room or space, meals and time off you can offer before you talk about salary.",
          "If the role also includes cooking, looking after a child or an older parent, or a much wider set of responsibilities, expect the salary to be higher than for cleaning alone.",
        ],
      },
      {
        id: "factors",
        title: "What changes the salary",
        paragraphs: ["Two families can pay very different amounts for help they both call \"a maid\". These are the things that move the figure:"],
        bullets: [
          "Hours per day — the biggest single factor",
          "Days per week, and how many days off",
          "Which cleaning tasks are included: sweeping, mopping, dusting, bathrooms",
          "Dishes",
          "Laundry, and whether it is by machine or by hand",
          "Ironing",
          "Cooking",
          "Looking after a child, an older person or someone unwell",
          "How many people live in the home",
          "The size of the home: number of rooms and bathrooms",
          "The helper's experience",
          "The locality",
          "How far the helper has to travel",
          "The time of the slot: early-morning and evening slots are often in demand",
          "For live-in help: the accommodation and meals provided",
        ],
      },
      {
        id: "by-work",
        title: "Salary by the work included",
        paragraphs: [
          "Moving down this list usually means more time each day, and so a higher salary. There is no fixed rupee amount for any one task: agree a total for the whole arrangement with the helper.",
        ],
        bullets: [
          "Sweeping and mopping only",
          "Sweeping, mopping and dishes",
          "All-round cleaning, including bathrooms and dusting",
          "Cleaning plus laundry and ironing",
          "Cleaning plus cooking",
          "Cleaning plus looking after a child or an older parent",
        ],
      },
      {
        id: "locality",
        title: "How locality and travel affect what helpers ask",
        paragraphs: [
          "Salaries differ across Mumbai, Thane and Navi Mumbai, but there isn't a reliable figure for each neighbourhood, so this guide doesn't give one.",
          "Travel usually matters more than the area name. A helper who already works in your society, or lives nearby, can keep a fixed slot more easily than someone who commutes by train or bus, and a long commute limits which slots they can offer.",
          "In many buildings the early-morning slots fill first, so a helper's free slots can affect what they ask.",
        ],
      },
      {
        id: "agree",
        title: "What to agree before you hire",
        paragraphs: ["Comparing salaries only makes sense once you know what you are paying for. Agree these with the helper, in writing if you can:"],
        bullets: [
          "Start and finish time, and the days of the week",
          "Exactly which tasks, room by room",
          "Live-out or live-in, and for live-in help the room, meals, rest hours and time off",
          "Whether cooking or looking after a child or an older parent is part of the role",
          "The weekly off and leave",
          "The monthly salary, how and when it is paid, and when it will be reviewed",
          "What happens on days the helper can't come",
          "The notice period on either side",
        ],
      },
    ],
    methodology: [
      "The ranges in the table are a rounded, indicative band informed by several current published sources on maid salaries in Mumbai: marketplace and agency price and salary guides, salary data published for Mumbai localities, salary expectations listed by individual live-in helpers, and a placement-based salary-trend report. No single source is treated as authoritative, and the table does not reproduce any one source's figures.",
      "The ranges describe what households and helpers in Mumbai agree in the market. They are not MeeHelp rates, not quotes, and not legal advice. For questions about your obligations as an employer, ask a qualified adviser.",
      "Evidence last reviewed: {reviewed}.",
    ],
    sources: [
      { name: "MyBuddyMaid", usedFor: "Current maid pricing published for Mumbai." },
      {
        name: "Helpers Near Me",
        usedFor: "Current salary data published for part-time maids in Mumbai, and for live-in maids in Mumbai localities.",
        links: [
          { href: "https://helpersnearme.com/jobs/en/part-time-maid-mumbai-maharashtra", label: "Part-time maid, Mumbai" },
          { href: "https://helpersnearme.com/jobs/en/live-in-maid-thane-mumbai", label: "Live-in maid, Thane" },
        ],
      },
      { name: "TrustedMaid", usedFor: "Current Mumbai pricing, and its salary guide with wage grids by suburb and shift." },
      { name: "BookMyBai", usedFor: "Salary expectations on current profiles of live-in helpers in Mumbai." },
      { name: "MyHelperIndia", usedFor: "Its 2026 domestic-helper salary-trend report, based on placement data." },
    ],
    faqs: [
      {
        question: "How much does a maid cost in Mumbai?",
        answer:
          "It depends on the arrangement. As an indicative guide for {year}: {range:part-time} a month for part-time help, {range:full-time-live-out} for a full-time maid who goes home each evening, and {range:live-in} for a live-in maid. Hours, tasks and whether the helper lives in make the biggest difference.",
      },
      {
        question: "What is the salary of a 24-hour maid in Mumbai?",
        answer:
          "A \"24-hour maid\" usually means a live-in maid, for whom an indicative range is {range:live-in} a month. It doesn't mean 24 hours of work: agree working hours, rest time and a weekly off with the helper.",
      },
      {
        question: "Is there one fixed maid rate in Mumbai?",
        answer:
          "No. The ranges on this page are indicative market figures, not fixed rates and not rates set by MeeHelp. The salary is agreed between your household and the helper.",
      },
      {
        question: "Does a MeeHelp contact plan include the maid's salary?",
        answer:
          "No. A contact plan covers getting in touch with helpers through MeeHelp. The helper's salary is separate: with Find & Hire, you agree it and pay it directly to the helper.",
      },
      {
        question: "How up to date are these figures?",
        answer: "The ranges were last checked in {reviewed} against several current published sources, and are reviewed again when the market moves.",
      },
    ],
    seo: {
      title: "Maid Salary in Mumbai {year}: Part-Time, Full-Time & Live-In",
      description:
        "See indicative maid salary and charges in Mumbai for part-time, full-time and live-in help in {year}, plus the factors that affect what families may pay.",
    },
    publishStatus: "published",
    updatedAt: "2026-10-22",
  },
];

/** Every rupee figure a guide may show (its range ends). */
export const salaryFigures = (guide: SalaryGuide): number[] => guide.ranges.flatMap((r: SalaryRange) => [r.min, r.max]);
