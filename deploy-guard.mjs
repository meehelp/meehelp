/**
 * Build-time deployment guard, used by astro.config.mjs (and tested in
 * tests/unit/deployment.test.ts). It makes unsafe hosted builds FAIL instead
 * of silently producing the wrong site:
 *
 *   1. On Vercel, SITE_STAGE must be set explicitly. Without it Astro would
 *      build the "development" stage (every page, placeholders included).
 *   2. A Vercel PRODUCTION deployment may only be built with
 *      SITE_STAGE=production — a review/preview build must never become the
 *      production deployment.
 *   3. Canonicals always point at https://meehelp.in on release-review,
 *      production and any Vercel build — never at a *.vercel.app hostname.
 *
 * Returns the list of problems (empty = OK); astro.config.mjs throws on any.
 */
export const CANONICAL_ORIGIN = "https://meehelp.in";
const STAGES = ["development", "preview", "release-review", "production"];

export function deploymentProblems(env) {
  const problems = [];
  const stage = env.SITE_STAGE;
  const onVercel = Boolean(env.VERCEL);
  const site = (env.SITE_URL || CANONICAL_ORIGIN).replace(/\/+$/, "");
  if (stage && !STAGES.includes(stage)) problems.push(`Unknown SITE_STAGE "${stage}" (use ${STAGES.join(", ")})`);
  if (onVercel && !stage) problems.push("SITE_STAGE must be set on Vercel (use npm run build:release-review for the protected review deployment)");
  if (onVercel && env.VERCEL_ENV === "production" && stage !== "production")
    problems.push(`A Vercel production deployment must not be built with SITE_STAGE=${stage || "(unset)"}; deploy review builds as Preview deployments only`);
  if ((onVercel || stage === "release-review" || stage === "production") && site !== CANONICAL_ORIGIN)
    problems.push(`SITE_URL must stay ${CANONICAL_ORIGIN} (got ${site}); canonicals never point at a preview hostname`);
  return problems;
}
