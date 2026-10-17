import type { APIRoute } from "astro";
import { getSiteRoutes } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Only canonical, indexable, published routes. Empty on non-production stages. */
export const GET: APIRoute = () => {
  const urls = getSiteRoutes()
    .filter((r) => r.indexable)
    .map((r) => `<url>\n<loc>${escape(absoluteUrl(r.path))}</loc>\n<lastmod>${r.updatedAt}</lastmod>\n</url>\n`)
    .join("");
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
