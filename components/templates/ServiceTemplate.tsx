import type { Metadata } from "next";
import { schemaSettings } from "@/data/business";
import { defaultSteps } from "@/data/how-it-works";
import { AppDownloadSection } from "@/components/app/AppDownloadSection";
import { StoreButtons } from "@/components/app/StoreButtons";
import { FaqList } from "@/components/content/FaqList";
import { Icon } from "@/components/content/Icon";
import { LinkList } from "@/components/content/LinkList";
import { BulletList, CheckList, EngagementList, Steps } from "@/components/content/Lists";
import { Section } from "@/components/content/Section";
import { ServiceCards } from "@/components/content/ServiceCards";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Safeguards } from "@/components/trust/Safeguards";
import { Testimonials } from "@/components/trust/Testimonials";
import { cityName, getBuiltServiceCities, getBuiltServices } from "@/lib/content";
import type { ResolvedRoute } from "@/lib/content/resolve";
import { serviceCityPath, servicePath } from "@/lib/content/paths";
import { isIndexable } from "@/lib/content/publishing";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { faqPageSchema, serviceSchema } from "@/lib/seo/schema";

type ServiceRoute = Extract<ResolvedRoute, { kind: "service" }>;

export function serviceMetadata({ service, status }: ServiceRoute): Metadata {
  return buildPageMetadata({ ...service.seo, path: servicePath(service.slug), indexable: isIndexable(status) });
}

export function ServiceTemplate({ route }: { route: ServiceRoute }) {
  const { service } = route;
  const path = servicePath(service.slug);
  const cityPages = getBuiltServiceCities().filter((sc) => sc.service === service.slug);
  const related = getBuiltServices().filter((s) => s.slug !== service.slug);

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: service.name, path },
        ]}
      />
      <JsonLd
        data={[
          ...(schemaSettings.service
            ? [serviceSchema({ service, path, name: service.name, description: service.seo.description })]
            : []),
          ...(schemaSettings.faqPage ? [faqPageSchema(service.faqs)] : []),
        ]}
      />

      <section className="hero hero--compact">
        <div className="container">
          <span className="hero__icon">
            <Icon name={service.icon} size={36} />
          </span>
          <h1>{service.headline}</h1>
          {service.description.map((p) => (
            <p key={p} className="lead">
              {p}
            </p>
          ))}
          <StoreButtons placement={`${service.slug}_hero`} />
        </div>
      </section>

      <Section id="situations" title="When families look for this help">
        <BulletList items={service.customerProblems} />
      </Section>

      <Section id="tasks" title={`What ${service.roleWithArticle} can help with`} tone="tint">
        <div className="two-col">
          <div>
            <h3>Usually included</h3>
            <CheckList items={service.tasksIncluded} />
          </div>
          <div>
            <h3>Usually not included</h3>
            <CheckList items={service.tasksExcluded} variant="cross" />
          </div>
        </div>
        <p className="note">Every home is different. Agree the exact tasks with your helper before they start.</p>
      </Section>

      <Section id="how-it-works" title="How booking works on MeeHelp">
        <Steps steps={service.howItWorks ?? defaultSteps} />
      </Section>

      <Section id="arrangements" title="Choose the arrangement that suits you" tone="warm">
        <EngagementList keys={service.engagementTypes} />
      </Section>

      <Section id="hiring-safely" title="Hiring safely">
        <Safeguards extra={service.safeguards} />
      </Section>

      {cityPages.length > 0 ? (
        <Section id="cities" title={`${service.shortName} services by city`} tone="tint">
          <LinkList
            label={`${service.name} by city`}
            links={cityPages.map((sc) => ({
              href: serviceCityPath(sc.service, sc.city),
              label: `${service.shortName} in ${cityName(sc.city)}`,
            }))}
          />
        </Section>
      ) : null}

      <Testimonials service={service.slug} />

      <Section id="faqs" title={`${service.name}: frequently asked questions`}>
        <FaqList faqs={service.faqs} />
      </Section>

      <AppDownloadSection
        placement={`${service.slug}_app_section`}
        title={`Find ${service.roleWithArticle} in the MeeHelp app`}
      />

      {related.length > 0 ? (
        <Section id="related" title="Other services">
          <ServiceCards services={related} />
        </Section>
      ) : null}
    </>
  );
}
