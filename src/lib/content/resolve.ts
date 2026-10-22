import { siteStage, type SiteStage } from "@/lib/site";
import { products } from "@/data/products";
import { salaryGuides } from "@/data/salary-guides";
import { services } from "@/data/services";
import {
  pricingPageStatus,
  getCity,
  getLocalityPage,
  getServiceCity,
  getServiceCityContent,
  getService,
  getSiteRoutes,
  productStatus,
  salaryGuideStatus,
  serviceCityStatus,
  serviceHubStatus,
  type LocalityPage,
} from "./index";
import { isBuilt } from "./publishing";
import { inStageScope } from "./release-scope";
import { salaryGuidePath } from "./salary-guides";
import type { BusinessModel, City, OnDemandProduct, PublishStatus, SalaryGuide, Service, ServiceCity, ServiceCityContent } from "./types";

export type ResolvedRoute =
  | { kind: "pricing"; status: PublishStatus }
  | { kind: "product"; model: "onDemand"; product: OnDemandProduct; service: Service; status: PublishStatus }
  | { kind: "guide"; model: "marketplace"; guide: SalaryGuide; service: Service; city: City; status: PublishStatus }
  | { kind: "service"; model: BusinessModel; service: Service; status: PublishStatus }
  | {
      kind: "service-city";
      model: BusinessModel;
      service: Service;
      city: City;
      page: ServiceCity;
      content: ServiceCityContent;
      status: PublishStatus;
    }
  | { kind: "locality"; model: BusinessModel; service: Service; city: City; page: LocalityPage; status: PublishStatus };

/** The service and model a first URL segment belongs to: "maid" → marketplace, "hourly-maid" → on-demand. */
function serviceForSlug(slug: string): { service: Service; model: BusinessModel } | null {
  for (const service of services) {
    if (service.slug === slug) return { service, model: "marketplace" };
    if (service.onDemand.slug === slug) return { service, model: "onDemand" };
  }
  return null;
}

/**
 * Maps URL segments to content, applying publishing rules:
 *   /maid/, /maid/mumbai/, /maid/mumbai/andheri-west/       marketplace
 *   /hourly-maid/, /hourly-maid/mumbai/                      on-demand
 *   /one-time-cleaning/                                      on-demand product page
 *   /maid-salary/mumbai/                                     salary guide (no /maid-salary/ index yet)
 */
export function resolveRoute(segments: string[], stage: SiteStage = siteStage): ResolvedRoute | null {
  const [serviceSlug, citySlug, localitySlug, ...extra] = segments;
  if (!serviceSlug || extra.length > 0) return null;

  // /pricing/ shares this route so it is generated only when built for the stage.
  if (serviceSlug === "pricing") {
    if (citySlug) return null;
    const status = pricingPageStatus(stage);
    return isBuilt(status, stage) && inStageScope("/pricing/", stage) ? { kind: "pricing", status } : null;
  }

  // On-demand product pages (/one-time-cleaning/) are single-segment pages of their own.
  const product = products.find((p) => p.slug === serviceSlug);
  if (product) {
    const service = getService(product.service);
    if (citySlug || !service) return null;
    const status = productStatus(product);
    return isBuilt(status, stage) && inStageScope(`/${serviceSlug}/`, stage) ? { kind: "product", model: "onDemand", product, service, status } : null;
  }

  // Salary guides exist per city only: /maid-salary/mumbai/ (there is no /maid-salary/ page).
  if (salaryGuides.some((g) => g.slug === serviceSlug)) {
    const guide = salaryGuides.find((g) => g.slug === serviceSlug && g.city === citySlug);
    if (!guide || localitySlug) return null;
    const service = getService(guide.service);
    const city = getCity(guide.city);
    if (!service || !city) return null;
    const status = salaryGuideStatus(guide);
    return isBuilt(status, stage) && inStageScope(salaryGuidePath(guide), stage) ? { kind: "guide", model: "marketplace", guide, service, city, status } : null;
  }

  const match = serviceForSlug(serviceSlug);
  if (!match) return null;
  const { service, model } = match;

  if (!citySlug) {
    const status = serviceHubStatus(service, model);
    return isBuilt(status, stage) && inStageScope(`/${serviceSlug}/`, stage) ? { kind: "service", model, service, status } : null;
  }

  const city = getCity(citySlug);
  if (!city) return null;

  if (!localitySlug) {
    const page = getServiceCity(service.slug, citySlug, model);
    if (!page) return null;
    const status = serviceCityStatus(page);
    return isBuilt(status, stage) && inStageScope(`/${serviceSlug}/${citySlug}/`, stage)
      ? { kind: "service-city", model, service, city, page, content: getServiceCityContent(page), status }
      : null;
  }

  const page = getLocalityPage(service.slug, citySlug, localitySlug);
  return page && page.content.model === model && inStageScope(`/${serviceSlug}/${citySlug}/${localitySlug}/`, stage) ? { kind: "locality", model, service, city, page, status: "published" } : null;
}

/** Params for getStaticPaths in src/pages/[service]/[...rest].astro — the same registry as the sitemap. */
export function getServiceRouteParams(stage: SiteStage = siteStage): { service: string; rest: string[] }[] {
  return getSiteRoutes(stage)
    .filter((r) => r.kind !== "home")
    .map((r) => {
      const [service, ...rest] = r.path.split("/").filter(Boolean);
      // [] is the service hub itself.
      return { service: service!, rest };
    });
}
