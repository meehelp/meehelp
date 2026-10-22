/** PageMeta for each resolved route kind (title/description come from src/data, never templates). */
import { pricingPage } from "@/data/plans";
import { productPath } from "@/data/products";
import { localityPath, pricingPath, serviceCityPath, servicePath } from "@/lib/content/paths";
import { isIndexable } from "@/lib/content/publishing";
import { guideSeo, salaryGuidePath } from "@/lib/content/salary-guides";
import type { ResolvedRoute } from "@/lib/content/resolve";
import { buildPageMetadata, type PageMeta } from "./metadata";

export function routeMetadata(route: ResolvedRoute): PageMeta {
  const indexable = isIndexable(route.status);
  switch (route.kind) {
    case "pricing":
      return buildPageMetadata({ ...pricingPage.seo, path: pricingPath, indexable });
    case "product":
      return buildPageMetadata({ ...route.product.seo, path: productPath(route.product.slug), indexable });
    case "guide":
      return buildPageMetadata({ ...guideSeo(route.guide), path: salaryGuidePath(route.guide), indexable });
    case "service": {
      const seo = route.model === "marketplace" ? route.service.seo : route.service.onDemand.seo;
      return buildPageMetadata({ ...seo, path: servicePath(route.service.slug, route.model), indexable });
    }
    case "service-city":
      return buildPageMetadata({
        ...route.content.seo,
        path: serviceCityPath(route.page.service, route.page.city, route.model),
        indexable,
      });
    case "locality":
      return buildPageMetadata({
        ...route.page.content.seo,
        path: localityPath(route.page.service, route.page.locality.city, route.page.locality.slug, route.model),
        indexable,
      });
  }
}
