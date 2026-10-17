import Link from "next/link";
import type { Service } from "@/lib/content/types";
import { Icon } from "./Icon";

/**
 * Service category cards. A card links to its hub page only when that page is
 * built for the current stage; otherwise it is shown as plain text, so the
 * site never links to a page that doesn't exist.
 */
export function ServiceCards({ items }: { items: { service: Service; href: string | null }[] }) {
  return (
    <ul className="service-cards">
      {items.map(({ service: s, href }) => {
        const body = (
          <>
            <span className="service-card__icon">
              <Icon name={s.icon} size={28} />
            </span>
            <h3 className="service-card__title">{s.name}</h3>
            <span className="service-card__text">{s.summary}</span>
            {href ? (
              <span className="service-card__more">
                More about {s.name.toLowerCase()} <Icon name="arrow" size={16} />
              </span>
            ) : null}
          </>
        );
        return (
          <li key={s.slug}>
            {href ? (
              <Link href={href} className="service-card">
                {body}
              </Link>
            ) : (
              <div className="service-card service-card--static">{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
