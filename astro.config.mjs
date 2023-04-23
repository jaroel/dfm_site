import {defineConfig} from 'astro/config'
import tailwind from '@astrojs/tailwind'
import solidJs from '@astrojs/solid-js'
import netlify from '@astrojs/netlify/functions'

export default defineConfig({
  output: 'server',
  integrations: [tailwind(), solidJs()],
  experimental: {
    assets: true,
  },
  image: {
    service: 'astro/assets/services/sharp',
  },
  adapter: netlify(),
})
