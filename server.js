// The entire production server for a turnkey SSR app: static client assets
// plus one import — the built server bundle's `handleRequest`, an
// adapter-agnostic web `Request -> Response` handler that streams the SSR
// render, resolves hashed client assets through the build manifest, and
// serves the `/_server` endpoint too.
import { readFileSync } from "node:fs";
import path from "node:path";

import { handleRequest } from "./dist/server/server.js";

const port = process.env.PORT || 3000;
const __dirname = import.meta.dir;
const clientDir = path.resolve(__dirname, "dist/client");

const MIME = {
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".json": "application/json",
  ".txt": "text/plain",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".mp3": "audio/mpeg",
  ".webm": "audio/webm",
  ".mp4": "video/mp4",
};

const server = Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // Static client assets first.
    if (pathname !== "/") {
      const filePath = path.join(clientDir, pathname);
      const rel = path.relative(clientDir, filePath);
      // Path-traversal-safe: only serve files strictly inside dist/client.
      if (rel && !rel.startsWith("..") && !path.isAbsolute(rel)) {
        try {
          const content = readFileSync(filePath);
          const type = MIME[path.extname(pathname)] || "application/octet-stream";
          return new Response(content, { headers: { "Content-Type": type } });
        } catch {
          // Fall through to the handler (SSR routes, /_server, ...).
        }
      }
    }

    try {
      return await handleRequest(req);
    } catch (e) {
      console.error(e);
      return new Response(String(e), { status: 500 });
    }
  },
});

console.log(`Server running at http://localhost:${port}`);
