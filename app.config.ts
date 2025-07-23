import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import { imagetools } from "vite-imagetools";

export default defineConfig({
  vite: {
    plugins: [tailwindcss(), imagetools()],
    build: {
      reportCompressedSize: false,
    },
  },
  server: {
    prerender: {
      routes: ["/"],
    },
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
