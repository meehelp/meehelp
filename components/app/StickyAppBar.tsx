import { PlatformCta } from "./PlatformCta";

/** Small fixed bar on mobile screens only (hidden on wide screens via CSS). */
export function StickyAppBar() {
  return (
    <aside className="sticky-app-bar" aria-label="Get the MeeHelp app">
      <p className="sticky-app-bar__text">Find help near you in the MeeHelp app</p>
      <PlatformCta placement="sticky_bar" />
    </aside>
  );
}
