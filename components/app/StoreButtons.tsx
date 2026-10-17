import { appLinks, storeUrl, type Platform } from "@/data/app-links";
import { analyticsEvents } from "@/lib/analytics/config";
import { Icon } from "@/components/content/Icon";

/**
 * App-store CTAs. Plain links (no JS required). `placement` feeds Play Store
 * install-referrer attribution and analytics `data-track` attributes.
 *
 * Official store badge artwork can replace the text buttons later; follow
 * Google's and Apple's badge guidelines when doing so.
 */
export function StoreButton({ platform, placement }: { platform: Platform; placement: string }) {
  const isAndroid = platform === "android";
  return (
    <a
      className={`store-button store-button--${platform}`}
      href={storeUrl(platform, placement)}
      data-track={analyticsEvents.appDownload}
      data-platform={platform}
      data-placement={placement}
    >
      <Icon name={isAndroid ? "play" : "phone"} size={22} className="store-button__icon" />
      <span className="store-button__text">
        <span className="store-button__small">{isAndroid ? "Get it on" : "Download on the"}</span>
        <span className="store-button__store">{isAndroid ? appLinks.android.storeName : appLinks.ios.storeName}</span>
      </span>
    </a>
  );
}

export function StoreButtons({ placement, align = "start" }: { placement: string; align?: "start" | "center" }) {
  return (
    <div className={`store-buttons store-buttons--${align}`}>
      <StoreButton platform="android" placement={placement} />
      <StoreButton platform="ios" placement={placement} />
    </div>
  );
}
