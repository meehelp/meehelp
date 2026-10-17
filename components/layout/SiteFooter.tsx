import Link from "next/link";
import { business } from "@/data/business";
import { StoreButtons } from "@/components/app/StoreButtons";
import { getBuiltCitiesWithPages, getBuiltServices, getService } from "@/lib/content";
import { serviceCityPath, servicePath } from "@/lib/content/paths";

export function SiteFooter() {
  const services = getBuiltServices();
  const cities = getBuiltCitiesWithPages();
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <img
            src={business.logo.src}
            width={155}
            height={60}
            alt={business.logo.alt}
            loading="lazy"
            className="site-footer__logo"
          />
          <p className="site-footer__summary">{business.summary}</p>
          <StoreButtons placement="footer" />
        </div>

        <nav aria-labelledby="footer-services">
          <h2 id="footer-services" className="site-footer__heading">
            Services
          </h2>
          <ul>
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={servicePath(s.slug)}>{s.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {cities.length > 0 ? (
          <nav aria-labelledby="footer-cities">
            <h2 id="footer-cities" className="site-footer__heading">
              Cities
            </h2>
            <ul>
              {cities.flatMap(({ city, pages }) =>
                pages.map((p) => (
                  <li key={`${p.service}-${p.city}`}>
                    <Link href={serviceCityPath(p.service, p.city)}>
                      {getService(p.service)?.shortName} in {city.name}
                    </Link>
                  </li>
                )),
              )}
            </ul>
          </nav>
        ) : null}

        {business.contact.email.enabled ? (
          <div>
            <h2 className="site-footer__heading">Contact</h2>
            <p>
              <a href={`mailto:${business.contact.email.value}`}>{business.contact.email.value}</a>
            </p>
          </div>
        ) : null}
      </div>
      <div className="container site-footer__legal">
        <p>
          © {year} {business.legalName ?? business.brandName}
        </p>
      </div>
    </footer>
  );
}
