import type { ClaimKey } from "@/data/business";
import type { BusinessModel } from "@/lib/content/types";
import { getActiveClaims } from "@/lib/trust";
import { Icon } from "@/components/content/Icon";

/**
 * Marketing claims for a page of the given model. Every claim is disabled
 * unless approved in data/business.ts.
 */
export function Claims({ model, keys }: { model: BusinessModel | "both"; keys?: ClaimKey[] }) {
  const active = getActiveClaims(model, keys);
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
