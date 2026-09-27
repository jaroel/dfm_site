import { responsiveImage } from "@responsive-image/vite-plugin";
import solid from "@solidjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { fileRoutes } from "filesystem-routing/vite";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig(({ command }) => ({
  plugins: [
    solid({
      start: {
        // Fetch-style chain fronting every request: dispatches API routes.
        middleware: "./src/middleware.ts",
      },
      ssr: true,
      // Compiles 'use server' functions into fetch calls on the client and
      // serves them from the /_server endpoint; registers the router's
      // single-flight collector before dispatch.
      serverFunctions: { configure: "./src/server-config.ts" },
      // Compile the ?pick=-suffixed route modules filesystem-routing emits.
      extensions: [".jsx", ".tsx"],
    }),
    tailwindcss(),
    // @responsive-image/vite-plugin: resizes local images (§responsive imports) in
    // dev and at build time, and serves the generated variants in dev.
    responsiveImage(),
    // `httpMethods` also scans route modules for GET/POST/... exports (API
    // routes). One router serves both sides.
    fileRoutes({ httpMethods: true, types: true }),
  ],
  resolve: {
    // Keep bun's node_modules symlink IDs (don't resolve to the realpath):
    // the linked @responsive-image packages import deps (@solidjs/web,
    // solid-js, @responsive-image/core) that only exist in our node_modules.
    preserveSymlinks: true,
    // The linked @responsive-image packages keep their OWN node_modules with
    // their own (Solid 1.x) solid-js, so `preserveSymlinks` makes their
    // `solid-js` imports resolve to a SECOND copy of the runtime. Two copies =
    // two `sharedConfig`s = two hydration-id counters = key collisions and
    // "Cannot read properties of null" during hydration. Force one copy.
    dedupe: ["solid-js", "solid-js/web", "@solidjs/web", "@solidjs/signals"],
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    reportCompressedSize: false,
    target: "esnext",
    // Keep images as asset files instead of inlining them into the JS bundle.
    assetsInlineLimit: 0,
  },
  test: {
    globals: false,
    // Two projects because they need different halves of the framework:
    // component tests run in a DOM against the browser build (client
    // posture), while server-runtime tests run in node.
    projects: [
      {
        extends: true,
        test: {
          name: "client",
          environment: "jsdom",
          include: ["src/**/*.test.tsx"],
        },
      },
      {
        extends: true,
        test: {
          name: "server",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
    ],
  },
}));
