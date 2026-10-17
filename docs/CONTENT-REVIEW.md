# Content review & business information required

All copy was written for this phase without access to approved business data. It makes
**no** claims about verification, pricing, coverage, ratings, download numbers or policies.
Approvals are recorded in the data files themselves.

## Current publishing state

| Content | File | Status | Built on production? |
|---|---|---|---|
| Home page | `data/home.ts` | published | yes |
| 5 service hubs (maid, cook, babysitter-nanny, elder-care, patient-care) | `data/services.ts` | published | yes — **copy still needs business sign-off before go-live** |
| 8 cities | `data/cities.ts` | review | no (preview only) |
| maid/mumbai, maid/delhi-ncr, cook/mumbai, elder-care/bengaluru | `data/service-cities.ts` | review | no (preview only) |
| Localities (andheri-west, powai) | `data/localities.ts` | draft | never (examples of the model) |
| Testimonials | `data/testimonials.ts` | 2 dev placeholders | never |
| Trust metrics | `data/business.ts` | all empty | hidden |
| Claims (verification, no brokerage, replacement, support, payments) | `data/business.ts` | all disabled | hidden |
| Desktop QR code | `data/app-links.ts` | placeholder | hidden on production |

## Information needed from the business

### Coverage
- [ ] Which services are live in which cities → `cities[].serviceAvailability` and city `publishStatus`.
- [ ] Which service × city pages to publish first → `service-cities.ts`.
- [ ] Confirmed areas served per city (only real, supplied areas) → `areasServed`.
- [ ] Whether "Mumbai & MMR" should include Thane / Navi Mumbai, and "Delhi NCR" Gurugram / Noida / Ghaziabad / Faridabad.

### Product & process (check against the current app)
- [ ] The 4-step "How MeeHelp works" in `data/how-it-works.ts`.
- [ ] Which arrangements each service offers (on-demand / part-time / full-time) → `engagementTypes`.
- [ ] Tasks included/excluded per service.
- [ ] Whether customers can speak to helpers before booking (stated in copy).
- [ ] Whether charges are always shown before confirming (stated in FAQs).

### Trust & claims (each needs an owner and an approval date)
- [ ] Verification: what is checked, by whom, when, and with what evidence. **Current in-app
      guidelines say verification is the employer's responsibility.** Until this changes, keep
      `verifiedHelpers` and `backgroundChecks` disabled.
- [ ] "No brokerage" — still accurate for all services?
- [ ] Replacement policy (conditions, time window).
- [ ] Support channels and hours; whether contact@meehelp.in should be shown.
- [ ] In-app payment availability.

### Proof
- [ ] Current Google Play and App Store rating, review count and download band, each with source and date.
- [ ] Helper and booking counts (only if they can be stated accurately, with date).
- [ ] Real testimonials with written consent (first name + initial, city, service, date).

### Brand & legal
- [ ] Registered company name (the app shows "Mehp Technologies Pvt Ltd") → `business.legalName`.
- [ ] Official social profile URLs → `business.sameAs`.
- [ ] Official store badge artwork (to replace the text store buttons).
- [ ] SVG version of the logo, and licensed photography if wanted.
- [ ] Privacy policy and terms pages for the website (and whether existing URLs must be kept).

## Review checklist for every page before publishing

- Answers: what's offered, what's included, how it works, coverage, what happens after booking, safeguards, FAQs.
- No invented numbers, ratings, areas or guarantees.
- Local pages contain genuinely local information — not city-swapped copy (`npm test` checks for identical intros).
- Title ≤ 60 characters and description 70–160 characters, both unique (`npm test` / `npm run seo`).
- `npm run check` passes.
