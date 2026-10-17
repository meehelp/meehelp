/**
 * Content queries. The ONLY place pages read data from, so publishing rules
 * are applied consistently to routes, links, sitemap and tests.
 */
import { cities } from "@/data/cities";
import { home } from "@/data/home";
import { pricingPage } from "@/data/plans";
import { localities } from "@/data/localities";
import { serviceCities } from "@/data/service-cities";
import { services } from "@/data/services";
import { testimonials } from "@/data/testimonials";
import { siteStage, type SiteStage } from "@/lib/site";
import { arePricesPublishable } from "@/lib/pricing";
import { homePath, localityPath, pricingPath, serviceCityPath, servicePath } from "./paths";
import { availabilityStatus, combineStatus, confirmedStatus, isBuilt, isIndexable } from "./publishing";
import type {
  BusinessModel,
  City,
  CitySlug,
  Locality,
  LocalityServiceContent,
  PublishStatus,
  Service,
  ServiceCity,
  ServiceSlug,
  Testimonial,
} from "./types";

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

/**
 * A service hub (/maid/) is a MARKETPLACE page, so it is only as published as
 * the confirmation that the service supports the marketplace model.
 */
export function serviceHubStatus(s: Service): PublishStatus {
  return combineStatus(s.publishStatus, confirmedStatus(s.models.marketplace));
}

export function getBuiltServices(stage: SiteStage = siteStage): Service[] {
  return services.filter((s) => isBuilt(serviceHubStatus(s), stage));
}

/** All categories, with a link only when the hub page is built for this stage. */
export function getServiceCategories(stage: SiteStage = siteStage): { service: Service; href: string | null }[] {
  return services.map((service) => ({
    service,
    href: isBuilt(serviceHubStatus(service), stage) ? servicePath(service.slug) : null,
  }));
}

/**
 * A service-city page needs: its own status, the service and city status, the
 * service confirmed for the page's model, the city confirmed as an active
 * market, and availability confirmed for that service + city + model.
 *
 * On-demand service-city routes are not implemented yet (see
 * docs/URL-ARCHITECTURE.md), so on-demand entries never build.
 */
export function serviceCityStatus(sc: ServiceCity): PublishStatus {
  const service = getService(sc.service);
  const city = getCity(sc.city);
  if (!service || !city) return "draft";
  if (sc.model !== "marketplace") return "draft";
  return combineStatus(
    sc.publishStatus,
    service.publishStatus,
    city.publishStatus,
    confirmedStatus(service.models[sc.model]),
    confirmedStatus(city.marketActive),
    availabilityStatus(city.availability[sc.service][sc.model]),
  );
}

export function getServiceCity(
  service: string,
  city: string,
  model: BusinessModel = "marketplace",
): ServiceCity | undefined {
  return serviceCities.find((sc) => sc.service === service && sc.city === city && sc.model === model);
}

export function getBuiltServiceCities(stage: SiteStage = siteStage): ServiceCity[] {
  return serviceCities.filter((sc) => isBuilt(serviceCityStatus(sc), stage));
}

export interface LocalityPage {
  locality: Locality;
  service: ServiceSlug;
  content: LocalityServiceContent;
}

export function localityPageStatus(page: LocalityPage): PublishStatus {
  const parent = getServiceCity(page.service, page.locality.city, page.content.model);
  if (!parent) return "draft";
  return combineStatus(page.locality.publishStatus, page.content.publishStatus, serviceCityStatus(parent));
}

/**
 * Locality pages require an explicit "published" on every level in EVERY
 * stage — they are never built as drafts or for review.
 */
export function getPublishedLocalityPages(): LocalityPage[] {
  const pages: LocalityPage[] = [];
  for (const locality of localities) {
    for (const [service, content] of Object.entries(locality.services)) {
      if (!content) continue;
      const page: LocalityPage = { locality, service: service as ServiceSlug, content };
      if (localityPageStatus(page) === "published") pages.push(page);
    }
  }
  return pages;
}

export function getLocalityPage(service: string, city: string, locality: string): LocalityPage | undefined {
  return getPublishedLocalityPages().find(
    (p) => p.service === service && p.locality.city === city && p.locality.slug === locality,
  );
}

/** Cities that have at least one built service-city page. */
export function getBuiltCitiesWithPages(stage: SiteStage = siteStage): { city: City; pages: ServiceCity[] }[] {
  const built = getBuiltServiceCities(stage);
  return cities
    .map((city) => ({ city, pages: built.filter((sc) => sc.city === city.slug) }))
    .filter((entry) => entry.pages.length > 0);
}

export function getVisibleTestimonials(stage: SiteStage = siteStage): Testimonial[] {
  if (stage === "production") return testimonials.filter((t) => !t.isPlaceholder && t.consentToPublish);
  return testimonials;
}

export type RouteKind = "home" | "service" | "service-city" | "locality" | "pricing";

/** The pricing page is held in review until prices may be shown on production. */
export function pricingPageStatus(stage: SiteStage = siteStage): PublishStatus {
  return combineStatus(pricingPage.publishStatus, arePricesPublishable(stage) ? "published" : "review");
}

export interface SiteRoute {
  path: string;
  kind: RouteKind;
  /** Which proposition the page serves; the home page introduces both. */
  model: BusinessModel | "both";
  title: string;
  description: string;
  status: PublishStatus;
  indexable: boolean;
  updatedAt: string;
}

/** Every route built for a stage. Sitemap = the indexable subset. */
export function getSiteRoutes(stage: SiteStage = siteStage): SiteRoute[] {
  const routes: SiteRoute[] = [];
  const add = (r: Omit<SiteRoute, "indexable">) => routes.push({ ...r, indexable: isIndexable(r.status, stage) });

  if (isBuilt(home.publishStatus, stage)) {
    add({ path: homePath, kind: "home", model: "both", ...home.seo, status: home.publishStatus, updatedAt: home.updatedAt });
  }
  const pricingStatus = pricingPageStatus(stage);
  if (isBuilt(pricingStatus, stage)) {
    add({ path: pricingPath, kind: "pricing", model: "marketplace", ...pricingPage.seo, status: pricingStatus, updatedAt: pricingPage.updatedAt });
  }
  for (const s of getBuiltServices(stage)) {
    add({
      path: servicePath(s.slug),
      kind: "service",
      model: "marketplace",
      ...s.seo,
      status: serviceHubStatus(s),
      updatedAt: s.updatedAt,
    });
  }
  for (const sc of getBuiltServiceCities(stage)) {
    add({
      path: serviceCityPath(sc.service, sc.city),
      kind: "service-city",
      model: sc.model,
      ...sc.seo,
      status: serviceCityStatus(sc),
      updatedAt: sc.updatedAt,
    });
  }
  for (const p of getPublishedLocalityPages()) {
    add({
      path: localityPath(p.service, p.locality.city, p.locality.slug),
      kind: "locality",
      model: p.content.model,
      ...p.content.seo,
      status: "published",
      updatedAt: p.content.updatedAt,
    });
  }
  return routes;
}

export function cityName(slug: CitySlug): string {
  return getCity(slug)?.name ?? slug;
}
