import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { appLinks } from "@/data/app-links";
import { business } from "@/data/business";
import { Analytics } from "@/components/analytics/Analytics";
import { StickyAppBar } from "@/components/app/StickyAppBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { analyticsConfig } from "@/lib/analytics/config";
import { isProductionStage, siteUrl } from "@/lib/site";
import "./globals.css";

// One self-hosted weight, headings only. Body text uses the system font stack.
const lexend = localFont({
  src: "./fonts/Lexend-SemiBold.ttf",
  weight: "600",
  display: "swap",
  variable: "--font-heading",
  fallback: ["system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: business.brandName,
  // Safe default; every page sets its own title, description and robots.
  title: business.brandName,
  description: business.summary,
  robots: isProductionStage ? undefined : { index: false, follow: false },
  formatDetection: { telephone: false },
  ...(appLinks.ios.smartAppBanner ? { itunes: { appId: appLinks.ios.appId } } : {}),
  ...(analyticsConfig.googleSiteVerification
    ? { verification: { google: analyticsConfig.googleSiteVerification } }
    : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={lexend.variable}>
      <body>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <StickyAppBar />
        <Analytics />
      </body>
    </html>
  );
}
