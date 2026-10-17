/**
 * schema.org JSON-LD builders. Only describe what is visible on the page.
 * Never add Review / AggregateRating markup unless genuine first-party
 * reviews are displayed on that page.
 */
import { business } from "@/data/business";
import type { City, Faq, Service } from "@/lib/content/types";
import { absoluteUrl, siteUrl } from "@/lib/site";

const orgId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;

type JsonLd = Record<string, unknown>;

export function organizationSchema(): JsonLd {
  const schema: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId,
    name: business.brandName,
    url: absoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}${business.logo.src}`,
      width: business.logo.width,
      height: business.logo.height,
    },
    description: business.summary,
  };
  if (business.legalName) schema.legalName = business.legalName;
  if (business.sameAs.length > 0) schema.sameAs = business.sameAs;
  if (business.contact.email.enabled) schema.email = business.contact.email.value;
  return schema;
}

export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: business.brandName,
    url: absoluteUrl("/"),
    inLanguage: "en-IN",
    publisher: { "@id": orgId },
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Service markup. No offers/prices until approved pricing exists. */
export function serviceSchema(opts: {
  service: Service;
  path: string;
  name: string;
  description: string;
  city?: City;
}): JsonLd {
  const schema: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    serviceType: opts.service.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    provider: { "@id": orgId },
    availableChannel: {
      "@type": "ServiceChannel",
      name: "MeeHelp mobile app",
      serviceUrl: absoluteUrl(opts.path),
    },
  };
  if (opts.city) {
    schema.areaServed = {
      "@type": "City",
      name: opts.city.name,
      containedInPlace: { "@type": "State", name: opts.city.region },
    };
  } else {
    schema.areaServed = { "@type": "Country", name: "India" };
  }
  return schema;
}

/** FAQPage — only used when schemaSettings.faqPage is enabled AND FAQs are visible on the page. */
export function faqPageSchema(faqs: Faq[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
