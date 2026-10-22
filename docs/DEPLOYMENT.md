# Deployment notes (NOT done in this phase)

> The protected Vercel review deployment of the 15-page `release-review` build is documented in
> **`docs/DEPLOYMENT-REVIEW.md`**; its headers live in `vercel.json` (the block below is kept in sync).

Nothing has been deployed, and no DNS, redirect or hosting configuration has been changed.

## Hosting

`npm run build:production` (Astro, `output: "static"`) writes a fully static site to `dist/`.
Any static host or CDN works (e.g. Cloudflare Pages, Netlify, Vercel static, S3 + CloudFront).
No server, database, secrets or client JavaScript are required at runtime.

Build command: `SITE_STAGE=production SITE_URL=https://meehelp.in npm run build`
Output directory: `dist`
Node.js: ≥ 22.22.0 (Astro 7 requirement)
Run `npm run check` in CI before every deploy.

## Recommended rollout

1. **Preview host** (e.g. `v2-preview.meehelp.in` or a provider subdomain) built with
   `SITE_STAGE=preview`: every page is `noindex`, `robots.txt` is `Disallow: /`.
   Also protect it with basic auth or an access policy.
2. Business review of the content (see `docs/CONTENT-REVIEW.md`).
3. **Production cut-over** at the edge — see "Coexistence with the current site" below.

## Canonical domain policy

- Canonical origin: `https://meehelp.in` (apex, HTTPS). Set via `SITE_URL`.
- 301 `http://meehelp.in/*` → `https://meehelp.in/*`
- 301 `https://www.meehelp.in/*` → `https://meehelp.in/*`
- Enable HSTS once HTTPS is confirmed everywhere: `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  (add `preload` only after confirming all subdomains support HTTPS).
- `meehelp.co.in` and `meehelp.online` host the API/admin — do **not** redirect their API paths.

## Trailing-slash policy

All page URLs end with `/` (`trailingSlash: true`); canonicals, internal links and the sitemap all use it.
The host must 301/308 `/maid` → `/maid/` (`npm run serve` demonstrates this behaviour).
Most static hosts do this automatically for `dist/maid/index.html`.

## 404 handling

`dist/404.html` must be served with HTTP **404** for unknown paths (not a 200 "soft 404").
Cloudflare Pages, Netlify and Vercel do this automatically for `404.html`.

## Redirects that will be needed (configure at the host/CDN)

Astro static output cannot set HTTP redirects or headers itself; configure them at the edge.

1. Host canonicalisation (above).
2. **Legacy URL map**: crawl the current meehelp.in and export Search Console "Pages",
   then 301 every indexed legacy URL to its closest V2 equivalent (never mass-redirect to `/`).
3. Do **not** redirect `/acp/*` or `/images/*` — see below.

## Coexistence with the current site

The admin panel and push-notification/invoice assets live on the same host today:

- `https://meehelp.in/acp/*` — admin panel (referenced by admin code)
- `https://www.meehelp.in/images/meehelp_logo.png` — used in push notifications and invoices

At cut-over, route **only** marketing paths to V2 and keep these on the legacy origin,
e.g. with a CDN path rule:

| Path | Origin |
|---|---|
| `/acp/*` | legacy server (unchanged) |
| `/images/*` | legacy server (unchanged) |
| Privacy policy / terms URLs used by the store listings | legacy server until V2 has equivalents |
| everything else | V2 static host |

Longer term, move the admin to its own subdomain and add `X-Robots-Tag: noindex` to it.

## Response headers (configure at the host)

```
/_astro/*         Cache-Control: public, max-age=31536000, immutable   (content-hashed; none emitted today)
/fonts/*, /brand/*, /og/*, /*.png
                  Cache-Control: public, max-age=604800
/*.html, /        Cache-Control: public, max-age=0, must-revalidate
/*                X-Content-Type-Options: nosniff
                  Referrer-Policy: strict-origin-when-cross-origin
                  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
                  X-Frame-Options: DENY
```

The site runs no JavaScript (JSON-LD blocks are data, not executed), so a strict policy works today:

```
Content-Security-Policy: default-src 'self'; script-src 'none'; style-src 'self' 'unsafe-inline';
  img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self';
  form-action 'none'; frame-ancestors 'none'
```

`style-src 'unsafe-inline'` is needed because the stylesheet is inlined into each page. If GA4/GTM is enabled
later, allow `https://www.googletagmanager.com` and the inline analytics snippet's hash in `script-src`.

## Analytics

Set `GA4_MEASUREMENT_ID` **or** `GTM_CONTAINER_ID` in the production build environment.
Nothing loads unless `SITE_STAGE=production` and an ID is set. CTA clicks emit
`app_download_click` with `platform` and `placement`. Before enabling, confirm the
consent/privacy approach and update the privacy policy.
