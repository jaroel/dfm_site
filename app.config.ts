import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import devtools from "solid-devtools/vite";
import { responsiveImage } from "@responsive-image/vite-plugin";

export default defineConfig({
  vite: {
    plugins: [
      devtools({
        autoname: true,
        locator: {
          componentLocation: true,
          jsxLocation: true,
        },
      }),
      tailwindcss(),
      responsiveImage(),
    ],
    build: {
      reportCompressedSize: false,
    },
  },
  server: {
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
