import type { HiringArrangement, Step } from "@/lib/content/types";

/**
 * MARKETPLACE journey (confirmed in the Phase 3 brief): find → review profiles
 * → choose a contact plan → contact directly → discuss/negotiate/trial → hire.
 * The free profile view count is NOT written here; it comes from data/plans.ts.
 */
export const marketplaceSteps: Step[] = [
  { title: "Register on MeeHelp", body: "Download the app and sign up with your mobile number." },
  { title: "Review helper profiles", body: "Browse profiles of helpers near you who match what you need." },
  { title: "Choose a contact plan", body: "Pick a plan based on how many helpers you want to contact." },
  { title: "Contact helpers directly", body: "Call the helpers you would like to speak to." },
  {
    title: "Discuss, agree and try",
    body: "Talk through the work, timings and salary with the helper directly, and call them for a trial.",
  },
  {
    title: "Hire directly",
    body: "Decide whether to hire. If it doesn't work out, you can stop and speak to other helpers.",
  },
];

/**
 * ON-DEMAND journey — business-level only. Which services support it is not
 * yet confirmed, so this is used only in clearly separated on-demand sections.
 */
export const onDemandSteps: Step[] = [
  { title: "Choose the help you need", body: "Pick the type of help in the MeeHelp app." },
  { title: "Pick a time", body: "Book instantly, schedule for later, or book by the hour." },
  { title: "Confirm in the app", body: "Review the details and confirm your booking." },
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
