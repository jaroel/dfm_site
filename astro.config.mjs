import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import solidJs from '@astrojs/solid-js'
import nodejs from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [tailwind(), solidJs()],
  adapter: nodejs({ mode: 'standalone' }),
})
