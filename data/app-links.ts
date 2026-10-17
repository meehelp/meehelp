/**
 * Official public app-store listings. No deep-link provider is active yet:
 * the existing Branch link domains used by the apps (see docs/APP-LINKING.md) must be
 * reviewed before they are used on the website.
 */
export const appLinks = {
  android: {
    storeName: "Google Play",
    storeUrl: "https://play.google.com/store/apps/details?id=com.meehelp.meehelp&hl=en_IN",
    packageName: "com.meehelp.meehelp",
    /** Append a Play Install Referrer (utm_*) so website installs can be attributed. */
    addInstallReferrer: true,
  },
  ios: {
    storeName: "App Store",
    storeUrl: "https://apps.apple.com/in/app/meehelp-find-helpers-near-you/id1625634794",
    appId: "1625634794",
    /** Safari Smart App Banner (<meta name="apple-itunes-app">). */
    smartAppBanner: true,
  },
  /** Desktop QR code. Needs an approved image pointing at a smart link. */
  qr: {
    enabled: false,
    imageSrc: null as string | null,
    targetUrl: null as string | null,
  },
  deepLinking: {
    enabled: false,
    provider: null as "branch" | "firebase-hosting" | "custom" | null,
    /** e.g. https://link.meehelp.in — set only after review. */
    baseUrl: null as string | null,
  },
} as const;

export type Platform = "android" | "ios";

/** Store URL for a CTA, with optional campaign attribution for Google Play. */
export function storeUrl(platform: Platform, placement?: string): string {
  if (platform === "ios") return appLinks.ios.storeUrl;
  const base = appLinks.android.storeUrl;
  if (!appLinks.android.addInstallReferrer) return base;
  const referrer = new URLSearchParams({
    utm_source: "meehelp_website",
    utm_medium: "organic",
    utm_campaign: placement ?? "site",
  }).toString();
  return `${base}&referrer=${encodeURIComponent(referrer)}`;
}
