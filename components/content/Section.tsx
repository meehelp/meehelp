interface SectionProps {
  id: string;
  /** Marks the section as belonging to one proposition (checked by `npm run seo`). */
  model?: "marketplace" | "onDemand";
  title: string;
  intro?: string;
  tone?: "plain" | "tint" | "warm";
  children: React.ReactNode;
}

/** A page section with an H2 and aria-labelledby, for a consistent heading outline. */
export function Section({ id, title, intro, tone = "plain", model, children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={`section section--${tone}`} data-model={model}>
      <div className="container">
        <h2 id={headingId} className="section__title">
          {title}
        </h2>
        {intro ? <p className="section__intro">{intro}</p> : null}
        {children}
      </div>
    </section>
  );
}
