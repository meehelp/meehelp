import Script from "next/script";
import { activeAnalytics, analyticsEvents } from "@/lib/analytics/config";

/**
 * Analytics loader. Renders NOTHING unless the build stage is "production"
 * and GTM_CONTAINER_ID or GA4_MEASUREMENT_ID is set (see .env.example).
 * Scripts load after the page is interactive, so they never block rendering.
 */
export function Analytics() {
  const active = activeAnalytics();
  if (!active) return null;

  // One delegated listener for every CTA carrying data-track.
  const clickTracking = `
    document.addEventListener('click', function (e) {
      var el = e.target.closest && e.target.closest('[data-track]');
      if (!el) return;
      var payload = { platform: el.dataset.platform, placement: el.dataset.placement, page_path: location.pathname };
      if (window.gtag) window.gtag('event', el.dataset.track, payload);
      else if (window.dataLayer) window.dataLayer.push(Object.assign({ event: el.dataset.track }, payload));
    }, { passive: true });`;

  if (active.kind === "gtm") {
    return (
      <>
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${active.id}');`}
        </Script>
        <Script id="cta-tracking" strategy="afterInteractive">
          {clickTracking}
        </Script>
      </>
    );
  }

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${active.id}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${active.id}');`}
      </Script>
      <Script id="cta-tracking" strategy="afterInteractive">
        {clickTracking}
      </Script>
    </>
  );
}

export { analyticsEvents };
