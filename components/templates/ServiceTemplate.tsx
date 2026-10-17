import type { Metadata } from "next";
import { schemaSettings } from "@/data/business";
import { marketplaceSteps } from "@/data/how-it-works";
import { AppDownloadSection } from "@/components/app/AppDownloadSection";
import { Cta } from "@/components/content/Cta";
import { FaqList } from "@/components/content/FaqList";
import { Icon } from "@/components/content/Icon";
import { LinkList } from "@/components/content/LinkList";
import { ArrangementList, BulletList, CheckList, Steps } from "@/components/content/Lists";
import { Section } from "@/components/content/Section";
import { ServiceCards } from "@/components/content/ServiceCards";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PlansSummary } from "@/components/pricing/PlansSummary";
import { JsonLd } from "@/components/seo/JsonLd";
import { Claims } from "@/components/trust/Claims";
import { Safeguards } from "@/components/trust/Safeguards";
import { Testimonials } from "@/components/trust/Testimonials";
import { VerificationSummary } from "@/components/trust/VerificationSummary";
import { cityName, getBuiltServiceCities, getServiceCategories } from "@/lib/content";
import type { ResolvedRoute } from "@/lib/content/resolve";
import { serviceCityPath, servicePath } from "@/lib/content/paths";
import { isIndexable } from "@/lib/content/publishing";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { faqPageSchema, serviceSchema } from "@/lib/seo/schema";

type ServiceRoute = Extract<ResolvedRoute, { kind: "service" }>;

export function serviceMetadata({ service, status }: ServiceRoute): Metadata {
  return buildPageMetadata({ ...service.seo, path: servicePath(service.slug), indexable: isIndexable(status) });
}

/** Service hub — a MARKETPLACE page: find helpers, contact them and hire directly. */
export function ServiceTemplate({ route }: { route: ServiceRoute }) {
  const { service } = route;
  const path = servicePath(service.slug);
  const cityPages = getBuiltServiceCities().filter((sc) => sc.service === service.slug);
  const related = getServiceCategories().filter((c) => c.service.slug !== service.slug && c.href);

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

      <div data-model="marketplace">
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
            <div className="cta-row">
              <Cta ctaKey="findService" role={service.roleWithArticle} placement={`${service.slug}_hero`} />
              <a className="text-link" href="#plans">
                See plans
              </a>
            </div>
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
          <p className="note">Every home is different. Agree the exact tasks with the helper before they start.</p>
        </Section>

        <Section id="how-it-works" title={`How to find and hire ${service.roleWithArticle} on MeeHelp`}>
          <Steps steps={marketplaceSteps} />
        </Section>

        <Section id="plans" title="Plans for contacting helpers" tone="warm">
          <Claims model="marketplace" />
          <PlansSummary placement={`${service.slug}_plans`} />
        </Section>

        <Section id="arrangements" title="Arrangements you can agree with a helper">
          <ArrangementList keys={service.arrangements} />
        </Section>

        <Section id="hiring-safely" title="Hiring safely" tone="tint">
          <VerificationSummary />
          <h3>Tips for hiring</h3>
          <Safeguards extra={service.safeguards} />
        </Section>

        {cityPages.length > 0 ? (
          <Section id="cities" title={`Find ${service.roleWithArticle} in your city`}>
            <LinkList
              label={`${service.name} by city`}
              links={cityPages.map((sc) => ({
                href: serviceCityPath(sc.service, sc.city),
                label: `${service.shortName} in ${cityName(sc.city)}`,
              }))}
            />
          </Section>
        ) : null}

        <Testimonials service={service.slug} model="marketplace" />

        <Section id="faqs" title={`${service.name}: frequently asked questions`}>
          <FaqList faqs={service.faqs} />
        </Section>

        <AppDownloadSection
          model="marketplace"
          placement={`${service.slug}_app_section`}
          title={`Find ${service.roleWithArticle} in the MeeHelp app`}
        />

        {related.length > 0 ? (
          <Section id="related" title="Find other helpers">
            <ServiceCards items={related} />
          </Section>
        ) : null}
      </div>
    </>
  );
}
