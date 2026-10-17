import type { MetadataRoute } from "next";
import { absoluteUrl, isProductionStage } from "@/lib/site";

export const dynamic = "force-static";

/** Production: crawl everything, point to the sitemap. Any other stage: block all crawling. */
export default function robots(): MetadataRoute.Robots {
  if (!isProductionStage) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml").replace(/\/$/, ""),
  };
}
