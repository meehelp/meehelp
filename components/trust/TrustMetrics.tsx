import { getDisplayableMetrics } from "@/lib/trust";

/** Business statistics. Renders nothing until approved, sourced, dated numbers exist in data/business.ts. */
export function TrustMetrics({ keys }: { keys?: string[] }) {
  const metrics = getDisplayableMetrics(keys);
  if (metrics.length === 0) return null;
  return (
    <dl className="metrics">
      {metrics.map((m) => (
        <div key={m.key} className="metrics__item">
          <dt>{m.metric}</dt>
          <dd>{m.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** App-store ratings and downloads. Text only — never marked up as AggregateRating schema. */
export function AppRatings() {
  return <TrustMetrics keys={["playRating", "playDownloads", "appStoreRating"]} />;
}
