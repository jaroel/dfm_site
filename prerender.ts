// Render the static home page once after `vite build` and write it next to the
// client assets. `server.bun.ts` serves dist/client/index.html for `/` before
// dispatching to the SSR handler.
import { mkdir, writeFile } from "node:fs/promises";

const { handleRequest } = await import(
  new URL("./dist/server/server.js", import.meta.url).href
);

// `async` (not the default stream) settles every boundary before the head is
// sent: no fallback markup, swap scripts or pending asset state to replay in a
// static file.
const response = await handleRequest(
  new Request("http://localhost/", { headers: { accept: "text/html" } }),
  { renderMode: "async" },
);
if (!response.ok) {
  throw new Error(`prerendering / failed: ${response.status}`);
}

await mkdir(new URL("./dist/client/", import.meta.url), { recursive: true });
await writeFile(
  new URL("./dist/client/index.html", import.meta.url),
  await response.text(),
);
console.log("prerendered / -> dist/client/index.html");
