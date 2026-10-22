/**
 * Content queries. The ONLY place pages read data from, so publishing rules
 * are applied consistently to routes, links, sitemap and tests.
 */
import { cities } from "@/data/cities";
import { home } from "@/data/home";
import { pricingPage } from "@/data/plans";
import { productPath, products } from "@/data/products";
import { salaryGuides } from "@/data/salary-guides";
import { localities } from "@/data/localities";
import { serviceCities } from "@/data/service-cities";
import { services } from "@/data/services";
import { testimonials } from "@/data/testimonials";
import { siteStage, type SiteStage } from "@/lib/site";
import { arePricesPublishable } from "@/lib/pricing";
import { composeServiceCity } from "./compose";
import { homePath, localityPath, pricingPath, serviceCityPath, servicePath } from "./paths";
import { availabilityStatus, combineStatus, confirmedStatus, isBuilt, isIndexable } from "./publishing";
import { inStageScope } from "./release-scope";
import { guideSeo, salaryGuidePath } from "./salary-guides";
import type {
  BusinessModel,
  City,
  CitySlug,
  Locality,
  LocalityServiceContent,
  OnDemandProduct,
  PublishStatus,
  SalaryGuide,
  Service,
  ServiceCity,
  ServiceCityContent,
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
 * A service hub is only as published as its copy AND the confirmation that
 * the service supports that model: /maid/ (marketplace) or /hourly-maid/ (on-demand).
 */
export function serviceHubStatus(s: Service, model: BusinessModel = "marketplace"): PublishStatus {
  const copy = model === "marketplace" ? s.publishStatus : s.onDemand.publishStatus;
  return combineStatus(copy, confirmedStatus(s.models[model]));
}

/** Whether a hub page is built for the stage: its status AND (on release-review) the release scope. */
export function isHubBuilt(s: Service, model: BusinessModel = "marketplace", stage: SiteStage = siteStage): boolean {
  return isBuilt(serviceHubStatus(s, model), stage) && inStageScope(servicePath(s.slug, model), stage);
}

export function getBuiltServices(stage: SiteStage = siteStage, model: BusinessModel = "marketplace"): Service[] {
  return services.filter((s) => isHubBuilt(s, model, stage));
}

/** All categories for a model, with a link only when that hub page is built for this stage. */
export function getServiceCategories(
  stage: SiteStage = siteStage,
  model: BusinessModel = "marketplace",
): { service: Service; href: string | null }[] {
  return services.map((service) => ({
    service,
    href: isHubBuilt(service, model, stage) ? servicePath(service.slug, model) : null,
  }));
}

/**
 * A service-city page needs: its own status, its hub's status for the same
 * model (which includes the service's model confirmation), the city's status,
 * the city confirmed as an active market, and availability confirmed for that
 * service + city + model.
 */
export function serviceCityStatus(sc: ServiceCity): PublishStatus {
  const service = getService(sc.service);
  const city = getCity(sc.city);
  if (!service || !city) return "draft";
  return combineStatus(
    sc.publishStatus,
    serviceHubStatus(service, sc.model),
    city.publishStatus,
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

/** The rendered content of a service-city page (composed from frames, city facts and overrides). */
export function getServiceCityContent(sc: ServiceCity): ServiceCityContent {
  const service = getService(sc.service);
  const city = getCity(sc.city);
  if (!service || !city) throw new Error(`Unknown service-city ${sc.service}/${sc.city}`);
  return composeServiceCity(sc, service, city);
}

/** Whether a service × city page is built for the stage: status AND (on release-review) the release scope. */
export function isServiceCityBuilt(sc: ServiceCity, stage: SiteStage = siteStage): boolean {
  return isBuilt(serviceCityStatus(sc), stage) && inStageScope(serviceCityPath(sc.service, sc.city, sc.model), stage);
}

export function getBuiltServiceCities(stage: SiteStage = siteStage, model?: BusinessModel): ServiceCity[] {
  return serviceCities.filter((sc) => (!model || sc.model === model) && isServiceCityBuilt(sc, stage));
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
  if (stage === "production" || stage === "release-review") return testimonials.filter((t) => !t.isPlaceholder && t.consentToPublish);
  return testimonials;
}

export type RouteKind = "home" | "service" | "service-city" | "locality" | "pricing" | "product" | "guide";

/** The pricing page is held in review until prices may be shown on production. */
export function pricingPageStatus(stage: SiteStage = siteStage): PublishStatus {
  return combineStatus(pricingPage.publishStatus, arePricesPublishable(stage) ? "published" : "review");
}

/**
 * An on-demand product page (/one-time-cleaning/) is only as published as its
 * own copy AND the on-demand hub of its service (which carries the model confirmation).
 */
export function productStatus(p: OnDemandProduct): PublishStatus {
  const service = getService(p.service);
  if (!service) return "draft";
  return combineStatus(p.publishStatus, serviceHubStatus(service, p.model));
}

export function isProductBuilt(p: OnDemandProduct, stage: SiteStage = siteStage): boolean {
  return isBuilt(productStatus(p), stage) && inStageScope(productPath(p.slug), stage);
}

export function getBuiltProducts(stage: SiteStage = siteStage): OnDemandProduct[] {
  return products.filter((p) => isProductBuilt(p, stage));
}

/**
 * A salary guide (/maid-salary/mumbai/) is only as published as its own copy
 * AND the marketplace city page it sends readers to (/maid/mumbai/).
 */
export function salaryGuideStatus(g: SalaryGuide): PublishStatus {
  const target = getServiceCity(g.service, g.city, "marketplace");
  if (!target) return "draft";
  return combineStatus(g.publishStatus, serviceCityStatus(target));
}

export function isSalaryGuideBuilt(g: SalaryGuide, stage: SiteStage = siteStage): boolean {
  return isBuilt(salaryGuideStatus(g), stage) && inStageScope(salaryGuidePath(g), stage);
}

export function getBuiltSalaryGuides(stage: SiteStage = siteStage): SalaryGuide[] {
  return salaryGuides.filter((g) => isSalaryGuideBuilt(g, stage));
}

/** Whether /pricing/ is built for the stage. */
export function isPricingBuilt(stage: SiteStage = siteStage): boolean {
  return isBuilt(pricingPageStatus(stage), stage) && inStageScope(pricingPath, stage);
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

  if (isBuilt(home.publishStatus, stage) && inStageScope(homePath, stage)) {
    add({ path: homePath, kind: "home", model: "both", ...home.seo, status: home.publishStatus, updatedAt: home.updatedAt });
  }
  const pricingStatus = pricingPageStatus(stage);
  if (isPricingBuilt(stage)) {
    add({ path: pricingPath, kind: "pricing", model: "marketplace", ...pricingPage.seo, status: pricingStatus, updatedAt: pricingPage.updatedAt });
  }
  for (const model of ["marketplace", "onDemand"] as const) {
    for (const s of getBuiltServices(stage, model)) {
      const copy = model === "marketplace" ? s : s.onDemand;
      add({
        path: servicePath(s.slug, model),
        kind: "service",
        model,
        ...copy.seo,
        status: serviceHubStatus(s, model),
        updatedAt: copy.updatedAt,
      });
    }
  }
  for (const p of getBuiltProducts(stage)) {
    add({ path: productPath(p.slug), kind: "product", model: p.model, ...p.seo, status: productStatus(p), updatedAt: p.updatedAt });
  }
  for (const g of getBuiltSalaryGuides(stage)) {
    add({ path: salaryGuidePath(g), kind: "guide", model: "marketplace", ...guideSeo(g), status: salaryGuideStatus(g), updatedAt: g.updatedAt });
  }
  for (const sc of getBuiltServiceCities(stage)) {
    add({
      path: serviceCityPath(sc.service, sc.city, sc.model),
      kind: "service-city",
      model: sc.model,
      ...getServiceCityContent(sc).seo,
      status: serviceCityStatus(sc),
      updatedAt: sc.updatedAt,
    });
  }
  for (const p of getPublishedLocalityPages().filter((x) => inStageScope(localityPath(x.service, x.locality.city, x.locality.slug, x.content.model), stage))) {
    add({
      path: localityPath(p.service, p.locality.city, p.locality.slug, p.content.model),
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
