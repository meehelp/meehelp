/**
 * Helper verification facts. The ONLY source of verification wording.
 *
 * A check produces customer-facing wording only when `enabled` is true and
 * `approvedBy`/`approvedOn` are recorded. `npm test` and `npm run seo` fail if
 * a production page implies a check that is not enabled (see lib/guards).
 *
 * Confirmed (Phase 3 brief, 2026-10-17): when a helper registers, MeeHelp
 * verifies the mobile number by OTP and the Aadhaar through its system, and
 * stores the current and permanent addresses.
 */
export type VerificationKey =
  | "mobileOtpVerified"
  | "aadhaarVerified"
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

export const verificationChecks: Record<VerificationKey, VerificationCheck> = {
  mobileOtpVerified: {
    enabled: true,
    claim: "Mobile number verified by OTP",
    detail: "Each helper's mobile number is verified with a one-time password when they register.",
    approvedBy: confirmedBy,
    approvedOn: confirmedOn,
  },
  aadhaarVerified: {
    enabled: true,
    claim: "Aadhaar verified",
    detail: "Each helper's Aadhaar is verified by MeeHelp's system when they register.",
    approvedBy: confirmedBy,
    approvedOn: confirmedOn,
  },
  currentAddressRecorded: {
    enabled: true,
    claim: "Current address on record",
    detail: "The helper's current address at the time of registration is recorded by MeeHelp.",
    approvedBy: confirmedBy,
    approvedOn: confirmedOn,
  },
  permanentAddressRecorded: {
    enabled: true,
    claim: "Permanent address on record",
    detail: "The helper's permanent address is recorded by MeeHelp.",
    approvedBy: confirmedBy,
    approvedOn: confirmedOn,
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
  heading: "How MeeHelp verifies helpers",
  intro: "When a helper registers on MeeHelp:",
  limitation:
    "Aadhaar verification confirms a helper's identity. It is not a police verification or a criminal background check, so follow the hiring tips below as well.",
};

export function isCheckActive(check: VerificationCheck): boolean {
  return check.enabled && Boolean(check.approvedBy) && Boolean(check.approvedOn);
}
