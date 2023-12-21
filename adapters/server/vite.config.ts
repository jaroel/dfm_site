import { nodeServerAdapter } from "@builder.io/qwik-city/adapters/node-server/vite";
import { extendConfig } from "@builder.io/qwik-city/vite";
import baseConfig from "../../vite.config";

import { compression } from 'vite-plugin-compression2'

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["src/entry.express.tsx", "@qwik-city-plan"],
      },
    },
    plugins: [
      nodeServerAdapter({
        name: "express",
        ssg: {
          include:["*"],
          exclude:["/uzg"],
          origin: "https://www-dinxperfm-nl.toffe.site/"
        }
      }),
      compression({compressionOptions: {level: 9}})
    ],
  };
});
