import type { MetadataRoute } from "next";
import { getSiteRoutes } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/** Only canonical, indexable, published routes. Empty on non-production stages. */
export default function sitemap(): MetadataRoute.Sitemap {
  return getSiteRoutes()
    .filter((r) => r.indexable)
    .map((r) => ({ url: absoluteUrl(r.path), lastModified: r.updatedAt }));
}
