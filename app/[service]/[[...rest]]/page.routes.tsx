import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalityTemplate, localityMetadata } from "@/components/templates/LocalityTemplate";
import { PricingTemplate, pricingMetadata } from "@/components/templates/PricingTemplate";
import { ServiceCityTemplate, serviceCityMetadata } from "@/components/templates/ServiceCityTemplate";
import { ServiceTemplate, serviceMetadata } from "@/components/templates/ServiceTemplate";
import { getServiceRouteParams, resolveRoute } from "@/lib/content/resolve";

/**
 * One route for every service-based URL:
 *   /maid/                      service hub
 *   /maid/mumbai/               service × city (explicitly listed combinations only)
 *   /maid/mumbai/andheri-west/  locality (explicitly "published" only — none today)
 *   /pricing/                   marketplace plans (held in review until prices may be published)
 *
 * Only paths returned by generateStaticParams are built; anything else is a 404.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getServiceRouteParams();
}

type Props = { params: Promise<{ service: string; rest?: string[] }> };

async function load(params: Props["params"]) {
  const { service, rest = [] } = await params;
  const route = resolveRoute([service, ...rest]);
  if (!route) notFound();
  return route;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const route = await load(params);
  switch (route.kind) {
    case "pricing":
      return pricingMetadata(route);
    case "service":
      return serviceMetadata(route);
    case "service-city":
      return serviceCityMetadata(route);
    case "locality":
      return localityMetadata(route);
  }
}

export default async function ServiceRoutePage({ params }: Props) {
  const route = await load(params);
  switch (route.kind) {
    case "pricing":
      return <PricingTemplate route={route} />;
    case "service":
      return <ServiceTemplate route={route} />;
    case "service-city":
      return <ServiceCityTemplate route={route} />;
    case "locality":
      return <LocalityTemplate route={route} />;
  }
}
