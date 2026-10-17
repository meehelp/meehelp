import { pricingSettings, type Plan, type PlanSegment } from "@/data/plans";
import { Cta } from "@/components/content/Cta";
import { isProductionStage } from "@/lib/site";
import { arePricesPublishable, formatInr, formatValidity, getActivePlans } from "@/lib/pricing";

/**
 * Plan cards for ONE segment, read from data/plans.ts. Prices are never typed
 * into page copy. While the meaning of the app's "*" is unconfirmed, prices are
 * hidden on production builds and flagged on preview builds.
 */
export function PlanCards({ segment, placement }: { segment: PlanSegment; placement: string }) {
  const plans = getActivePlans(segment);
  const showPrices = arePricesPublishable();
  return (
    <>
      <ul className="plans">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} showPrices={showPrices} placement={placement} />
        ))}
      </ul>
      {showPrices && pricingSettings.priceNote.status !== "confirmed" && !isProductionStage ? (
        <p className="badge badge--pending" role="note">
          Pending: the app shows “*” beside prices. Its meaning is not confirmed, so no tax or GST explanation is shown.
          Prices are hidden on production builds until this is confirmed.
        </p>
      ) : null}
      {showPrices && pricingSettings.priceNote.status === "confirmed" && pricingSettings.priceNote.text ? (
        <p className="note">{pricingSettings.priceNote.text}</p>
      ) : null}
    </>
  );
}

function PlanCard({ plan, showPrices, placement }: { plan: Plan; showPrices: boolean; placement: string }) {
  const headingId = `plan-${plan.id}`;
  return (
    <li className={`plan${plan.bestValue ? " plan--best" : ""}`} aria-labelledby={headingId}>
      {plan.bestValue ? <p className="plan__flag">Best value</p> : null}
      <h3 id={headingId} className="plan__name">
        {plan.displayName}
      </h3>
      <p className="plan__contacts">
        <strong>{plan.contacts}</strong> helper contacts
      </p>
      <p className="plan__validity">Valid for {formatValidity(plan.validity)}</p>
      {showPrices ? (
        <p className="plan__price">
          <span className="plan__current">{formatInr(plan.currentPrice)}</span>
          {plan.previousPrice !== null ? (
            <>
              {" "}
              <del className="plan__previous">
                <span className="visually-hidden">was </span>
                {formatInr(plan.previousPrice)}
              </del>
            </>
          ) : null}
          {plan.discountPercent !== null ? <span className="plan__discount"> {plan.discountPercent}% off</span> : null}
        </p>
      ) : null}
      <Cta ctaKey={plan.ctaKey} placement={`${placement}_${plan.id}`} variant="secondary" />
    </li>
  );
}
