/** PageMeta for each resolved route kind (title/description come from src/data, never templates). */
import { pricingPage } from "@/data/plans";
import { localityPath, pricingPath, serviceCityPath, servicePath } from "@/lib/content/paths";
import { isIndexable } from "@/lib/content/publishing";
import type { ResolvedRoute } from "@/lib/content/resolve";
import { buildPageMetadata, type PageMeta } from "./metadata";

export function routeMetadata(route: ResolvedRoute): PageMeta {
  const indexable = isIndexable(route.status);
  switch (route.kind) {
    case "pricing":
      return buildPageMetadata({ ...pricingPage.seo, path: pricingPath, indexable });
    case "service":
      return buildPageMetadata({ ...route.service.seo, path: servicePath(route.service.slug), indexable });
    case "service-city":
      return buildPageMetadata({ ...route.page.seo, path: serviceCityPath(route.page.service, route.page.city), indexable });
    case "locality":
      return buildPageMetadata({
        ...route.page.content.seo,
        path: localityPath(route.page.service, route.page.locality.city, route.page.locality.slug),
        indexable,
      });
  }
}
