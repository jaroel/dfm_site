// Bun-native production server: static client assets first, then the
// adapter-agnostic web `Request -> Response` handler from the build.
// Nothing from node:* — `Bun.file`, `Bun.serve` and `import.meta.dir` are the
// whole platform.
import { handleRequest } from "./dist/server/server.js";

const port = Number(process.env.PORT) || 3000;
const clientRoot = `${import.meta.dir}/dist/client`;

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
            ? { "cache-control": "max-age=31536000, immutable" }
            : {},
        });
      }
    }

    try {
      return await handleRequest(req, { event: { nativeEvent: req } });
    } catch (e) {
      console.error(e);
      return new Response(e instanceof Error ? e.message : String(e), {
        status: 500,
      });
    }
  },
});

console.log(`Server running at http://localhost:${port}`);
