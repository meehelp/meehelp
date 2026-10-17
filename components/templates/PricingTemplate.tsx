import type { Metadata } from "next";
import { marketplaceSteps } from "@/data/how-it-works";
import { pricingPage } from "@/data/plans";
import { AppDownloadSection } from "@/components/app/AppDownloadSection";
import { Cta } from "@/components/content/Cta";
import { Steps } from "@/components/content/Lists";
import { Section } from "@/components/content/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PlanCards } from "@/components/pricing/PlanCards";
import { PlansSummary } from "@/components/pricing/PlansSummary";
import { Claims } from "@/components/trust/Claims";
import type { ResolvedRoute } from "@/lib/content/resolve";
import { pricingPath } from "@/lib/content/paths";
import { isIndexable } from "@/lib/content/publishing";
import { getSegments } from "@/lib/pricing";
import { buildPageMetadata } from "@/lib/seo/metadata";

/**
 * Marketplace plans for all three segments. The only page that shows Office
 * and Business plans. Held in review until prices may be shown on production
 * (see data/plans.ts — the meaning of the app's "*" is unconfirmed).
 */
type PricingRoute = Extract<ResolvedRoute, { kind: "pricing" }>;

export function pricingMetadata({ status }: PricingRoute): Metadata {
  return buildPageMetadata({ ...pricingPage.seo, path: pricingPath, indexable: isIndexable(status) });
}

export function PricingTemplate({ route: _route }: { route: PricingRoute }) {
  const b2b = getSegments("b2b");
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Plans", path: pricingPath },
        ]}
      />
      <div data-model="marketplace">
        <section className="hero hero--compact">
          <div className="container">
            <h1>{pricingPage.headline}</h1>
            {pricingPage.intro.map((p) => (
              <p key={p} className="lead">
                {p}
              </p>
            ))}
            <div className="cta-row">
              <Cta ctaKey="choosePlan" placement="pricing_hero" />
            </div>
          </div>
        </section>

        <Section id="home-plans" title="Home plans" intro="For households hiring help at home." tone="tint">
          <Claims model="marketplace" />
          <PlansSummary placement="pricing_home" linkToAllPlans={false} />
        </Section>

        {b2b.map((segment) => (
          <Section key={segment.id} id={`${segment.id}-plans`} title={`${segment.name} plans`} intro={segment.description}>
            <PlanCards segment={segment.id} placement={`pricing_${segment.id}`} />
          </Section>
        ))}

        <Section id="how-it-works" title="How contact plans work" tone="warm">
          <Steps steps={marketplaceSteps} />
        </Section>

        <AppDownloadSection model="marketplace" placement="pricing_app_section" title="Choose a plan in the MeeHelp app" />
      </div>
    </>
  );
}
