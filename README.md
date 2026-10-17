# MeeHelp Website V2

SEO-first marketing website for MeeHelp. A **static Next.js site**, fully
independent of the production apps, PHP backend, admin panel and databases.

- Every page is pre-rendered to plain HTML at build time (`output: "export"`). There are no client components.
- All content comes from typed files in `data/`. There is no API or database connection.
- MeeHelp has **two propositions** — the marketplace (find and hire helpers directly with a contact plan) and
  on-demand booking — and they are modelled, rendered and validated separately (`docs/BUSINESS-MODEL.md`).
- Content is gated by `publishStatus` (`draft` → `review` → `published`) **and** by business facts: unconfirmed
  model support or city availability holds a page in review.
- Nothing is deployed. See `docs/DEPLOYMENT.md` for what deployment will need.

## Quick start

```bash
npm install
npm run dev               # http://localhost:3000 — development stage (shows drafts, noindex)
npm run check             # typecheck + unit tests + production and preview SEO validation
npm run build:preview     # static build incl. "review" content, all noindex
npm run build:production  # static build of "published" content only
npm run serve             # serve out/ at http://localhost:4000 (trailing-slash + 404 behaviour)
npm run seo               # build (production) and validate generated HTML, sitemap, robots
npm run seo:preview       # same for a preview build
npm run measure:js        # per-page script bytes for the current out/ build
```

Always build through the npm scripts (they run `scripts/build.ts`, which excludes the service catch-all route
when the registry has nothing to generate — static export cannot build an empty dynamic route).

Requires Node.js ≥ 20.9 (developed on Node 22).

## Build stages

| `SITE_STAGE` | Builds | Indexable | robots.txt | Sitemap |
|---|---|---|---|---|
| `development` (default) | everything (except unpublished localities) | no | `Disallow: /` | empty |
| `preview` | `published` + `review` | no | `Disallow: /` | empty |
| `production` | `published` only | yes | `Allow: /` + sitemap | published URLs |

`SITE_URL` sets the canonical origin (default `https://meehelp.in`).
Variable names are listed in `.env.example` (names only — never commit values).

## Directory structure

```
app/                         Routes (Next.js App Router)
  layout.tsx                 HTML shell, header/footer, smart app banner, analytics slot
  page.tsx                   Home page
  [service]/[[...rest]]/     page.routes.tsx: /maid/, /maid/mumbai/, /maid/mumbai/andheri-west/, /pricing/
  not-found.tsx              404 page (noindex)
  robots.ts, sitemap.ts      Generated from the route registry
  fonts/                     Lexend SemiBold (headings only)
components/
  layout/                    SiteHeader, SiteFooter, Breadcrumbs
  templates/                 ServiceTemplate, ServiceCityTemplate, LocalityTemplate, PricingTemplate
  content/                   Section, Cta, ServiceCards, FaqList, Lists, Icon, LinkList
  app/                       StoreButtons, QrPanel, AppDownloadSection, StickyAppBar
  pricing/                   PlanCards, PlansSummary (prices only from data/plans.ts)
  trust/                     VerificationSummary, Claims, TrustMetrics/AppRatings, Testimonials, Safeguards
  seo/                       JsonLd
  analytics/                 Analytics (inactive until IDs are configured)
data/                        Approved business content — the only content source
  business-models.ts         the two propositions (marketplace, on-demand)
  services.ts                categories + per-service model support (true/false/null)
  cities.ts                  8 active markets + availability per service per model
  service-cities.ts localities.ts   page content per service × city × model
  plans.ts                   all 9 marketplace plans, free profile views, price note
  verification.ts            helper verification facts (only source of verification wording)
  ctas.ts                    CTA labels per proposition
  business.ts                marketing claims, trust metrics, schema switches
  app-links.ts testimonials.ts home.ts how-it-works.ts
lib/
  site.ts                    Stage, canonical origin, trailing-slash policy
  content/                   Types, publishing rules, queries, route registry, resolver
  seo/                       Metadata builder, JSON-LD builders
  trust/                     Claim/metric/verification display rules
  guards/                    Unsupported-claim and model-mixing wording rules
  pricing.ts                 Price formatting and the price-publishing gate
  analytics/                 Analytics config (env-driven, empty by default)
scripts/
  build.ts                   build wrapper (see above)
  seo-check.ts               `npm run seo` validator
  measure-js.mjs             `npm run measure:js`
  serve-static.mjs           Local static server
  optimise-images.mjs        Generates logo, favicons and OG image from assets/source
tests/unit/                  node:test suites (publishing, routes, content, models, plans, guards, trust, links, security)
assets/source/               Original brand artwork (logo from the MeeHelp user app)
public/                      Static files served as-is (logo, OG image)
docs/                        Business model, URL architecture, performance, deployment, Search Console,
                             content review, app linking
```

## Publishing workflow

1. Edit or add content in `data/` with `publishStatus: "review"`.
2. `npm run build:preview && npm run serve` and review the page locally.
3. Business approves → set `publishStatus: "published"` (and `updatedAt`).
4. `npm run check` must pass.

A service × city page is built only if the combination is explicitly listed in
`data/service-cities.ts` **and** the service, the city and the combination are
all built for the stage. A locality page additionally needs the locality and
its per-service content to be `"published"` — in every stage.

## Guardrails

- **Propositions never mix.** Sections carry `data-model`; `npm run seo` fails on on-demand wording/CTAs in marketplace
  sections and vice versa, and on any on-demand block on a marketplace page.
- **Verification wording** comes only from `data/verification.ts`. Police, criminal-background, reference and
  employment-history claims, "fully/100% verified", "vetted" and unqualified "verified helpers" fail `npm test` and
  `npm run seo` while those checks are disabled.
- **Commercial claims**: replacement/placement/hiring guarantees, "completely free", "zero/no charges" are blocked.
  "No placement agency fee" is the only enabled marketplace claim.
- **Prices** exist only in `data/plans.ts`. Tests fail on any price string elsewhere in code; `npm run seo` fails on
  unconfigured prices, Office/Business prices outside `/pricing/`, and any price on production while the app's "*"
  is unexplained.
- Claims need `approvedBy`/`approvedOn`; trust metrics need value, source, source URL, date checked, approval and
  `displayEnabled`.
- Placeholder testimonials never render on production; `[DEV PLACEHOLDER]`/`[DRAFT]` text fails `npm run seo`.
- No Review/AggregateRating schema is emitted.
- `tests/unit/security.test.ts` fails on key files, API/Branch/Razorpay keys, Twilio SIDs, private keys, AdMob IDs and
  any reference to the production API or legacy link domains.
