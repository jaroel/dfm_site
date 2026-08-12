import { responsiveImage } from "@responsive-image/vite-plugin";
import { solidStart } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [solidStart(), nitro(), tailwindcss(), responsiveImage()],
  build: {
    reportCompressedSize: false,
  },
  nitro: {
    preset: "bun",
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
    },
  },
});
