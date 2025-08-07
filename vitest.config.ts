import solid from "vite-plugin-solid";
import { defineConfig } from "vitest/config";
import path from "node:path";
import { imagetools } from "vite-imagetools";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), imagetools(), solid()],
  resolve: {
    conditions: ["development", "browser"],
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
