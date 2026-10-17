import type { Faq } from "@/lib/content/types";

/** Visible FAQs. Answers are in the HTML (inside <details>), so they are crawlable. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;
  return (
    <div className="faq">
      {faqs.map((faq) => (
        <details key={faq.question} className="faq__item">
          <summary className="faq__question">
            <h3>{faq.question}</h3>
          </summary>
          <div className="faq__answer">
            {faq.answer.split(/\n\s*\n/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
