# Apache production deployment — MeeHelp Website V2

This runbook reflects the production pre-cutover verification completed on 19 October 2026.

## Confirmed current production state

- Web server: Apache 2.4 on Ubuntu
- Apex domain: `meehelp.in`
- SSH user: `ubuntu`
- Apache runtime user/group: `www-data:www-data`
- Main Apache root: `/var/www/html`
- **Active HTTP and HTTPS vhosts currently serve:** `/var/www/html/meehelp-website/build/`
- HTTP vhost: `/etc/apache2/sites-enabled/000-default.conf`
- HTTPS vhost: `/etc/apache2/sites-enabled/000-default-le-ssl.conf`
- Both active vhosts use `AllowOverride None`
- `mod_headers`, `mod_rewrite`, and `mod_ssl` are enabled
- The existing HTTPS certificate is valid for `meehelp.in`
- `www.meehelp.in` currently does not resolve and is not covered by the inspected certificate
- Website and API/backend are separate systems; do not change backend/API configuration during the website cutover

The Website V2 artifact is static HTML/CSS/images. It does not need PHP, Node, MySQL, or the MeeHelp API at runtime.

## Product cutover decision

Website V2 is intentionally **app-led only**. The legacy React website's customer registration, login and OTP/SMS flows are not part of Website V2 and do not need to be preserved during the website cutover. Customer account creation, login and service transactions remain in the MeeHelp apps.

The legacy website API calls should therefore be treated as retired frontend behavior, not as a production dependency of Website V2. This decision does **not** authorize any change to the separate backend/API infrastructure at `meehelp.co.in` or to the mobile apps.

## Production build

Use Node 22 and build from the approved release branch/commit:

```bash
npm ci
GA4_MEASUREMENT_ID=G-07TZPSFJ8Y npm run build:production
```

The deployable output is `dist/`.

The production build must contain exactly the 16 approved release URLs (15 from Phase 5 + `/one-time-cleaning/`, SEO batch 1) plus `404.html`, with an indexable `robots.txt` and `sitemap.xml`.

## Mandatory pre-cutover gates

Do not switch the live vhost until all of these are complete:

1. Create a timestamped recovery archive **outside `/var/www/html`** and record its size and SHA-256 checksum.
2. Preserve the current active website directory and the root-level `/var/www/html/index.html`.
3. Preserve the real privacy-policy content. The current React source contains `/var/www/html/meehelp-website/src/web/Privacy.js`; migrate its approved content into Website V2 before launch.
4. Do not treat `/terms/`, `/refund/`, `/cancellation/`, `/contact/`, or the `.well-known` app-link paths as proven pages merely because the old SPA returns HTTP 200 for them.
5. Confirm no API/admin/callback/upload dependency uses the current website vhost.
6. Stage the new static site in a separate directory and validate it before changing either Apache vhost.
7. Because `AllowOverride None` is active, **do not rely on `.htaccess`**. Put the required headers and 404 behavior directly in the Apache vhost.

## Verified backup

First check free space:

```bash
df -h /var /var/www
```

Create a backup directory outside the active webroot:

```bash
stamp=$(date +%Y%m%d-%H%M%S)
sudo mkdir -p /var/backups/meehelp
sudo tar -C /var/www -czf "/var/backups/meehelp/html-pre-v2-$stamp.tar.gz" html
sudo sha256sum "/var/backups/meehelp/html-pre-v2-$stamp.tar.gz" | sudo tee "/var/backups/meehelp/html-pre-v2-$stamp.tar.gz.sha256"
sudo tar -tzf "/var/backups/meehelp/html-pre-v2-$stamp.tar.gz" >/dev/null
ls -lh "/var/backups/meehelp/html-pre-v2-$stamp.tar.gz"*
```

Also back up both active vhost files:

```bash
sudo cp -a /etc/apache2/sites-enabled/000-default.conf "/var/backups/meehelp/000-default.conf.$stamp"
sudo cp -a /etc/apache2/sites-enabled/000-default-le-ssl.conf "/var/backups/meehelp/000-default-le-ssl.conf.$stamp"
```

Do not delete the existing `/var/www/html/meehelp-website_backup`; it is useful but is not the sole disaster-recovery copy.

## Stage Website V2

Use a new directory outside the old React project:

```bash
sudo mkdir -p /var/www/meehelp-v2
sudo rsync -a --delete ./dist/ /var/www/meehelp-v2/
sudo chown -R root:root /var/www/meehelp-v2
sudo find /var/www/meehelp-v2 -type d -exec chmod 755 {} \;
sudo find /var/www/meehelp-v2 -type f -exec chmod 644 {} \;
```

Sanity-check the staged release:

```bash
test -f /var/www/meehelp-v2/index.html
test -f /var/www/meehelp-v2/404.html
test -f /var/www/meehelp-v2/robots.txt
test -f /var/www/meehelp-v2/sitemap.xml
grep -q 'G-07TZPSFJ8Y' /var/www/meehelp-v2/index.html
grep -q 'Allow: /' /var/www/meehelp-v2/robots.txt
test "$(grep -c '<loc>https://meehelp.in/' /var/www/meehelp-v2/sitemap.xml)" = "15"
```

Do not cut over until the privacy-policy route has been added to the staged release if it is required by the live app/store listings.

## Apache vhost requirements at cutover

Both active vhosts must point to:

```apache
DocumentRoot /var/www/meehelp-v2

<Directory /var/www/meehelp-v2>
    Options -Indexes
    AllowOverride None
    Require all granted
</Directory>

DirectoryIndex index.html
ErrorDocument 404 /404.html
```

Remove the old React SPA catch-all fallback. Website V2 has real static routes and unknown URLs must return HTTP 404 instead of serving the homepage.

Because `.htaccess` is disabled, place the production security headers directly in the active vhost configuration, including:

```apache
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
Header always set X-Frame-Options "DENY"
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.google-analytics.com https://*.google-analytics.com; font-src 'self'; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'"
```

Retain the existing Let's Encrypt SSL directives from the current HTTPS vhost. Do not invent or replace certificate paths.

Before reload:

```bash
sudo apachectl configtest
```

Only if it returns `Syntax OK`:

```bash
sudo systemctl reload apache2
```

## HTTP and WWW behavior

Before launch, record:

```bash
curl -I http://meehelp.in/
curl -I https://meehelp.in/
```

The preferred final state is HTTP → HTTPS with a permanent redirect.

`www.meehelp.in` is currently not configured. This is not a reason to point it at the server without coordinating DNS and certificate coverage. If `www` is added later, first add DNS, issue/expand the certificate for `www.meehelp.in`, and permanently redirect it to `https://meehelp.in`.

## Immediate post-cutover verification

From outside the server, verify:

```bash
curl -I https://meehelp.in/
curl -I https://meehelp.in/pricing/
curl -I https://meehelp.in/maid/
curl -I https://meehelp.in/maid/mumbai/
curl -I https://meehelp.in/maid/delhi-ncr/
curl -I https://meehelp.in/cook/mumbai/
curl -I https://meehelp.in/no-such-page/
curl https://meehelp.in/robots.txt
curl https://meehelp.in/sitemap.xml
```

Expected:

- approved pages: HTTP 200
- unknown/excluded pages: HTTP 404
- HTTPS valid
- canonicals point to `https://meehelp.in/...`
- `robots.txt` allows crawling
- sitemap contains only the 16 approved SEO URLs
- GA4 tag uses `G-07TZPSFJ8Y`
- no `noindex` on production pages
- no Vercel hostname in HTML
- GA4 Realtime receives a test visit

## Search Console

The Domain property `sc-domain:meehelp.in` is verified via a BigRock TXT record. Leave that TXT verification record in DNS.

After Website V2 is live and the production sitemap has been externally verified, submit:

`https://meehelp.in/sitemap.xml`

Do not submit the temporary Vercel hostname.

## Rollback

If any critical issue appears, restore the old vhost files and keep the old React directory untouched:

```bash
sudo cp -a "/var/backups/meehelp/000-default.conf.<STAMP>" /etc/apache2/sites-enabled/000-default.conf
sudo cp -a "/var/backups/meehelp/000-default-le-ssl.conf.<STAMP>" /etc/apache2/sites-enabled/000-default-le-ssl.conf
sudo apachectl configtest
sudo systemctl reload apache2
```

If file restoration is also required, restore the verified `html-pre-v2-<STAMP>.tar.gz` archive only after confirming the target path.

Do not delete the pre-cutover archive, old React website, or old vhost copies until the new site, privacy policy, GA4, Search Console, SSL, redirects and 404 behavior have all been confirmed.
