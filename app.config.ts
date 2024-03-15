import { defineConfig } from "@solidjs/start/config";
import { imagetools } from "vite-imagetools";

export default defineConfig({
  vite: {
    plugins: [imagetools()],
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
          headers: { "cache-control": "private,max-age=3600" },
        },
        "/uzg/": {
          headers: { "cache-control": "max-age=3600" },
        },
      },
    },

});
