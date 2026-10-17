import Link from "next/link";
import { business } from "@/data/business";
import { getBuiltServices } from "@/lib/content";
import { servicePath } from "@/lib/content/paths";

export function SiteHeader() {
  const services = getBuiltServices();
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="site-header__logo" aria-label={`${business.brandName} home`}>
          <img
            src={business.logo.src}
            width={business.logo.width}
            height={business.logo.height}
            alt={business.logo.alt}
            fetchPriority="high"
          />
        </Link>

        <nav aria-label="Main" className="site-nav site-nav--desktop">
          <ul>
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={servicePath(s.slug)}>{s.shortName}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <a href="#get-the-app" className="button button--small site-header__cta">
          Get the app
        </a>

        {/* No-JS mobile menu: native <details> is keyboard and screen-reader accessible. */}
        <details className="site-nav site-nav--mobile">
          <summary aria-label="Menu">
            <span className="burger" aria-hidden="true" />
            <span className="site-nav__label">Menu</span>
          </summary>
          <nav aria-label="Main (mobile)">
            <ul>
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={servicePath(s.slug)}>{s.name}</Link>
                </li>
              ))}
              <li>
                <a href="#get-the-app">Get the app</a>
              </li>
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
