import type { Claim, TrustMetric } from "@/lib/content/types";

/**
 * Central, business-controlled configuration.
 *
 * RULES
 * - Never invent numbers. A metric renders only when `approved` is true and
 *   `value`, `source` and `asOf` are all set.
 * - A claim renders only when `enabled` is true AND `approvedBy`/`approvedOn`
 *   are set. `npm test` fails if a claim is enabled without approval details.
 * - Verification-type claims are disabled by default (see `claims` below).
 */

export const business = {
  brandName: "MeeHelp",
  /**
   * The app's About screen shows "Mehp Technologies Pvt Ltd". Confirm the exact
   * registered name before setting it; it is used in the footer and schema.
   */
  legalName: null as string | null,
  /** One-line description used in metadata and schema. */
  summary:
    "MeeHelp is an app that helps households in India find maids, cooks, babysitters, elder care and patient care attendants near them.",
  logo: {
    src: "/brand/meehelp-logo.png",
    width: 465,
    height: 180,
    alt: "MeeHelp",
  },
  /** Official social profile URLs for Organization.sameAs — only add confirmed profiles. */
  sameAs: [] as string[],
  contact: {
    /** contact@meehelp.in appears in the apps' privacy policy. Enable once confirmed for website use. */
    email: { value: "contact@meehelp.in", enabled: false },
    phone: { value: null as string | null, enabled: false },
    whatsapp: { value: null as string | null, enabled: false },
  },
} as const;

export type ClaimKey =
  | "verifiedHelpers"
  | "backgroundChecks"
  | "noBrokerage"
  | "replacementSupport"
  | "inAppSupport"
  | "securePayments";

export const claims: Record<ClaimKey, Claim> = {
  verifiedHelpers: {
    enabled: false,
    text: "Verified helpers",
    detail: "Describe exactly what is verified, by whom, and when.",
    approvedBy: null,
    approvedOn: null,
    note:
      "DISABLED. The current in-app service guidelines say document verification is the employer's responsibility. Do not enable until the verification process is defined and approved.",
  },
  backgroundChecks: {
    enabled: false,
    text: "Background checks",
    detail: "Describe the type of check and the provider.",
    approvedBy: null,
    approvedOn: null,
    note: "DISABLED. Requires a documented, auditable process before any claim is made.",
  },
  noBrokerage: {
    enabled: false,
    text: "No brokerage",
    detail: "You don't pay an agent's commission to hire a helper.",
    approvedBy: null,
    approvedOn: null,
    note: "Existing in-app copy says 'zero brokerage'. Confirm it is still accurate for every service before enabling.",
  },
  replacementSupport: {
    enabled: false,
    text: "Replacement support",
    detail: "State the conditions and time window.",
    approvedBy: null,
    approvedOn: null,
    note: "Older in-app guidelines mention replacements; the current policy must be confirmed.",
  },
  inAppSupport: {
    enabled: false,
    text: "Support from the app",
    detail: "State support hours and channels.",
    approvedBy: null,
    approvedOn: null,
    note: "Confirm support channels and hours.",
  },
  securePayments: {
    enabled: false,
    text: "Pay in the app",
    detail: "Name the payment methods that are supported.",
    approvedBy: null,
    approvedOn: null,
    note: "Confirm which services support in-app payment.",
  },
};

/** Business statistics. All empty until real, dated figures are supplied. */
export const trustMetrics: TrustMetric[] = [
  { key: "playRating", label: "Google Play rating", value: null, source: null, asOf: null, approved: false },
  { key: "appStoreRating", label: "App Store rating", value: null, source: null, asOf: null, approved: false },
  { key: "downloads", label: "App downloads", value: null, source: null, asOf: null, approved: false },
  { key: "helpers", label: "Helpers registered", value: null, source: null, asOf: null, approved: false },
  { key: "bookings", label: "Bookings completed", value: null, source: null, asOf: null, approved: false },
];

/**
 * Structured-data switches.
 * FAQPage: since 2023 Google shows FAQ rich results only for well-known
 * government and health sites, so the markup brings no visible benefit for a
 * commercial site. It stays off by default; the implementation exists and
 * only ever describes FAQs that are visible on the page.
 */
export const schemaSettings = {
  faqPage: false,
  service: true,
  breadcrumbs: true,
} as const;
