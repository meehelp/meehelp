import type { CitySlug, ServiceSlug } from "./types";

export const homePath = "/";
export const servicePath = (service: ServiceSlug) => `/${service}/`;
export const serviceCityPath = (service: ServiceSlug, city: CitySlug) => `/${service}/${city}/`;
export const localityPath = (service: ServiceSlug, city: CitySlug, locality: string) =>
  `/${service}/${city}/${locality}/`;
