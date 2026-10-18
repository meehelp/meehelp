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
    pattern: new RegExp(String.raw`(?<!otp[- ])\bverified\s+${helperNouns}\b`, "i"),
  });
  if (!isCheckActive(v.aadhaarDocumentReviewed)) {
    rules.push({ id: "aadhaar", reason: "aadhaarDocumentReviewed is not enabled", pattern: /\baadhaar\b/i });
  }
  // Phase 4.6: Aadhaar is a manually reviewed document — never an electronic,
  // OTP, e-KYC or government-database verification (evidence biz.aadhaar-manual).
  rules.push({
    id: "aadhaar-electronic",
    reason: "Aadhaar is collected and manually reviewed; electronic verification must not be claimed",
    pattern:
      /\baadhaar[- ](?:verified|authenticated|e-?kyc)\b|\b(?:verified|authenticated|checked)\s+(?:through|via|with|by|against)\s+(?:the\s+)?(?:aadhaar|uidai|government)\b|\baadhaar\s+(?:otp|e-?kyc)\b|\b(?:otp|e-?kyc)[- ]based\s+aadhaar\b|\belectronically\s+verified\b|\bgovernment[- ](?:database|records?)[- ]?(?:verified|checks?|verification)?\b|\buidai\b|\bdigilocker\b|\bbackground[- ]verified\b|\bfully[- ]verified\b/i,
  });
  // The address is the one on the Aadhaar document — no independent address check.
  if (!isCheckActive(v.currentAddressRecorded) && !isCheckActive(v.permanentAddressRecorded)) {
    rules.push({
      id: "address-verification",
      reason: "MeeHelp does not independently verify current or permanent addresses",
      pattern:
        /\b(?:current|permanent|residential|home)\s+address(?:es)?\s+(?:is\s+|are\s+)?(?:verified|checked|confirmed|on record)\b|\baddress[- ](?:verified|verification|checked)\b|\bverif(?:y|ies|ied)\s+(?:the\s+|their\s+|a\s+)?(?:helper's\s+)?(?:current\s+|permanent\s+)?address\b|\bpermanent address\b/i,
    });
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

/**
 * Product claims the evidence ledger (src/data/evidence.ts) does NOT support.
 * Phase 4.5: the app has no experience/age/language/salary/skill filters, no
 * live tracking or SOS, no trial feature, unreliable ratings, and its care
 * categories are non-medical. Patterns are claim-shaped so honest advice
 * ("this is not nursing care", "agree a trial with the helper") passes.
 */
export function unsupportedClaimRules(): WordingRule[] {
  return [
    {
      id: "filter-claim",
      reason: "evidence mkt.no-filters: the app does not filter by these attributes",
      pattern: /\bfilter(?:s|ed|ing)?\s+(?:helpers?\s+|profiles?\s+|results?\s+|cooks?\s+|nannies\s+|attendants?\s+)?by\s+(?:their\s+)?(?:experience|age|language|religion|caste|salary|skills?|cuisine)\b/i,
    },
    {
      id: "tracking-claim",
      reason: "evidence od.no-tracking: no live tracking or SOS in the customer app",
      pattern: /\b(?:live|real[- ]time)\s+(?:tracking|location)\b|\btrack\s+(?:your|the)\s+helper\b|\bSOS\b/i,
    },
    {
      id: "rating-claim",
      reason: "evidence trust.ratings-default: ratings are not a reliable public signal",
      pattern: /\b(?:top|highly|best|5[- ]star)[- ]rated\b|\b\d(?:\.\d)?\s?(?:★|stars?)\s+(?:rating|rated|average)\b|\brated\s+\d(?:\.\d)?\b/i,
    },
    {
      id: "training-claim",
      reason: "no evidence of training or certification of helpers",
      pattern: /\b(?:trained|certified|skilled and verified|professionally trained)\s+(?:maids?|helpers?|cooks?|nann(?:y|ies)|babysitters?|caregivers?|attendants?|professionals?|staff|nurses?)\b/i,
    },
    {
      id: "clinical-claim",
      reason: "care categories are non-medical; clinical services need business approval and evidence",
      pattern: /\b(?:provides?|offers?|gives?|performs?|delivers?|includes?)\s+(?:professional\s+)?(?:nursing|medical|clinical|ICU)\s+(?:care|services?|treatment|procedures?|support)\b|\b(?:qualified|registered|trained)\s+nurses?\s+(?:from|on|through)\s+MeeHelp\b|\bhome\s+nursing\s+services?\b/i,
    },
    {
      id: "trial-feature",
      reason: "evidence mkt.no-trial-feature: trials are arranged with the helper, not in the app",
      pattern: /\bfree\s+trial\b|\btrial\s+(?:period|feature|booking|guarantee)\b|\bbook\s+a\s+trial\s+(?:in|through|on)\s+(?:the\s+)?(?:app|MeeHelp)\b/i,
    },
  ];
}

/**
 * Local "filler" that made city pages look different without helping the
 * customer (Phase 4.5 brief §3). Used by tests on city facts and composed
 * city pages.
 */
export const cityFillerPattern =
  /\b(?:diwali|holi|ganesh(?:a)?\s?chaturthi|ganeshotsav|navratri|navaratri|durga\s+puja|kali\s+puja|pongal|onam|ugadi|sankranti|bonalu|eid|festivals?|monsoon|heatwave|humidity|fog|air\s+quality|pollution|aqi|cuisine|chettinad|hyderabadi|konkani|maharashtrian|bengali\s+food|tourist|famous\s+for|population)\b/i;

/** Stale app copy that must never reach Website V2 (evidence biz.299-stale). */
export const stalePricePattern = /(?:₹|\bRs\.?|\bINR)\s?299\b|\b299\s?(?:rupees|rs)\b/i;

/**
 * Clinical-safety guard (Phase 4.6 §19). Sentence-based so honest negations
 * ("This is not nursing care", "these need a qualified nurse") and exclusion
 * lists pass, while any positive claim fails:
 *   - invasive work (injections, insulin, IV, invasive procedures) — needs
 *     clinicalServices.invasive, which is false for the first release;
 *   - wound, bed-sore and catheter care — needs clinicalServices.woundAndCatheter;
 *   - vital-sign checks must say the caregiver is trained, and never diagnose.
 */
import { clinicalServices } from "@/data/care-scope";

const negation =
  /\b(?:not|no|never|isn't|aren't|don't|doesn't|without|unless|except|excluded|outside|only by|must be done by|need(?:s)?\s+(?:a\s+)?qualified|ask (?:your|their|the) (?:parent's )?doctor|stays? with)\b/i;
const invasivePattern = /\b(?:inject(?:ion|ions|ed|ing)?|insulin|intravenous|iv(?:\s+(?:lines?|drips?|therapy|fluids?))?|invasive)\b/i;
const woundCatheterPattern = /\b(?:wound(?:s)?(?:\s+(?:dressing|care|procedures?))?|bed[- ]?sores?|catheter(?:s|[- ]related)?)\b/i;
const nursingPattern = /\b(?:nursing\s+(?:care|services?|procedures?)|(?:our|meehelp|trained|qualified|registered)\s+nurses?)\b/i;
const vitalsPattern = /\b(?:blood\s+pressure|blood\s+sugar|oxygen\s+(?:level|saturation)s?|temperature|vital\s+signs?|vitals)\b/i;

export function clinicalClaimFindings(text: string): string[] {
  const findings: string[] = [];
  for (const sentence of text.split(/(?<=[.!?])\s+|\n+/)) {
    if (!sentence.trim() || sentence.trim().endsWith("?")) continue; // questions are not claims
    const negated = negation.test(sentence);
    if (!clinicalServices.invasive && invasivePattern.test(sentence) && !negated) findings.push(`invasive: ${sentence.trim()}`);
    if (!clinicalServices.woundAndCatheter && woundCatheterPattern.test(sentence) && !negated) findings.push(`wound/catheter: ${sentence.trim()}`);
    if (nursingPattern.test(sentence) && !negated) findings.push(`nursing: ${sentence.trim()}`);
    if (vitalsPattern.test(sentence) && !/\btrain(?:ed|ing)\b/i.test(sentence)) findings.push(`vitals without 'trained': ${sentence.trim()}`);
    if (vitalsPattern.test(sentence) && /\bdiagnos(?:e|es|is|ing)\b/i.test(sentence) && !negated) findings.push(`diagnosis: ${sentence.trim()}`);
  }
  return findings;
}

/** Cancellation wording must stay as narrow as the app's policy (evidence shot.cancellation). */
export const broadRefundPattern =
  /\b(?:all|any|every)\s+cancell?ations?\b[^.]*\brefund|\bfree\s+cancell?ation\b|\bcancel\s+(?:any\s?time|for\s+free)\b|\bfull\s+refund\s+(?:on|for)\s+(?:all|any)\b|\brefund(?:ed)?\s+if\s+you\s+cancel\b/i;
