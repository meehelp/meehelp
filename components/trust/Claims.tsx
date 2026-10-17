import type { ClaimKey } from "@/data/business";
import { getActiveClaims } from "@/lib/trust";
import { Icon } from "@/components/content/Icon";

/**
 * Verification, booking and support claims. Every claim is disabled by
 * default and renders only when approved in data/business.ts.
 */
export function Claims({ keys }: { keys?: ClaimKey[] }) {
  const active = getActiveClaims(keys);
  if (active.length === 0) return null;
  return (
    <ul className="claims">
      {active.map((c) => (
        <li key={c.key} className="claims__item">
          <Icon name="check" size={20} />
          <span>
            <strong>{c.text}</strong>
            {c.detail ? <span className="claims__detail">{c.detail}</span> : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function VerificationClaim() {
  return <Claims keys={["verifiedHelpers", "backgroundChecks"]} />;
}

export function BookingSupportClaims() {
  return <Claims keys={["noBrokerage", "replacementSupport", "inAppSupport", "securePayments"]} />;
}
