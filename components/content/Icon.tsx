import type { IconName } from "@/lib/content/types";

type Glyph = IconName | "check" | "cross" | "phone" | "play" | "arrow";

const paths: Record<Glyph, React.ReactNode> = {
  maid: (
    <>
      <path d="M14 3h4v6l-2 2-2-2z" />
      <path d="M16 11v4" />
      <path d="M10 21l2-6h8l2 6z" />
      <path d="M4 14c1.5 0 2-1 2-2M3 18c2 0 3-1.5 3-3" />
    </>
  ),
  cook: (
    <>
      <path d="M5 11h14v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" />
      <path d="M3 11h18" />
      <path d="M9 7c0-1 1-1 1-2s-1-1-1-2M14 7c0-1 1-1 1-2s-1-1-1-2" />
    </>
  ),
  nanny: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M10 8.5h.01M14 8.5h.01M10.5 11a2 2 0 0 0 3 0" />
      <path d="M6 21a6 6 0 0 1 12 0" />
    </>
  ),
  elder: (
    <>
      <circle cx="11" cy="4.5" r="2" />
      <path d="M11 7v6l-3 8M11 13l3 3v5" />
      <path d="M11 9l-3 3M17 12v9M15 12h2" />
    </>
  ),
  patient: (
    <>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
      <path d="M12 9v5M9.5 11.5h5" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  cross: <path d="M7 7l10 10M17 7L7 17" />,
  phone: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M11 18.5h2" />
    </>
  ),
  play: <path d="M7 4.5v15l12-7.5z" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
};

/** Decorative inline SVG icon (aria-hidden). Pair with visible text. */
export function Icon({ name, size = 24, className }: { name: Glyph; size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
