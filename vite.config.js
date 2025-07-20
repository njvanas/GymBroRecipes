import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // When deploying to GitHub Pages the site will be served from
  // https://<user>.github.io/<repo>/, so we need to prefix asset URLs
  // with the repository name. This prevents requests for assets like
  // /assets/index.js from returning the 404 page (served as text/html)
  // which caused the "disallowed MIME type" error.
  base: '/GymBroRecipes/',
  plugins: [react()],
  server: {
    open: true,
  },
});
