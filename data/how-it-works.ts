import type { EngagementKey, Step } from "@/lib/content/types";

/** Shared booking steps. Review against the current app flow before launch. */
export const defaultSteps: Step[] = [
  {
    title: "Download the MeeHelp app",
    body: "Install MeeHelp from Google Play or the App Store and sign in with your mobile number.",
  },
  {
    title: "Tell us what you need",
    body: "Choose the service, the hours you need help, and the address where the work will happen.",
  },
  {
    title: "Connect with helpers near you",
    body: "See helpers who match your requirement in your area, and speak to them before you decide.",
  },
  {
    title: "Agree the details and get started",
    body: "Confirm the tasks, timings and charges shown in the app, then manage your booking from your phone.",
  },
];

export const engagementTypes: Record<EngagementKey, { name: string; body: string }> = {
  "on-demand": {
    name: "On-demand",
    body: "One-off help for a few hours — for example, a thorough clean before guests arrive.",
  },
  "part-time": {
    name: "Part-time",
    body: "A helper who comes on set days for a fixed number of hours, such as two hours every morning.",
  },
  "full-time": {
    name: "Full-time",
    body: "A helper for most of the day, with hours, meal breaks and a weekly off agreed in advance.",
  },
};

/** Practical, honest hiring advice. Makes no claims about MeeHelp checks. */
export const sharedSafeguards: string[] = [
  "Meet the helper, or speak on a video call, before they start.",
  "Ask to see a government-issued photo ID, and keep a copy with their consent.",
  "Many housing societies and local police ask households to register domestic staff. Check what your building and city require.",
  "Agree the tasks, hours, pay, weekly off and notice period clearly — in writing if you can.",
  "Start with a trial day or a trial week where possible.",
  "Keep cash, jewellery and important documents locked away, especially in the first few weeks.",
];
