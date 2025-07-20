import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite configuration
 *
 * The `base` option controls the path prepended to asset URLs in the built
 * index.html. When deploying to GitHub Pages the site is served from
 * `https://<user>.github.io/<repo>/` so we need to prefix assets with the repo
 * name. Netlify, on the other hand, serves the site from the domain root and
 * requires `base` to be `/`. Netlify automatically sets the `NETLIFY`
 * environment variable during the build which we can use to switch between the
 * two.
 */
export default defineConfig({
  base: process.env.NETLIFY ? '/' : '/GymBroRecipes/',
  plugins: [react()],
  server: {
    open: true,
  },
});
