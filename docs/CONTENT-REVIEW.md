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

Per-page readiness (READY / REVIEW / HOLD), evidence counts and similarity: `docs/seo/QUALITY-REPORT.md` (`npm run report`).
Which product facts are grounded in code, and which are assumptions: `docs/seo/CONTENT-EVIDENCE.md` (`npm run evidence`).
Intent targets per page: `docs/seo/intent-map.json` (`npm run intent-map`).
Recommended first public release (not published): `src/data/release-plan.ts`.

## Questions for the business

### Resolved in Phase 4.6
Elder care maps to the shared care-helper pool · instant booking is one-time cleaning only · Aadhaar document collected
and manually reviewed · address = the one on the Aadhaar document · ₹299 is stale · baby, elder and patient care scopes
supplied. See `docs/seo/PRODUCT-TRUTH-RECONCILIATION.md`.

### Still open (see CONTENT-EVIDENCE.md)
- [ ] **Q-PRICE / Q-FEE** — are the observed prices and the ~20% fee + 5% GST pattern stable and the same everywhere?
- [ ] **Q-CANCEL** — customer cancellation before acceptance, and hourly-booking cancellation terms.
- [ ] **Q-RESCHEDULE** — is rescheduling possible?
- [ ] **Q-CLINICAL** — training/credential pathway for special care, wound/catheter support and any invasive work.
- [ ] **Q-ELDER-LABEL** — which option customers choose in the app to find an elder care attendant.
- [ ] **Q-TASKS** — approve task names.
- [ ] Engineering (not website): the Aadhaar upload endpoint sets the verified flag on upload; the app still shows the stale ₹299 copy.

First-release review pack: `docs/seo/FIRST-RELEASE-REVIEW.md`.

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
