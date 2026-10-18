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
  headline: "Hire a helper directly, or book help by the hour",
  intro:
    "MeeHelp gives you two ways to get help at home. Find a maid, cook, nanny or care attendant and hire them yourself — or book help in the app: a one-time clean, or a few hours of help scheduled ahead.",
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
        "MeeHelp is a mobile app with two ways to get help at home. You can find domestic helpers — maids, cooks, babysitters and nannies, elder care and patient care attendants — and hire them directly. Or you can book help in the app: a one-time clean, now or for later, or hourly help scheduled ahead.",
    },
    {
      question: "How does finding and hiring a helper work?",
      answer:
        "You search for helpers in the app, choose a contact plan, and contact the helpers you like directly. You discuss the work and agree the salary with the helper yourself, and you can agree a trial with them before you decide.",
    },
    {
      question: "What does it cost to find a helper?",
      answer:
        "You pay MeeHelp for a contact plan, which gives you a number of helper contacts. MeeHelp doesn't charge a placement agency fee, and the helper's salary is agreed and paid directly between you and the helper.",
    },
    {
      question: "How is booking by the hour different?",
      answer:
        "A booking is a single visit. One-time cleaning can be booked now or for later; hourly help, including cooking and care, is scheduled at least 2 hours ahead. There's no long-term arrangement; you book again whenever you need help.",
    },
    {
      question: "Which cities does MeeHelp work in?",
      answer:
        "Mumbai and the MMR, Delhi NCR, Bengaluru, Hyderabad, Chennai, Pune, Kolkata and Ahmedabad. Search or book from your address in the app to see what's available near you.",
    },
    {
      question: "Do I need the app?",
      answer:
        "Yes. Finding helpers and booking help by the hour both happen in the MeeHelp app, which you can download from Google Play and the App Store.",
    },
  ],
  seo: {
    title: "MeeHelp – Hire Maids, Cooks & Nannies or Book Hourly Help",
    description:
      "Find and hire maids, cooks, nannies, elder care and patient attendants directly, or book a one-time clean or hourly help in the MeeHelp app.",
  },
  publishStatus: "published",
  updatedAt: "2026-10-17",
};
