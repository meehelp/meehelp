import { verificationScope } from "@/data/verification";
import { getActiveVerificationChecks } from "@/lib/trust";
import { Icon } from "@/components/content/Icon";

/**
 * The only component that renders verification wording. Lists enabled,
 * approved checks from data/verification.ts, followed by a scope note so
 * identity checks are not mistaken for police or background checks.
 */
export function VerificationSummary({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const checks = getActiveVerificationChecks();
  if (checks.length === 0) return null;
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="verification">
      <Heading className="verification__title">{verificationScope.heading}</Heading>
      <p>{verificationScope.intro}</p>
      <ul className="claims">
        {checks.map((c) => (
          <li key={c.key} className="claims__item">
            <Icon name="check" size={20} />
            <span>
              <strong>{c.claim}</strong>
              <span className="claims__detail">{c.detail}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="note">{verificationScope.limitation}</p>
    </div>
  );
}
