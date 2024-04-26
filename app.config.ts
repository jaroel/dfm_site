import { defineConfig } from "@solidjs/start/config";
import { imagetools } from "vite-imagetools";
import devtools from "solid-devtools/vite";

export default defineConfig({
  vite: {
    plugins: [
      imagetools(),
      devtools({
        /* features options - all disabled by default */
        autoname: true, // e.g. enable autoname
      }),
    ],
    build: {
      reportCompressedSize: false,
    },
  },
  server: {
    routeRules: {
      "/_build/assets/**": {
        headers: { "cache-control": "max-age=31536000, immutable" },
      },
      "/_server/assets/**": {
        headers: { "cache-control": "max-age=31536000, immutable" },
      },
      "/assets/**": {
        headers: { "cache-control": "max-age=31536000, immutable" },
      },
      "/": {
        headers: { "cache-control": "max-age=3600, must-revalidate" },
      },
      "/uzg/": {
        headers: { "cache-control": "max-age=3600" },
      },
    },
  },
});
