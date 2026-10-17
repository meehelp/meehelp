// @ts-check
import { defineConfig } from "astro/config";

/**
 * Static build: every route is pre-rendered to plain HTML at build time and
 * can be served from any static host/CDN. No server, no database, no
 * connection to the production PHP API, and no client JavaScript unless a
 * component explicitly opts in (none do).
 *
 * Redirects and response headers are configured at the hosting/CDN layer
 * (see docs/DEPLOYMENT.md).
 */
const site = (process.env.SITE_URL || "https://meehelp.in").replace(/\/+$/, "");

export default defineConfig({
  site,
  output: "static",
  // Every page URL ends with "/" (/maid/mumbai/), written as maid/mumbai/index.html.
  trailingSlash: "always",
  build: {
    format: "directory",
    // The single global stylesheet is small; inline it to remove a render-blocking request.
    inlineStylesheets: "always",
  },
  devToolbar: { enabled: false },
  // Prefetching would inject client JavaScript; plain navigation is used instead.
  prefetch: false,
});
