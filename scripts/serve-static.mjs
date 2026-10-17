/**
 * Minimal local server for the static export in out/ (no dependencies).
 * Mirrors the intended production behaviour so it can be reviewed locally:
 *   - /maid        → 308 redirect to /maid/   (trailing-slash policy)
 *   - /maid/       → out/maid/index.html
 *   - unknown path → out/404.html with HTTP 404
 *   - gzip for text responses when the client accepts it (like a CDN would)
 * Usage: npm run serve  (PORT=4000 npm run serve)
 * Local review only — not a production server.
 */
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { gzipSync } from "node:zlib";

const root = join(process.cwd(), "out");
const port = Number(process.env.PORT || 4000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

if (!existsSync(root)) {
  console.error("out/ not found. Run `npm run build` (or build:preview / build:production) first.");
  process.exit(1);
}

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const path = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  let file = join(root, path);

  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!path.endsWith("/")) {
      res.writeHead(308, { Location: `${path}/${url.search}` });
      return res.end();
    }
    file = join(file, "index.html");
  } else if (!extname(path) && existsSync(join(root, path, "index.html"))) {
    res.writeHead(308, { Location: `${path}/${url.search}` });
    return res.end();
  }

  if (!existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404, { "Content-Type": types[".html"] });
    return res.end(readFileSync(join(root, "404.html")));
  }

  const ext = extname(file);
  const immutable = file.includes(`${join("_next", "static")}`);
  const compressible = [".html", ".js", ".css", ".txt", ".xml", ".json", ".svg", ".ttf"].includes(ext);
  const gzip = compressible && /\bgzip\b/.test(String(req.headers["accept-encoding"] ?? ""));
  const body = readFileSync(file);
  res.writeHead(200, {
    "Content-Type": types[ext] ?? "application/octet-stream",
    "Cache-Control": immutable ? "public, max-age=31536000, immutable" : "public, max-age=0, must-revalidate",
    ...(gzip ? { "Content-Encoding": "gzip", Vary: "Accept-Encoding" } : {}),
  });
  res.end(gzip ? gzipSync(body) : body);
}).listen(port, () => console.log(`Serving out/ at http://localhost:${port}`));
