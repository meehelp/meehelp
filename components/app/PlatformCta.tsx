"use client";

import { useEffect, useState } from "react";
import type { Platform } from "@/data/app-links";
import { StoreButton } from "./StoreButtons";

function detectPlatform(): Platform | null {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  return null;
}

/**
 * The only client component on the site. Server HTML shows both store links;
 * after load, phones see just the store for their platform. Works without JS.
 */
export function PlatformCta({ placement }: { placement: string }) {
  const [platform, setPlatform] = useState<Platform | null>(null);
  useEffect(() => setPlatform(detectPlatform()), []);

  if (platform) {
    return (
      <div className="store-buttons store-buttons--single">
        <StoreButton platform={platform} placement={placement} />
      </div>
    );
  }
  return (
    <div className="store-buttons store-buttons--compact">
      <StoreButton platform="android" placement={placement} />
      <StoreButton platform="ios" placement={placement} />
    </div>
  );
}
