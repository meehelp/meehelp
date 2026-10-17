# Content review & business information required

Copy was written without access to approved business data beyond what the Phase 2 and 3 briefs confirmed.
Approvals are recorded in the data files themselves (`approvedBy` / `approvedOn`, `publishStatus`, `true/false/null`).

## Current publishing state

| Content | File | Status | Built on production? |
|---|---|---|---|
| Home page | `data/home.ts` | published | **yes — the only production page today** |
| 5 marketplace service hubs | `data/services.ts` | published copy, but `models.marketplace = null` | no (preview only) until marketplace support is confirmed per category |
| 8 cities | `data/cities.ts` | review; `marketActive: true`; availability `unknown` | — (no city pages) |
| maid/mumbai, maid/delhi-ncr, cook/mumbai, elder-care/bengaluru (marketplace) | `data/service-cities.ts` | review | no |
| `/pricing/` | `data/plans.ts` | review; prices gated | no, until the price note is confirmed |
| Localities (andheri-west, powai) | `data/localities.ts` | draft | never (examples of the model) |
| Testimonials | `data/testimonials.ts` | 2 dev placeholders | never |
| Trust metrics | `data/business.ts` | all empty | hidden |
| Verification: OTP mobile, Aadhaar, current/permanent address | `data/verification.ts` | **enabled (confirmed)** | yes, via `VerificationSummary` |
| Verification: police, criminal background, references, employment history | `data/verification.ts` | disabled | blocked |
| Claim: no placement agency fee | `data/business.ts` | **enabled (confirmed)** | yes, marketplace sections |
| All CTA labels | `data/ctas.ts` | proposed | used, listed by `npm run seo` |

## Questions for the business

### Blocking production pages
- [ ] **Marketplace support per category**: is the marketplace live for maid, cook, babysitter/nanny, elder care and
      patient care? → `services[].models.marketplace` (one `true` publishes that hub on production).
- [ ] **On-demand support per category** and booking types (instant / scheduled / hourly) → `services[].models`.
- [ ] **Availability per city × service × model** → `cities[].availability`. Which service-city pages to publish first.
- [ ] **The asterisk (\*) beside plan prices in the app** — what does it mean? Until answered, prices are not shown on
      production and no tax/GST wording may be used → `pricingSettings.priceNote`, then `publishPrices`.

### Approvals
- [ ] CTA wording in `data/ctas.ts` (all "proposed").
- [ ] Marketplace journey steps (`data/how-it-works.ts`), especially the "contact helpers directly" / "call for a trial" wording.
- [ ] On-demand steps ("Pick a time — instantly, scheduled or by the hour"; "Confirm in the app").
- [ ] Whether to show "You can view your first helper profile free" (`freeProfileViews.showOnWebsite`).
- [ ] Plan display names ("Home Plan 1" …) and segment descriptions ("For households/offices/businesses").
- [ ] Plan effective dates (`effectiveDate`, currently unknown).
- [ ] Service hub, city and service-city copy.
- [ ] Areas served per city (only real, supplied areas) → `areasServed`.

### Proof
- [ ] Current Google Play / App Store rating, review count and download band — value, source URL and date checked.
- [ ] Real testimonials with written consent (first name + initial, city, service, model, date).

### Brand & legal
- [ ] Registered company name → `business.legalName`; official social profiles → `business.sameAs`.
- [ ] Official store badge artwork; SVG logo; licensed photography if wanted.
- [ ] Website privacy policy and terms pages.

## Review checklist for every page before publishing

- One proposition per page (or clearly separated sections on the home page).
- Answers: what's offered, what's included, how it works, coverage, what happens next, safeguards, FAQs.
- No invented numbers, ratings, areas, availability or guarantees; no prices typed into copy.
- Local pages contain genuinely local information — not city-swapped copy.
- `npm run check` passes.
