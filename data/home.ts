import type { Faq, PublishStatus, Seo } from "@/lib/content/types";

export const home: {
  headline: string;
  intro: string;
  audiences: { title: string; body: string }[];
  faqs: Faq[];
  seo: Seo;
  publishStatus: PublishStatus;
  updatedAt: string;
} = {
  headline: "Find house help, cooks, nannies and care attendants near you",
  intro:
    "MeeHelp is an app that connects households with domestic helpers for one-off, part-time and full-time work — so you can find the help your home needs, close to where you live.",
  audiences: [
    {
      title: "Working households",
      body: "Daily cleaning and cooking handled, so evenings and weekends are yours again.",
    },
    {
      title: "New and busy parents",
      body: "A babysitter or nanny for the hours you need, with time to meet them first.",
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
        "MeeHelp is a mobile app that helps households find domestic helpers near them — maids, cooks, babysitters and nannies, and elder care and patient care attendants.",
    },
    {
      question: "How do I find a helper on MeeHelp?",
      answer:
        "Download the app, sign in with your mobile number, and tell us the service, hours and address. You can then see helpers near you and speak to them before you decide.",
    },
    {
      question: "How much does it cost?",
      answer:
        "Charges depend on the service, the hours and the work involved. The app shows the charges for your requirement before you confirm anything.",
    },
    {
      question: "Is MeeHelp available in my area?",
      answer:
        "Open the app and enter your address to see the helpers available near you. Availability depends on your exact location and the service you need.",
    },
    {
      question: "Do I need the app, or can I book on the website?",
      answer:
        "Bookings are made in the MeeHelp app, which you can download from Google Play and the App Store.",
    },
  ],
  seo: {
    title: "MeeHelp – Maids, Cooks, Nannies & Care Attendants Near You",
    description:
      "Find maids, cooks, babysitters, elder care and patient care attendants near you. Choose one-off, part-time or full-time help with the MeeHelp app.",
  },
  publishStatus: "published",
  updatedAt: "2026-10-17",
};
