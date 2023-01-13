/* eslint-disable n/file-extension-in-import */
import {defineConfig} from 'astro/config'
import tailwind from '@astrojs/tailwind'
import image from '@astrojs/image'

// https://astro.build/config
import solidJs from '@astrojs/solid-js'

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
    }),
    solidJs(),
  ],
  // Vite: {ssr: {external: ['ftp-ts']}},
})
