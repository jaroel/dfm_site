import { defineConfig } from "@solidjs/start/config";
import { imagetools } from "vite-imagetools";

export default defineConfig({
  plugins: [imagetools()],
  build: {
    reportCompressedSize: false,
  },
  start: {
    server: {
      prerender: {
        routes: ["/"],
      },
      routeRules: {
        "/_build/assets/**": {
          headers: { "cache-control": "max-age=31536000, immutable" },
        },
      },
    },
  },
});
