import type { BusinessModel, ServiceSlug } from "@/lib/content/types";

/**
 * SEO intent map — maintained input for GPT/Claude.
 *
 * These are INTENT TARGETS: the search intents and keyword concepts each page
 * is written to satisfy. They are NOT search-volume estimates; no keyword
 * volume source has been used, and none may be invented here.
 *
 * Per-page details (canonical, title, H1, meta) are derived from the route
 * registry and exported to docs/seo/intent-map.json by `npm run intent-map`.
 * City pages inherit their service × model intent with the city as modifier
 * (e.g. "maid in {city}").
 */
export interface IntentTarget {
  primaryIntent: string;
  primaryKeyword: string;
  supportingKeywords: string[];
  proposition: string;
  /** City-page keyword patterns; {city} is replaced per city. */
  cityKeywords: string[];
}

export const intentTargets: Record<ServiceSlug, Record<BusinessModel, IntentTarget>> = {
  maid: {
    marketplace: {
      primaryIntent: "Find and hire a maid / house help directly for a regular arrangement",
      primaryKeyword: "maid near me",
      supportingKeywords: ["hire maid", "find maid", "house help near me", "domestic helper near me", "maid hiring app", "domestic helper app", "find maid directly", "full-time maid", "part-time maid"],
      proposition: "Search helpers, buy a contact plan, contact and hire directly; salary agreed with the helper",
      cityKeywords: ["maid in {city}", "house help in {city}", "domestic helper in {city}"],
    },
    onDemand: {
      primaryIntent: "Book a one-time clean or a few hours of house help — now or scheduled",
      primaryKeyword: "hourly maid near me",
      supportingKeywords: ["instant maid", "maid for 2 hours", "book maid", "on demand maid", "hourly house help", "scheduled maid"],
      proposition: "Book a 120–180 minute clean (now or scheduled) or hourly house help in the app; bring-your-own supplies",
      cityKeywords: ["hourly maid in {city}", "book maid in {city}"],
    },
  },
  cook: {
    marketplace: {
      primaryIntent: "Find and hire a home cook directly for regular meals",
      primaryKeyword: "cook for home",
      supportingKeywords: ["find cook", "cook near me", "home cook", "hire cook", "live-in cook", "part-time cook"],
      proposition: "Search cooks by household size, contact them directly, agree a trial meal and the salary yourself",
      cityKeywords: ["cook in {city}", "home cook in {city}"],
    },
    onDemand: {
      primaryIntent: "Book a cook by the hour for guests, a family meal or meal prep",
      primaryKeyword: "hourly cook",
      supportingKeywords: ["book cook", "cook for party at home", "cook for a day", "cook for guests"],
      proposition: "Schedule a cook by the hour in the app (2–12 hours, up to 5 days ahead)",
      cityKeywords: ["hourly cook in {city}", "book cook in {city}"],
    },
  },
  "babysitter-nanny": {
    marketplace: {
      primaryIntent: "Find and hire a babysitter or nanny directly for regular childcare",
      primaryKeyword: "nanny near me",
      supportingKeywords: ["babysitter near me", "babysitter for home", "nanny for home", "full-time nanny", "baby care at home"],
      proposition: "Search nannies, contact and meet them, agree hours and salary directly",
      cityKeywords: ["nanny in {city}", "babysitter in {city}"],
    },
    onDemand: {
      primaryIntent: "Book a babysitter for a few hours",
      primaryKeyword: "hourly babysitter",
      supportingKeywords: ["babysitter for few hours", "book babysitter", "evening babysitter"],
      proposition: "Schedule baby care by the hour in the app (at least 2 hours ahead)",
      cityKeywords: ["hourly babysitter in {city}", "book babysitter in {city}"],
    },
  },
  "elder-care": {
    marketplace: {
      primaryIntent: "Find and hire an elder care attendant directly",
      primaryKeyword: "elder care at home",
      supportingKeywords: ["elderly caregiver", "elder care helper", "caretaker for elderly", "attendant for old age parents"],
      proposition: "Search attendants, contact them directly, agree routine and salary",
      cityKeywords: ["elder care in {city}", "elderly caregiver in {city}"],
    },
    onDemand: {
      primaryIntent: "Book elder care by the hour",
      primaryKeyword: "hourly elder care",
      supportingKeywords: ["on-demand elder care", "attendant for doctor visit", "elder care for few hours"],
      proposition: "Schedule non-medical elder care (company, routine) by the hour in the app",
      cityKeywords: ["hourly elder care in {city}"],
    },
  },
  "patient-care": {
    marketplace: {
      primaryIntent: "Find and hire a patient care attendant directly",
      primaryKeyword: "patient attendant",
      supportingKeywords: ["patient care at home", "patient care attendant", "attendant for bedridden patient", "home attendant after surgery"],
      proposition: "Search attendants, contact them directly, agree shifts and salary",
      cityKeywords: ["patient attendant in {city}", "patient care in {city}"],
    },
    onDemand: {
      primaryIntent: "Book a patient care attendant by the hour",
      primaryKeyword: "hourly patient care",
      supportingKeywords: ["patient attendant for few hours", "attendant after discharge", "caregiver relief"],
      proposition: "Schedule non-medical personal care for a patient by the hour in the app",
      cityKeywords: ["hourly patient care in {city}"],
    },
  },
};

export const siteIntents = {
  home: {
    primaryIntent: "Understand MeeHelp: hire a helper directly or book help by the hour",
    primaryKeyword: "domestic helper app",
    supportingKeywords: ["maid hiring app", "house help app", "book home help today", "MeeHelp"],
    proposition: "Two ways to get help at home: direct hiring (contact plans) or hourly booking",
  },
  pricing: {
    primaryIntent: "Compare MeeHelp contact plans before hiring directly",
    primaryKeyword: "MeeHelp plans",
    supportingKeywords: ["maid hiring app price", "helper contact plan", "MeeHelp subscription"],
    proposition: "Home, Office and Business plans give a set number of helper contacts",
  },
};
