# Performance

## Phase 4 content preview (92 pages)

Same method as below: Lighthouse performance (mobile, simulated throttling, median of 3 runs), Chromium 141,
preview build served by `scripts/serve-static.mjs` with gzip.

| Page | Score | FCP | LCP | TBT | CLS | JS | Total transfer |
|---|---|---|---|---|---|---|---|
| `/` | 100 | 691 ms | 1359 ms | 0 ms | 0 | 0 KB | 73.4 KB |
| `/maid/` | 100 | 683 ms | 1358 ms | 0 ms | 0 | 0 KB | 73.5 KB |
| `/maid/mumbai/` | 100 | 678 ms | 1355 ms | 0 ms | 0 | 0 KB | 71.7 KB |
| `/hourly-maid/` | 100 | 670 ms | 1355 ms | 0 ms | 0 | 0 KB | 72.3 KB |
| `/hourly-maid/mumbai/` | 100 | 668 ms | 1352 ms | 0 ms | 0 | 0 KB | 71.5 KB |
| `/pricing/` | 100 | 671 ms | 1358 ms | 0 ms | 0 | 0 KB | 71.4 KB |

Accessibility and Best Practices: 100 on all six. Lighthouse SEO shows 69 on preview only because every preview
page is deliberately `noindex` (the `is-crawlable` audit). `npm run measure:js`: 0 bytes of JS on all 93 built pages;
the only `<script>` tags are JSON-LD.

## Astro migration result (migration phase, before Phase 4)

Same method as Phase 3:
- Preview build, every template page.
- `npm run measure:js`.
- Lighthouse 13.5.0, mobile preset with simulated throttling, Chromium 141.0.7390.37.
- Median of 3 runs per page, served by `npm run serve` with gzip.

Lab numbers on a local machine show **relative** differences. They are not field data.

### Script bytes per page

| | Module script files | JS gzip | Inline JS | HTML gzip (home / `/maid/` / `/pricing/`) |
|---|---|---|---|---|
| Next.js 16.3.8 (before) | 6 | 133.5 KB (+38.6 KB `nomodule`) | 67–102 KB (RSC payload) | 22.4 / 22.4 / 16.9 KB |
| **Astro 7.3.5 (after)** | **0** | **0 KB** | **0 KB** (JSON-LD data only) | **9.6 / 9.7 / 7.3 KB** |

### Lighthouse mobile (median of 3)

| Page | Build | Score | FCP | LCP | TBT | CLS | JS transfer | Total transfer |
|---|---|---|---|---|---|---|---|---|
| `/` | Next.js | 98 | 878 ms | 2,319 ms | 72 ms | 0.000 | 135.5 KB | 236.4 KB |
| `/` | **Astro** | **100** | 706 ms | **1,360 ms** | **0 ms** | 0.000 | **0 KB** | **73.0 KB** |
| `/maid/` | Next.js | 98 | 1,058 ms | 2,299 ms | 45 ms | 0.000 | 135.5 KB | 236.5 KB |
| `/maid/` | **Astro** | **100** | 700 ms | **1,355 ms** | **0 ms** | 0.000 | **0 KB** | **73.1 KB** |
| `/maid/mumbai/` | Next.js | 99 | 1,055 ms | 1,853 ms | 65 ms | 0.000 | 135.5 KB | 242.6 KB |
| `/maid/mumbai/` | **Astro** | **100** | 678 ms | **1,354 ms** | **0 ms** | 0.000 | **0 KB** | **72.4 KB** |
| `/pricing/` | Next.js | 99 | 1,056 ms | 1,956 ms | 83 ms | 0.000 | 135.5 KB | 230.9 KB |
| `/pricing/` | **Astro** | **100** | 676 ms | **1,352 ms** | **0 ms** | 0.000 | **0 KB** | **70.8 KB** |

- **Accessibility / Best Practices:** 100 / 100 on all four pages in both builds.
- **SEO:** the production home page scores 100 in both. Preview pages score 69 in both, because they are deliberately `noindex`.
- **Visual parity:** full-page screenshots at desktop 1366 px and mobile 390 px @2x were pixel-diffed for home, `/maid/`, `/maid/mumbai/`, `/pricing/` and 404.
  - Page dimensions are identical on every preview page.
  - At most 0.034% of pixels differ, all sub-pixel glyph anti-aliasing (text-node boundaries).
  - The only intended change: production no longer renders the empty "Services" navigation landmarks while no service pages are published.

### Client components after migration

None. Every component is a server-rendered `.astro` component.
- The mobile menu and FAQs use native `<details>`.
- The sticky app bar is CSS.
- Store buttons and CTAs are plain links.
- JSON-LD is emitted as `is:inline` data blocks.
- Analytics renders nothing until IDs are configured.

Tests (`tests/unit/framework.test.ts`) and `npm run seo` fail if client JavaScript is introduced.

---

# Phase 3 review (historical — Next.js)


## Method

- Build: `npm run build:preview` (all 11–12 template pages present). Measured with `npm run measure:js`
  (scripts/measure-js.mjs): per page, the external module scripts the HTML references (raw + gzip -9), legacy
  `nomodule` polyfills (skipped by modern browsers), and inline script bytes.
- Lab: Lighthouse 13.5.0, mobile preset (simulated 4G + 4× CPU slowdown), Chromium 141, **median of 3 runs**, served
  by `npm run serve` **with gzip** (as a CDN would). Lighthouse was installed outside the project; it is not a dependency.
- An initial run without compression gave LCP ≈ 4.7 s and was discarded as unrepresentative; both BEFORE and AFTER
  below use the same gzip server.
- Content changed slightly between BEFORE and AFTER (plans and verification sections were added), so the
  "no-JS" experiment uses exactly the AFTER pages.

## Hydration inventory

| Component / file | Client? | Why it was client | Browser behaviour | JS dependency | Hydration needed? | Now |
|---|---|---|---|---|---|---|
| `components/app/PlatformCta.tsx` | **was "use client"** | read `navigator.userAgent` to show one store | swapped 2 store buttons for 1 after load → caused **CLS 0.028** | React state/effect | No — both stores fit in the bar | **Removed.** `StickyAppBar` is server-rendered with both stores |
| `SiteHeader` mobile menu | server | — | native `<details>/<summary>` | none | No | unchanged |
| `StickyAppBar` | server | — | CSS media query shows it on mobile only | none | No | now fully server |
| `StoreButtons`, `Cta` | server | — | plain `<a>` links, `data-*` for analytics | none | No | unchanged / new |
| `FaqList` | server | — | native `<details>` | none | No | unchanged |
| `Analytics` | server | used `next/script` (needs the Next runtime to inject tags) | loads GA4/GTM only when IDs set on production | was Next runtime | No | **plain async `<script>` tags**, framework-independent |
| `QrPanel`, `PlanCards`, `PlansSummary`, `VerificationSummary`, `Claims`, `Testimonials`, `Breadcrumbs`, `JsonLd` | server | — | static HTML | none | No | unchanged / new |
| `next/link` (all internal links) | server-rendered `<a>` | — | client-side navigation + prefetch, **only because the runtime is loaded** | Next router | No (normal navigation works) | unchanged |
| **Next.js App Router runtime** (React DOM, router, RSC payload) | always | framework requirement | hydrates the server tree; no visible behaviour on this site | 6 module scripts + inline `self.__next_f` payload | **No** | cannot be removed in Next.js without post-processing |

After this phase there are **zero client components** (`grep -r '"use client"' app components` → none).

## Measurements

### Script bytes per page (preview build)

| | Module script files | JS raw | **JS gzip** | nomodule gzip | Inline JS (RSC payload) | HTML gzip |
|---|---|---|---|---|---|---|
| BEFORE | 6 | 459.4 KB | **136.4 KB** | 38.6 KB | 60–84 KB | 10.4–19.8 KB |
| AFTER | 6 | 450.9 KB | **133.5 KB** | 38.6 KB | 67–102 KB | 10.8–22.5 KB |
| Same pages, framework scripts removed (experiment) | 0 | 0 | **0** | 0 | 0 | 6.5–9.8 KB |

Removing the only client component saved **2.9 KB gzip**. The rest is the framework runtime, which every page
loads even with zero client components. The inline RSC payload duplicates the page content as JavaScript strings
and roughly doubles the HTML transfer size.

### Lighthouse mobile (median of 3)

| Page | Stage | Score | FCP | LCP | TBT | CLS | JS transfer | Total transfer | JS boot-up |
|---|---|---|---|---|---|---|---|---|---|
| `/` | BEFORE | 98 | 858 ms | 2,292 ms | 95 ms | 0.028 | 138.4 KB | 267.1 KB | 427 ms |
| `/` | AFTER | 98 | 885 ms | 2,317 ms | 59 ms | **0.000** | 135.5 KB | 236.4 KB | 345 ms |
| `/` | no-JS experiment | 100 | 691 ms | **1,360 ms** | **0 ms** | 0.000 | 0 KB | 73.2 KB | 11 ms |
| `/maid/` | BEFORE | 98 | 873 ms | 2,110 ms | 54 ms | 0.028 | 138.4 KB | 234.9 KB | 369 ms |
| `/maid/` | AFTER | 98 | 1,056 ms | 2,289 ms | 48 ms | **0.000** | 135.5 KB | 236.5 KB | 337 ms |
| `/maid/` | no-JS experiment | 100 | 903 ms | **1,353 ms** | **0 ms** | 0.000 | 0 KB | 73.3 KB | 10 ms |
| `/maid/mumbai/` | BEFORE | 98 | 861 ms | 2,300 ms | 103 ms | 0.028 | 138.4 KB | 240.3 KB | 430 ms |
| `/maid/mumbai/` | AFTER | 98 | 1,056 ms | 1,859 ms | 96 ms | **0.000** | 135.5 KB | 242.6 KB | 348 ms |
| `/maid/mumbai/` | no-JS experiment | 100 | 902 ms | **1,053 ms** | **0 ms** | 0.000 | 0 KB | 72.6 KB | 12 ms |

The no-JS pages were **pixel-identical** to the Next.js pages in a full-page mobile screenshot comparison
(image diff bounding box: none). The menu and FAQs use native HTML, so nothing breaks without JS.

## Changes made

1. Removed `PlatformCta` (the only client component). Fixes CLS 0.028 → 0.
2. `Analytics` uses plain async script tags instead of `next/script`, so it doesn't depend on the framework runtime.
3. The local server (`npm run serve`) now gzips, so local measurements reflect CDN delivery.
4. Added `npm run measure:js` for repeatable measurement.

Not done, deliberately: stripping Next.js runtime scripts from the exported HTML in a post-build step. It produced
the experiment numbers above, but it relies on undocumented output markup and would break silently on a framework
upgrade. That is the kind of fragile workaround to avoid, and it is the main input into the framework recommendation below.

## Next.js vs Astro (no migration done)

| | Current Next.js static export | Hypothetical Astro static build |
|---|---|---|
| Client JS per page | ~133.5 KB gzip (6 files) + RSC inline payload, with zero interactive components | 0 KB by default; JS only for components explicitly marked as islands |
| Static HTML quality | full content in HTML, but each page also embeds a JS copy of itself (HTML ≈ 2× larger) | the same HTML without the duplicate payload (measured proxy: 9.8 KB vs 22 KB gzip) |
| SEO | equal: both are fully crawlable static HTML with identical metadata | equal; slightly leaner pages |
| Likely CWV impact (field, low-end Android on 4G) | measurable main-thread cost (TBT 48–103 ms lab, ~340 ms JS boot-up); LCP ~1.9–2.3 s lab | TBT ≈ 0, LCP ≈ 1.1–1.4 s lab (from the experiment) |
| Development complexity | App Router conventions; workarounds already needed (empty-route export limit → `pageExtensions` switch; catch-all route) | simpler file-based static pages; `getStaticPaths` with empty arrays is fine |
| Dynamic route generation | `generateStaticParams`; export fails on empty routes | `getStaticPaths`; empty is fine |
| Sitemap/content scale | fine (registry-driven) | fine (same registry; content collections optional) |
| Future analytics | plain script tags work in both | plain script tags; Partytown integration available |
| App conversion | links and smart banner — no JS needed | identical |
| Maintenance with Claude Code | very well known | well known; `.astro` + existing TSX components (Astro renders React components to static HTML with no client JS) |
| Migration cost **now** | — | low: `data/`, `lib/content`, `lib/guards`, `lib/pricing`, `lib/trust`, `lib/seo` (schema), tests and scripts carry over almost unchanged; ~25 TSX components can be reused through `@astrojs/react` (server-rendered) or ported; replace `next/link`, Next metadata objects, `robots.ts`/`sitemap.ts`. Estimated 1–2 focused days including re-validation |
| Migration cost **after** hundreds of SEO pages | — | the code cost grows mainly with templates, not pages (content is data). But a live migration then risks URLs, canonicals and rankings, needs full re-crawl verification, and Next-specific features may have accumulated |

## Recommendation

**Migrate to Astro (static output) before Phase 4 content expansion.**

- This site has no interactive features, and every measured cost of Next.js here is pure framework overhead:
  ~135 KB gzip of JS, a duplicate RSC payload, up to ~100 ms TBT and ~0.5–1 s later LCP in the lab.
  Identical pages without it are pixel-identical and score 100.
- The priorities for this site are crawlability, static HTML, mobile performance and minimal JS, in that order.
  Next.js only matches the first two.
- The migration is cheapest now: before launch there is no SEO risk, and the framework-agnostic parts
  (data, rules, guards, tests, validator) are most of the code.
- Keep the content model, route registry, guards and `npm run seo` as they are; the validator works on any static
  HTML output.

If the team prefers to stay on Next.js, it remains a valid, fully crawlable choice. The cost is the runtime JS
above, and no further meaningful reduction is available without fragile post-processing.
