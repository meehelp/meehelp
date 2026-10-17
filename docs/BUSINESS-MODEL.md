# Business model, plans, verification and CTAs — how the site encodes them

Everything below is configuration in `data/`. Page copy never repeats prices, free-view counts or verification wording.

## Two propositions (`data/business-models.ts`)

| | Marketplace — "Find and hire a helper" | On-demand — "Book on-demand help" |
|---|---|---|
| Business level | confirmed | confirmed (instant, scheduled, hourly) |
| Customer pays | a contact plan; salary agreed directly with the helper | a booking in the app |
| Pages today | service hubs, service × city, `/pricing/` | home page section only |
| CTAs | findHelpers, findService, exploreHelpers, viewHelpers, choosePlan | bookNow, bookHourly, bookInstant, scheduleHelp |

Sections are marked `data-model="marketplace"` / `data-model="onDemand"`. `npm run seo` fails if a section contains
the other proposition's wording or CTAs, or if a marketplace page contains any on-demand section or CTA.

## Per-service support (`data/services.ts` → `models`)

`marketplace`, `onDemand`, `instantBooking`, `scheduledBooking`, `hourlyBooking` are each `true` / `false` / `null`.
**All are `null` (not confirmed) today.** `null` holds pages in review; `false` removes them. A service hub is built on
production only when `models.marketplace === true`.

## Per-city availability (`data/cities.ts`)

`marketActive: true` for all 8 cities (confirmed). `availability[service][model]` is `"unknown"` everywhere.
A service × city page publishes only when its availability is `available` or `limited`, as well as all the other conditions.

## Marketplace plans (`data/plans.ts`)

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

(INR. The table is documentation only; the site reads `data/plans.ts`.)

- Fields: id, segment, displayName, contacts, currentPrice, previousPrice, discountPercent, validity {value, unit},
  bestValue, active, displayOrder, effectiveDate, lastReviewed, priceNote, ctaKey.
- `freeProfileViews: 1` is rendered only by `PlansSummary`.
- **Price note:** the app shows "*" beside prices; its meaning is unconfirmed. `priceNote.status = "pending"`,
  `publishPrices = false`. Until both change, production pages show plan contacts and validity **without prices**,
  and `/pricing/` is not built on production. Preview shows prices with a visible "Pending" note.
- Consumer pages show **Home** plans only. Office/Business appear only on `/pricing/` (enforced by `npm run seo`).
- Guards: tests fail if any price string appears outside `data/plans.ts`; `npm run seo` fails if a page shows a price
  that isn't configured, or any price on production while the note is unconfirmed.

## Verification (`data/verification.ts`)

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
a helper's identity. It is not a police verification or a criminal background check…". `lib/guards/claims.ts` blocks
police/background/reference/employment-history claims, "fully/100% verified", "vetted" and unqualified "verified helpers"
in all builds while those checks are disabled.

## Marketing claims (`data/business.ts`)

| Claim | Enabled | Note |
|---|---|---|
| noPlacementFee — "No placement agency fee" | ✓ | Marketplace only. Never shorten to "free" / "zero fee". |
| inAppSupport | ✗ | Needs channels and hours. |
| replacementGuarantee, placementGuarantee, guaranteedHiring, completelyFree | ✗ | Not part of the model; wording is blocked. |

## CTAs (`data/ctas.ts`)

Each CTA has a `model`, a `label`, `wording: "proposed" | "approved"`, a future app `journey`, and today's destination
(the page's `#get-the-app` section). All labels are **proposed**. `npm run seo` lists the proposed CTAs used on each build.
When deep linking is approved, change `destination` to a smart link per `journey`.

## Trust metrics (`data/business.ts`)

metric, value, source, sourceUrl, dateChecked, approved, displayEnabled. All values are empty. No Review or
AggregateRating schema is emitted, and `npm run seo` fails if any appears.
