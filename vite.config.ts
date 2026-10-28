import { fileURLToPath } from "node:url";
import { responsiveImage } from "@responsive-image/vite-plugin";
import solid from "@solidjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { fileRoutes } from "filesystem-routing/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    solid({
      start: { middleware: "./src/middleware.ts" },
      ssr: true,
      serverFunctions: true,
      extensions: [".jsx", ".tsx"],
    }),
    tailwindcss(),
    fileRoutes({ httpMethods: true, types: true }),
    responsiveImage(),
  ],
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    reportCompressedSize: false,
    target: "esnext",
  },
});
