import { activeAnalytics, analyticsEvents } from "@/lib/analytics/config";

/**
 * Analytics loader. Renders NOTHING unless the build stage is "production"
 * and GTM_CONTAINER_ID or GA4_MEASUREMENT_ID is set (see .env.example).
 *
 * Uses plain async <script> tags (not next/script), so tags load without
 * depending on any framework client runtime and never block rendering.
 */
export function Analytics() {
  const active = activeAnalytics();
  if (!active) return null;

  // One delegated listener for every element carrying data-track (store buttons and CTAs).
  const clickTracking = `document.addEventListener('click',function(e){var el=e.target.closest&&e.target.closest('[data-track]');if(!el)return;var p={platform:el.dataset.platform,cta:el.dataset.cta,cta_model:el.dataset.ctaModel,placement:el.dataset.placement,page_path:location.pathname};if(window.gtag)window.gtag('event',el.dataset.track,p);else if(window.dataLayer)window.dataLayer.push(Object.assign({event:el.dataset.track},p));},{passive:true});`;

  if (active.kind === "gtm") {
    const gtm = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${active.id}');`;
    return <script id="analytics" dangerouslySetInnerHTML={{ __html: gtm + clickTracking }} />;
  }

  const ga4 = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${active.id}');`;
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${active.id}`} />
      <script id="analytics" dangerouslySetInnerHTML={{ __html: ga4 + clickTracking }} />
    </>
  );
}

export { analyticsEvents };
