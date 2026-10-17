import { Section } from "@/components/content/Section";
import { AppRatings } from "@/components/trust/TrustMetrics";
import { QrPanel } from "./QrPanel";
import { StoreButtons } from "./StoreButtons";

export function AppDownloadSection({
  id = "get-the-app",
  title = "Get the MeeHelp app",
  body = "Bookings happen in the MeeHelp app. Download it, sign in with your mobile number, and tell us what help you need.",
  placement,
}: {
  id?: string;
  title?: string;
  body?: string;
  placement: string;
}) {
  return (
    <Section id={id} title={title} tone="tint">
      <div className="app-download">
        <div className="app-download__copy">
          <p className="lead">{body}</p>
          <StoreButtons placement={placement} />
          <AppRatings />
        </div>
        <QrPanel />
      </div>
    </Section>
  );
}
