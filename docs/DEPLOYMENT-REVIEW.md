# Protected Vercel review deployment (Phase 5.5)

**Status: prepared, NOT deployed.** Nothing has been created on Vercel. No domain, DNS, Search Console or analytics
change has been made. This document is the exact procedure for a person with access to the MeeHelp Vercel team.

> ⚠️ **DO NOT attach meehelp.in (or www.meehelp.in) to this Vercel project yet.**
> Do not add any domain, do not click "Promote to Production", and do not create a production deployment.
> The review build is for authorised reviewers only.

The deployment serves the `release-review` build: exactly the 15 approved first-release pages plus `404.html`,
`robots.txt` (`Disallow: /`) and an empty `sitemap.xml`. Every page is `noindex, nofollow, noarchive`, and
canonicals point at the future `https://meehelp.in/...` URLs on purpose (see section I).

> Dashboard labels below are written from Vercel's documented UI; this environment could not reach vercel.com to
> re-check them. If a label differs slightly, follow the intent described next to it.

---

## A. Vercel project setup

| Setting | Value |
|---|---|
| Team | the MeeHelp team that should own the review deployment |
| Project name | e.g. `meehelp-website-v2-review` (the name appears in preview URLs only) |
| Plan | Vercel Authentication works on Hobby (only the account owner can view) and Pro (team members can view) — use a **Pro team** if several reviewers need access |

Nothing in Website V2 needs secrets, a database or an API: it is a static site.

## B. Git repository and branch

| | |
|---|---|
| Repository | `meehelp/meehelp` (GitHub) |
| Review branch | `seo/phase-4-content-preview` |
| Production branch | set to a branch that does **not** exist (e.g. `production-not-yet`) — see step N2 |

`main` holds an older Astro migration commit and **must not** be deployed as production.

## C. Framework and build settings

| Setting (Project → Settings → Build and Deployment) | Value |
|---|---|
| Framework Preset | **Astro** (also declared in `vercel.json`) |
| Root Directory | `./` (repository root) |
| Install Command | `npm ci` (also in `vercel.json`) |
| Build Command | **`npm run build:release-review`** (override ON) |
| Output Directory | `dist` (also in `vercel.json`) |
| Node.js Version | **22.x** (Astro 7 needs ≥ 22.22.0) |

`vercel.json` deliberately contains **no build command and no stage**, so the same file works for the eventual
production build (`npm run build:production`). It only sets: framework, `npm ci`, `dist`, `trailingSlash: true`
(308 `/maid` → `/maid/`), security headers, an `X-Robots-Tag: noindex` header for `*.vercel.app` hosts only, and
a one-week cache for `/fonts`, `/brand` and `/og`.

## D. Build command

```
npm run build:release-review
```

It runs `SITE_STAGE=release-review astro build`: the stage is set by the script itself, so it can never build
production by accident. `deploy-guard.mjs` (loaded by `astro.config.mjs`) additionally **fails the build** when:

- `SITE_STAGE` is not set on Vercel (plain `astro build` would otherwise build the development stage);
- a Vercel **production** deployment is attempted with any stage other than `production`;
- `SITE_URL` is anything other than `https://meehelp.in` on Vercel or release-review (canonicals never point at a
  preview hostname).

## E. Environment variables

| Name | Value | Environments |
|---|---|---|
| `SITE_STAGE` | `release-review` | **Preview only** (optionally limited to branch `seo/phase-4-content-preview`) |
| `SITE_URL` | — leave unset — | — |

No other variables. Do **not** add database, API, Firebase, Branch, Razorpay, Twilio, analytics or Search Console
values. Nothing from the existing apps/backend is needed or allowed.

## F. Output directory

`dist` — Astro static output (`build.format: "directory"`, so `/maid/` is `dist/maid/index.html`). Vercel serves
`dist/404.html` with HTTP 404 for unknown paths automatically.

## G. Enable Vercel Authentication for preview deployments

**Project → Settings → Deployment Protection**

1. **Vercel Authentication**: switch **Enabled**.
2. Scope: **Standard Protection** — protects all preview deployments and generated deployment URLs. (If your plan
   offers **All Deployments**, that is even stricter and also fine.) Do not choose a scope that leaves preview
   deployments public.
3. **Protection Bypass for Automation**: leave **off** (no bypass secret).
4. **Shareable Links**: do **not** create any.
5. Password Protection / Trusted IPs: not needed (paid add-ons); Vercel Authentication is the requirement.
6. Save. Do this **before** the first review deployment (see step N).

Who can open the review URL: signed-in Vercel users who are members of the team (on Hobby, only the account
owner). Others see Vercel's login / "request access" page and must be approved by a team owner.

## H. Verify that authentication is working

1. Open the preview URL (`https://<project>-git-seo-phase-4-content-preview-<team>.vercel.app/`, or the
   deployment URL) in a **private / incognito window**, not signed in.
   **Expected:** Vercel's sign-in or "Authentication required" page — never MeeHelp content.
2. From a terminal: `curl -sI https://<preview-host>/` → **expected:** `401` (or a redirect to vercel.com sign-in),
   never `200` with the page. Repeat for `/maid/` and `/robots.txt`.
3. Sign in with an authorised team account → the MeeHelp home page loads.
4. If step 1 or 2 shows the page without signing in, **delete the deployment immediately** (section J) and re-check G.

## I. Verify robots / noindex (signed in)

| Check | How | Expected |
|---|---|---|
| Robots meta | View source of any page | `<meta name="robots" content="noindex, nofollow, noarchive">` |
| Response header | DevTools → Network → document → Headers | `X-Robots-Tag: noindex, nofollow, noarchive` (from `vercel.json`, `*.vercel.app` only) |
| robots.txt | `/robots.txt` | `User-Agent: *` / `Disallow: /` |
| Sitemap | `/sitemap.xml` | a `<urlset>` with **no** `<loc>` entries |
| Canonical | View source | `https://meehelp.in/<path>/` — **intentionally** the future production URL, never the vercel.app host |
| Inventory | Try `/maid/bengaluru/`, `/hourly-maid/mumbai/` | 404 page (only the 15 release pages exist) |
| Trailing slash | `/maid` | 308 → `/maid/` |
| Security headers | DevTools → Headers | `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` |
| JavaScript | DevTools → Network → JS filter | nothing from the site (Vercel's own toolbar script, if any, is blocked by the CSP — expected) |
| Store links | Click both badges | Google Play `com.meehelp.meehelp`, App Store `id1625634794` |

The same checks run locally, before any deployment, with `npm run smoke:hosting` (it reproduces the `vercel.json`
behaviour: 308 trailing-slash redirects, headers, `has: host` rules and 404 status, then loads every page in
Chromium under the CSP).

## J. Roll back / delete the preview

- **Delete one deployment:** Project → **Deployments** → ⋯ next to the deployment → **Delete**.
- **Stop future previews:** Project → Settings → Git → **Disconnect** the repository, or set an **Ignored Build
  Step** that always skips (`exit 0`).
- **Remove everything:** Project → Settings → General → **Delete Project**. Website V2 itself is unaffected (the code
  stays on the branch).
- Instant Rollback / promotion apply to production only and are **not** used here.

## K. Warnings

- **DO NOT attach meehelp.in** (apex or www) or any other domain to this project.
- **Do not promote** any deployment to production; do not change the Production Branch back to `main`.
- **Do not** add Shareable Links, Protection Bypass secrets, analytics IDs, Search Console tags or any credentials.
- **Do not** set `SITE_URL` — canonicals must stay `https://meehelp.in`.
- The current meehelp.in site, its DNS, the PHP backend, admin and apps are untouched by any of this.

---

## Security headers (staging and eventual production)

Set in `vercel.json` for every path:

```
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'; script-src 'none'; style-src 'self' 'unsafe-inline';
  img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self';
  form-action 'none'; frame-ancestors 'none'
```

- Works with the site as built: no client JavaScript (JSON-LD blocks are data, not executed), the stylesheet is
  inlined (`'unsafe-inline'` for styles only), the Lexend font, logo, icons and OG image are self-hosted, and the
  App Store / Google Play badges are ordinary links (navigation is not restricted by CSP). Verified locally in
  Chromium by `npm run smoke:hosting` (no CSP violations, fonts and images load).
- If GA4/GTM is enabled later (production only), add `https://www.googletagmanager.com` (and the analytics
  endpoints in `connect-src`) plus the inline snippet's hash to `script-src`.
- **HSTS:** not set in `vercel.json`. Vercel serves `*.vercel.app` over HTTPS with platform-managed HSTS. For
  meehelp.in decide at cut-over: `Strict-Transport-Security: max-age=31536000` first, and add `includeSubDomains`
  / `preload` only after confirming every subdomain (including the legacy API/admin hosts) serves HTTPS.

## N. Manual steps (in order)

1. **Vercel → Add New → Project → Import `meehelp/meehelp`.** On the configure screen set: Framework **Astro**,
   Root `./`, Build Command **`npm run build:release-review`**, Install `npm ci`, Output `dist`, and environment
   variable `SITE_STAGE=release-review`.
   Vercel normally starts a first **production** build of the default branch (`main`) on import. `main` has no
   `build:release-review` script, so that build **fails and nothing is served** — expected and safe. If you
   prefer no build at all, cancel it from the Deployments tab.
2. **Settings → Git → Production Branch:** change `main` to a non-existent branch, e.g. `production-not-yet`.
   From now on no push creates a production deployment.
3. **Settings → Deployment Protection:** enable **Vercel Authentication** with **Standard Protection** (or All
   Deployments); no bypass, no shareable links (section G).
4. **Settings → Environment Variables:** keep `SITE_STAGE=release-review` for **Preview** only (optionally only for
   branch `seo/phase-4-content-preview`); make sure it is not set for Production. No `SITE_URL`.
5. **Settings → Build and Deployment:** confirm Build Command `npm run build:release-review`, Output `dist`,
   Node.js **22.x**.
6. **Create the preview:** Deployments → **Create Deployment** (choose branch `seo/phase-4-content-preview`), or
   push the next commit to that branch. It must appear as a **Preview** deployment.
7. Run the checks in **H** (authentication) and **I** (noindex, inventory, headers). Share the URL only with
   team members who need to review.
