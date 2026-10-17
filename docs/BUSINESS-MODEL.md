# Business model, plans, verification and CTAs — how the site encodes them

Everything below is configuration in `src/data/`. Page copy never repeats prices, free-view counts or verification wording.

## Two propositions (`src/data/business-models.ts`)

| | Marketplace — "Find and hire a helper" | On-demand — "Book on-demand help" |
|---|---|---|
| Business level | confirmed | confirmed (instant, scheduled, hourly) |
| Customer pays | a contact plan; salary agreed directly with the helper | a booking in the app |
| Pages (preview) | `/{service}/`, `/{service}/{city}/`, `/pricing/` | `/hourly-{service}/`, `/hourly-{service}/{city}/` — no plans, no prices |
| CTAs | findHelpers, findService, exploreHelpers, viewHelpers, choosePlan | bookNow, bookHourly, bookInstant, scheduleHelp |

Sections are marked `data-model="marketplace"` / `data-model="onDemand"`. `npm run seo` fails if a section contains
the other proposition's wording or CTAs, or if a marketplace page contains any on-demand section or CTA.

## Per-service support (`src/data/services.ts` → `models`)

`marketplace`, `onDemand`, `instantBooking`, `scheduledBooking`, `hourlyBooking` are each `true` / `false` / `null`.
**All are `true` for all five services (confirmed in the Phase 4 brief).** `null` holds pages in review; `false` removes them.
A hub is built on production only when its model is `true` **and** its copy is `published`. All copy is in `review` today,
so production still builds the home page only.

### How the product implements it (Phase 4.5, `docs/seo/CONTENT-EVIDENCE.md`)

| | Marketplace (hire directly) | On-demand (book) |
|---|---|---|
| Maid | Part-time 2–12 h/day or full-time live-in; house size 1–5 BHK; gender preference | One-time clean: ≥ 2 tasks, 120/150/180 min, **book now** or schedule ≤ 5 days, 7 AM–8 PM; hourly deep-clean tasks |
| Cook | Same, with household members 1–5 | Hourly cooking task (members 1–5), scheduled ≥ 2 h ahead |
| Babysitter / nanny | "Baby Care" helper category | Hourly "baby care" task, scheduled |
| Elder care | **no helper category in code** | Hourly "elder care" task, scheduled |
| Patient care | "Patient Care" helper category | Hourly "patient care" task, scheduled |

Hourly bookings: 2–12 hours in 2-hour steps, start 7 AM–8 PM, booked 2 hours to 5 days ahead. Prices, fees and
cancellation terms are server-configured and **not** published. The search has no experience/age/language/salary
filters, and the app has no trial feature, tracking or SOS — guards in `src/lib/guards/claims.ts` block those claims.

## Per-city availability (`src/data/cities.ts`)

`marketActive: true` for all 8 cities and `availability[service][model] = "available"` for every service in both models
(confirmed in the Phase 4 brief). A service × city page publishes only when its own copy, its hub and its city are all
`published` as well.

## Marketplace plans (`src/data/plans.ts`)

| Segment | Plan | Contacts | Current | Previous | Discount | Validity | Best value |
|---|---|---|---|---|---|---|---|
| Home | Home Plan 1 | 10 | 499.00 | — | — | 1 month | |
| Home | Home Plan 2 | 15 | 699.00 | — | — | 2 months | ✓ |
| Home | Home Plan 3 | 20 | 899.00 | — | — | 3 months | |
| Office | Office Plan 1 | 30 | 1,199.20 | 1,499.00 | 20% | 3 months | |
| Office | Office Plan 2 | 40 | 1,399.30 | 1,999.00 | 30% | 3 months | ✓ |
| Office | Office Plan 3 | 50 | 1,649.45 | 2,999.00 | 45% | 6 months | |
| Business | Business Plan 1 | 80 | 16,000.00 | 20,000.00 | 20% | 6 months | |
| Business | Business Plan 2 | 110 | 19,600.00 | 28,000.00 | 30% | 11 months | ✓ |
| Business | Business Plan 3 | 140 | 22,750.00 | 35,000.00 | 35% | 12 months | |

(INR. The table is documentation only; the site reads `src/data/plans.ts`.)

- Fields: id, segment, displayName, contacts, currentPrice, previousPrice, discountPercent, validity {value, unit},
  bestValue, active, displayOrder, effectiveDate, lastReviewed, ctaKey.
- **Asterisk:** the "*" the app shows beside prices has no business meaning and is removed
  (`pricingSettings.asterisk.show = false`). `npm test` and `npm run seo` fail on any price followed by "*".
- **Tax:** no tax statement has been provided (`taxStatement: null`), so no GST/tax wording of any kind is allowed.
- `publishPrices: true`. `/pricing/` is still held in `review`, so it is built on preview only.
- What the pricing page says: a plan is paid to MeeHelp, not to the helper; one contact = one helper's contact details;
  the helper's salary is agreed separately and is not included; there is no replacement guarantee.

## Promotions (`src/data/promotions.ts`)

`freeProfileViews` (currently 1) is a **temporary, dynamic promotion**. It is never rendered: `evergreenCopyAllowed: false`
blocks free-profile-view wording in all copy, titles and meta descriptions (`promo-free-profile` rule).
- Consumer pages show **Home** plans only. Office/Business appear only on `/pricing/` (enforced by `npm run seo`).
- Guards: tests fail if any price string appears outside `src/data/plans.ts`; `npm run seo` fails if a page shows a price
  that isn't configured, a priced asterisk, or any plan/price on an on-demand page.

## Marketplace journey (`src/data/how-it-works.ts`)

Search for helpers → choose a contact plan → contact helpers directly → discuss and agree terms → arrange a trial →
hire directly. On-demand: choose the help → book now or schedule → choose the hours → confirm in the app.

## Verification (`src/data/verification.ts`)

| Check | Enabled | Wording |
|---|---|---|
| mobileOtpVerified | ✓ | Mobile number verified by OTP |
| aadhaarVerified | ✓ | Aadhaar verified |
| currentAddressRecorded | ✓ | Current address on record |
| permanentAddressRecorded | ✓ | Permanent address on record |
| policeVerification | ✗ | — |
| criminalBackgroundCheck | ✗ | — |
| referenceVerification | ✗ | — |
| employmentHistoryVerification | ✗ | — |

`VerificationSummary` is the only component that renders this. It adds the scope note: "Aadhaar verification confirms
a helper's identity. It is not a police verification or a criminal background check…". `src/lib/guards/claims.ts` blocks
police/background/reference/employment-history claims, "fully/100% verified", "vetted" and unqualified "verified helpers"
in all builds while those checks are disabled.

## Marketing claims (`src/data/business.ts`)

| Claim | Enabled | Note |
|---|---|---|
| noPlacementFee — "No placement agency fee" | ✓ | Marketplace only. Never shorten to "free" / "zero fee". |
| inAppSupport | ✗ | Needs channels and hours. |
| replacementGuarantee, placementGuarantee, guaranteedHiring, completelyFree | ✗ | Not part of the model; wording is blocked. |

## CTAs (`src/data/ctas.ts`)

Each CTA has a `model`, a `label`, `wording: "proposed" | "approved"`, a future app `journey`, and today's destination
(the page's `#get-the-app` section). All labels are **proposed**. `npm run seo` lists the proposed CTAs used on each build.
When deep linking is approved, change `destination` to a smart link per `journey`.

## Trust metrics (`src/data/business.ts`)

metric, value, source, sourceUrl, dateChecked, approved, displayEnabled. All values are empty. No Review or
AggregateRating schema is emitted, and `npm run seo` fails if any appears.
