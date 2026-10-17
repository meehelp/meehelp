# MeeHelp Website V2 — working notes for Claude Code

Static Astro 7 marketing site. Read `README.md` first. The business rules are in `docs/BUSINESS-MODEL.md`.

- **Never connect to production.** No PHP API, database, admin, app or credentials. Content comes only from `src/data/`.
- **Zero client JS.** Use `.astro` components and native HTML/CSS. Never add `client:*` directives,
  bundled `<script>` tags or framework integrations without explicit approval (tests enforce this).
- **Don't publish by side effect.** Only the business flips `publishStatus`, `services[].models`,
  `cities[].availability`, CTA `wording` or `pricingSettings.publishPrices`.
- **Keep the propositions separate.** Marketplace and on-demand content each go in their own `data-model` section.
- Prices only in `src/data/plans.ts`; verification wording only via `src/data/verification.ts`.
- Before committing: `npm run check` (astro check, unit tests, production and preview SEO validation).
