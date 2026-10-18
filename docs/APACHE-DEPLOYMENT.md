# Apache production deployment — MeeHelp Website V2

This runbook is for the current production website host confirmed by the backend team:

- Web server: Apache
- Current document root: `/var/www/html`
- Access available: SSH and FTP
- Existing SSL certificate stays on the server
- Website is a separate instance from the API/backend

The Website V2 artifact is static HTML/CSS/images. It does not need PHP, Node, MySQL, or the MeeHelp API at runtime.

## Production build

Use Node 22 and build from the approved branch/commit:

```bash
npm ci
GA4_MEASUREMENT_ID=G-07TZPSFJ8Y npm run build:production
```

The deployable output is `dist/`.

The production build must contain exactly the 15 approved release URLs plus `404.html`, with an indexable `robots.txt` and `sitemap.xml`.

## Mandatory pre-cutover checks

Before replacing `/var/www/html`:

1. Record the active Apache vhost file and run `apachectl -S`.
2. Confirm whether `www.meehelp.in` resolves and whether it redirects to the apex domain.
3. Confirm `AllowOverride` for `/var/www/html`. If it is `None`, copy the headers from `public/.htaccess` into the vhost instead.
4. Preserve the current website in a timestamped backup.
5. Preserve legacy/legal URLs that must continue working. At minimum, `/privacy-policy/` exists on the current site and must not be accidentally removed. Inventory any Terms, Refund, Cancellation, Contact, or other legal/store-linked routes before cutover.
6. Do not change API/backend configuration.

## Backup

Example:

```bash
stamp=$(date +%Y%m%d-%H%M%S)
sudo cp -a /var/www/html "/var/www/html-backup-$stamp"
echo "/var/www/html-backup-$stamp"
```

Keep the backup until post-launch verification is complete.

## Stage the new files

Upload the contents of `dist/` to a temporary directory first:

```bash
sudo mkdir -p /var/www/meehelp-next
sudo rsync -a --delete ./dist/ /var/www/meehelp-next/
```

Sanity-check the staged release:

```bash
test -f /var/www/meehelp-next/index.html
test -f /var/www/meehelp-next/robots.txt
test -f /var/www/meehelp-next/sitemap.xml
grep -q 'G-07TZPSFJ8Y' /var/www/meehelp-next/index.html
grep -q 'Allow: /' /var/www/meehelp-next/robots.txt
grep -q '<loc>https://meehelp.in/' /var/www/meehelp-next/sitemap.xml
```

## Cutover

After legacy/legal route preservation is resolved:

```bash
sudo rsync -a --delete /var/www/meehelp-next/ /var/www/html/
sudo chown -R <APACHE_USER>:<APACHE_GROUP> /var/www/html
sudo apachectl configtest
sudo systemctl reload apache2
```

Replace `<APACHE_USER>` and `<APACHE_GROUP>` with the values used by the existing server. Do not guess them.

If `.htaccess` is disabled, add the equivalent security headers and `ErrorDocument 404 /404.html` to the Apache vhost, run `apachectl configtest`, then reload Apache.

## Immediate verification

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
- sitemap contains only the 15 approved URLs
- GA4 tag uses `G-07TZPSFJ8Y`
- no `noindex` on production pages
- no Vercel hostname in HTML

Open GA4 Realtime and generate one test visit from a normal browser after launch.

## Search Console

The Domain property `meehelp.in` has been created but DNS verification is pending.

When BigRock access is available:
1. Add the Google-provided TXT verification record at the apex/root of `meehelp.in`.
2. Do not alter the A record, nameservers, MX, or other DNS records for verification.
3. Verify the Domain property in Search Console.
4. Submit `https://meehelp.in/sitemap.xml`.

## Rollback

If any critical issue appears:

```bash
sudo rsync -a --delete "/var/www/html-backup-<STAMP>/" /var/www/html/
sudo apachectl configtest
sudo systemctl reload apache2
```

Then verify the old homepage and any legal/store-linked routes before ending the rollback.

Do not delete the backup until the new site, GA4, Search Console, SSL, redirects, 404 handling and legal routes have all been confirmed.
