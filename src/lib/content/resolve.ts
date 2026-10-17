import { siteStage, type SiteStage } from "@/lib/site";
import {
  pricingPageStatus,
  getCity,
  getLocalityPage,
  getService,
  getServiceCity,
  getSiteRoutes,
  serviceCityStatus,
  type LocalityPage,
} from "./index";
import { isBuilt } from "./publishing";
import type { City, PublishStatus, Service, ServiceCity } from "./types";

export type ResolvedRoute =
  | { kind: "pricing"; status: PublishStatus }
  | { kind: "service"; service: Service; status: PublishStatus }
  | { kind: "service-city"; service: Service; city: City; page: ServiceCity; status: PublishStatus }
  | { kind: "locality"; service: Service; city: City; page: LocalityPage; status: PublishStatus };

/** Maps URL segments (/maid/, /maid/mumbai/, /maid/mumbai/andheri-west/) to content, applying publishing rules. */
export function resolveRoute(segments: string[], stage: SiteStage = siteStage): ResolvedRoute | null {
  const [serviceSlug, citySlug, localitySlug, ...extra] = segments;
  if (!serviceSlug || extra.length > 0) return null;

  // /pricing/ shares this route so it is generated only when built for the stage.
  if (serviceSlug === "pricing") {
    if (citySlug) return null;
    const status = pricingPageStatus(stage);
    return isBuilt(status, stage) ? { kind: "pricing", status } : null;
  }

  const service = getService(serviceSlug);
  if (!service) return null;

  if (!citySlug) {
    return isBuilt(service.publishStatus, stage) ? { kind: "service", service, status: service.publishStatus } : null;
  }

  const city = getCity(citySlug);
  if (!city) return null;

  if (!localitySlug) {
    const page = getServiceCity(serviceSlug, citySlug);
    if (!page) return null;
    const status = serviceCityStatus(page);
    return isBuilt(status, stage) ? { kind: "service-city", service, city, page, status } : null;
  }

  const page = getLocalityPage(serviceSlug, citySlug, localitySlug);
  return page ? { kind: "locality", service, city, page, status: "published" } : null;
}

/** Static params for app/[service]/[[...rest]] — derived from the same registry as the sitemap. */
export function getServiceRouteParams(stage: SiteStage = siteStage): { service: string; rest: string[] }[] {
  return getSiteRoutes(stage)
    .filter((r) => r.kind !== "home")
    .map((r) => {
      const [service, ...rest] = r.path.split("/").filter(Boolean);
      // Static export requires `rest` on every entry; [] is the service hub itself.
      return { service: service!, rest };
    });
}
