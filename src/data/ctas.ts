import type { BusinessModel } from "@/lib/content/types";

/**
 * Central CTA definitions. Pages pick a CTA by key — never write CTA labels inline.
 *
 * - `model` keeps journeys separate: marketplace pages may only use
 *   marketplace (or app) CTAs, on-demand sections only on-demand (or app) CTAs.
 *   `npm run seo` enforces this.
 * - `wording` records approval of the label. All labels are "proposed" until
 *   the business approves them.
 * - `destination` is the in-page app download section today. When deep linking
 *   is reviewed, `journey` identifies the app screen each CTA should open.
 */
export type CtaKey =
  | "findHelpers"
  | "findService"
  | "exploreHelpers"
  | "viewHelpers"
  | "choosePlan"
  | "bookNow"
  | "bookHourly"
  | "bookInstant"
  | "scheduleHelp"
  | "getApp";

export interface CtaDefinition {
  model: BusinessModel | "app";
  /** "{role}" is replaced with the service's roleWithArticle, e.g. "Find a maid". */
  label: string;
  wording: "proposed" | "approved";
  journey: "marketplace-search" | "marketplace-plans" | "on-demand-booking" | "app-home";
  destination: { type: "app-download-section"; anchor: "#get-the-app" };
  /** Restricts where the CTA may appear (instant CTAs: one-time cleaning pages only). */
  scope?: "one-time-cleaning";
}

const appSection = { type: "app-download-section", anchor: "#get-the-app" } as const;

export const ctas: Record<CtaKey, CtaDefinition> = {
  findHelpers: { model: "marketplace", label: "Find helpers", wording: "proposed", journey: "marketplace-search", destination: appSection },
  findService: { model: "marketplace", label: "Find {role}", wording: "proposed", journey: "marketplace-search", destination: appSection },
  exploreHelpers: { model: "marketplace", label: "Explore helpers", wording: "proposed", journey: "marketplace-search", destination: appSection },
  viewHelpers: { model: "marketplace", label: "View helper profiles", wording: "proposed", journey: "marketplace-search", destination: appSection },
  choosePlan: { model: "marketplace", label: "Choose a plan", wording: "proposed", journey: "marketplace-plans", destination: appSection },
  // Instant CTAs are for the one-time cleaning flow only (biz.instant-scope); npm run seo enforces it.
  bookNow: { model: "onDemand", label: "Book a clean now", wording: "proposed", journey: "on-demand-booking", destination: appSection, scope: "one-time-cleaning" },
  bookHourly: { model: "onDemand", label: "Book help in the app", wording: "proposed", journey: "on-demand-booking", destination: appSection },
  bookInstant: { model: "onDemand", label: "Book an instant clean", wording: "proposed", journey: "on-demand-booking", destination: appSection, scope: "one-time-cleaning" },
  scheduleHelp: { model: "onDemand", label: "Schedule help", wording: "proposed", journey: "on-demand-booking", destination: appSection },
  getApp: { model: "app", label: "Get the MeeHelp app", wording: "proposed", journey: "app-home", destination: appSection },
};

export function ctaLabel(key: CtaKey, role?: string): string {
  const label = ctas[key].label;
  return role ? label.replace("{role}", role) : label.replace(" {role}", "");
}
