import { appLinks } from "@/data/app-links";
import { isProductionStage } from "@/lib/site";

/**
 * Desktop QR code for "scan to download". Shown only on wide screens (CSS).
 * Until an approved QR image exists, a labelled placeholder is shown on
 * development/preview builds and nothing is rendered on production.
 */
export function QrPanel() {
  const { qr } = appLinks;
  if (qr.enabled && qr.imageSrc) {
    return (
      <figure className="qr-panel">
        <img src={qr.imageSrc} width={140} height={140} alt="QR code to download the MeeHelp app" loading="lazy" />
        <figcaption>Scan with your phone camera to get the app</figcaption>
      </figure>
    );
  }
  if (isProductionStage) return null;
  return (
    <div className="qr-panel qr-panel--placeholder" role="note">
      <span className="qr-panel__box" aria-hidden="true">QR</span>
      <span>
        <strong>Placeholder:</strong> desktop QR code. Add an approved image and smart link in{" "}
        <code>data/app-links.ts</code>.
      </span>
    </div>
  );
}
