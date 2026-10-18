# MeeHelp Website V2

SEO-first marketing website for MeeHelp: a **static Astro site** that is fully independent of
the production apps, PHP backend, admin panel and databases.

- Every page is pre-rendered to plain HTML at build time (`output: "static"`). **No client
  JavaScript is shipped**; the only `<script>` tags are JSON-LD data blocks.
- All content comes from typed files in `src/data/`. There is no API or database connection.
- MeeHelp has **two propositions**, the marketplace (find and hire helpers directly with a contact
  plan) and on-demand booking. They are modelled, rendered and validated separately
  (`docs/BUSINESS-MODEL.md`).
- Content is gated by `publishStatus` (`draft` → `review` → `published`) **and** by business facts:
  unconfirmed model support or city availability holds a page in review.
- Nothing is deployed. See `docs/DEPLOYMENT.md` for what deployment will need.

Migrated from Next.js 16 to Astro 7 in a dedicated migration phase before Phase 4 (see `docs/PERFORMANCE.md`). URLs, content, metadata,
structured data and business rules are unchanged.

## Quick start

```bash
npm install
npm run dev               # http://localhost:4321 — development stage (shows drafts, noindex)
npm run check             # astro check + unit tests + production and preview SEO validation
npm run build:preview     # static build incl. "review" content, all noindex
npm run build:production  # static build of "published" content only
npm run serve             # serve dist/ at http://localhost:4000 (gzip, trailing-slash + 404 behaviour)
npm run seo               # build (production) and validate the generated HTML, sitemap, robots
npm run seo:preview       # the same for a preview build
npm run measure:js        # per-page script bytes for the current dist/ build (expected: 0)
```

Requires Node.js ≥ 22.22.0 (an Astro 7 requirement).

## Build stages

| `SITE_STAGE` | Builds | Indexable | robots.txt | Sitemap |
|---|---|---|---|---|
| `development` (default) | everything (except unpublished localities) | no | `Disallow: /` | empty |
| `preview` | `published` + `review` | no | `Disallow: /` | empty |
| `production` | `published` only | yes | `Allow: /` + sitemap | published URLs |

`SITE_URL` sets the canonical origin (default `https://meehelp.in`). Variable names are in
`.env.example` (names only; never commit values).

Production currently builds **only `/`**, on purpose: no category's marketplace support is
confirmed yet, and plan prices wait on the meaning of the app's "*".

## Directory structure

```
astro.config.mjs             static output, trailingSlash "always", inlined CSS, no prefetch
src/
  pages/
    index.astro              home page (both propositions, separated)
    [service]/[...rest].astro  /maid/, /maid/mumbai/, /hourly-maid/, /hourly-maid/mumbai/, /pricing/
    404.astro                404 page (noindex)
    robots.txt.ts, sitemap.xml.ts   generated from the route registry
  layouts/BaseLayout.astro   HTML shell: SEO head, skip link, header, main, footer, app bar
  components/
    layout/                  SiteHeader, SiteFooter, Breadcrumbs
    templates/               ServiceTemplate, OnDemandHubTemplate, ServiceCityTemplate, OnDemandCityTemplate,
                             LocalityTemplate, PricingTemplate
    content/                 Section, Cta, ServiceCards, FaqList, CheckList, BulletList, Steps,
                             ArrangementList, Icon, LinkList, BookingTypes, CrossLink, StepsInline
    app/                     StoreButton(s), QrPanel, AppDownloadSection, StickyAppBar
    pricing/                 PlanCard(s), PlansSummary, PlansLine (prices only from src/data/plans.ts)
    trust/                   VerificationSummary, Claims, TrustMetrics, AppRatings, Testimonials, Safeguards
    seo/                     SeoHead, JsonLd
    analytics/               Analytics (renders nothing until IDs are configured)
  data/                      approved business content (the only content source)
    business-models.ts       the two propositions (marketplace, on-demand)
    services.ts              categories (marketplace copy) + per-service model support (true/false/null)
    on-demand.ts             on-demand hub copy per category (/hourly-*/)
    cities.ts                8 active markets, availability, city descriptors, tagged local facts and FAQs
    city-frames.ts           short per-service × model city-page frames
    service-cities.ts        the 80 service × city × model pages (+ hand-written overrides)
    localities.ts            locality model (draft examples)
    intent-map.ts            intent targets per service × model (not volume estimates)
    evidence.ts              evidence ledger: every product claim, its source file/lines, confidence, approval
    product-facts.ts         the only place app mechanics are stated; each fact cites evidence ids
    release-plan.ts          recommended first public release (recommendation only — publishes nothing)
    care-scope.ts            business-approved baby / elder / patient care scope with publish status per item
    observed-app-values.ts   prices seen in current-app screenshots — never rendered (leak tests)
    reconciliation.ts        code vs screenshots vs business confirmation, per topic
    plans.ts                 all 9 marketplace plans, pricing page copy, asterisk/tax settings
    promotions.ts            temporary promotions (never in evergreen copy)
    verification.ts          helper verification facts (the only source of verification wording)
    ctas.ts                  CTA labels per proposition
    business.ts              marketing claims, trust metrics, schema switches
    app-links.ts testimonials.ts home.ts how-it-works.ts
  lib/
    site.ts                  stage, canonical origin, trailing-slash policy
    content/                 types, publishing rules, queries, route registry, resolver
    seo/                     metadata builder, route metadata, JSON-LD builders
    guards/                  unsupported-claim and model-mixing wording rules
    trust/                   claim/metric/verification display rules
    pricing.ts               price formatting and the price-publishing gate
    analytics/               analytics config (env-driven, empty by default)
  styles/global.css          the single global stylesheet (inlined into each page)
scripts/
  seo-check.ts               `npm run seo` validator
  content-report.ts          `npm run report` → docs/seo/quality-report.json, QUALITY-REPORT.md, FIRST-RELEASE-REVIEW.md
  intent-map.ts              `npm run intent-map` → docs/seo/intent-map.json
  evidence.ts                `npm run evidence` → docs/seo/CONTENT-EVIDENCE.* and PRODUCT-TRUTH-RECONCILIATION.*
  lib/similarity.ts          shingle-based similarity used by the validator and report
  measure-js.mjs             `npm run measure:js`
  serve-static.mjs           local static server
  optimise-images.mjs        generates logo, favicons and OG image from assets/source
tests/unit/                  node:test suites (publishing, routes, content, models, plans, guards,
                             trust, links, security, framework/zero-JS, seo-content)
public/                      static files served as-is (logo, icons, OG image, Lexend font)
assets/source/               original brand artwork and font notes
docs/                        business model, URL architecture, performance, deployment,
                             Search Console, content review, app linking
```

## Publishing workflow

1. Edit or add content in `src/data/` with `publishStatus: "review"`.
2. Run `npm run build:preview && npm run serve` and review the page locally.
3. When the business approves, set `publishStatus: "published"` (and `updatedAt`), plus the
   relevant business facts (`services[].models`, `cities[].availability`).
4. `npm run check` must pass.

Routes come from one registry (`getSiteRoutes` in `src/lib/content`). It drives `getStaticPaths`,
the sitemap and the validator, so a page cannot exist without being registered. A service × city
page is built only if the combination is explicitly listed **and** every status and business fact
allows it. A locality page also needs the locality and its per-service content to be
`"published"`, in every stage.

## Guardrails

- **Zero client JavaScript.** Tests fail on any `client:*` hydration directive, any bundled
  `<script>`, any framework integration, or any Next.js/React import. `npm run seo` fails on any
  non-JSON-LD script, script preload, or `.js` file in `dist/`.
- **Propositions never mix.** Sections carry `data-model`. `npm run seo` fails on on-demand
  wording or CTAs in marketplace sections and vice versa, and on any on-demand block on a
  marketplace page.
- **Verification wording** comes only from `src/data/verification.ts`. While those checks are
  disabled, `npm test` and `npm run seo` fail on:
  - police, criminal-background, reference and employment-history claims;
  - "fully/100% verified" and "vetted";
  - unqualified "verified helpers".
- **Commercial claims**: replacement/placement/hiring guarantees, "completely free" and
  "zero/no charges" are blocked. "No placement agency fee" is the only enabled marketplace claim.
- **Prices** exist only in `src/data/plans.ts`. Tests fail on any price string elsewhere in the
  source. `npm run seo` fails on:
  - unconfigured prices;
  - Office/Business prices outside `/pricing/`;
  - any price followed by "*" (the app's asterisk has no meaning and is removed);
  - any plan or price on an on-demand page.
- **Promotions** (free profile views) and **tax wording** never appear in evergreen copy, titles or metas.
- **Content truth** (Phase 4.5): product mechanics only via `src/data/product-facts.ts` with evidence ids;
  tests block city filler (festivals, weather, cuisine), clinical claims for care, unsupported filters, tracking,
  ratings or trial claims, instant-booking promises the app doesn't make, and durations that aren't app values.
- **Doorway guard**: `npm run seo` warns on every city page at high similarity risk; `npm run report`
  scores every page and marks it ready-for-approval or needs-content.
- Claims need `approvedBy`/`approvedOn`. Trust metrics need value, source, source URL, date
  checked, approval and `displayEnabled`.
- Placeholder testimonials never render on production, and `[DEV PLACEHOLDER]`/`[DRAFT]` text
  fails `npm run seo`.
- No Review/AggregateRating schema is emitted. FAQPage schema stays off.
- `tests/unit/security.test.ts` fails on:
  - key files;
  - API, Branch and Razorpay keys, Twilio SIDs, private keys and AdMob IDs;
  - any reference to the production API or legacy link domains.
