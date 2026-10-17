/**
 * Build wrapper:  tsx scripts/build.ts   (used by every npm build script)
 *
 * Static export refuses a dynamic route that generates zero pages. Service
 * pages only build once their business facts are confirmed, so on some stages
 * there may be none. This wrapper asks the route registry first and tells
 * next.config.ts (via SERVICE_ROUTES) whether to include the catch-all route
 * file app/[service]/[[...rest]]/page.routes.tsx. Nothing is ever generated
 * that the registry does not list.
 */
import { execSync } from "node:child_process";

const { getServiceRouteParams } = await import("@/lib/content/resolve");
const { siteStage } = await import("@/lib/site");

const count = getServiceRouteParams().length;
const env = { ...process.env, SERVICE_ROUTES: count > 0 ? "1" : "0", NEXT_TELEMETRY_DISABLED: "1" };
console.log(`▶ SITE_STAGE=${siteStage}: ${count} service route(s)${count === 0 ? " — catch-all route excluded" : ""}`);
execSync("npx next build", { stdio: "inherit", env });
