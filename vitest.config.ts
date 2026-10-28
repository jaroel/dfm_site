import { fileURLToPath } from "node:url";
import { responsiveImage } from "@responsive-image/vite-plugin";
import solid from "@solidjs/vite-plugin";
import { fileRoutes } from "filesystem-routing/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    solid({
      start: true,
      ssr: true,
      extensions: [".tsx"],
    }),
    fileRoutes(),
    responsiveImage(),
  ],
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
  },
});
