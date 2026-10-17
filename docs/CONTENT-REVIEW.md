# Content review & business information required

Copy was written without access to approved business data beyond what the Phase 2 and 3 briefs confirmed.
Approvals are recorded in the data files themselves (`approvedBy` / `approvedOn`, `publishStatus`, `true/false/null`).

## Current publishing state

| Content | File | Status | Built on production? |
|---|---|---|---|
| Home page | `src/data/home.ts` | published | **yes — the only production page today** |
| 5 marketplace hubs (`/maid/` …) | `src/data/services.ts` | review; `models.marketplace = true` | no (preview only) |
| 5 on-demand hubs (`/hourly-maid/` …) | `src/data/on-demand.ts` | review; `models.onDemand = true` | no (preview only) |
| 80 city pages (5 services × 8 cities × 2 models) | `src/data/service-cities.ts`, `cities.ts`, `city-frames.ts` | review; all cities `available` | no (preview only) |
| `/pricing/` | `src/data/plans.ts` | review; `publishPrices: true` | no (preview only) |
| Localities (andheri-west, powai) | `src/data/localities.ts` | draft | never (examples of the model) |
| Free profile view promotion | `src/data/promotions.ts` | never rendered | blocked in evergreen copy |
| Testimonials | `src/data/testimonials.ts` | 2 dev placeholders | never |
| Trust metrics | `src/data/business.ts` | all empty | hidden |
| Verification: OTP mobile, Aadhaar, current/permanent address | `src/data/verification.ts` | **enabled (confirmed)** | yes, via `VerificationSummary` |
| Verification: police, criminal background, references, employment history | `src/data/verification.ts` | disabled | blocked |
| Claim: no placement agency fee | `src/data/business.ts` | **enabled (confirmed)** | yes, marketplace sections |
| All CTA labels | `src/data/ctas.ts` | proposed | used, listed by `npm run seo` |

Per-page readiness, word counts and similarity risk: `docs/seo/QUALITY-REPORT.md` (`npm run report`).
Intent targets per page: `docs/seo/intent-map.json` (`npm run intent-map`).

## Questions for the business

### Before publishing expanded pages
- [ ] Approve copy page by page, starting with the pages marked "ready-for-approval" in the quality report.
- [ ] City pages at high doorway risk need real local information (areas actually served, local demand notes,
      timing/transport details the team can stand behind) — not rewritten templates.
- [ ] Confirmed areas/localities served per city → `areasServed` (empty today, so the section is hidden).
- [ ] On-demand: price basis and minimum booking duration (not stated anywhere on the site today).

### Approvals
- [ ] CTA wording in `src/data/ctas.ts` (all "proposed").
- [ ] Marketplace journey steps (`src/data/how-it-works.ts`), especially the "contact helpers directly" / "call for a trial" wording.
- [ ] On-demand steps ("Choose the help you need"; "Book now or schedule"; "Choose the hours"; "Confirm in the app").
- [ ] Plan display names ("Home Plan 1" …) and segment descriptions ("For households/offices/businesses").
- [ ] Plan effective dates (`effectiveDate`, currently unknown).
- [ ] Service hub, city and service-city copy.

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
