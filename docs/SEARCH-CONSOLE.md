# Google Search Console — steps for after a domain is live

Search Console has not been touched. Do these steps when the preview, then production, site exists.

## 1. Verify ownership (once, by the domain owner)

Preferred: a **Domain property** for `meehelp.in`, verified with a DNS TXT record at the
DNS provider. This covers http/https, apex/www and all subdomains, and needs no website change.

Alternative (URL-prefix property `https://meehelp.in/`): set `GOOGLE_SITE_VERIFICATION`
to the token value in the production build environment. The site then renders
`<meta name="google-site-verification" content="…">`. Do not commit the value.

Check first whether a property already exists for the current site. If it does, keep it,
because it holds the historical data needed for the migration.

## 2. Before cut-over

- Export **Pages → Indexed** and **Performance** (16 months) for the current site, to build the legacy redirect map.
- Do not submit the preview site; it is `noindex` and `Disallow: /` by design.

## 3. At cut-over

1. Confirm `https://meehelp.in/robots.txt` shows `Allow: /` and the `Sitemap:` line.
2. **Sitemaps** → submit `https://meehelp.in/sitemap.xml`.
3. **URL Inspection** → test live URL for `/`, `/maid/` and one service-city page → Request indexing.
4. If the old site had a different sitemap URL, remove it after confirming its URLs redirect.

## 4. First 8 weeks

- Weekly: **Pages** report (watch "Not found (404)", "Duplicate without user-selected canonical",
  "Crawled – currently not indexed"); fix redirects for any legacy 404s.
- **Core Web Vitals** report (mobile) once field data accumulates.
- **Performance**: compare queries/pages against the pre-migration export.
- Enhancements: Breadcrumbs should appear; Organization appears in the knowledge panel over time.

## 5. Link to analytics

Link Search Console to the GA4 property (GA4 Admin → Product links → Search Console),
once GA4 is configured.
