import solid from "vite-plugin-solid";
import { defineConfig } from "vitest/config";
import path from "node:path";
import { responsiveImage } from "@responsive-image/vite-plugin";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), solid(), responsiveImage()],
  resolve: {
    conditions: ["development", "browser"],
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
