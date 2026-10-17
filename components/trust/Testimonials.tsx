import { getVisibleTestimonials } from "@/lib/content";
import { getService } from "@/lib/content";
import { cityName } from "@/lib/content";
import type { ServiceSlug } from "@/lib/content/types";

/**
 * Customer testimonials. Placeholders are visible (and clearly labelled) on
 * development/preview builds only. Renders nothing when there are none.
 * Deliberately has no Review/AggregateRating schema.
 */
export function Testimonials({ service, title = "What customers say" }: { service?: ServiceSlug; title?: string }) {
  const items = getVisibleTestimonials().filter((t) => !service || !t.service || t.service === service);
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="testimonials-heading" className="section">
      <div className="container">
        <h2 id="testimonials-heading" className="section__title">
          {title}
        </h2>
        <ul className="cards cards--2">
          {items.map((t) => (
            <li key={t.id} className={`card testimonial${t.isPlaceholder ? " testimonial--placeholder" : ""}`}>
              {t.isPlaceholder ? <p className="badge">Development placeholder — not published</p> : null}
              <blockquote>
                <p>{t.quote}</p>
              </blockquote>
              <p className="testimonial__by">
                {t.displayName}
                {t.service ? ` · ${getService(t.service)?.shortName}` : ""}
                {t.city ? ` · ${cityName(t.city)}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
