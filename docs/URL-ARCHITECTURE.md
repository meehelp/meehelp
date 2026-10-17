# Recommended URL architecture

Status: **recommendation**. Only the marketplace routes below exist in code today.
No on-demand, B2B or locality pages are built.

## Principles

1. URLs follow how customers search, not MeeHelp's internal terms. Nobody searches "marketplace" or "on-demand maid";
   people search "maid in Mumbai" (hire intent) or "hourly maid near me" / "maid for 2 hours" (booking intent).
2. **One page per intent**, not per synonym. "maid", "house help", "domestic helper" and "find maid" share one page.
   "hourly maid", "maid for 2 hours", "instant maid" and "book maid" share one page.
3. The two propositions get **separate canonical pages** and never share a page's main content.
4. Maximum depth of 3 segments: `/{service}/{city}/{locality}/`.
5. Every URL is lowercase, hyphenated and has a trailing slash, with a self-referencing canonical.
6. Pages exist only when the content model says the service + city + model is confirmed and published.

## Target structure

| Intent | Pattern | Examples | Status |
|---|---|---|---|
| Brand / both propositions | `/` | `/` | built |
| **Marketplace** — find & hire, by category | `/{service}/` | `/maid/`, `/cook/`, `/babysitter-nanny/`, `/elder-care/`, `/patient-care/` | built (held in review until `models.marketplace` is confirmed) |
| Marketplace × city | `/{service}/{city}/` | `/maid/mumbai/`, `/cook/bengaluru/` | 4 drafts in review |
| Marketplace × city × locality | `/{service}/{city}/{locality}/` | `/maid/mumbai/andheri-west/` | model only, never auto-generated |
| Marketplace plans | `/pricing/` | `/pricing/` | built, held until the price note is confirmed |
| **On-demand** — book, by category | `/hourly-{service}/` | `/hourly-maid/`, `/hourly-cook/` (only if supported) | not built |
| On-demand × city | `/hourly-{service}/{city}/` | `/hourly-maid/mumbai/` | not built |
| On-demand × city × locality | `/hourly-{service}/{city}/{locality}/` | `/hourly-maid/mumbai/powai/` | not built |
| B2B (Office/Business plans) | `/office-staff/`, `/business-staff/` (names to be validated with keyword data) | — | not built |

### Why service-led routes for the marketplace (`/maid/`), not `/hire/maid/`

- The head terms ("maid in Mumbai", "maid near me", "cook for home", "nanny for home") are predominantly hire intent,
  so the marketplace should own the shortest, strongest URLs.
- `/hire/` adds a level of depth without matching any query, and "hire maid" is already served by `/maid/`.

### Why `/hourly-maid/` for on-demand, not `/on-demand/maid/`

- "Hourly" is the word customers actually use ("hourly maid near me", "hourly house help", "hourly cook").
  "On-demand" is internal terminology.
- A single on-demand page per category covers instant, scheduled and hourly booking as **sections**.
  `/instant-maid/`, `/same-day-maid/` and `/maid-for-2-hours/` would be synonym pages competing with each other (doorway risk).
- If one booking type later proves to have distinct demand and distinct content (different product, price or availability),
  it can be split out deliberately, with its own content entry.

### Synonym mapping (no separate pages)

| Queries | Canonical page |
|---|---|
| maid near me, maid service, house help near me, domestic helper near me, find maid directly, maid hiring app | `/maid/` (and `/maid/{city}/`) |
| cook near me, cook for home, home cook | `/cook/` |
| babysitter near me, nanny near me, nanny for home | `/babysitter-nanny/` |
| elder care at home, elderly caregiver | `/elder-care/` |
| patient care at home, patient attendant | `/patient-care/` |
| domestic helper app | `/` |
| hourly maid near me, instant maid, maid for 2 hours, book maid, on demand maid, same day maid service, scheduled maid service | `/hourly-maid/` (and `/hourly-maid/{city}/`) |
| hourly cook | `/hourly-cook/` (only if confirmed) |
| book home help today | `/` on-demand section, or an on-demand hub once 3+ categories support it |

## Internal linking

- Home → marketplace hubs, `/pricing/`, and (later) on-demand hubs, in separate sections.
- Marketplace hub → its city pages → their locality pages, plus breadcrumbs back up.
- `/maid/mumbai/` ↔ `/hourly-maid/mumbai/`: one clearly separated cross-link block
  ("Need help for a few hours instead?"), not mixed into the page's main content.
- Office/Business plans are linked only from `/pricing/` and the future B2B pages.

## How the code supports this

- `ServiceCity.model` and `LocalityServiceContent.model` record the proposition for every page entry.
- `src/lib/content/index.ts` requires `services[].models[model] === true` and
  `cities[].availability[service][model]` to be `available`/`limited` before a page can be published.
- On-demand entries are rejected (`serviceCityStatus` → `draft`) until their own route and template exist.
- The route registry (`getSiteRoutes`) drives `getStaticPaths` (src/pages/[service]/[...rest].astro), the sitemap and the validator, so a new route family
  is added in one place.
- `npm run seo` fails if marketplace pages contain on-demand wording or CTAs (and vice versa).
