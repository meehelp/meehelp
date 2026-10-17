import type { HiringArrangement, Step } from "@/lib/content/types";

/**
 * MARKETPLACE journey (confirmed in the Phase 4 brief): search → choose a
 * contact plan → get contact details → contact directly → discuss and
 * negotiate → trial → hire directly. The arrangement is between customer and
 * helper. Promotions (e.g. free profile views) are never part of this copy.
 */
export const marketplaceSteps: Step[] = [
  { title: "Search for helpers", body: "Browse helpers near you in the MeeHelp app." },
  { title: "Choose a contact plan", body: "Pick a plan for the number of helpers you want to contact." },
  { title: "Contact helpers directly", body: "Use your plan to get helpers' contact details, and call the ones you like." },
  { title: "Discuss and agree terms", body: "Talk through the work, timings and salary with the helper directly." },
  { title: "Arrange a trial", body: "Invite the helper for a trial before you decide." },
  { title: "Hire directly", body: "Choose whom to hire. The working arrangement is between you and the helper." },
];

/** ON-DEMAND journey (confirmed: instant, scheduled and hourly booking for every category). */
export const onDemandSteps: Step[] = [
  { title: "Choose the help you need", body: "Pick the type of help in the MeeHelp app." },
  { title: "Book now or schedule", body: "Book instantly, or choose a date and time that suits you." },
  { title: "Choose the hours", body: "Book for as many hours as the work needs." },
  { title: "Confirm in the app", body: "Review the details and confirm your booking." },
];

/** The three booking types of the on-demand model. */
export const bookingTypes: { key: "instant" | "scheduled" | "hourly"; name: string; body: string }[] = [
  { key: "instant", name: "Instant", body: "Book for now, when you need help as soon as possible." },
  { key: "scheduled", name: "Scheduled", body: "Pick a date and time that suits you." },
  { key: "hourly", name: "Hourly", body: "Choose how many hours the visit should last." },
];

/** Arrangements a customer can agree directly with a helper they hire. */
export const hiringArrangements: Record<HiringArrangement, { name: string; body: string }> = {
  "part-time": {
    name: "Part-time",
    body: "A helper who comes on set days for a fixed number of hours, such as two hours every morning.",
  },
  "full-time": {
    name: "Full-time",
    body: "A helper for most of the day, with hours, meal breaks and a weekly off agreed with them.",
  },
};

/** Practical hiring advice for customers. Makes no claims about MeeHelp checks. */
export const sharedSafeguards: string[] = [
  "Speak to the helper on the phone, and meet them before they start.",
  "See their original ID in person when you meet.",
  "Many housing societies and local police ask households to register domestic staff. Check what your building and city require.",
  "Agree the tasks, hours, salary, weekly off and notice period clearly — in writing if you can.",
  "Start with a trial before you commit.",
  "Keep cash, jewellery and important documents locked away, especially in the first few weeks.",
];
