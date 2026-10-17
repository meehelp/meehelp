import { engagementTypes } from "@/data/how-it-works";
import type { EngagementKey, Step } from "@/lib/content/types";
import { Icon } from "./Icon";

export function CheckList({ items, variant = "check" }: { items: string[]; variant?: "check" | "cross" }) {
  return (
    <ul className={`checklist checklist--${variant}`}>
      {items.map((item) => (
        <li key={item}>
          <Icon name={variant} size={20} className="checklist__icon" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="bullets">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="steps">
      {steps.map((step, i) => (
        <li key={step.title} className="steps__item">
          <span className="steps__number" aria-hidden="true">
            {i + 1}
          </span>
          <h3 className="steps__title">{step.title}</h3>
          <p>{step.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function EngagementList({ keys }: { keys: EngagementKey[] }) {
  return (
    <ul className="cards cards--3">
      {keys.map((key) => (
        <li key={key} className="card">
          <h3 className="card__title">{engagementTypes[key].name}</h3>
          <p>{engagementTypes[key].body}</p>
        </li>
      ))}
    </ul>
  );
}
