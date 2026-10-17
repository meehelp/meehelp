import type { NextConfig } from "next";

/**
 * Static export: every route is pre-rendered to plain HTML at build time and
 * can be served from any static host/CDN. No Node server, no database, no
 * connection to the production PHP API.
 *
 * Redirects and response headers cannot be set here when using `output: "export"`;
 * they must be configured at the hosting/CDN layer (see docs/DEPLOYMENT.md).
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Static export has no image optimisation server; images are pre-sized
    // by scripts/optimise-images.mjs and served as-is.
    unoptimized: true,
  },
  experimental: {
    // Inline the (small) global stylesheet into each HTML document to remove
    // a render-blocking request on first load.
    inlineCss: true,
  },
};

export default nextConfig;
