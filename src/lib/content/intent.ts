/** Joins the intent map with the route registry: one entry per built page. */
import { guideIntents, intentTargets, productIntents, siteIntents } from "@/data/intent-map";
import { fillGuideText } from "./salary-guides";
import { home } from "@/data/home";
import { pricingPage } from "@/data/plans";
import { siteStage, absoluteUrl, type SiteStage } from "@/lib/site";
import { getSiteRoutes } from "./index";
import { resolveRoute } from "./resolve";
import type { BusinessModel, CitySlug, ServiceSlug } from "./types";

export interface IntentEntry {
  path: string;
  canonical: string;
  kind: string;
  model: BusinessModel | "both";
  service: ServiceSlug | null;
  city: CitySlug | null;
  primaryIntent: string;
  primaryKeyword: string;
  supportingKeywords: string[];
  proposition: string;
  title: string;
  h1: string;
  metaDescription: string;
  status: string;
  indexable: boolean;
  note: "intent targets — not search-volume estimates";
}

export function buildIntentMap(stage: SiteStage = siteStage): IntentEntry[] {
  return getSiteRoutes(stage).map((r) => {
    const base = {
      path: r.path,
      canonical: absoluteUrl(r.path),
      kind: r.kind,
      model: r.model,
      title: r.title,
      metaDescription: r.description,
      status: r.status,
      indexable: r.indexable,
      note: "intent targets — not search-volume estimates" as const,
    };
    if (r.kind === "home") return { ...base, service: null, city: null, ...siteIntents.home, h1: home.headline };
    if (r.kind === "pricing") return { ...base, service: null, city: null, ...siteIntents.pricing, h1: pricingPage.headline };
    const route = resolveRoute(r.path.split("/").filter(Boolean), stage);
    if (!route || route.kind === "pricing") throw new Error(`Unresolvable route ${r.path}`);
    if (route.kind === "product") {
      const t = productIntents[route.product.slug];
      return { ...base, service: route.service.slug, city: null, ...t, supportingKeywords: [...t.supportingKeywords], h1: route.product.headline };
    }
    if (route.kind === "guide") {
      const t = guideIntents[`${route.guide.slug}/${route.guide.city}`];
      if (!t) throw new Error(`No intent target for ${r.path}`);
      return { ...base, service: route.service.slug, city: route.city.slug, ...t, supportingKeywords: [...t.supportingKeywords], h1: fillGuideText(route.guide, route.guide.headline) };
    }
    const target = intentTargets[route.service.slug][route.model];
    if (route.kind === "service") {
      const h1 = route.model === "marketplace" ? route.service.headline : route.service.onDemand.headline;
      const { cityKeywords: _c, ...t } = target;
      return { ...base, service: route.service.slug, city: null, ...t, h1 };
    }
    if (route.kind === "service-city") {
      const cityTerms = target.cityKeywords.map((k) => k.replaceAll("{city}", route.city.name));
      return {
        ...base,
        service: route.service.slug,
        city: route.city.slug,
        primaryIntent: `${target.primaryIntent} in ${route.city.displayName}`,
        primaryKeyword: cityTerms[0] ?? target.primaryKeyword,
        supportingKeywords: [...cityTerms.slice(1), target.primaryKeyword, ...target.supportingKeywords.slice(0, 3)],
        proposition: target.proposition,
        h1: route.content.headline,
      };
    }
    return {
      ...base,
      service: route.service.slug,
      city: route.city.slug,
      primaryIntent: target.primaryIntent,
      primaryKeyword: target.primaryKeyword,
      supportingKeywords: target.supportingKeywords,
      proposition: target.proposition,
      h1: route.page.content.headline,
    };
  });
}
