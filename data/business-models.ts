import type { BusinessModel, Confirmed } from "@/lib/content/types";

/**
 * MeeHelp's two customer propositions, at business level (both confirmed).
 * Which SERVICES and CITIES support each model is configured separately in
 * data/services.ts (models) and data/cities.ts (availability) — never assume
 * that a business-level model applies to every service or city.
 *
 * Copy here describes the journeys only; it must stay true for every service.
 */
export interface BusinessModelConfig {
  confirmed: Confirmed;
  /** Name of the customer journey, used in headings. */
  name: string;
  summary: string;
}

export const businessModels: Record<BusinessModel, BusinessModelConfig> & {
  onDemand: { bookingTypes: { instant: Confirmed; scheduled: Confirmed; hourly: Confirmed } };
} = {
  marketplace: {
    confirmed: true,
    name: "Find and hire a helper",
    summary:
      "Review helper profiles, choose a plan for the number of helper contacts you need, contact helpers directly and agree the work and salary with them yourself.",
  },
  onDemand: {
    confirmed: true,
    name: "Book on-demand help",
    summary: "Book help through the MeeHelp app — instantly, for a scheduled time, or by the hour.",
    bookingTypes: { instant: true, scheduled: true, hourly: true },
  },
};
