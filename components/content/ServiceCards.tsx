import Link from "next/link";
import { servicePath } from "@/lib/content/paths";
import type { Service } from "@/lib/content/types";
import { Icon } from "./Icon";

/** Crawlable links to service hubs. */
export function ServiceCards({ services, headingLevel = 3 }: { services: Service[]; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <ul className="service-cards">
      {services.map((s) => (
        <li key={s.slug}>
          <Link href={servicePath(s.slug)} className="service-card">
            <span className="service-card__icon">
              <Icon name={s.icon} size={28} />
            </span>
            <Heading className="service-card__title">{s.name}</Heading>
            <span className="service-card__text">{s.summary}</span>
            <span className="service-card__more">
              More about {s.name.toLowerCase()} <Icon name="arrow" size={16} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
