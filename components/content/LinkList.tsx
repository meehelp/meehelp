import Link from "next/link";

export interface LinkItem {
  href: string;
  label: string;
}

export function LinkList({ links, label }: { links: LinkItem[]; label?: string }) {
  if (links.length === 0) return null;
  return (
    <ul className="link-list" aria-label={label}>
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href}>{l.label}</Link>
        </li>
      ))}
    </ul>
  );
}
