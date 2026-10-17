import { StoreButtons } from "./StoreButtons";

/**
 * Small fixed bar on mobile screens only (hidden on wide screens via CSS).
 * Server-rendered with both stores: no JavaScript, and no layout shift from
 * swapping buttons after load (this removed the site's only client component).
 */
export function StickyAppBar() {
  return (
    <aside className="sticky-app-bar" aria-label="Get the MeeHelp app">
      <p className="sticky-app-bar__text">Get the MeeHelp app</p>
      <StoreButtons placement="sticky_bar" size="compact" />
    </aside>
  );
}
