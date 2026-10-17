import type { Faq, PublishStatus, Seo } from "@/lib/content/types";

/**
 * Home page copy. The home page introduces BOTH propositions in clearly
 * separated sections (marketplace vs on-demand). Prices, free profile views
 * and verification wording are NOT written here — they come from
 * data/plans.ts and data/verification.ts.
 */
export const home: {
  headline: string;
  intro: string;
  audiences: { title: string; body: string }[];
  faqs: Faq[];
  seo: Seo;
  publishStatus: PublishStatus;
  updatedAt: string;
} = {
  headline: "Find domestic helpers near you, or book help at home",
  intro:
    "MeeHelp gives you two ways to get help at home: find and hire a helper directly, or book on-demand help through the app.",
  audiences: [
    {
      title: "Working households",
      body: "Daily cleaning and cooking handled, so evenings and weekends are yours again.",
    },
    {
      title: "New and busy parents",
      body: "A babysitter or nanny you have spoken to and met before you decide.",
    },
    {
      title: "Families caring for parents",
      body: "Company and day-to-day support for elderly parents, even when you live in another city.",
    },
    {
      title: "Patients recovering at home",
      body: "An attendant for personal care and mobility while someone gets back on their feet.",
    },
  ],
  faqs: [
    {
      question: "What is MeeHelp?",
      answer:
        "MeeHelp is a mobile app with two ways to get help at home. You can find domestic helpers — maids, cooks, babysitters and nannies, elder care and patient care attendants — and hire them directly. You can also book on-demand help through the app.",
    },
    {
      question: "How does finding and hiring a helper work?",
      answer:
        "You review helper profiles in the app, choose a plan for the number of helper contacts you need, and contact helpers directly. You discuss the work, agree the salary with the helper yourself, and can call them for a trial before you decide.",
    },
    {
      question: "What does it cost to find a helper?",
      answer:
        "MeeHelp doesn't charge a placement agency fee. You pay for a plan that gives you a number of helper contacts, and you agree the helper's salary directly with them.",
    },
    {
      question: "What is on-demand help?",
      answer:
        "On-demand help is booked through the MeeHelp app — instantly, for a scheduled time, or by the hour. Which kinds of help you can book depends on your area, so check in the app.",
    },
    {
      question: "Which cities does MeeHelp work in?",
      answer:
        "MeeHelp operates in the cities listed on this page. What is available depends on your exact area and the kind of help you need, so check in the app.",
    },
    {
      question: "Do I need the app?",
      answer:
        "Yes. Finding helpers and booking on-demand help both happen in the MeeHelp app, which you can download from Google Play and the App Store.",
    },
  ],
  seo: {
    title: "MeeHelp – Find Maids, Cooks & Nannies or Book Help at Home",
    description:
      "Find and hire maids, cooks, nannies, elder care and patient attendants directly, or book on-demand help at home. Get the MeeHelp app.",
  },
  publishStatus: "published",
  updatedAt: "2026-10-17",
};
