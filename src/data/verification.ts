/**
 * Helper verification facts. The ONLY source of verification wording.
 *
 * A check produces customer-facing wording only when `enabled` is true and
 * `approvedBy`/`approvedOn` are recorded. `npm test` and `npm run seo` fail if
 * a production page implies a check that is not enabled (see lib/guards).
 *
 * Phase 4.6 final wording (business confirmation, 2026-10-18):
 *   - the helper's mobile number is verified by OTP;
 *   - the helper's Aadhaar DOCUMENT is collected and MANUALLY reviewed by MeeHelp.
 *     Electronic / OTP / government-database Aadhaar verification is NOT the
 *     normal process and must not be claimed;
 *   - the address is the one on the submitted Aadhaar document. MeeHelp does
 *     not separately verify a current or permanent address, so those checks
 *     are disabled.
 * Evidence: biz.aadhaar-manual, biz.address-in-aadhaar, trust.mobile-otp (src/data/evidence.ts).
 */
export type VerificationKey =
  | "mobileOtpVerified"
  | "aadhaarDocumentReviewed"
  | "currentAddressRecorded"
  | "permanentAddressRecorded"
  | "policeVerification"
  | "criminalBackgroundCheck"
  | "referenceVerification"
  | "employmentHistoryVerification";

export interface VerificationCheck {
  enabled: boolean;
  /** Customer-facing wording for the check. */
  claim: string;
  detail: string;
  approvedBy: string | null;
  approvedOn: string | null;
}

const confirmedBy = "MeeHelp business owner (Phase 3 brief)";
const confirmedOn = "2026-10-17";
const reconfirmedBy = "MeeHelp business owner (Phase 4.6 brief)";
const reconfirmedOn = "2026-10-18";

export const verificationChecks: Record<VerificationKey, VerificationCheck> = {
  mobileOtpVerified: {
    enabled: true,
    claim: "Mobile number verified by OTP",
    detail: "Each helper's mobile number is verified with a one-time password when they register.",
    approvedBy: reconfirmedBy,
    approvedOn: reconfirmedOn,
  },
  aadhaarDocumentReviewed: {
    enabled: true,
    claim: "Aadhaar document collected and manually reviewed",
    detail: "Each helper submits their Aadhaar document when they register, and MeeHelp reviews it by hand. The address on that document is available to MeeHelp.",
    approvedBy: reconfirmedBy,
    approvedOn: reconfirmedOn,
  },
  // SUPERSEDED (Phase 4.6): the address is the one on the Aadhaar document;
  // MeeHelp does not separately capture or verify current/permanent addresses.
  currentAddressRecorded: {
    enabled: false,
    claim: "Current address on record",
    detail: "",
    approvedBy: null,
    approvedOn: null,
  },
  permanentAddressRecorded: {
    enabled: false,
    claim: "Permanent address on record",
    detail: "",
    approvedBy: null,
    approvedOn: null,
  },
  // NOT CONFIRMED — must never be claimed until enabled and approved.
  policeVerification: {
    enabled: false,
    claim: "Police verification",
    detail: "",
    approvedBy: null,
    approvedOn: null,
  },
  criminalBackgroundCheck: {
    enabled: false,
    claim: "Criminal background check",
    detail: "",
    approvedBy: null,
    approvedOn: null,
  },
  referenceVerification: {
    enabled: false,
    claim: "References checked",
    detail: "",
    approvedBy: null,
    approvedOn: null,
  },
  employmentHistoryVerification: {
    enabled: false,
    claim: "Employment history checked",
    detail: "",
    approvedBy: null,
    approvedOn: null,
  },
};

/**
 * Shown with the verification summary so customers understand its scope.
 * Keep it accurate if more checks are enabled later.
 */
export const verificationScope = {
  heading: "What MeeHelp checks when a helper registers",
  intro: "When a helper registers on MeeHelp:",
  limitation:
    "MeeHelp reviews the helper's Aadhaar document to check their identity. It is not a police verification or a background check, and MeeHelp does not separately check where the helper lives — so follow the tips below as well.",
};

export function isCheckActive(check: VerificationCheck): boolean {
  return check.enabled && Boolean(check.approvedBy) && Boolean(check.approvedOn);
}
