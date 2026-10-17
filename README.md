# MeeHelp Website V2

SEO-first marketing website for MeeHelp. A **static Next.js site**, fully
independent of the production apps, PHP backend, admin panel and databases.

- Every page is pre-rendered to plain HTML at build time (`output: "export"`).
- All content comes from typed files in `data/`. There is no API or database connection.
- Content is gated by `publishStatus` (`draft` → `review` → `published`).
- Nothing is deployed. See `docs/DEPLOYMENT.md` for what deployment will need.

## Quick start

```bash
npm install
npm run dev               # http://localhost:3000 — development stage (shows drafts, noindex)
npm run check             # typecheck + unit tests + production SEO validation
npm run build:preview     # static build incl. "review" content, all noindex
npm run build:production  # static build of "published" content only
npm run serve             # serve out/ at http://localhost:4000 (trailing-slash + 404 behaviour)
npm run seo               # build (production) and validate generated HTML, sitemap, robots
npm run seo:preview       # same for a preview build
```

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
  [service]/[[...rest]]/     /maid/, /maid/mumbai/, /maid/mumbai/andheri-west/
  not-found.tsx              404 page (noindex)
  robots.ts, sitemap.ts      Generated from the route registry
  fonts/                     Lexend SemiBold (headings only)
components/
  layout/                    SiteHeader, SiteFooter, Breadcrumbs
  templates/                 ServiceTemplate, ServiceCityTemplate, LocalityTemplate
  content/                   Section, ServiceCards, FaqList, Lists, Icon, LinkList
  app/                       StoreButtons, PlatformCta (only client component), QrPanel,
                             AppDownloadSection, StickyAppBar
  trust/                     TrustMetrics/AppRatings, Claims, Testimonials, Safeguards
  seo/                       JsonLd
  analytics/                 Analytics (inactive until IDs are configured)
data/                        Approved business content — the only content source
  services.ts cities.ts service-cities.ts localities.ts
  business.ts (claims, metrics, schema switches) app-links.ts testimonials.ts
  home.ts how-it-works.ts
lib/
  site.ts                    Stage, canonical origin, trailing-slash policy
  content/                   Types, publishing rules, queries, route registry, resolver
  seo/                       Metadata builder, JSON-LD builders
  trust/                     Claim/metric display rules
  analytics/                 Analytics config (env-driven, empty by default)
scripts/
  seo-check.ts               `npm run seo` validator
  serve-static.mjs           Local static server
  optimise-images.mjs        Generates logo, favicons and OG image from assets/source
tests/unit/                  node:test suites (publishing, routes, content, trust, links, security)
assets/source/               Original brand artwork (logo from the MeeHelp user app)
public/                      Static files served as-is (logo, OG image)
docs/                        Deployment, Search Console, content review, app linking
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

- Claims (`data/business.ts`) are disabled by default; an enabled claim must record who approved it and when.
- Verification wording ("verified helper", "background checked" …) in production HTML fails `npm run seo` while verification claims are disabled.
- Trust metrics render only with an approved value, a source and an as-of date.
- Placeholder testimonials never render on production, and `[DEV PLACEHOLDER]`/`[DRAFT]` text in production HTML fails `npm run seo`.
- No Review/AggregateRating schema is emitted; `npm run seo` fails if any appears.
- `tests/unit/security.test.ts` fails on key files, API keys, Branch keys, Twilio SIDs, private keys, and any reference to the production API domains.
