import { Section } from "@/components/content/Section";
import type { BusinessModel } from "@/lib/content/types";
import { AppRatings } from "@/components/trust/TrustMetrics";
import { QrPanel } from "./QrPanel";
import { StoreButtons } from "./StoreButtons";

const defaultBody = {
  marketplace: "Finding helpers happens in the MeeHelp app. Download it, sign up with your mobile number and start reviewing helper profiles near you.",
  onDemand: "On-demand bookings happen in the MeeHelp app. Download it and sign up with your mobile number.",
  both: "Finding helpers and booking on-demand help both happen in the MeeHelp app. Download it and sign up with your mobile number.",
};

/** The page's #get-the-app target. CTA buttons across the page scroll here. */
export function AppDownloadSection({
  title = "Get the MeeHelp app",
  body,
  model,
  placement,
}: {
  title?: string;
  body?: string;
  model: BusinessModel | "both";
  placement: string;
}) {
  return (
    <Section id="get-the-app" title={title} tone="tint" model={model === "both" ? undefined : model}>
      <div className="app-download">
        <div className="app-download__copy">
          <p className="lead">{body ?? defaultBody[model]}</p>
          <StoreButtons placement={placement} />
          <AppRatings />
        </div>
        <QrPanel />
      </div>
    </Section>
  );
}
