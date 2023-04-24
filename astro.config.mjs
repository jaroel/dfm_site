import {defineConfig} from 'astro/config'
import tailwind from '@astrojs/tailwind'
import solidJs from '@astrojs/solid-js'
import node from '@astrojs/node'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [tailwind(), solidJs()],
  experimental: {
    assets: true,
  },
  image: {
    service: 'astro/assets/services/sharp',
  },
  adapter: node({
    mode: 'standalone',
  }),
})
