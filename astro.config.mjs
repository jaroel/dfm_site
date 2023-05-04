import {defineConfig} from 'astro/config'
import {sharpImageService} from 'astro/assets'
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
    service: sharpImageService(),
  },
  adapter: node({
    mode: 'standalone',
  }),
})
