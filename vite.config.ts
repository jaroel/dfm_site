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
    },
  },
});
