import type { Metadata } from "next";
import { AppDownloadSection } from "@/components/app/AppDownloadSection";
import { Cta } from "@/components/content/Cta";
import { FaqList } from "@/components/content/FaqList";
import { Section } from "@/components/content/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import type { ResolvedRoute } from "@/lib/content/resolve";
import { localityPath, serviceCityPath, servicePath } from "@/lib/content/paths";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { isIndexable } from "@/lib/content/publishing";

type LocalityRoute = Extract<ResolvedRoute, { kind: "locality" }>;

/** Locality pages exist only when explicitly "published" at every level (see lib/content). */
export function localityMetadata({ page, status }: LocalityRoute): Metadata {
  return buildPageMetadata({
    ...page.content.seo,
    path: localityPath(page.service, page.locality.city, page.locality.slug),
    indexable: isIndexable(status),
  });
}

export function LocalityTemplate({ route }: { route: LocalityRoute }) {
  const { page, service, city } = route;
  const path = localityPath(page.service, city.slug, page.locality.slug);
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: service.name, path: servicePath(service.slug) },
          { name: city.name, path: serviceCityPath(service.slug, city.slug) },
          { name: page.locality.name, path },
        ]}
      />
      <div data-model={page.content.model}>
      <section className="hero hero--compact">
        <div className="container">
          <h1>{page.content.headline}</h1>
          {page.content.introduction.map((para) => (
            <p key={para} className="lead">
              {para}
            </p>
          ))}
          <div className="cta-row">
            <Cta ctaKey="findService" role={service.roleWithArticle} placement={`${service.slug}_${city.slug}_${page.locality.slug}_hero`} />
          </div>
        </div>
      </section>
      <Section id="faqs" title="Frequently asked questions">
        <FaqList faqs={page.content.localFaqs} />
      </Section>
      <AppDownloadSection model={page.content.model} placement={`${service.slug}_${city.slug}_${page.locality.slug}_app_section`} />
      </div>
    </>
  );
}
