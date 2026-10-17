import type { APIRoute } from "astro";
import { absoluteUrl, isProductionStage } from "@/lib/site";

/** Production: crawl everything and point to the sitemap. Any other stage: block all crawling. */
export const GET: APIRoute = () => {
  const body = isProductionStage
    ? `User-Agent: *\nAllow: /\n\nSitemap: ${absoluteUrl("/sitemap.xml").replace(/\/$/, "")}\n`
    : "User-Agent: *\nDisallow: /\n\n";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
