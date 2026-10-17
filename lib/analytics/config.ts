/**
 * Analytics configuration. IDs are read from the environment at build time
 * and are EMPTY by default — nothing loads until real IDs are supplied and
 * the build stage is "production".
 *
 * Variable names: GA4_MEASUREMENT_ID, GTM_CONTAINER_ID, GOOGLE_SITE_VERIFICATION
 */
import { isProductionStage } from "@/lib/site";

const ga4Pattern = /^G-[A-Z0-9]{4,16}$/;
const gtmPattern = /^GTM-[A-Z0-9]{4,12}$/;

function read(name: string, pattern?: RegExp): string | null {
  const value = process.env[name]?.trim();
  if (!value) return null;
  if (pattern && !pattern.test(value)) {
    throw new Error(`${name} is set but does not look valid. Check .env.example.`);
  }
  return value;
}

export const analyticsConfig = {
  ga4MeasurementId: read("GA4_MEASUREMENT_ID", ga4Pattern),
  gtmContainerId: read("GTM_CONTAINER_ID", gtmPattern),
  googleSiteVerification: read("GOOGLE_SITE_VERIFICATION"),
};

/** Load tags only on production builds, and only one tag manager at a time (GTM wins). */
export function activeAnalytics(): { kind: "gtm"; id: string } | { kind: "ga4"; id: string } | null {
  if (!isProductionStage) return null;
  if (analyticsConfig.gtmContainerId) return { kind: "gtm", id: analyticsConfig.gtmContainerId };
  if (analyticsConfig.ga4MeasurementId) return { kind: "ga4", id: analyticsConfig.ga4MeasurementId };
  return null;
}

/** Event names used by data-track attributes on CTAs. */
export const analyticsEvents = {
  appDownload: "app_download_click",
} as const;
