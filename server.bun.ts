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

Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);

    // Static client assets first. `Bun.file` is a lazy, file-backed Response
    // body; `.type` is inferred from the file extension.
    if (url.pathname !== "/" && !url.pathname.includes("..")) {
      const file = Bun.file(clientRoot + url.pathname);
      if (await file.exists()) {
        // Hashed build assets never change under the same name.
        const immutable = url.pathname.startsWith("/assets/");
        return new Response(file, {
          headers: immutable
            ? {
                ...SECURITY_HEADERS,
                "cache-control": "max-age=31536000, immutable",
              }
            : SECURITY_HEADERS,
        });
      }
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
