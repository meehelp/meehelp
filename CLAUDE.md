# MeeHelp Website V2 — working notes for Claude Code

Static Astro 7 marketing site. Read `README.md` first. The business rules are in `docs/BUSINESS-MODEL.md`.

- **Never connect to production.** No PHP API, database, admin, app or credentials. Content comes only from `src/data/`.
- **Zero client JS.** Use `.astro` components and native HTML/CSS. Never add `client:*` directives,
  bundled `<script>` tags or framework integrations without explicit approval (tests enforce this).
- **Don't publish by side effect.** Only the business flips `publishStatus`, `services[].models`,
  `cities[].availability`, CTA `wording` or `pricingSettings.publishPrices`.
- **Keep the propositions separate.** Marketplace and on-demand content each go in their own `data-model` section.
- Prices only in `src/data/plans.ts`; verification wording only via `src/data/verification.ts`.
- **Only evidenced product claims.** App mechanics go in `src/data/product-facts.ts` and must cite
  `src/data/evidence.ts` (read `docs/seo/CONTENT-EVIDENCE.md` first). No city filler (festivals, weather, cuisine),
  no clinical claims for care, no on-demand prices. Other MeeHelp repos are READ-ONLY sources.
- **Phase 4.6 truth:** instant booking = one-time cleaning only; "Aadhaar document collected and manually reviewed" (never electronic/OTP);
  no address-verification claims; elder care = shared care-helper pool; care scope only from `src/data/care-scope.ts`
  (invasive work disabled, wound/catheter review-only); observed app prices never in copy; ₹299 is stale.
- After content changes: `npm run evidence`, `npm run intent-map`, `npm run report` (commit the regenerated docs/seo files).
- Before committing: `npm run check` (astro check, unit tests, production and preview SEO validation).
