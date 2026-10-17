import type { Metadata } from "next";
import Link from "next/link";
import { appLinks } from "@/data/app-links";
import { schemaSettings } from "@/data/business";
import { defaultSteps } from "@/data/how-it-works";
import { home } from "@/data/home";
import { AppDownloadSection } from "@/components/app/AppDownloadSection";
import { QrPanel } from "@/components/app/QrPanel";
import { StoreButtons } from "@/components/app/StoreButtons";
import { FaqList } from "@/components/content/FaqList";
import { Icon } from "@/components/content/Icon";
import { Steps } from "@/components/content/Lists";
import { Section } from "@/components/content/Section";
import { ServiceCards } from "@/components/content/ServiceCards";
import { JsonLd } from "@/components/seo/JsonLd";
import { Safeguards } from "@/components/trust/Safeguards";
import { Testimonials } from "@/components/trust/Testimonials";
import { TrustMetrics } from "@/components/trust/TrustMetrics";
import { getBuiltCitiesWithPages, getBuiltServices, getService } from "@/lib/content";
import { serviceCityPath } from "@/lib/content/paths";
import { isIndexable } from "@/lib/content/publishing";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { faqPageSchema, organizationSchema, websiteSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildPageMetadata({
  ...home.seo,
  path: "/",
  indexable: isIndexable(home.publishStatus),
});

export default function HomePage() {
  const services = getBuiltServices();
  const cities = getBuiltCitiesWithPages();

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
        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="eyebrow">Domestic help through the MeeHelp app</p>
            <h1>{home.headline}</h1>
            <p className="lead">{home.intro}</p>
            <StoreButtons placement="home_hero" />
            <p className="hero__links">
              Looking for something specific?{" "}
              {services.map((s, i) => (
                <span key={s.slug}>
                  <Link href={`/${s.slug}/`}>{s.shortName}</Link>
                  {i < services.length - 1 ? " · " : ""}
                </span>
              ))}
            </p>
          </div>
          <div className="hero__aside">
            {appLinks.qr.enabled ? (
              <QrPanel />
            ) : (
              <div className="hero-art" aria-hidden="true">
                {services.map((s) => (
                  <span key={s.slug}>
                    <Icon name={s.icon} size={40} />
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Section id="services" title="What help do you need?" intro="Choose a service to see what's included and how it works.">
        <ServiceCards services={services} />
      </Section>

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

      <Section id="how-it-works" title="How MeeHelp works">
        <Steps steps={defaultSteps} />
      </Section>

      <Section id="coverage" title="Where MeeHelp works" tone="tint">
        {cities.length > 0 ? (
          <ul className="city-list">
            {cities.map(({ city, pages }) => (
              <li key={city.slug} className="city-list__item">
                <h3 className="city-list__name">{city.displayName}</h3>
                <ul>
                  {pages.map((p) => (
                    <li key={p.service}>
                      <Link href={serviceCityPath(p.service, p.city)}>
                        {getService(p.service)?.shortName} in {city.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : null}
        <p>Open the MeeHelp app and enter your address to see helpers available near you.</p>
      </Section>

      <Section
        id="hiring-safely"
        title="Hiring with confidence"
        intro="Simple steps that help any household start a new helper arrangement well."
      >
        <TrustMetrics />
        <Safeguards />
      </Section>

      <Testimonials />

      <AppDownloadSection placement="home_app_section" />

      <Section id="faqs" title="Frequently asked questions">
        <FaqList faqs={home.faqs} />
      </Section>

      <section className="cta-band" aria-labelledby="final-cta-heading">
        <div className="container">
          <h2 id="final-cta-heading">Find help near you today</h2>
          <p>Download MeeHelp, tell us what you need and connect with helpers in your area.</p>
          <StoreButtons placement="home_final_cta" align="center" />
        </div>
      </section>
    </>
  );
}
