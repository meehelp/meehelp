/**
 * Content model for Website V2.
 *
 * All business content lives in /data as typed, version-controlled files.
 * A future offline export (e.g. approved categories, cities, aggregate
 * metrics) can regenerate these files — the website never talks to the
 * production backend or database.
 */

/**
 * - draft:     work in progress — never built outside local development
 * - review:    ready for business review — built on preview (noindex), not production
 * - published: approved — built and indexable on production
 */
export type PublishStatus = "draft" | "review" | "published";

/**
 * A business fact that may not be confirmed yet.
 * true = confirmed yes · false = confirmed no · null = NOT CONFIRMED (never assume).
 */
export type Confirmed = boolean | null;

/**
 * MeeHelp's two customer propositions. They are never mixed on one page or in one journey.
 * - marketplace: customer finds helpers, buys a contact plan, contacts and hires them directly
 * - onDemand:    customer books help through MeeHelp (instant, scheduled or hourly)
 */
export type BusinessModel = "marketplace" | "onDemand";

export type ServiceSlug = "maid" | "cook" | "babysitter-nanny" | "elder-care" | "patient-care";

export type CitySlug =
  | "mumbai"
  | "delhi-ncr"
  | "bengaluru"
  | "hyderabad"
  | "chennai"
  | "pune"
  | "kolkata"
  | "ahmedabad";

export type IconName = "maid" | "cook" | "nanny" | "elder" | "patient";

/**
 * Whether something is offered in a city for one business model.
 * Only "available"/"limited" can be published; "unknown" holds pages in review.
 */
export type Availability = "available" | "limited" | "coming-soon" | "unavailable" | "unknown";

/** Working arrangements a customer can agree directly with a helper (marketplace). */
export type HiringArrangement = "part-time" | "full-time";

/** Which business models and booking types a service supports. Unconfirmed = null. */
export interface ModelSupport {
  marketplace: Confirmed;
  onDemand: Confirmed;
  instantBooking: Confirmed;
  scheduledBooking: Confirmed;
  hourlyBooking: Confirmed;
}

export interface Faq {
  question: string;
  /** Plain text. Separate paragraphs with a blank line. */
  answer: string;
}

export interface Seo {
  /** Full <title>. Aim for <= 60 characters. Must be unique site-wide. */
  title: string;
  /** Meta description. Aim for 70–160 characters. Must be unique site-wide. */
  description: string;
}

export interface Step {
  title: string;
  body: string;
}

/** Text with placeholders filled per city: {city} {cityFull} {areas} {cuisine} {festivals} {festival} {languages}. */
export type CityTemplate = string;

/** How a service's city pages are framed for one model. Facts come from the city. */
export interface CityPageFrame {
  headline: CityTemplate;
  intro: CityTemplate[];
  /** Marketplace: what households usually ask for. On-demand: when people book. */
  points: string[];
  title: CityTemplate;
  description: CityTemplate;
}

/** A same-model link to a related product, e.g. /hourly-maid/ ↔ /one-time-cleaning/. */
export interface AlternativeLink {
  heading: string;
  body: string;
  href: string;
  label: string;
}

/**
 * An on-demand PRODUCT page that owns one booking flow of a service, e.g.
 * /one-time-cleaning/ (the maid one-time cleaning flow). It has its own URL,
 * metadata and search intent, and is built through the same route registry.
 */
export interface OnDemandProduct {
  /** Route slug: /one-time-cleaning/. */
  slug: "one-time-cleaning";
  service: ServiceSlug;
  model: "onDemand";
  /** "Book now" exists for this flow (evidence biz.instant-scope). */
  bookNow: boolean;
  name: string;
  shortName: string;
  headline: string;
  description: string[];
  steps: Step[];
  useCases: string[];
  tasksIncluded: string[];
  tasksExcluded: string[];
  /** Shared (not page-scoped) product facts shown on the page, by id. */
  sharedFactIds: string[];
  safeguards: string[];
  faqs: Faq[];
  alternative: AlternativeLink;
  seo: Seo;
  publishStatus: PublishStatus;
  updatedAt: string;
}

/** The on-demand (book by the hour) proposition for a service — its own hub and city pages. */
export interface OnDemandContent {
  /** Route slug, e.g. "hourly-maid" → /hourly-maid/ and /hourly-maid/mumbai/. */
  slug: string;
  /** e.g. "Hourly Maid". */
  name: string;
  /** e.g. "Hourly maid" — used in sentences and links. */
  shortName: string;
  /** With article, for sentences: "an hourly maid", "a cook by the hour". */
  bookingNoun: string;
  /**
   * Whether the app offers "Book now" (instant) for this category today
   * (evidence impl.instant-scope). When false, copy describes scheduled
   * booking only, even though the business has confirmed instant booking.
   */
  bookNow: boolean;
  /** Optional same-model link shown on the hub, e.g. hourly maid → one-time cleaning. */
  alternative?: AlternativeLink;
  headline: string;
  description: string[];
  useCases: string[];
  tasksIncluded: string[];
  tasksExcluded: string[];
  safeguards: string[];
  faqs: Faq[];
  seo: Seo;
  publishStatus: PublishStatus;
  updatedAt: string;
}

/**
 * A helper category. The top-level fields are its MARKETPLACE content
 * (/maid/: find & hire directly). `onDemand` is its separate on-demand
 * proposition (/hourly-maid/: book by the hour). The two never share a page.
 */
export interface Service {
  slug: ServiceSlug;
  /** Full display name, e.g. "Maid / House Help". */
  name: string;
  /** Short name used in sentences and links, e.g. "Maid". */
  shortName: string;
  icon: IconName;
  /** The helper's role with its article, used in sentences: "a maid", "an elder care attendant". */
  roleWithArticle: string;
  /** One sentence for service cards and link previews. */
  summary: string;
  models: ModelSupport;
  /** Used as the page H1. */
  headline: string;
  /** Intro paragraphs. */
  description: string[];
  /** Situations customers are in when they search for this service. */
  customerProblems: string[];
  tasksIncluded: string[];
  tasksExcluded: string[];
  /** Arrangements customers commonly agree with helpers in this category. */
  arrangements: HiringArrangement[];
  /** Service-specific advice added to the shared hiring safeguards. */
  safeguards: string[];
  faqs: Faq[];
  seo: Seo;
  publishStatus: PublishStatus;
  /** ISO date of the last substantive content change (used for sitemap lastmod). */
  updatedAt: string;
  onDemand: OnDemandContent;
  /** Framing for this service's city pages, per model. */
  cityPage: Record<BusinessModel, CityPageFrame>;
}

/**
 * A genuine, practical fact about hiring or booking help in a city. Tagged so
 * each page uses only the facts that are relevant to it. Never statistics,
 * demand figures, response times or locality coverage claims.
 */
export interface CityFact {
  text: string;
  /** Services the fact is relevant to (all when omitted). */
  services?: ServiceSlug[];
  /** Models the fact is relevant to (both when omitted). */
  models?: BusinessModel[];
}

export interface CityFaq extends Faq {
  services?: ServiceSlug[];
  models?: BusinessModel[];
}

export interface City {
  slug: CitySlug;
  /** Short name, e.g. "Mumbai". */
  name: string;
  /** State / region, e.g. "Maharashtra". */
  region: string;
  /** Name used in headings, e.g. "Mumbai & MMR". */
  displayName: string;
  /** Other places covered by this city entry (e.g. Thane, Navi Mumbai). */
  includes: string[];
  /** MeeHelp operates commercially in this city (confirmed for all 8 target metros). */
  marketActive: Confirmed;
  /** Availability per service AND per business model. */
  availability: Record<ServiceSlug, Record<BusinessModel, Availability>>;
  /** Short phrases used in titles, descriptions and intros. */
  descriptors: {
    /** e.g. "Mumbai, Thane and Navi Mumbai". */
    areas: string;
  };
  facts: CityFact[];
  faqs: CityFaq[];
  /** Reserved for a future city hub page; not used by service pages. */
  seo: Seo;
  publishStatus: PublishStatus;
  updatedAt: string;
}

/**
 * One service, in one city, for one business model. Every page is an
 * explicit entry in src/data/service-cities.ts. Its content is composed from
 * the service's city frame and the city's tagged facts
 * (src/lib/content/compose.ts); `overrides` holds hand-written content where
 * we have more to say.
 */
export interface ServiceCity {
  service: ServiceSlug;
  city: CitySlug;
  model: BusinessModel;
  publishStatus: PublishStatus;
  updatedAt: string;
  overrides?: Partial<ServiceCityContent>;
}

/** The rendered content of a service-city page. */
export interface ServiceCityContent {
  headline: string;
  introduction: string[];
  /** Marketplace: common requirements. On-demand: typical bookings. */
  points: string[];
  /** City facts relevant to this service and model. */
  localNotes: string[];
  /** Only areas the business has confirmed. Empty hides the section. */
  areasServed: string[];
  localFaqs: Faq[];
  localCta: { heading: string; body: string };
  seo: Seo;
}

/** Content for one service within a locality, e.g. maid in Andheri West. */
export interface LocalityServiceContent {
  model: BusinessModel;
  headline: string;
  introduction: string[];
  localFaqs: Faq[];
  seo: Seo;
  publishStatus: PublishStatus;
  updatedAt: string;
}

/**
 * Locality pages (/maid/mumbai/andheri-west/) are generated ONLY when the
 * locality, its per-service content and the parent service-city page are all
 * explicitly "published". Nothing is generated from combinations automatically.
 */
export interface Locality {
  slug: string;
  name: string;
  city: CitySlug;
  publishStatus: PublishStatus;
  services: Partial<Record<ServiceSlug, LocalityServiceContent>>;
}

export interface Testimonial {
  id: string;
  quote: string;
  /** First name + initial only, e.g. "Priya S." */
  displayName: string;
  city?: CitySlug;
  service?: ServiceSlug;
  model?: BusinessModel;
  source: "play-store" | "app-store" | "customer-survey" | "direct";
  /** Written consent to publish was obtained. */
  consentToPublish: boolean;
  /** ISO date the review was given. */
  date: string;
  /** Development placeholders are never rendered on production builds. */
  isPlaceholder: boolean;
}

/** A customer-facing marketing claim. Rendered only when enabled AND approved. */
export interface Claim {
  enabled: boolean;
  /** Which proposition the claim belongs to; "both" for brand-level claims. */
  model: BusinessModel | "both";
  /** Short claim shown to customers. */
  text: string;
  /** Optional supporting detail shown under the claim. */
  detail?: string;
  /** Who approved the claim and when. Required when enabled. */
  approvedBy: string | null;
  approvedOn: string | null;
  note: string;
}

export interface TrustMetric {
  key: string;
  /** Label shown to customers, e.g. "Google Play rating". */
  metric: string;
  /** Display value, e.g. "4.3". null = not provided. */
  value: string | null;
  /** Where the number comes from, e.g. "Google Play listing". */
  source: string | null;
  sourceUrl: string | null;
  /** ISO date the number was last checked at the source. */
  dateChecked: string | null;
  /** The value has been confirmed as accurate and may be used. */
  approved: boolean;
  /** Show it on the website (in addition to being approved). */
  displayEnabled: boolean;
}
