import type { Metadata } from "next";
import { business } from "@/data/business";
import { absoluteUrl, normalisePath } from "@/lib/site";

export const defaultOgImage = {
  url: "/og/meehelp-og.png",
  width: 1200,
  height: 630,
  alt: "MeeHelp — house help, cooks, nannies and care attendants near you",
};

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  indexable: boolean;
}

/**
 * Builds complete per-page metadata: title, description, canonical, robots,
 * Open Graph and Twitter. Every page must call this from generateMetadata.
 */
export function buildPageMetadata({ title, description, path, indexable }: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  return {
    // `absolute` bypasses any title template so titles are exactly as written in /data.
    title: { absolute: title },
    description,
    alternates: { canonical: normalisePath(path) },
    robots: indexable
      ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } }
      : { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: business.brandName,
      url,
      title,
      description,
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultOgImage.url],
    },
  };
}
