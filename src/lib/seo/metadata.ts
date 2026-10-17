import { business } from "@/data/business";
import { absoluteUrl, siteUrl } from "@/lib/site";

export const defaultOgImage = {
  url: "/og/meehelp-og.png",
  width: 1200,
  height: 630,
  alt: "MeeHelp — house help, cooks, nannies and care attendants near you",
};

/**
 * Framework-neutral page metadata. Rendered into <head> by
 * src/components/seo/SeoHead.astro. Every page must provide one.
 */
export interface PageMeta {
  /** Full <title>, exactly as written in src/data (no template). */
  title: string;
  description: string;
  /** Absolute canonical URL, or null for pages that must not declare one (404). */
  canonical: string | null;
  robots: string;
  googlebot: string | null;
  openGraph: {
    type: "website";
    locale: "en_IN";
    siteName: string;
    url: string;
    title: string;
    description: string;
    image: { url: string; width: number; height: number; alt: string };
  } | null;
  twitter: { card: "summary_large_image"; title: string; description: string; image: string } | null;
}

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  indexable: boolean;
}

/** Builds complete per-page metadata: title, description, canonical, robots, Open Graph and Twitter. */
export function buildPageMetadata({ title, description, path, indexable }: PageMetaInput): PageMeta {
  const url = absoluteUrl(path);
  const image = { ...defaultOgImage, url: `${siteUrl}${defaultOgImage.url}` };
  return {
    title,
    description,
    canonical: url,
    robots: indexable ? "index, follow" : "noindex, nofollow",
    googlebot: indexable ? "index, follow, max-image-preview:large" : null,
    openGraph: { type: "website", locale: "en_IN", siteName: business.brandName, url, title, description, image },
    twitter: { card: "summary_large_image", title, description, image: image.url },
  };
}

/** The 404 page: never indexed, links may be followed, no canonical or social tags. */
export function buildNotFoundMetadata(title: string, description: string): PageMeta {
  return { title, description, canonical: null, robots: "noindex, follow", googlebot: null, openGraph: null, twitter: null };
}
