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
      },
    },

});
