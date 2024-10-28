// @ts-check
import { defineConfig } from 'astro/config';
import preload from './src/preload'

// https://astro.build/config
export default defineConfig({
  integrations: [preload()],
  redirects: {
    '/news': '/news/page/1'
  }
});
