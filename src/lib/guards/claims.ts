/**
 * Wording guards. Turns the business configuration into a list of phrases
 * that must NOT appear in customer-facing output. Used by unit tests (source
 * copy) and by `npm run seo` (generated HTML).
 *
 * Patterns are deliberately claim-shaped ("police verified", "background
 * checked") so that honest advice ("check what your society requires", "it is
 * not a police verification") is not flagged.
 */
import { claims } from "@/data/business";
import { pricingSettings } from "@/data/plans";
import { promotions } from "@/data/promotions";
import { isCheckActive, verificationChecks } from "@/data/verification";
import type { BusinessModel } from "@/lib/content/types";
import { isClaimActive } from "@/lib/trust";

export interface WordingRule {
  id: string;
  reason: string;
  pattern: RegExp;
}

const helperNouns = "(?:maids?|helpers?|cooks?|nann(?:y|ies)|babysitters?|caregivers?|attendants?|staff|professionals?|workers?)";

/** Unsupported verification / trust wording, given what is enabled. */
export function verificationRules(): WordingRule[] {
  const v = verificationChecks;
  const rules: WordingRule[] = [];

  if (!isCheckActive(v.policeVerification)) {
    rules.push({
      id: "police-verification",
      reason: "policeVerification is not enabled",
      pattern: new RegExp(
        String.raw`\bpolice[- ](?:verified|checked|cleared|vetted)\b|\bverified by (?:the )?police\b|\b(?:with|includes?|including|completed?|carries out|carry out|conducts?|provides?|offers?|done)\s+(?:a\s+|full\s+)?police (?:verification|checks?)\b|\bpolice verification (?:is |was )?(?:done|completed|included|provided|carried out)\b`,
        "i",
      ),
    });
  }
  if (!isCheckActive(v.criminalBackgroundCheck)) {
    rules.push({
      id: "criminal-background-check",
      reason: "criminalBackgroundCheck is not enabled",
      pattern: new RegExp(
        String.raw`\bbackground[- ](?:verified|checked|cleared|screened)\b|\b(?:with|includes?|including|completed?|carries out|carry out|conducts?|provides?|offers?|done)\s+(?:a\s+|full\s+)?(?:criminal\s+)?background (?:checks?|verification|screening)\b|\bcriminal (?:record|background)s? (?:checked|verified|cleared)\b|\b(?:fully|thoroughly|completely|100%)[- ](?:verified|vetted|checked|screened)\b|\bvetted\b`,
        "i",
      ),
    });
  }
  if (!isCheckActive(v.referenceVerification)) {
    rules.push({
      id: "reference-verification",
      reason: "referenceVerification is not enabled",
      pattern: /\breferences?[- ](?:are |were )?(?:checked|verified)\b|\breference[- ]checked\b/i,
    });
  }
  if (!isCheckActive(v.employmentHistoryVerification)) {
    rules.push({
      id: "employment-history",
      reason: "employmentHistoryVerification is not enabled",
      pattern:
        /\b(?:employment|work) history (?:is |was )?(?:checked|verified)\b|\bprevious employers? (?:are |were )?(?:checked|verified|contacted)\b/i,
    });
  }
  // "Verified helpers" on its own overstates identity-only checks. Only the
  // qualified form ("Aadhaar-verified helpers") is allowed.
  rules.push({
    id: "unqualified-verified",
    reason: "Unqualified 'verified helper' wording overstates the enabled checks",
    pattern: new RegExp(String.raw`(?<!aadhaar[- ])(?<!otp[- ])\bverified\s+${helperNouns}\b`, "i"),
  });
  if (!isCheckActive(v.aadhaarVerified)) {
    rules.push({ id: "aadhaar", reason: "aadhaarVerified is not enabled", pattern: /\baadhaar\b/i });
  }
  if (!isCheckActive(v.mobileOtpVerified)) {
    rules.push({ id: "otp", reason: "mobileOtpVerified is not enabled", pattern: /\b(?:otp|one-time password)[- ]verified\b|\bverified (?:by|with) (?:an? )?(?:otp|one-time password)\b/i });
  }
  return rules;
}

/** Marketplace commercial wording that is not part of the model unless enabled later. */
export function commercialRules(): WordingRule[] {
  const rules: WordingRule[] = [];
  if (!isClaimActive(claims.replacementGuarantee)) {
    rules.push({
      id: "replacement",
      reason: "replacementGuarantee is not enabled",
      pattern: /\breplacement (?:guarantee|guaranteed|policy|support)\b|\bguaranteed replacements?\b|\bagency replacements?\b|\bfree replacements?\b/i,
    });
  }
  if (!isClaimActive(claims.placementGuarantee) || !isClaimActive(claims.guaranteedHiring)) {
    rules.push({
      id: "guarantee",
      reason: "placement/hiring guarantees are not enabled",
      pattern: new RegExp(String.raw`\bplacement guarantee\b|\bguaranteed (?:placement|hiring|hire|${helperNouns.slice(3, -1)})\b|\bguarantee(?:s|d)? (?:a |that you )?(?:find|hire)\b`, "i"),
    });
  }
  if (!isClaimActive(claims.completelyFree)) {
    rules.push({
      id: "free",
      reason: "customers buy contact plans — 'free' service claims are not allowed",
      pattern: /\b(?:completely|totally|100%|absolutely) free\b|\bfree (?:maid|cook|nanny|helper|of cost) ?(?:service)?\b|\bzero (?:fees?|charges?|cost)\b|\bno (?:charges?|fees?|cost)\b(?! to download)/i,
    });
  }
  // Promotions are temporary: never in evergreen pages.
  if (!promotions.freeProfileViews.evergreenCopyAllowed) {
    rules.push({
      id: "promo-free-profile",
      reason: "free profile views are a temporary promotion, not evergreen copy",
      pattern:
        /\bfree (?:helper )?profile views?\b|\b(?:first|one|1) (?:helper )?profile (?:view )?(?:is |for )?free\b|\bview (?:your first|one|1) (?:helper )?profiles? (?:for )?free\b|\bprofile views?\b[^.]{0,30}\bfree\b/i,
    });
  }
  // No tax statement has been provided: no GST/tax wording of any kind.
  if (!pricingSettings.taxStatement) {
    rules.push({
      id: "tax",
      reason: "no tax statement has been provided",
      pattern:
        /\b(?:incl(?:usive|uding|\.)?|excl(?:usive|uding|\.)?|plus|\+)\s*(?:of\s+)?(?:gst|taxes|tax)\b|\b(?:gst|taxes|tax)\s+(?:included|inclusive|extra|excluded|applicable|additional|as applicable)\b|\bgst\b/i,
    });
  }
  if (!isClaimActive(claims.noPlacementFee)) {
    rules.push({ id: "no-placement-fee", reason: "noPlacementFee is not enabled", pattern: /\bno placement (?:agency )?fee\b|\bdoesn't (?:charge|take) a placement\b/i });
  }
  return rules;
}

/**
 * Wording that belongs to the OTHER proposition. Used to keep marketplace and
 * on-demand sections from mixing.
 */
export const modelWording: Record<BusinessModel, RegExp> = {
  // Must not appear in MARKETPLACE sections:
  onDemand:
    /\bon[- ]demand\b|\bbook (?:now|instantly|today|in minutes)\b|\binstant (?:booking|help|maid|cook|service)s?\b|\bhourly (?:booking|help|maid|cook|service)s?\b|\bsame[- ]day\b|\bone[- ]off\b|\bbook (?:a|an) (?:maid|cook|helper|nanny|babysitter|attendant)\b|\byour booking\b/i,
  // Must not appear in ON-DEMAND sections:
  marketplace:
    /\bcontact plans?\b|\bhelper contacts\b|\bnegotiat(?:e|ion)\b|\bhire (?:them )?directly\b|\bprofile views?\b|\bchoose a plan\b|\bplacement agency fee\b/i,
};

/** The wording that must not appear in a section of the given model. */
export function forbiddenInModel(model: BusinessModel): RegExp {
  return model === "marketplace" ? modelWording.onDemand : modelWording.marketplace;
}

/** Any price-looking string (₹ / INR / Rs). */
export const priceStringPattern = /(?:₹|\bINR|\bRs\.?)\s?\d[\d,]*(?:\.\d{1,2})?/g;

/** A price followed by an asterisk (the app's meaningless "*" must never appear). */
export const pricedAsteriskPattern = /(?:₹|\bINR|\bRs\.?)\s?\d[\d,]*(?:\.\d{1,2})?\s*\*/;

export function findViolations(text: string, rules: WordingRule[]): { rule: WordingRule; match: string }[] {
  const hits: { rule: WordingRule; match: string }[] = [];
  for (const rule of rules) {
    const m = text.match(rule.pattern);
    if (m) hits.push({ rule, match: m[0] });
  }
  return hits;
}
