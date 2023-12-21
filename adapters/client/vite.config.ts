import { nodeServerAdapter } from "@builder.io/qwik-city/adapters/node-server/vite";
import { extendConfig } from "@builder.io/qwik-city/vite";
import baseConfig from "../../vite.config";

import { compression } from 'vite-plugin-compression2'

export default extendConfig(baseConfig, () => {
  return {
    plugins: [compression({compressionOptions: {level: 9}})],
  };
});
