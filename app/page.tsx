import type { Metadata } from "next";
import Link from "next/link";
import { businessModels } from "@/data/business-models";
import { schemaSettings } from "@/data/business";
import { cities } from "@/data/cities";
import { home } from "@/data/home";
import { marketplaceSteps, onDemandSteps } from "@/data/how-it-works";
import { AppDownloadSection } from "@/components/app/AppDownloadSection";
import { StoreButtons } from "@/components/app/StoreButtons";
import { Cta } from "@/components/content/Cta";
import { FaqList } from "@/components/content/FaqList";
import { Icon } from "@/components/content/Icon";
import { Steps } from "@/components/content/Lists";
import { Section } from "@/components/content/Section";
import { ServiceCards } from "@/components/content/ServiceCards";
import { PlansSummary } from "@/components/pricing/PlansSummary";
import { JsonLd } from "@/components/seo/JsonLd";
import { Claims } from "@/components/trust/Claims";
import { Safeguards } from "@/components/trust/Safeguards";
import { Testimonials } from "@/components/trust/Testimonials";
import { TrustMetrics } from "@/components/trust/TrustMetrics";
import { VerificationSummary } from "@/components/trust/VerificationSummary";
import { getBuiltServiceCities, getService, getServiceCategories } from "@/lib/content";
import { serviceCityPath } from "@/lib/content/paths";
import { isIndexable } from "@/lib/content/publishing";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { faqPageSchema, organizationSchema, websiteSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildPageMetadata({
  ...home.seo,
  path: "/",
  indexable: isIndexable(home.publishStatus),
});

const bookingTypeNames = { instant: "Instant", scheduled: "Scheduled", hourly: "Hourly" } as const;

/**
 * The home page introduces BOTH propositions. Each proposition has its own
 * sections, marked with data-model, and the SEO validator checks that their
 * wording and CTAs never mix.
 */
export default function HomePage() {
  const categories = getServiceCategories();
  const cityPages = getBuiltServiceCities();
  const activeCities = cities.filter((c) => c.marketActive === true);
  const { marketplace, onDemand } = businessModels;
  const bookingTypes = (Object.keys(bookingTypeNames) as (keyof typeof bookingTypeNames)[]).filter(
    (k) => onDemand.bookingTypes[k] === true,
  );

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          websiteSchema(),
          ...(schemaSettings.faqPage ? [faqPageSchema(home.faqs)] : []),
        ]}
      />

      <section className="hero">
        <div className="container">
          <p className="eyebrow">Help at home with the MeeHelp app</p>
          <h1>{home.headline}</h1>
          <p className="lead">{home.intro}</p>
          <ul className="paths">
            {marketplace.confirmed ? (
              <li className="path" data-model="marketplace">
                <h2 className="path__title">{marketplace.name}</h2>
                <p>{marketplace.summary}</p>
                <Cta ctaKey="findHelpers" placement="home_hero_marketplace" />
              </li>
            ) : null}
            {onDemand.confirmed ? (
              <li className="path path--alt" data-model="onDemand">
                <h2 className="path__title">{onDemand.name}</h2>
                <p>{onDemand.summary}</p>
                <Cta ctaKey="bookNow" placement="home_hero_on_demand" />
              </li>
            ) : null}
          </ul>
          <StoreButtons placement="home_hero" />
        </div>
      </section>

      <Section
        id="helpers"
        title="Helpers you can find on MeeHelp"
        intro="Review profiles, contact helpers directly and hire the person who fits your home."
        model="marketplace"
      >
        <ServiceCards items={categories} />
      </Section>

      <Section id="how-hiring-works" title="How finding and hiring a helper works" tone="tint" model="marketplace">
        <Steps steps={marketplaceSteps} />
      </Section>

      <Section id="plans" title="Plans for contacting helpers" tone="warm" model="marketplace">
        <Claims model="marketplace" />
        <PlansSummary placement="home_plans" />
      </Section>

      {onDemand.confirmed ? (
        <Section id="on-demand" title={onDemand.name} intro={onDemand.summary} model="onDemand">
          {bookingTypes.length > 0 ? (
            <ul className="tags" aria-label="Booking types">
              {bookingTypes.map((k) => (
                <li key={k}>{bookingTypeNames[k]}</li>
              ))}
            </ul>
          ) : null}
          <Steps steps={onDemandSteps} />
          <p className="note">The kinds of help you can book depend on your area. Check in the MeeHelp app.</p>
          <div className="cta-row">
            <Cta ctaKey="bookNow" placement="home_on_demand" />
          </div>
        </Section>
      ) : null}

      <Section id="who-we-help" title="Who MeeHelp helps" tone="warm">
        <ul className="cards cards--4">
          {home.audiences.map((a) => (
            <li key={a.title} className="card">
              <h3 className="card__title">{a.title}</h3>
              <p>{a.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="safety" title="Helper verification and safety">
        <TrustMetrics />
        <VerificationSummary />
        <h3>Tips for hiring</h3>
        <Safeguards />
      </Section>

      {activeCities.length > 0 ? (
        <Section id="coverage" title="Cities where MeeHelp operates" tone="tint">
          <ul className="city-list">
            {activeCities.map((city) => {
              const pages = cityPages.filter((p) => p.city === city.slug);
              return (
                <li key={city.slug} className="city-list__item">
                  <h3 className="city-list__name">
                    <Icon name="arrow" size={16} className="city-list__icon" /> {city.displayName}
                  </h3>
                  {pages.length > 0 ? (
                    <ul>
                      {pages.map((p) => (
                        <li key={`${p.service}-${p.model}`}>
                          <Link href={serviceCityPath(p.service, p.city)}>
                            {getService(p.service)?.shortName} in {city.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <p>What is available depends on your exact area and the kind of help you need. Check in the MeeHelp app.</p>
        </Section>
      ) : null}

      <Testimonials />

      <AppDownloadSection model="both" placement="home_app_section" />

      <Section id="faqs" title="Frequently asked questions">
        <FaqList faqs={home.faqs} />
      </Section>

      <section className="cta-band" aria-labelledby="final-cta-heading">
        <div className="container">
          <h2 id="final-cta-heading">Get help at home with MeeHelp</h2>
          <p>Find and hire a helper directly, or book on-demand help — both in the MeeHelp app.</p>
          <StoreButtons placement="home_final_cta" align="center" />
        </div>
      </section>
    </>
  );
}
