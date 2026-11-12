// Bun-native production server: static client assets first, then the
// adapter-agnostic web `Request -> Response` handler from the build.
// Nothing from node:* — `Bun.file`, `Bun.serve` and `import.meta.dir` are the
// whole platform.
import { handleRequest } from "./dist/server/server.js";

const port = Number(process.env.PORT) || 3000;
const clientRoot = `${import.meta.dir}/dist/client`;

const SECURITY_HEADERS = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
};

// Read once: the client build is immutable for the life of the process.
// `undefined` (no prerender) falls through to the SSR handler.
const indexHtml = await Bun.file(`${clientRoot}/index.html`)
  .text()
  .catch(() => undefined);
const robots = await Bun.file(`${clientRoot}/robots.txt`)
  .text()
  .catch(() => undefined);

Bun.serve({
  port,
  async fetch(req) {
    const { pathname } = new URL(req.url);

    if (indexHtml !== undefined && pathname === "/") {
      // Prerendered HTML changes on every deploy.
      return new Response(indexHtml, {
        headers: {
          ...SECURITY_HEADERS,
          "cache-control": "no-cache",
          "content-type": "text/html;charset=utf-8",
        },
      });
    }

    if (robots !== undefined && pathname === "/robots.txt") {
      return new Response(robots, { headers: SECURITY_HEADERS });
    }

    // Hashed build assets never change under the same name. `Bun.file` is a
    // lazy, file-backed Response body; `.type` is inferred from the extension.
    if (pathname.startsWith("/assets/") && !pathname.includes("..")) {
      const file = Bun.file(clientRoot + pathname);
      if (await file.exists()) {
        return new Response(file, {
          headers: {
            ...SECURITY_HEADERS,
            "cache-control": "max-age=31536000, immutable",
          },
        });
      }
      return new Response("Not Found", {
        status: 404,
        headers: SECURITY_HEADERS,
      });
    }

    try {
      const response = await handleRequest(req, {
        event: { nativeEvent: req },
      });
      for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
        response.headers.set(name, value);
      }
      return response;
    } catch (e) {
      // The detail goes to the server log; the client gets nothing usable.
      console.error(e);
      return new Response("Internal Server Error", {
        status: 500,
        headers: SECURITY_HEADERS,
      });
    }
  },
});

console.log(`Server running at http://localhost:${port}`);
