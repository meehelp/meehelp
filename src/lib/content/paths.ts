import { services } from "@/data/services";
import type { BusinessModel, CitySlug, ServiceSlug } from "./types";

/**
 * URL policy (docs/URL-ARCHITECTURE.md): marketplace pages use the category
 * slug (/maid/), on-demand pages use the category's on-demand slug
 * (/hourly-maid/). Same depth, separate canonicals, no /hire/ or /on-demand/ prefix.
 */
export function routeSlug(service: ServiceSlug, model: BusinessModel = "marketplace"): string {
  if (model === "marketplace") return service;
  const s = services.find((x) => x.slug === service);
  if (!s) throw new Error(`Unknown service ${service}`);
  return s.onDemand.slug;
}

export const homePath = "/";
export const pricingPath = "/pricing/";
export const servicePath = (service: ServiceSlug, model: BusinessModel = "marketplace") => `/${routeSlug(service, model)}/`;
export const serviceCityPath = (service: ServiceSlug, city: CitySlug, model: BusinessModel = "marketplace") =>
  `/${routeSlug(service, model)}/${city}/`;
export const localityPath = (service: ServiceSlug, city: CitySlug, locality: string, model: BusinessModel = "marketplace") =>
  `/${routeSlug(service, model)}/${city}/${locality}/`;
