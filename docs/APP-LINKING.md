# App download & deep linking

## Current implementation

- Store CTAs use the official listings (`data/app-links.ts`):
  - Google Play: `https://play.google.com/store/apps/details?id=com.meehelp.meehelp&hl=en_IN`
  - App Store: `https://apps.apple.com/in/app/meehelp-find-helpers-near-you/id1625634794`
- Play links append an install referrer (`utm_source=meehelp_website`, `utm_medium=organic`,
  `utm_campaign=<placement>`), visible in Play Console acquisition reports.
- Safari Smart App Banner: `<meta name="apple-itunes-app" content="app-id=1625634794">`.
- The mobile sticky bar shows both store buttons, server-rendered (no JS, no layout shift). Device-specific store
  selection was removed in Phase 3 because it needed a client component and caused CLS; a smart link will do this server-side once deep linking is reviewed.
- Proposition CTAs (`data/ctas.ts`, e.g. "Find a maid", "Choose a plan", "Book now") link to the page's `#get-the-app`
  section today. Each has a `journey` (marketplace-search, marketplace-plans, on-demand-booking) for future deep links.
- `QrPanel` is a desktop placeholder (preview only) until an approved QR image exists.
- Store buttons have `data-track="app_download_click"`; proposition CTAs have `data-track="cta_click"`, `data-cta` and
  `data-cta-model`. All carry `data-placement` for analytics.

## Not used yet (needs review)

The apps are configured for Branch.io link domains (user app and helper app each have their
own `*.app.link` domain). These are **not** used on the website until the Branch configuration is reviewed:

- which Branch app/keys are live, and who administers them
- whether a custom link domain (e.g. `link.meehelp.in`) should be set up
- the malformed custom URL scheme in the user and helper Android manifests (`com.meehelp.meehelp://`
  includes `://`, which Android treats as invalid). This needs a fix in the apps (out of scope here).

## Future options

1. **Branch smart links** (deferred deep linking already in the apps via `flutter_branch_sdk`):
   set `deepLinking.enabled`, `provider: "branch"` and `baseUrl`, then have `StoreButton` link to
   `baseUrl` with `service`/`city` link data so installs open the right flow.
2. **Android App Links / iOS Universal Links on meehelp.in**: requires
   `/.well-known/assetlinks.json` and `/.well-known/apple-app-site-association` on the website
   *and* app releases that declare `meehelp.in`. Coordinate with an app release.
3. A desktop QR code that points at the smart link (set `qr.enabled`, `imageSrc`, `targetUrl`).
