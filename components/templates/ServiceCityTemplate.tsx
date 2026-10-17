import type { Metadata } from "next";
import Link from "next/link";
import { schemaSettings } from "@/data/business";
import { defaultSteps } from "@/data/how-it-works";
import { AppDownloadSection } from "@/components/app/AppDownloadSection";
import { StoreButtons } from "@/components/app/StoreButtons";
import { FaqList } from "@/components/content/FaqList";
import { LinkList } from "@/components/content/LinkList";
import { BulletList, CheckList, Steps } from "@/components/content/Lists";
import { Section } from "@/components/content/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Safeguards } from "@/components/trust/Safeguards";
import { Testimonials } from "@/components/trust/Testimonials";
import { cityName, getBuiltServiceCities, getService } from "@/lib/content";
import type { ResolvedRoute } from "@/lib/content/resolve";
import { serviceCityPath, servicePath } from "@/lib/content/paths";
import { isIndexable } from "@/lib/content/publishing";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { faqPageSchema, serviceSchema } from "@/lib/seo/schema";

const availabilityText = {
  available: "available",
  limited: "available in some areas",
  "coming-soon": "coming soon",
} as const;

type ServiceCityRoute = Extract<ResolvedRoute, { kind: "service-city" }>;

export function serviceCityMetadata({ page, status }: ServiceCityRoute): Metadata {
  return buildPageMetadata({
    ...page.seo,
    path: serviceCityPath(page.service, page.city),
    indexable: isIndexable(status),
  });
}

export function ServiceCityTemplate({ route }: { route: ServiceCityRoute }) {
  const { page, service, city } = route;
  const path = serviceCityPath(page.service, page.city);
  const built = getBuiltServiceCities();
  const otherServicesHere = built.filter((sc) => sc.city === city.slug && sc.service !== service.slug);
  const sameServiceElsewhere = built.filter((sc) => sc.service === service.slug && sc.city !== city.slug);
  const placement = `${service.slug}_${city.slug}`;

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: service.name, path: servicePath(service.slug) },
          { name: city.name, path },
        ]}
      />
      <JsonLd
        data={[
          ...(schemaSettings.service
            ? [
                serviceSchema({
                  service,
                  path,
                  city,
                  name: `${service.name} in ${city.name}`,
                  description: page.seo.description,
                }),
              ]
            : []),
          ...(schemaSettings.faqPage ? [faqPageSchema(page.localFaqs)] : []),
        ]}
      />

      <section className="hero hero--compact">
        <div className="container">
          <p className="eyebrow">
            {service.name} · {city.displayName}
          </p>
          <h1>{page.localHeadline}</h1>
          {page.localIntroduction.map((para) => (
            <p key={para} className="lead">
              {para}
            </p>
          ))}
          {page.availability !== "unknown" ? (
            <p className="availability">
              {service.name} in {city.name}: <strong>{availabilityText[page.availability]}</strong>
            </p>
          ) : null}
          <StoreButtons placement={`${placement}_hero`} />
        </div>
      </section>

      <Section id="requirements" title={`What ${city.name} households usually ask for`}>
        <BulletList items={page.commonRequirements} />
      </Section>

      {page.areasServed.length > 0 ? (
        <Section id="areas" title={`Areas we serve in ${city.displayName}`} tone="tint">
          <BulletList items={page.areasServed} />
        </Section>
      ) : null}

      <Section id="tasks" title="What's usually included" tone="tint">
        <CheckList items={service.tasksIncluded} />
        <p className="note">
          See the full list on our <Link href={servicePath(service.slug)}>{service.name.toLowerCase()} page</Link>.
        </p>
      </Section>

      <Section id="local-info" title={`Hiring in ${city.name}: good to know`} tone="warm">
        <BulletList items={city.localInformation} />
      </Section>

      <Section id="how-it-works" title="How it works">
        <Steps steps={service.howItWorks ?? defaultSteps} />
      </Section>

      <Section id="hiring-safely" title="Hiring safely">
        <Safeguards extra={service.safeguards} />
      </Section>

      <Testimonials service={service.slug} />

      <Section id="faqs" title={`${service.shortName} in ${city.name}: frequently asked questions`}>
        <FaqList faqs={page.localFaqs} />
      </Section>

      <AppDownloadSection placement={`${placement}_app_section`} title={page.localCta.heading} body={page.localCta.body} />

      {otherServicesHere.length > 0 || sameServiceElsewhere.length > 0 ? (
        <Section id="related" title="Related pages">
          <div className="two-col">
            {otherServicesHere.length > 0 ? (
              <div>
                <h3>Other services in {city.name}</h3>
                <LinkList
                  links={otherServicesHere.map((sc) => ({
                    href: serviceCityPath(sc.service, sc.city),
                    label: `${getService(sc.service)?.name} in ${city.name}`,
                  }))}
                />
              </div>
            ) : null}
            {sameServiceElsewhere.length > 0 ? (
              <div>
                <h3>{service.name} in other cities</h3>
                <LinkList
                  links={sameServiceElsewhere.map((sc) => ({
                    href: serviceCityPath(sc.service, sc.city),
                    label: `${service.shortName} in ${cityName(sc.city)}`,
                  }))}
                />
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}
    </>
  );
}
