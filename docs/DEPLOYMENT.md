# Deployment notes (NOT done in this phase)

Nothing has been deployed, and no DNS, redirect or hosting configuration has been changed.

## Hosting

`npm run build:production` writes a fully static site to `out/`. Any static host or CDN
works (e.g. Cloudflare Pages, Netlify, Vercel static, S3 + CloudFront). No server,
database or secrets are required at runtime.

Build command: `SITE_STAGE=production SITE_URL=https://meehelp.in npm run build`
Output directory: `out`
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
Most static hosts do this automatically for `out/maid/index.html`.

## 404 handling

`out/404.html` must be served with HTTP **404** for unknown paths (not a 200 "soft 404").
Cloudflare Pages, Netlify and Vercel do this automatically for `404.html`.

## Redirects that will be needed (configure at the host/CDN)

`output: "export"` cannot define redirects in `next.config.ts`; configure them at the edge.

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
/_next/static/*   Cache-Control: public, max-age=31536000, immutable
/*.html, /        Cache-Control: public, max-age=0, must-revalidate
/*                X-Content-Type-Options: nosniff
                  Referrer-Policy: strict-origin-when-cross-origin
                  Permissions-Policy: camera=(), microphone=(), geolocation=()
                  X-Frame-Options: SAMEORIGIN
```

Add a Content-Security-Policy once analytics choices are final. Next.js uses inline
scripts, so allow `'unsafe-inline'` for scripts or use hashes, and allow
`https://www.googletagmanager.com` if GA4/GTM is enabled.

## Analytics

Set `GA4_MEASUREMENT_ID` **or** `GTM_CONTAINER_ID` in the production build environment.
Nothing loads unless `SITE_STAGE=production` and an ID is set. CTA clicks emit
`app_download_click` with `platform` and `placement`. Before enabling, confirm the
consent/privacy approach and update the privacy policy.
